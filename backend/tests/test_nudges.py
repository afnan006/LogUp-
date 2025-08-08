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
async def test_create_nudge(client: TestClient, db_session: Session, test_user: User):
    nudge_data = {
        "user_id": test_user.id,
        "message": "Save more this week!",
        "type": "motivation"
    }
    response = client.post("/nudges", json=nudge_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["message"] == "Save more this week!"
    db_nudge = db_session.query(Nudge).filter(Nudge.message == "Save more this week!").first()
    assert db_nudge is not None
    assert db_nudge.user_id == test_user.id

@pytest.mark.asyncio
async def test_get_nudges(client: TestClient, db_session: Session, test_user: User):
    nudge = Nudge(
        user_id=test_user.id,
        message="Check your budget!",
        type="alert"
    )
    db_session.add(nudge)
    db_session.commit()
    response = client.get(f"/nudges?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(n["message"] == "Check your budget!" for n in response.json())