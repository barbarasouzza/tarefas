from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.models.task import Task as TaskModel
from app.schemas.task import Task as TaskSchema, TaskCreate, TaskUpdate, StatusUpdate
from app.database import get_db
from app import models

router = APIRouter()

@router.post("/", response_model=TaskSchema)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = TaskModel(**task.dict())
    if task.custom_days:
        db_task.custom_days = task.custom_days  # já é lista, sem json.dumps
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/for-evaluation")
def get_tasks_for_evaluation(
    username: str = Query(..., alias="username"),
    db: Session = Depends(get_db),
):
    tasks = (
        db.query(TaskModel)
        .filter(TaskModel.username != username)
        .all()
    )
    
    result = []
    for task in tasks:
        # Verifica se já foi avaliada por esse usuário
        already_evaluated = any(ev.username == username for ev in task.evaluations)
        if not already_evaluated:
            result.append({
                "id": task.id,
                "name": task.name
            })
    return result

@router.get("/", response_model=List[TaskSchema])
def read_tasks(db: Session = Depends(get_db)):
    tasks = db.query(TaskModel).all()
    return tasks

@router.get("/{task_id}", response_model=TaskSchema)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskSchema)
def update_task(task_id: int, updated: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for field, value in updated.dict(exclude_unset=True).items():
        if field == "custom_days" and value:
            setattr(task, field, value)
        elif value is not None:
            setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", response_model=TaskSchema)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return task

@router.put("/{task_id}/status")
async def update_task_status(
    task_id: int,
    status_update: StatusUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    if task.status == status_update.status:
        raise HTTPException(status_code=400, detail="O status da tarefa já está como o valor informado")

    task.status = status_update.status
    db.commit()
    db.refresh(task)
    return {"message": "Status da tarefa atualizado com sucesso", "task": task}

# Rotas auxiliares para prioridades e recorrências
@router.get("/priority")
def get_prioridades(db: Session = Depends(get_db)):
    return db.query(models.Prioridade).all()

@router.get("/recurrence")
def get_recorrencias(db: Session = Depends(get_db)):
    return db.query(models.Recorrencia).all()
