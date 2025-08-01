from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Optional
from enum import Enum

class SplitType(str, Enum):
    equal = "equal"
    percentage = "percentage"
    custom = "custom"

class SplitExpenseBase(BaseModel):
    description: str
    total_amount: float
    split_type: SplitType
    participants: List[Dict[str, float]]  # e.g., [{"user_id": 1, "amount_paid": 100, "share_amount": 50}]

class SplitExpenseCreate(SplitExpenseBase):
    pass

class SplitExpense(SplitExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True