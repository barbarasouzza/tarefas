from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EvaluationBase(BaseModel):
    task_id: int
    username: str
    rating: float
    comment: Optional[str] = None

class EvaluationCreate(EvaluationBase):
    pass

class Evaluation(EvaluationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # atualizar aqui para Pydantic v2
