from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models.friend import Friend
from app.db.schemas.friend import FriendCreate, Friend

router = APIRouter(prefix="/friends", tags=["friends"])

@router.post("/", response_model=Friend, status_code=status.HTTP_201_CREATED)
async def create_friend(friend: FriendCreate, user_id: int, db: Session = Depends(get_db)):
    db_friend = Friend(**friend.dict(), user_id=user_id)
    db.add(db_friend)
    db.commit()
    db.refresh(db_friend)
    return db_friend

@router.get("/{friend_id}", response_model=Friend)
async def get_friend(friend_id: int, user_id: int, db: Session = Depends(get_db)):
    friend = db.query(Friend).filter(Friend.id == friend_id, Friend.user_id == user_id).first()
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")
    return friend

@router.get("/", response_model=List[Friend])
async def get_friends(user_id: int, db: Session = Depends(get_db)):
    friends = db.query(Friend).filter(Friend.user_id == user_id).all()
    return friends

@router.put("/{friend_id}", response_model=Friend)
async def update_friend(friend_id: int, friend: FriendCreate, user_id: int, db: Session = Depends(get_db)):
    db_friend = db.query(Friend).filter(Friend.id == friend_id, Friend.user_id == user_id).first()
    if not db_friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")
    for key, value in friend.dict().items():
        setattr(db_friend, key, value)
    db.commit()
    db.refresh(db_friend)
    return db_friend

@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_friend(friend_id: int, user_id: int, db: Session = Depends(get_db)):
    db_friend = db.query(Friend).filter(Friend.id == friend_id, Friend.user_id == user_id).first()
    if not db_friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")
    db.delete(db_friend)
    db.commit()