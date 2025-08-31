from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import numpy as np
import cv2
from sqlalchemy.orm import Session
from app.services.config import SessionLocal
from app.services.facial import encode_face, save_face_encoding
from app.models.utilisateur import Utilisateur
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from app.utils import SECRET_KEY, ALGORITHM

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/encode")
def encode_face_route(file: UploadFile = File(...)):
    """📸 Recibe una imagen y devuelve el encoding facial (lista[128])"""
    try:
        contents = file.file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        encoding = encode_face(image)
        if encoding is None:
            raise HTTPException(status_code=400, detail="Aucun visage détecté.")
        return {"face_encoding": encoding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement de l'image : {str(e)}")

@router.post("/enroll")
def enroll_face_route(
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    📝 Guarda/actualiza el encoding facial para el usuario autenticado (admin o etudiant).
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

    user = db.query(Utilisateur).filter(Utilisateur.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    contents = file.file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    encoding = encode_face(image)
    if not encoding:
        raise HTTPException(status_code=400, detail="Aucun visage détecté")

    save_face_encoding(user.id, encoding)
    return {"message": "Encodage facial enregistré avec succès"}
