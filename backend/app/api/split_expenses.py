from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.split_expense import SplitExpense
from app.db.schemas.split_expense import SplitExpenseCreate, SplitExpense

router = APIRouter(prefix="/split_expenses", tags=["split_expenses"])

@router.post("/", response_model=SplitExpense, status_code=status.HTTP_201_CREATED)
async def create_split_expense(split_expense: SplitExpenseCreate, user_id: int, db: Session = Depends(get_db)):
    db_split = SplitExpense(**split_expense.dict(), user_id=user_id)
    db.add(db_split)
    db.commit()
    db.refresh(db_split)
    return db_split

@router.get("/{split_id}", response_model=SplitExpense)
async def get_split_expense(split_id: int, user_id: int, db: Session = Depends(get_db)):
    split = db.query(SplitExpense).filter(SplitExpense.id == split_id, SplitExpense.user_id == user_id).first()
    if not split:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Split expense not found")
    return split

@router.get("/", response_model=List[SplitExpense])
async def get_split_expenses(user_id: int, db: Session = Depends(get_db)):
    splits = db.query(SplitExpense).filter(SplitExpense.user_id == user_id).all()
    return splits

@router.put("/{split_id}", response_model=SplitExpense)
async def update_split_expense(split_id: int, split_expense: SplitExpenseCreate, user_id: int, db: Session = Depends(get_db)):
    db_split = db.query(SplitExpense).filter(SplitExpense.id == split_id, SplitExpense.user_id == user_id).first()
    if not db_split:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Split expense not found")
    for key, value in split_expense.dict().items():
        setattr(db_split, key, value)
    db.commit()
    db.refresh(db_split)
    return db_split

@router.delete("/{split_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_split_expense(split_id: int, user_id: int, db: Session = Depends(get_db)):
    db_split = db.query(SplitExpense).filter(SplitExpense.id == split_id, SplitExpense.user_id == user_id).first()
    if not db_split:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Split expense not found")
    db.delete(db_split)
    db.commit()