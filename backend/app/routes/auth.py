from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.services.config import SessionLocal
from app.models.utilisateur import Utilisateur
from app.models.etudiant import Etudiant
from jose import jwt, JWTError
from typing import Literal
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from app.services.facial import encode_face, match_face, save_face_encoding
from app.services.twofa import send_verification_email, store_verification_code, verify_code, generate_verification_code
from app.utils import create_access_token, SECRET_KEY, ALGORITHM
import numpy as np
import cv2
from fastapi import Form 

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ----------- SCHEMAS -----------
class RegisterRequest(BaseModel):
    email: str
    password: str
    nom: str
    prenom: str
    type: Literal["etudiant", "admin"] = "etudiant"

class LoginRequest(BaseModel):
    email: str
    password: str

class TwoFAVerify(BaseModel):
    user_id: str
    code: str

# ----------- DATABASE -----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------- REGISTER -----------
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

# ----------- LOGIN (Envoie code 2FA) -----------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.email == data.email).first()
    if not utilisateur or not pwd_context.verify(data.password, utilisateur.mot_de_passe):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")

    code = generate_verification_code()
    store_verification_code(str(utilisateur.id), code)
    send_verification_email(utilisateur.email, code)

    return {
        "message": "Code de vérification envoyé par email",
        "user_id": str(utilisateur.id),
        "user_type": utilisateur.type
    }

# ----------- 2FA Verification -----------
@router.post("/verify-code")
def verify_2fa_code(data: TwoFAVerify, db: Session = Depends(get_db)):
    if not verify_code(data.user_id, data.code):
        raise HTTPException(status_code=401, detail="Code de vérification invalide ou expiré")

    utilisateur = db.query(Utilisateur).filter(Utilisateur.id == int(data.user_id)).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    token = create_access_token({
        "sub": utilisateur.email,
        "user_type": utilisateur.type
    })

    return {
        "message": "Connexion réussie",
        "token": token,
        "username": utilisateur.nom,
        "user_type": utilisateur.type,
        "user_id": utilisateur.id
    }

# ----------- /me -----------
@router.get("/me")
def get_current_utilisateur(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user_type = payload.get("user_type")
        if not email:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    utilisateur = db.query(Utilisateur).filter(Utilisateur.email == email).first()
    if utilisateur is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    result = {
        "id": utilisateur.id,
        "email": utilisateur.email,
        "nom": utilisateur.nom,
        "prenom": utilisateur.prenom,
        "user_type": utilisateur.type
    }

    if utilisateur.type == "etudiant":
        etudiant = db.query(Etudiant).filter(Etudiant.utilisateur_id == utilisateur.id).first()
        result["niveau"] = etudiant.niveau if etudiant else None
        result["progression"] = etudiant.progression if etudiant else None

    return result

# ----------- Reconnaissance faciale (optionnel) -----------
@router.post("/login-face")
def login_face(file: UploadFile = File(...)):
    image = np.frombuffer(file.file.read(), np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    encoding = encode_face(image)
    if not encoding:
        raise HTTPException(status_code=400, detail="Aucun visage détecté")

    utilisateur = match_face(encoding)
    if not utilisateur:
        raise HTTPException(status_code=401, detail="Visage non reconnu")

    token = create_access_token({
        "sub": utilisateur.email,
        "user_type": utilisateur.type
    })

    return {
        "message": "Connexion réussie (reconnaissance faciale)",
        "token": token,
        "user_type": utilisateur.type,
        "username": utilisateur.nom,
        "user_id": utilisateur.id
    }


class ResendRequest(BaseModel):
    user_id: str

@router.post("/resend-code")
def resend_code(data: ResendRequest, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(Utilisateur.id == int(data.user_id)).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    code = generate_verification_code()
    store_verification_code(str(utilisateur.id), code)
    send_verification_email(utilisateur.email, code)
    return {"message": "Nouveau code envoyé"}

#-----------Register With Face--------------

@router.post("/register-with-face")
def register_with_face(
    email: str = Form(...),
    password: str = Form(...),
    nom: str = Form(...),
    prenom: str = Form(...),
    type: Literal["etudiant", "admin"] = Form("etudiant"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Validar tipo de archivo
    if file.content_type not in ("image/jpeg", "image/png"):
        raise HTTPException(status_code=400, detail="Format d'image non supporté (jpeg/png)")

    # Evitar duplicados
    existing_user = db.query(Utilisateur).filter(Utilisateur.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")

    # Leer imagen y extraer encoding ANTES de crear el usuario
    contents = file.file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    encoding = encode_face(image)
    if not encoding:
        raise HTTPException(status_code=400, detail="Aucun visage détecté. Réessayez avec une photo plus claire.")

    # Crear usuario y guardar encoding
    try:
        hashed_pw = pwd_context.hash(password)
        new_user = Utilisateur(
            email=email,
            mot_de_passe=hashed_pw,
            nom=nom,
            prenom=prenom,
            type=type
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        if type == "etudiant":
            db.add(Etudiant(utilisateur_id=new_user.id))
            db.commit()

        save_face_encoding(new_user.id, encoding)

        return {"message": "Utilisateur créé + encodage facial enregistré", "user_id": new_user.id, "user_type": type}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'inscription: {str(e)}")
