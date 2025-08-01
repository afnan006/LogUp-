from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.saving import Saving
from app.db.schemas.saving import SavingCreate, Saving

router = APIRouter(prefix="/savings", tags=["savings"])

@router.post("/", response_model=Saving, status_code=status.HTTP_201_CREATED)
async def create_saving(saving: SavingCreate, user_id: int, db: Session = Depends(get_db)):
    db_saving = Saving(**saving.dict(), user_id=user_id)
    db.add(db_saving)
    db.commit()
    db.refresh(db_saving)
    return db_saving

@router.get("/{saving_id}", response_model=Saving)
async def get_saving(saving_id: int, user_id: int, db: Session = Depends(get_db)):
    saving = db.query(Saving).filter(Saving.id == saving_id, Saving.user_id == user_id).first()
    if not saving:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saving not found")
    return saving

@router.get("/", response_model=List[Saving])
async def get_savings(user_id: int, db: Session = Depends(get_db)):
    savings = db.query(Saving).filter(Saving.user_id == user_id).all()
    return savings

@router.put("/{saving_id}", response_model=Saving)
async def update_saving(saving_id: int, saving: SavingCreate, user_id: int, db: Session = Depends(get_db)):
    db_saving = db.query(Saving).filter(Saving.id == saving_id, Saving.user_id == user_id).first()
    if not db_saving:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saving not found")
    for key, value in saving.dict().items():
        setattr(db_saving, key, value)
    db.commit()
    db.refresh(db_saving)
    return db_saving

@router.delete("/{saving_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saving(saving_id: int, user_id: int, db: Session = Depends(get_db)):
    db_saving = db.query(Saving).filter(Saving.id == saving_id, Saving.user_id == user_id).first()
    if not db_saving:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saving not found")
    db.delete(db_saving)
    db.commit()