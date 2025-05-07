from fastapi import FastAPI
from app.routers import tasks
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.67:3000"],  # ["*"] Permite qualquer origem, ou você pode especificar o IP ou domínio, por exemplo: ["http://192.168.1.67"]
    allow_credentials=True,
    allow_methods=["*"],  # Permite qualquer método HTTP
    allow_headers=["*"],  # Permite qualquer cabeçalho
)

# Suas rotas aqui...


@app.get("/")
def root():
    return {"message": "Welcome to the Tasks API"}

app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
