from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from typing import Dict

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/message", response_model=Dict)
async def send_chat_message(message: Dict, user_id: int, db: Session = Depends(get_db)):
    # Placeholder for AI chat processing (to be integrated with Qdrant later)
    return {
        "user_id": user_id,
        "message": message.get("content"),
        "response": "AI response placeholder"
    }