from sqlalchemy import Column, Integer, ForeignKey
from app.services.config import Base

class Etudiant(Base):
    __tablename__ = "etudiants"

    id = Column(Integer, primary_key=True)
    niveau = Column(Integer, default=1)
    progression = Column(Integer, default=0)
    utilisateur_id = Column(Integer, ForeignKey("utilisateurs.id"))
