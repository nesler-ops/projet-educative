from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.models.contenu import Contenu
from app.services.config import SessionLocal
from fastapi import APIRouter, Depends, HTTPException


router = APIRouter()

# Dependency: Session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_resources():
    return [{"id": 1, "title": "Intro to Python"}]

@router.get("/contenus")
def get_contenus(matiere: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Contenu)
    if matiere:
        query = query.filter(Contenu.matiere.ilike(matiere))  
    return query.all()

@router.get("/contenus/{slug}")
def get_contenu_by_slug(slug: str, db: Session = Depends(get_db)):
    contenu = db.query(Contenu).filter(Contenu.slug == slug).first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu non trouvé")
    return contenu
