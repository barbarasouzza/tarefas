from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from typing import List

router = APIRouter()

@router.get("/", response_model=List[str])
def get_usernames(db: Session = Depends(get_db)):
    usernames = db.query(User.username).distinct().all()
    if not usernames:
        raise HTTPException(status_code=404, detail="No users found")
    return [username[0] for username in usernames]
