from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class BudgetBase(BaseModel):
    category: str
    amount: float
    period: str  # monthly/weekly
    start_date: date
    end_date: date

class BudgetCreate(BudgetBase):
    pass

class Budget(BudgetBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True