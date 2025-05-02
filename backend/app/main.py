from fastapi import FastAPI
from app.routes import auth, users, resources, recommendation

app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(resources.router, prefix="/resources")
app.include_router(recommendation.router, prefix="/recommendation")
