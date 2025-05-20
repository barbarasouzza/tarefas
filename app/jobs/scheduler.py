from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.database import SessionLocal
from app.models.task import Task

def update_recurring_tasks():
    db: Session = SessionLocal()
    today = date.today()

    try:
        tasks = db.query(Task).filter(Task.recurrence != 'custom').all()

        for task in tasks:
            if task.next_due_date and task.next_due_date <= today:
                task.status = 'pending'

                if task.recurrence == 'daily':
                    task.next_due_date += timedelta(days=1)
                elif task.recurrence == 'weekly':
                    task.next_due_date += timedelta(weeks=1)
                elif task.recurrence == 'monthly':
                    next_month = (task.next_due_date.month % 12) + 1
                    year = task.next_due_date.year + (task.next_due_date.month // 12)
                    task.next_due_date = task.next_due_date.replace(month=next_month, year=year)

        db.commit()
    except Exception as e:
        print(f"Erro ao atualizar tarefas recorrentes: {e}")
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_recurring_tasks, 'cron', hour=0, minute=0)
    scheduler.start()
