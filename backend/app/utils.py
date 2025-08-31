# 📁 utils.py — Guardar en app/utils.py
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional

# 🔐 Clés du token
SECRET_KEY = "secreto_super_seguro"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120  # 2 heures

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Génère un token JWT avec une durée d'expiration."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

