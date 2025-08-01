from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from app.db.database import Base
import enum

class SplitType(enum.Enum):
    equal = "equal"
    percentage = "percentage"
    custom = "custom"

class SplitExpense(Base):
    __tablename__ = "split_expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    description = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    split_type = Column(Enum(SplitType), nullable=False)
    participants = Column(JSON, nullable=False)  # Stores list of {user_id, amount_paid, share_amount}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="split_expenses")