from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from app.models.task import Task
from app.schemas.task import StatusEnum
from datetime import date, timedelta
import calendar

DATABASE_URL = "postgresql://postgres:postgres@localhost/fazeres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_next_due_date(current: date, recurrence: str) -> date:
    if recurrence == 'daily':
        return current + timedelta(days=1)
    elif recurrence == 'weekly':
        return current + timedelta(weeks=1)
    elif recurrence == 'monthly':
        # próximo mês, mantendo o mesmo dia (ajustando se ultrapassar o último dia do mês)
        next_month = current.month % 12 + 1
        year = current.year + (current.month // 12)
        day = min(current.day, calendar.monthrange(year, next_month)[1])
        return date(year, next_month, day)
    return current  # fallback (para custom, não alteramos a data aqui)

def update_tasks():
    session = SessionLocal()
    try:
        today = date.today()
        weekday_str = calendar.day_name[today.weekday()].lower()

        tasks = session.execute(select(Task).where(Task.status != StatusEnum.done)).scalars().all()

        for task in tasks:
            update_needed = False

            # Verifica se a tarefa está vencida (next_due_date < hoje)
            if task.next_due_date and task.next_due_date >= today:
                continue  # ainda não venceu, não precisa atualizar

            # Verifica se deve atualizar com base na recorrência
            if task.recurrence == 'daily':
                update_needed = True
            elif task.recurrence == 'weekly' and weekday_str == 'monday':
                update_needed = True
            elif task.recurrence == 'monthly' and today.day == 1:
                update_needed = True
            elif task.recurrence == 'custom' and task.custom_days:
                if weekday_str in [d.lower() for d in task.custom_days]:
                    update_needed = True

            if update_needed:
                task.status = StatusEnum.pending
                task.next_due_date = get_next_due_date(today, task.recurrence)
                session.add(task)

        session.commit()
        print(f"[{today}] Tarefas atualizadas com sucesso.")

    except Exception as e:
        session.rollback()
        print(f"[{date.today()}] Erro ao atualizar tarefas: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    update_tasks()
