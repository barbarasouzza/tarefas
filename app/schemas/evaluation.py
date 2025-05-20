# app/schemas/evaluation.py
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

class EvaluationBase(BaseModel):
    task_id: int
    username: str
    rating: float
    comment: Optional[str] = None

    @field_validator("rating")
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v

class EvaluationCreate(EvaluationBase):
    pass

class Evaluation(EvaluationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
