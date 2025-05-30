from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "task"  # Nome da tabela no banco de dados

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
