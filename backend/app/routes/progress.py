from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models.progress import Progress
from app.services.config import SessionLocal
from app.services.protected_route import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ProgressCreate(BaseModel):
    resource_id: int
    score: float

@router.post("/")
def enregistrer_progression(data: ProgressCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_progress = Progress(
        user_id=user["id"],
        resource_id=data.resource_id,
        score=data.score
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return {"message": "Progression enregistrée", "progress_id": new_progress.id}

@router.get("/")
def lister_progressions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    progressions = db.query(Progress).filter(Progress.user_id == user["id"]).all()
    return progressions
