from sqlalchemy import Column, Integer, String, Enum, Text, Float, ARRAY
from app.database import Base
from sqlalchemy.orm import validates

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    priority = Column(Enum('high', 'medium', 'low', name='priority_enum'), nullable=False)
    recurrence = Column(Enum('daily', 'weekly', 'monthly', 'custom', name='recurrence_enum'), nullable=False)
    custom_days = Column(ARRAY(String), nullable=True)
    status = Column(Enum('done', 'pending', 'not done', name='status_enum'), nullable=False)
    username = Column(String(50), nullable=False)
    rating = Column(Float, nullable=True)
    comment = Column(Text, nullable=True)

    @validates('rating')
    def validate_rating(self, key, value):
        if value is not None and (value < 1 or value > 5):
            raise ValueError("Rating must be between 1 and 5")
        return value
