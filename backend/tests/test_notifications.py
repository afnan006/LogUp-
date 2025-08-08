import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.nudge import Nudge
from app.db.schemas.nudge import NudgeCreate, Nudge as NudgeSchema
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
async def test_get_notifications(client: TestClient, db_session: Session, test_user: User):
    nudge = Nudge(
        user_id=test_user.id,
        message="You overspent on Food this week!",
        type="alert"
    )
    db_session.add(nudge)
    db_session.commit()
    response = client.get(f"/notifications?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(n["message"] == "You overspent on Food this week!" for n in response.json())

@pytest.mark.asyncio
async def test_mark_notification_read(client: TestClient, db_session: Session, test_user: User):
    nudge = Nudge(
        user_id=test_user.id,
        message="Budget alert!",
        type="alert"
    )
    db_session.add(nudge)
    db_session.commit()
    response = client.post(f"/notifications/{nudge.id}/mark-read")
    assert response.status_code == status.HTTP_200_OK
    db_nudge = db_session.query(Nudge).filter(Nudge.id == nudge.id).first()
    assert db_nudge.is_read is True