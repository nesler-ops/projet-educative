from pydantic import BaseModel

class Progress(BaseModel):
    user_id: int
    resource_id: int
    score: float
