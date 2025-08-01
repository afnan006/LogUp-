from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    transactions = relationship("Transaction", back_populates="user")
    debts = relationship("Debt", back_populates="user")
    split_expenses = relationship("SplitExpense", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")
    budgets = relationship("Budget", back_populates="user")
    goals = relationship("Goal", back_populates="user")
    savings = relationship("Saving", back_populates="user")
    friends = relationship("Friend", back_populates="user")
    messages = relationship("Message", back_populates="user")
    nudges = relationship("Nudge", back_populates="user")
    permissions = relationship("Permission", back_populates="user")
    templates = relationship("Template", back_populates="user")
    widget_configs = relationship("WidgetConfig", back_populates="user")