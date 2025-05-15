from fastapi import FastAPI
from app.routers import tasks, evaluations, users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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
app.include_router(evaluations.router, prefix="/evaluations", tags=["Evaluations"])
app.include_router(users.router, prefix="/users", tags=["Users"])
