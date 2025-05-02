from pydantic import BaseModel

class Resource(BaseModel):
    id: int
    title: str
    description: str
    topic: str
    level: str
