from sqlalchemy import Column, Integer, Float, ForeignKey
from app.services.config import Base

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("utilisateurs.id"))
    resource_id = Column(Integer)
    score = Column(Float)
