# app/models/code2fa.py
from sqlalchemy import Column, String, DateTime, Index
from app.services.config import Base

class Code2FA(Base):
    __tablename__ = "codes2fa"

    # Usamos user_id como PK para tener un único código vigente por usuario
    user_id = Column(String, primary_key=True, index=True)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False, index=True)

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Code2FA user_id={self.user_id} expires_at={self.expires_at}>"

