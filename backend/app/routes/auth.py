from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.services.config import SessionLocal
from app.models.utilisateur import Utilisateur
from app.models.etudiant import Etudiant
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Literal

router = APIRouter()

SECRET_KEY = "secret_key_for_demo"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📥 MODELOS D'ENTRÉE
class RegisterRequest(BaseModel):
    email: str
    password: str
    nom: str
    prenom: str
    type: Literal["etudiant", "admin"] = "etudiant"

class LoginRequest(BaseModel):
    email: str
    password: str

# 🟢 ENREGISTREMENT
@router.post("/register")
def register_utilisateur(data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(Utilisateur).filter(Utilisateur.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")

    hashed_pw = pwd_context.hash(data.password)
    new_user = Utilisateur(
        email=data.email,
        mot_de_passe=hashed_pw,
        nom=data.nom,
        prenom=data.prenom,
        type=data.type
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if data.type == "etudiant":
        new_etudiant = Etudiant(utilisateur_id=new_user.id)
        db.add(new_etudiant)
        db.commit()

    return {"message": "Utilisateur créé avec succès"}

# 🔐 LOGIN
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.email == data.email).first()
    if not utilisateur or not pwd_context.verify(data.password, utilisateur.mot_de_passe):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")

    token_data = {
        "sub": utilisateur.email,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

# 🔍 ME
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.get("/me")
def get_current_utilisateur(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    utilisateur = db.query(Utilisateur).filter(Utilisateur.email == email).first()
    if utilisateur is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    # ✅ Ajouter données d'étudiant si applicable
    etudiant = db.query(Etudiant).filter(Etudiant.utilisateur_id == utilisateur.id).first()
    return {
        "id": utilisateur.id,
        "email": utilisateur.email,
        "nom": utilisateur.nom,
        "prenom": utilisateur.prenom,
        "type": utilisateur.type,
        "niveau": etudiant.niveau if etudiant else None,
        "progression": etudiant.progression if etudiant else None
    }
