from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from app.models.task import Task

def update_task_statuses(db: Session):
    today = datetime.now().date()

    tasks = db.query(Task).filter(Task.next_due_date != None).all()

    for task in tasks:
        if task.next_due_date <= today and task.status != 'pending':
            task.status = 'pending'

            if task.recurrence == 'daily':
                task.next_due_date += timedelta(days=1)
            elif task.recurrence == 'weekly':
                task.next_due_date += timedelta(weeks=1)
            elif task.recurrence == 'monthly':
                task.next_due_date += relativedelta(months=1)
            elif task.recurrence == 'custom' and task.custom_days:
                # Pula pro próximo dia da semana definido
                from calendar import day_name
                from datetime import timedelta
                week_days = list(day_name)  # ['Monday', ..., 'Sunday']
                today_weekday_index = task.next_due_date.weekday()

                future_days = [week_days.index(day) for day in task.custom_days if day in week_days]
                future_days = sorted(d for d in future_days if d > today_weekday_index)

                if future_days:
                    next_day = future_days[0]
                else:
                    next_day = sorted([week_days.index(d) for d in task.custom_days])[0]
                    task.next_due_date += timedelta(days=(7 - today_weekday_index + next_day))
                    continue

                task.next_due_date += timedelta(days=(next_day - today_weekday_index))

            db.add(task)
    
    db.commit()
