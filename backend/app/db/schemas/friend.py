from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FriendBase(BaseModel):
    name: str
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    is_online: bool = False

class FriendCreate(FriendBase):
    pass

class Friend(FriendBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True