from fastapi import APIRouter, HTTPException
from app.services.mongo import contenus_collection
from typing import Optional
from pathlib import Path

router = APIRouter()

@router.get("/contenus")
def get_contenus(matiere: Optional[str] = None):
    query = {}
    if matiere:
        query["matiere"] = matiere.lower()
    contenus = list(contenus_collection.find(query, {"_id": 0}))
    return contenus

@router.get("/contenus/{slug}")
def get_contenu_by_slug(slug: str):
    contenu = contenus_collection.find_one({"slug": slug}, {"_id": 0})
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu non trouvé")

    html_path = contenu.get("html_path")
    if html_path:
        filepath = Path("contenus_html") / html_path
        if filepath.exists():
            contenu["contenu_html"] = filepath.read_text(encoding="utf-8")
        else:
            print(f"❌ Fichier introuvable : {filepath}")

    return contenu
