from fastapi import FastAPI
from app.routers import tasks, evaluations, users
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from app.utils.task_scheduler import update_task_statuses
from app.database import SessionLocal
from app.jobs.scheduler import start_scheduler

app = FastAPI()

scheduler = BackgroundScheduler()

start_scheduler()

# Executa todo dia às 00:01
def scheduled_job():
    db = SessionLocal()
    try:
        update_task_statuses(db)
    finally:
        db.close()

scheduler.add_job(scheduled_job, "cron", hour=0, minute=1)
scheduler.start()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.67:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Tasks API"}

app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(evaluations.router, tags=["Evaluations"])
app.include_router(users.router, prefix="/users", tags=["Users"])
