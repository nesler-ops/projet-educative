
# 📁 twofa.py — Guardar en app/services/twofa.py
import random
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from app.services.config import SessionLocal
from sqlalchemy.orm import Session
from app.models.utilisateur import Utilisateur
from app.models.code2fa import Code2FA

# ⚙️ Envoi d'email simple
EMAIL_EXPEDITEUR = "bienetrecliniquem@gmail.com"
MOT_DE_PASSE_EMAIL = "meha azok szuc hbwe"


def envoyer_email_notification(to_email: str, sujet: str, contenu: str):
    msg = EmailMessage()
    msg["Subject"] = sujet
    msg["From"] = EMAIL_EXPEDITEUR
    msg["To"] = to_email
    msg.set_content(contenu)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_EXPEDITEUR, MOT_DE_PASSE_EMAIL)
            smtp.send_message(msg)
            print("✅ Email envoyé avec succès")
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi de l'email: {e}")
        raise


def generate_verification_code() -> str:
    return f"{random.randint(100000, 999999)}"


def send_verification_email(email: str, code: str):
    contenu = (
        f"Bonjour !\n\nVoici votre code de vérification : {code}"
        "\n\nCe code expirera dans 5 minutes.\n\nEducatif+"
    )
    envoyer_email_notification(
        to_email=email,
        sujet="Code de vérification - Educatif+",
        contenu=contenu
    )


def store_verification_code(user_id: str, code: str):
    db: Session = SessionLocal()
    expiration = datetime.utcnow() + timedelta(minutes=5)
    db.query(Code2FA).filter(Code2FA.user_id == user_id).delete()
    db.add(Code2FA(user_id=user_id, code=code, expires_at=expiration))
    db.commit()
    db.close()


def verify_code(user_id: str, input_code: str) -> bool:
    db: Session = SessionLocal()
    record = db.query(Code2FA).filter(Code2FA.user_id == user_id).first()
    if not record:
        db.close()
        return False

    valid = record.code == input_code and datetime.utcnow() < record.expires_at
    db.close()
    return valid
