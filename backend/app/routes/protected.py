from fastapi import APIRouter, Depends
from app.services.protected_route import get_current_user

router = APIRouter()

@router.get("/secret")
def read_secret(current_user: dict = Depends(get_current_user)):
    return {"message": f"Bienvenue, {current_user['email']}! Ceci est une route protégée."}
