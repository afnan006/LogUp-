from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from app.db.database import Base
import enum

class NudgeStatus(enum.Enum):
    active = "active"
    dismissed = "dismissed"

class Nudge(Base):
    __tablename__ = "nudges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    type = Column(String, nullable=False)  # e.g., debt_due, savings_goal
    content = Column(String, nullable=False)
    status = Column(Enum(NudgeStatus), nullable=False, default=NudgeStatus.active)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="nudges")