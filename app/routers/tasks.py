from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.task import Task as TaskModel
from app.schemas.task import TaskCreate, TaskUpdate, Task, StatusUpdate
from app.database import get_db, SessionLocal
from typing import List
from app import crud, models, schemas

router = APIRouter()

@router.post("/", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = TaskModel(**task.dict())
    if task.custom_days:
        db_task.custom_days = task.custom_days  # Não precisa de json.dumps
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[Task])
def read_tasks(db: Session = Depends(get_db)):
    tasks = db.query(TaskModel).all()
    for t in tasks:
        # Não precisa de json.loads, o custom_days já é uma lista de strings
        pass
    return tasks

@router.get("/{task_id}", response_model=Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    # Não precisa de json.loads aqui também
    return task


@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, updated: TaskUpdate, db: Session = Depends(get_db)):
    # Busca a tarefa no banco de dados
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()

    # Se a tarefa não for encontrada, levanta uma exceção 404
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Atualiza os campos que são diferentes de None
    for field, value in updated.dict(exclude_unset=True).items():  # exclude_unset ignora valores não passados
        if field == "custom_days" and value:
            setattr(task, field, value)  # Atualiza custom_days sem transformação adicional
        elif value is not None:  # Verifica se o valor não é None antes de atribuir
            setattr(task, field, value)

    # Commit para salvar as alterações no banco de dados
    db.commit()
    db.refresh(task)

    # Retorna a tarefa atualizada
    return task

@router.delete("/{task_id}", response_model=Task)
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
    # Corrigido para usar TaskModel em vez de Task
    task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    if task.status == status_update.status:
        raise HTTPException(status_code=400, detail="O status da tarefa já está como o valor informado")

    task.status = status_update.status
    db.commit()
    db.refresh(task)
    return {"message": "Status da tarefa atualizado com sucesso", "task": task}


# Rota para buscar as prioridades
@router.get("/priority")
def get_prioridades(db: Session = Depends(get_db)):
    return db.query(models.Prioridade).all()

# Rota para buscar as recorrências
@router.get("/recurrence")
def get_recorrencias(db: Session = Depends(get_db)):
    return db.query(models.Recorrencia).all()

# Rota para buscar os usuários (vai retornar uma lista de todos os usuários cadastrados)
@router.get("/username")
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()
