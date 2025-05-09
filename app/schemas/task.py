from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class PriorityEnum(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class RecurrenceEnum(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    custom = "custom"

class StatusEnum(str, Enum):
    done = "done"
    pending = "pending"
    not_done = "not done"


class StatusUpdate(BaseModel):
    status: StatusEnum

class TaskBase(BaseModel):
    name: str
    priority: PriorityEnum
    recurrence: RecurrenceEnum
    custom_days: Optional[List[str]] = None
    status: StatusEnum
    username: str
    rating: Optional[float] = None
    comment: Optional[str] = None

    
class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    recurrence: Optional[RecurrenceEnum] = None
    custom_days: Optional[List[str]] = None
    status: Optional[StatusEnum] = None
    username: Optional[str] = None
    rating: Optional[float] = None
    comment: Optional[str] = None


class Task(TaskBase):
    id: int

class Config:
    orm_mode = True 

