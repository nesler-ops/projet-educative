from app.services.config import Base, engine
from app.models import utilisateur
from app.models import contenu


def init_db():
    Base.metadata.create_all(bind=engine)
