from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum
from datetime import date, time

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
    next_due_date: Optional[date] = None
    reminder_time: Optional[time] = None

    @field_validator("custom_days")
    @classmethod
    def validate_custom_days(cls, v):
        if v is None:
            return v
        valid_days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
        for day in v:
            if day not in valid_days:
                raise ValueError(f"Invalid day: {day}. Must be one of {valid_days}")
        return v
    
    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError("Rating must be between 1 and 5")
        return v

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    name: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    recurrence: Optional[RecurrenceEnum] = None
    custom_days: Optional[List[str]] = None
    status: Optional[StatusEnum] = None
    username: Optional[str] = None
    rating: Optional[float] = None
    comment: Optional[str] = None
    next_due_date: Optional[date] = None
    reminder_time: Optional[time] = None

    @field_validator("custom_days")
    @classmethod
    def validate_custom_days(cls, v):
        if v is None:
            return v
        valid_days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
        for day in v:
            if day not in valid_days:
                raise ValueError(f"Invalid day: {day}. Must be one of {valid_days}")
        return v

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if v is not None and (v < 1 or v > 5):
            raise ValueError("Rating must be between 1 and 5")
        return v

class Task(TaskBase):
    id: int

    class Config:
        from_attributes = True
