from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List
from app import models, schemas
from app.models.task import Task as TaskModel
from app.database import get_db

router = APIRouter()

@router.post("/evaluations/", response_model=schemas.Evaluation)
def create_evaluation(evaluation: schemas.EvaluationCreate, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == evaluation.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    existing_evaluation = db.query(models.Evaluation).filter(
        models.Evaluation.task_id == evaluation.task_id,
        models.Evaluation.username == evaluation.username
    ).first()

    if existing_evaluation:
        raise HTTPException(status_code=400, detail="You have already evaluated this task")

    db_evaluation = models.Evaluation(**evaluation.dict())
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)

    avg_rating = db.query(func.avg(models.Evaluation.rating)) \
                   .filter(models.Evaluation.task_id == evaluation.task_id) \
                   .scalar()

    if avg_rating is not None:
        db.query(TaskModel).filter(TaskModel.id == evaluation.task_id).update({
            "rating": round(avg_rating, 1)
        })
        db.commit()

    return db_evaluation

@router.get("/evaluations/{task_id}", response_model=List[schemas.Evaluation])
def read_evaluations(task_id: int, db: Session = Depends(get_db)):
    evaluations = db.query(models.Evaluation).filter(models.Evaluation.task_id == task_id).all()
    if not evaluations:
        raise HTTPException(status_code=404, detail="No evaluations found for this task")
    return evaluations

@router.get("/evaluations/average/{task_id}", response_model=float)
def read_average_rating(task_id: int, db: Session = Depends(get_db)):
    avg = db.query(func.avg(models.Evaluation.rating)).filter(models.Evaluation.task_id == task_id).scalar()
    if avg is None:
        raise HTTPException(status_code=404, detail="No evaluations found")
    return round(avg, 1)
