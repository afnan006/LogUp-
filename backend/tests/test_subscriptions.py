import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.subscription import Subscription
from app.db.schemas.subscription import SubscriptionCreate, Subscription as SubscriptionSchema
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
async def test_create_subscription(client: TestClient, db_session: Session, test_user: User):
    subscription_data = {
        "user_id": test_user.id,
        "service_name": "Netflix",
        "amount": 15.00,
        "renewal_date": "2025-09-01"
    }
    response = client.post("/subscriptions", json=subscription_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["service_name"] == "Netflix"
    db_subscription = db_session.query(Subscription).filter(Subscription.service_name == "Netflix").first()
    assert db_subscription is not None
    assert db_subscription.user_id == test_user.id

@pytest.mark.asyncio
async def test_get_subscriptions(client: TestClient, db_session: Session, test_user: User):
    subscription = Subscription(
        user_id=test_user.id,
        service_name="Spotify",
        amount=10.00,
        renewal_date="2025-09-01"
    )
    db_session.add(subscription)
    db_session.commit()
    response = client.get(f"/subscriptions?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(s["service_name"] == "Spotify" for s in response.json())