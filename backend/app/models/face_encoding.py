from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.services.config import Base

class FaceEncoding(Base):
    __tablename__ = "face_encodings"

    user_id = Column(Integer, ForeignKey("utilisateurs.id"), primary_key=True)
    encoding = Column(Text, nullable=False)

    utilisateur = relationship("Utilisateur", backref="face_encoding")
