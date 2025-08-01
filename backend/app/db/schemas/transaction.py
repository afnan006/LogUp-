from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class TransactionType(str, Enum):
    expense = "expense"
    income = "income"

class TransactionBase(BaseModel):
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None
    merchant_name: Optional[str] = None
    bank_name: Optional[str] = None
    confidence: Optional[str] = None  # high/medium/low
    type: TransactionType
    timestamp: datetime

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True