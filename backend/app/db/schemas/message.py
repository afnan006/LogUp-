from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageBase(BaseModel):
    content: str
    is_user: bool
    timestamp: datetime

class MessageCreate(MessageBase):
    friend_id: Optional[int] = None

class Message(MessageBase):
    id: int
    user_id: int
    friend_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True