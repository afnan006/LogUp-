from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.budget import Budget
from app.db.schemas.budget import BudgetCreate, Budget

router = APIRouter(prefix="/budgets", tags=["budgets"])

@router.post("/", response_model=Budget, status_code=status.HTTP_201_CREATED)
async def create_budget(budget: BudgetCreate, user_id: int, db: Session = Depends(get_db)):
    db_budget = Budget(**budget.dict(), user_id=user_id)
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.get("/{budget_id}", response_model=Budget)
async def get_budget(budget_id: int, user_id: int, db: Session = Depends(get_db)):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user_id).first()
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    return budget

@router.get("/", response_model=List[Budget])
async def get_budgets(user_id: int, db: Session = Depends(get_db)):
    budgets = db.query(Budget).filter(Budget.user_id == user_id).all()
    return budgets

@router.put("/{budget_id}", response_model=Budget)
async def update_budget(budget_id: int, budget: BudgetCreate, user_id: int, db: Session = Depends(get_db)):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user_id).first()
    if not db_budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    for key, value in budget.dict().items():
        setattr(db_budget, key, value)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(budget_id: int, user_id: int, db: Session = Depends(get_db)):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user_id).first()
    if not db_budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    db.delete(db_budget)
    db.commit()