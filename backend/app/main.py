from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

# Importación de rutas internas
from app.routes import auth, users, resources, recommendation
from app.routes import protected
from app.routes import progress
from app.routes import contenus
from app.routes import facial
from app.routes import chatbot

# Inicializar FastAPI
app = FastAPI()

# 1. Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Incluir routers
app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(resources.router, prefix="/resources")
app.include_router(recommendation.router, prefix="/recommendation")
app.include_router(protected.router, prefix="/protected")
app.include_router(progress.router, prefix="/progress")
app.include_router(contenus.router)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(facial.router, prefix="/facial", tags=["facial"])
app.include_router(chatbot.router, prefix="/api", tags=["chatbot"])

# 3. Montar archivos estáticos
# Nota: main.py está en backend/app, así que usamos parent.parent

# Montar CSS
css_dir = Path(__file__).resolve().parent.parent / "contenus_css"
app.mount("/contenus_css", StaticFiles(directory=str(css_dir)), name="contenus_css")

# Montar HTML
html_dir = Path(__file__).resolve().parent.parent / "contenus_html"
app.mount("/contenus_html", StaticFiles(directory=str(html_dir)), name="contenus_html")

# 5. Inicializar la base de datos
from app.services.database import init_db
init_db()
