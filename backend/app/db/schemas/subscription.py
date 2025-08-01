from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional
from enum import Enum

class SubscriptionStatus(str, Enum):
    active = "active"
    paused = "paused"
    cancelled = "cancelled"

class SubscriptionBase(BaseModel):
    name: str
    amount: float
    billing_cycle: str  # monthly/yearly/weekly
    next_due_date: date
    category: Optional[str] = None
    status: SubscriptionStatus = SubscriptionStatus.active
    color: Optional[str] = None

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(SubscriptionBase):
    name: Optional[str] = None
    amount: Optional[float] = None
    billing_cycle: Optional[str] = None
    next_due_date: Optional[date] = None
    status: Optional[SubscriptionStatus] = None

class Subscription(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True