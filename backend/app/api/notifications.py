from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.nudge import Nudge
from app.db.schemas.nudge import NudgeCreate, Nudge

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.post("/", response_model=Nudge, status_code=status.HTTP_201_CREATED)
async def create_notification(nudge: NudgeCreate, user_id: int, db: Session = Depends(get_db)):
    db_nudge = Nudge(**nudge.dict(), user_id=user_id)
    db.add(db_nudge)
    db.commit()
    db.refresh(db_nudge)
    return db_nudge

@router.get("/{nudge_id}", response_model=Nudge)
async def get_notification(nudge_id: int, user_id: int, db: Session = Depends(get_db)):
    nudge = db.query(Nudge).filter(Nudge.id == nudge_id, Nudge.user_id == user_id).first()
    if not nudge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return nudge

@router.get("/", response_model=List[Nudge])
async def get_notifications(user_id: int, db: Session = Depends(get_db)):
    nudges = db.query(Nudge).filter(Nudge.user_id == user_id).all()
    return nudges

@router.put("/{nudge_id}", response_model=Nudge)
async def update_notification(nudge_id: int, nudge: NudgeCreate, user_id: int, db: Session = Depends(get_db)):
    db_nudge = db.query(Nudge).filter(Nudge.id == nudge_id, Nudge.user_id == user_id).first()
    if not db_nudge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    for key, value in nudge.dict().items():
        setattr(db_nudge, key, value)
    db.commit()
    db.refresh(db_nudge)
    return db_nudge

@router.delete("/{nudge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(nudge_id: int, user_id: int, db: Session = Depends(get_db)):
    db_nudge = db.query(Nudge).filter(Nudge.id == nudge_id, Nudge.user_id == user_id).first()
    if not db_nudge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    db.delete(db_nudge)
    db.commit()