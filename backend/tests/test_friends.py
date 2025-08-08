import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.friend import Friend
from app.db.schemas.friend import FriendCreate, Friend as FriendSchema
from main import app

@pytest_asyncio.fixture
async def client():
    return TestClient(app)

@pytest_asyncio.fixture
async def db_session():
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()

@pytest_asyncio.fixture
async def test_user(db_session: Session):
    user = db_session.query(User).filter(User.email == "test@example.com").first()
    if not user:
        user = User(
            username="testuser",
            email="test@example.com",
            password_hash="$2b$12$wHbQTgJT92Cnbzbp5/W3n.ud.JLZClxFPZIXuEsyWmGrBVX62pl6W",
            phone_number="1234567890"
        )
        db_session.add(user)
        db_session.commit()
    return user

@pytest.mark.asyncio
async def test_add_friend(client: TestClient, db_session: Session, test_user: User):
    friend_data = {
        "user_id": test_user.id,
        "friend_id": test_user.id  # Self for simplicity
    }
    response = client.post("/friends", json=friend_data)
    assert response.status_code == status.HTTP_201_CREATED
    db_friend = db_session.query(Friend).filter(Friend.user_id == test_user.id).first()
    assert db_friend is not None
    assert db_friend.friend_id == test_user.id

@pytest.mark.asyncio
async def test_get_friends(client: TestClient, db_session: Session, test_user: User):
    friend = Friend(user_id=test_user.id, friend_id=test_user.id)
    db_session.add(friend)
    db_session.commit()
    response = client.get(f"/friends?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(f["friend_id"] == test_user.id for f in response.json())