from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_resources():
    return [{"id": 1, "title": "Intro to Python"}]
