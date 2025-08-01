from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TemplateBase(BaseModel):
    name: str
    category: Optional[str] = None
    amount: Optional[float] = None
    description: Optional[str] = None

class TemplateCreate(TemplateBase):
    pass

class Template(TemplateBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True