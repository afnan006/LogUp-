from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.widget_config import WidgetConfig
from app.db.schemas.widget_config import WidgetConfigCreate, WidgetConfig

router = APIRouter(prefix="/widgets", tags=["widgets"])

@router.post("/", response_model=WidgetConfig, status_code=status.HTTP_201_CREATED)
async def create_widget(widget: WidgetConfigCreate, user_id: int, db: Session = Depends(get_db)):
    db_widget = WidgetConfig(**widget.dict(), user_id=user_id)
    db.add(db_widget)
    db.commit()
    db.refresh(db_widget)
    return db_widget

@router.get("/{widget_id}", response_model=WidgetConfig)
async def get_widget(widget_id: int, user_id: int, db: Session = Depends(get_db)):
    widget = db.query(WidgetConfig).filter(WidgetConfig.id == widget_id, WidgetConfig.user_id == user_id).first()
    if not widget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Widget not found")
    return widget

@router.get("/", response_model=List[WidgetConfig])
async def get_widgets(user_id: int, db: Session = Depends(get_db)):
    widgets = db.query(WidgetConfig).filter(WidgetConfig.user_id == user_id).all()
    return widgets

@router.put("/{widget_id}", response_model=WidgetConfig)
async def update_widget(widget_id: int, widget: WidgetConfigCreate, user_id: int, db: Session = Depends(get_db)):
    db_widget = db.query(WidgetConfig).filter(WidgetConfig.id == widget_id, WidgetConfig.user_id == user_id).first()
    if not db_widget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Widget not found")
    for key, value in widget.dict().items():
        setattr(db_widget, key, value)
    db.commit()
    db.refresh(db_widget)
    return db_widget

@router.delete("/{widget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_widget(widget_id: int, user_id: int, db: Session = Depends(get_db)):
    db_widget = db.query(WidgetConfig).filter(WidgetConfig.id == widget_id, WidgetConfig.user_id == user_id).first()
    if not db_widget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Widget not found")
    db.delete(db_widget)
    db.commit()