from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.permission import Permission
from app.db.schemas.permission import PermissionCreate, Permission

router = APIRouter(prefix="/permissions", tags=["permissions"])

@router.post("/", response_model=Permission, status_code=status.HTTP_201_CREATED)
async def create_permission(permission: PermissionCreate, user_id: int, db: Session = Depends(get_db)):
    db_permission = Permission(**permission.dict(), user_id=user_id)
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

@router.get("/{permission_id}", response_model=Permission)
async def get_permission(permission_id: int, user_id: int, db: Session = Depends(get_db)):
    permission = db.query(Permission).filter(Permission.id == permission_id, Permission.user_id == user_id).first()
    if not permission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
    return permission

@router.get("/", response_model=List[Permission])
async def get_permissions(user_id: int, db: Session = Depends(get_db)):
    permissions = db.query(Permission).filter(Permission.user_id == user_id).all()
    return permissions

@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_permission(permission_id: int, user_id: int, db: Session = Depends(get_db)):
    db_permission = db.query(Permission).filter(Permission.id == permission_id, Permission.user_id == user_id).first()
    if not db_permission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
    db.delete(db_permission)
    db.commit()