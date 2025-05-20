from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List
from app import models, schemas
from app.models.task import Task as TaskModel
from app.database import get_db

router = APIRouter(prefix="/evaluations")

@router.post("/", response_model=schemas.Evaluation)
def create_evaluation(evaluation: schemas.EvaluationCreate, db: Session = Depends(get_db)):
    # Validação rating
    if not (1 <= evaluation.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Verifica se a tarefa existe
    task = db.query(TaskModel).filter(TaskModel.id == evaluation.task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verifica se usuário já avaliou essa tarefa
    existing_evaluation = db.query(models.Evaluation).filter(
        models.Evaluation.task_id == evaluation.task_id,
        models.Evaluation.username == evaluation.username
    ).first()
    if existing_evaluation:
        raise HTTPException(status_code=400, detail="You have already evaluated this task")

    # Cria avaliação nova
    db_evaluation = models.Evaluation(**evaluation.dict())
    db.add(db_evaluation)
    db.commit()
    db.refresh(db_evaluation)

    # Calcula média atualizada das avaliações da tarefa
    avg_rating = db.query(func.avg(models.Evaluation.rating)) \
                   .filter(models.Evaluation.task_id == evaluation.task_id) \
                   .scalar()

    # Atualiza rating na task (arredonda para 1 casa decimal)
    if avg_rating is not None:
        db.query(TaskModel).filter(TaskModel.id == evaluation.task_id).update(
            {"rating": round(avg_rating, 1)},
            synchronize_session=False
        )
        db.commit()

    return db_evaluation

@router.get("/{task_id}", response_model=List[schemas.Evaluation])
def read_evaluations(task_id: int, db: Session = Depends(get_db)):
    evaluations = db.query(models.Evaluation).filter(models.Evaluation.task_id == task_id).all()
    if not evaluations:
        raise HTTPException(status_code=404, detail="No evaluations found for this task")
    return evaluations

@router.get("/average/{task_id}", response_model=float)
def read_average_rating(task_id: int, db: Session = Depends(get_db)):
    avg = db.query(func.avg(models.Evaluation.rating)).filter(models.Evaluation.task_id == task_id).scalar()
    if avg is None:
        # Retorna 0 se nenhuma avaliação encontrada (você pode mudar para None se preferir)
        return 0.0
    return round(avg, 1)
