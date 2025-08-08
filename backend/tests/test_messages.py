import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.message import Message
from app.db.schemas.message import MessageCreate, Message as MessageSchema
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
async def test_send_message(client: TestClient, db_session: Session, test_user: User):
    message_data = {
        "sender_id": test_user.id,
        "receiver_id": test_user.id,
        "content": "Hey, let’s split the bill!"
    }
    response = client.post("/messages", json=message_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["content"] == "Hey, let’s split the bill!"
    db_message = db_session.query(Message).filter(Message.content == "Hey, let’s split the bill!").first()
    assert db_message is not None
    assert db_message.sender_id == test_user.id

@pytest.mark.asyncio
async def test_get_messages(client: TestClient, db_session: Session, test_user: User):
    message = Message(
        sender_id=test_user.id,
        receiver_id=test_user.id,
        content="Pay me back for lunch!"
    )
    db_session.add(message)
    db_session.commit()
    response = client.get(f"/messages?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(m["content"] == "Pay me back for lunch!" for m in response.json())