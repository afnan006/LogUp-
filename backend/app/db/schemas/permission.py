from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PermissionBase(BaseModel):
    resource_id: int
    resource_type: str  # e.g., split_expense, budget
    permission_type: str  # view/edit

class PermissionCreate(PermissionBase):
    pass

class Permission(PermissionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True