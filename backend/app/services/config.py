from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv() 


DATABASE_URL = os.getenv("POSTGRES_URL")

if not DATABASE_URL:
    raise RuntimeError("No se encontró POSTGRES_URL en .env")

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

class Base(DeclarativeBase):
    pass
