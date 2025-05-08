from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, resources, recommendation
from app.routes import protected 
from app.services.database import init_db
from app.routes import progress
from app.routes import contenus
from fastapi.staticfiles import StaticFiles




app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(resources.router, prefix="/resources")
app.include_router(recommendation.router, prefix="/recommendation")
app.include_router(protected.router, prefix="/protected")
app.include_router(progress.router, prefix="/progress")
app.include_router(contenus.router)
app.mount("/static", StaticFiles(directory="static"), name="static")



init_db()