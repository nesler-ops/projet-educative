# app/routes/chatbot.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Dict, List
import os
import dotenv

# OpenAI SDK
from openai import OpenAI

dotenv.load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Falta OPENAI_API_KEY en .env")

client = OpenAI(api_key=OPENAI_API_KEY)
router = APIRouter()

# 🔸 En memoria (dev): historial por usuario (no persiste entre reinicios)
HISTORY: Dict[str, List[Dict[str, str]]] = {}

SYSTEM_PROMPT = (
    "Tu es Zorin, l'assistant pédagogique d'EduPlatform. "
    "Réponds de façon claire, concise et bienveillante. "
    "Aide en langues, mathématiques, sciences et organisation des études. "
    "Si on te pose une question hors de ton périmètre, réponds brièvement et propose une piste. "
    "Toujours en français."
)

class ChatRequest(BaseModel):
    user_id: str
    message: str

@router.post("/chat")
async def chat_with_bot(req: ChatRequest):
    user_id = req.user_id.strip()
    content = (req.message or "").strip()

    if not user_id or not content:
        raise HTTPException(status_code=400, detail="user_id et message sont requis.")

    # Inicializa historial para el usuario si no existe
    conv = HISTORY.setdefault(user_id, [{"role": "system", "content": SYSTEM_PROMPT}])

    # Añadimos el turno del usuario
    conv.append({"role": "user", "content": content})

    try:
        # Puedes usar "gpt-4o-mini" o "gpt-3.5-turbo" según tu plan
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=conv,
            temperature=0.7,
            max_tokens=500,
        )
        answer = resp.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur OpenAI: {e}")

    # Guardamos respuesta del asistente en el historial
    conv.append({"role": "assistant", "content": answer})

    # (Opcional) podar historial para no crecer infinito
    if len(conv) > 20:
        # mantén system + últimos 18 mensajes
        HISTORY[user_id] = [conv[0]] + conv[-18:]

    return {
        "user_id": user_id,
        "message": content,
        "response": answer,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
