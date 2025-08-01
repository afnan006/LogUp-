from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.template import Template
from app.db.schemas.template import TemplateCreate, Template

router = APIRouter(prefix="/templates", tags=["templates"])

@router.post("/", response_model=Template, status_code=status.HTTP_201_CREATED)
async def create_template(template: TemplateCreate, user_id: int, db: Session = Depends(get_db)):
    db_template = Template(**template.dict(), user_id=user_id)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.get("/{template_id}", response_model=Template)
async def get_template(template_id: int, user_id: int, db: Session = Depends(get_db)):
    template = db.query(Template).filter(Template.id == template_id, Template.user_id == user_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return template

@router.get("/", response_model=List[Template])
async def get_templates(user_id: int, db: Session = Depends(get_db)):
    templates = db.query(Template).filter(Template.user_id == user_id).all()
    return templates

@router.put("/{template_id}", response_model=Template)
async def update_template(template_id: int, template: TemplateCreate, user_id: int, db: Session = Depends(get_db)):
    db_template = db.query(Template).filter(Template.id == template_id, Template.user_id == user_id).first()
    if not db_template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    for key, value in template.dict().items():
        setattr(db_template, key, value)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(template_id: int, user_id: int, db: Session = Depends(get_db)):
    db_template = db.query(Template).filter(Template.id == template_id, Template.user_id == user_id).first()
    if not db_template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    db.delete(db_template)
    db.commit()