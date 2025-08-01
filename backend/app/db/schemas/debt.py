from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional
from enum import Enum

class DebtStatus(str, Enum):
    pending = "pending"
    paid = "paid"

class DebtBase(BaseModel):
    amount: float
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: DebtStatus = DebtStatus.pending

class DebtCreate(DebtBase):
    friend_id: Optional[int] = None

class Debt(DebtBase):
    id: int
    user_id: int
    friend_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True