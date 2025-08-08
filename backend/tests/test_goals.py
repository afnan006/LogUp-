import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.goal import Goal
from app.db.schemas.goal import GoalCreate, Goal as GoalSchema
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
async def test_create_goal(client: TestClient, db_session: Session, test_user: User):
    goal_data = {
        "user_id": test_user.id,
        "title": "Vacation Fund",
        "target_amount": 5000.00,
        "current_amount": 1000.00
    }
    response = client.post("/goals", json=goal_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["title"] == "Vacation Fund"
    db_goal = db_session.query(Goal).filter(Goal.title == "Vacation Fund").first()
    assert db_goal is not None
    assert db_goal.user_id == test_user.id

@pytest.mark.asyncio
async def test_get_goals(client: TestClient, db_session: Session, test_user: User):
    goal = Goal(
        user_id=test_user.id,
        title="Car Fund",
        target_amount=10000.00,
        current_amount=2000.00
    )
    db_session.add(goal)
    db_session.commit()
    response = client.get(f"/goals?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(g["title"] == "Car Fund" for g in response.json())

@pytest.mark.asyncio
async def test_update_goal(client: TestClient, db_session: Session, test_user: User):
    goal = Goal(
        user_id=test_user.id,
        title="Bike Fund",
        target_amount=2000.00,
        current_amount=500.00
    )
    db_session.add(goal)
    db_session.commit()
    update_data = {
        "current_amount": 600.00
    }
    response = client.put(f"/goals/{goal.id}", json=update_data)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["current_amount"] == 600.00