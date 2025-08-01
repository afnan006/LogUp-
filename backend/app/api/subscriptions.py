from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.debt import Debt
from app.db.schemas.debt import DebtCreate, Debt

router = APIRouter(prefix="/debts", tags=["debts"])

@router.post("/", response_model=Debt, status_code=status.HTTP_201_CREATED)
async def create_debt(debt: DebtCreate, user_id: int, db: Session = Depends(get_db)):
    db_debt = Debt(**debt.dict(), user_id=user_id)
    db.add(db_debt)
    db.commit()
    db.refresh(db_debt)
    return db_debt

@router.get("/{debt_id}", response_model=Debt)
async def get_debt(debt_id: int, user_id: int, db: Session = Depends(get_db)):
    debt = db.query(Debt).filter(Debt.id == debt_id, Debt.user_id == user_id).first()
    if not debt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Debt not found")
    return debt

@router.get("/", response_model=List[Debt])
async def get_debts(user_id: int, db: Session = Depends(get_db)):
    debts = db.query(Debt).filter(Debt.user_id == user_id).all()
    return debts

@router.put("/{debt_id}", response_model=Debt)
async def update_debt(debt_id: int, debt: DebtCreate, user_id: int, db: Session = Depends(get_db)):
    db_debt = db.query(Debt).filter(Debt.id == debt_id, Debt.user_id == user_id).first()
    if not db_debt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Debt not found")
    for key, value in debt.dict().items():
        setattr(db_debt, key, value)
    db.commit()
    db.refresh(db_debt)
    return db_debt

@router.delete("/{debt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_debt(debt_id: int, user_id: int, db: Session = Depends(get_db)):
    db_debt = db.query(Debt).filter(Debt.id == debt_id, Debt.user_id == user_id).first()
    if not db_debt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Debt not found")
    db.delete(db_debt)
    db.commit()