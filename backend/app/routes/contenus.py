from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.mongo import contenus_collection
from typing import Optional
from pathlib import Path

router = APIRouter()

# Directorio raíz de los HTML
html_dir = Path(__file__).resolve().parent.parent.parent / "contenus_html"

# 🔹 Ruta 1: Obtener todos los contenus (opcionalmente por matière)
@router.get("/contenus")
def get_contenus(matiere: Optional[str] = None):
    query = {}
    if matiere:
        query["matiere"] = matiere.lower()
    contenus = list(contenus_collection.find(query, {"_id": 0}))
    return contenus

# 🔹 Ruta 2: Obtener contenido individual con su HTML embebido (React)
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

# 🔹 Ruta 3: Servir el HTML directamente para ser abierto en navegador
@router.get("/contenus/{matiere}/{niveau}/{slug}")
def get_html_page(matiere: str, niveau: str, slug: str):
    file_path = html_dir / matiere / niveau / f"{slug}.html"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier HTML introuvable")
    return FileResponse(file_path, media_type="text/html")
