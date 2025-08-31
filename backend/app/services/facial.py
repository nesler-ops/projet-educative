# app/services/facial.py
import cv2
import json
import numpy as np
import face_recognition
from typing import Optional
from sqlalchemy.orm import Session
from app.services.config import SessionLocal
from app.models.face_encoding import FaceEncoding
from app.models.utilisateur import Utilisateur

def encode_face(image: np.ndarray) -> Optional[list]:
    """
    Convierte una imagen BGR a un vector 128D (lista de floats) usando face_recognition.
    Devuelve None si no detecta rostro.
    """
    if image is None or not isinstance(image, np.ndarray):
        return None

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_image)
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

    if not face_encodings:
        return None

    encoding = face_encodings[0]
    if len(encoding.shape) != 1 or encoding.shape[0] != 128:
        # Defensa por si la librería devuelve algo raro
        return None

    # Aseguramos floats nativos (serializables)
    return encoding.astype(float).tolist()

def save_face_encoding(utilisateur_id: int, encoding: list) -> None:
    """
    Guarda/actualiza la codificación facial del usuario en PostgreSQL (TEXT/JSON).
    - Tabla: face_encodings(user_id INT PK, encoding TEXT(JSON))
    """
    if not encoding or len(encoding) != 128:
        return

    db: Session = SessionLocal()
    try:
        payload = json.dumps(encoding)  # guardamos como JSON string

        row = db.query(FaceEncoding).filter(FaceEncoding.user_id == utilisateur_id).first()
        if row:
            row.encoding = payload
        else:
            db.add(FaceEncoding(user_id=utilisateur_id, encoding=payload))

        db.commit()
    finally:
        db.close()

def match_face(encoding: list, tolerance: float = 0.62) -> Optional[Utilisateur]:
    """
    Busca el usuario con menor distancia al encoding recibido y valida contra 'tolerance'.
    Devuelve el Utilisateur o None si no hay match.
    """
    if not encoding or len(encoding) != 128:
        return None

    probe = np.array(encoding, dtype=np.float64)
    if probe.shape != (128,):
        return None

    db: Session = SessionLocal()
    try:
        rows = db.query(FaceEncoding).all()
        if not rows:
            return None

        best_user_id = None
        best_dist = float("inf")

        for row in rows:
            try:
                stored_list = json.loads(row.encoding)
                stored = np.array(stored_list, dtype=np.float64)
                if stored.shape != (128,):
                    continue

                # Distancia más estable que compare_faces
                dist = face_recognition.face_distance([stored], probe)[0]
                if dist < best_dist:
                    best_dist = dist
                    best_user_id = row.user_id
            except Exception:
                continue

        if best_user_id is not None and best_dist <= tolerance:
            return db.query(Utilisateur).filter(Utilisateur.id == best_user_id).first()

        return None
    finally:
        db.close()
