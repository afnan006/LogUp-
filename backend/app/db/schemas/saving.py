from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SavingBase(BaseModel):
    name: str
    amount: float
    goal_id: Optional[int] = None

class SavingCreate(SavingBase):
    pass

class Saving(SavingBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True