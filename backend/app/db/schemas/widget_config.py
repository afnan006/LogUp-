from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict

class WidgetConfigBase(BaseModel):
    widget_type: str
    position: int
    settings: Optional[Dict] = None

class WidgetConfigCreate(WidgetConfigBase):
    pass

class WidgetConfig(WidgetConfigBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True