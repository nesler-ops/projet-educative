from sqlalchemy import Column, Integer, String, Text
from app.services.config import Base

class Contenu(Base):
    __tablename__ = "contenus"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    description = Column(String)
    type = Column(String)         # exemple: "vidéo", "texte", "exercice"
    difficulte = Column(String)   # exemple: "facile", "moyen", "difficile"
    lien = Column(String)
    matiere = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    contenu_html = Column(Text)
