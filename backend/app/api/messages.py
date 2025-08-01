from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.message import Message
from app.db.schemas.message import MessageCreate, Message

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/", response_model=Message, status_code=status.HTTP_201_CREATED)
async def create_message(message: MessageCreate, user_id: int, db: Session = Depends(get_db)):
    db_message = Message(**message.dict(), user_id=user_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/{message_id}", response_model=Message)
async def get_message(message_id: int, user_id: int, db: Session = Depends(get_db)):
    message = db.query(Message).filter(Message.id == message_id, Message.user_id == user_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    return message

@router.get("/", response_model=List[Message])
async def get_messages(user_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.user_id == user_id).all()
    return messages

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_message(message_id: int, user_id: int, db: Session = Depends(get_db)):
    db_message = db.query(Message).filter(Message.id == message_id, Message.user_id == user_id).first()
    if not db_message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    db.delete(db_message)
    db.commit()