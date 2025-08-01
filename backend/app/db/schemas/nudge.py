from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class NudgeStatus(str, Enum):
    active = "active"
    dismissed = "dismissed"

class NudgeBase(BaseModel):
    type: str  # e.g., debt_due, savings_goal
    content: str
    status: NudgeStatus = NudgeStatus.active

class NudgeCreate(NudgeBase):
    pass

class Nudge(NudgeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True