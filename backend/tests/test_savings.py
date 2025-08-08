import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.saving import Saving
from app.db.schemas.saving import SavingCreate, Saving as SavingSchema
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
async def test_create_saving(client: TestClient, db_session: Session, test_user: User):
    saving_data = {
        "user_id": test_user.id,
        "amount": 1000.00,
        "description": "Emergency Fund"
    }
    response = client.post("/savings", json=saving_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["amount"] == 1000.00
    db_saving = db_session.query(Saving).filter(Saving.description == "Emergency Fund").first()
    assert db_saving is not None
    assert db_saving.user_id == test_user.id

@pytest.mark.asyncio
async def test_get_savings(client: TestClient, db_session: Session, test_user: User):
    saving = Saving(
        user_id=test_user.id,
        amount=2000.00,
        description="Travel Fund"
    )
    db_session.add(saving)
    db_session.commit()
    response = client.get(f"/savings?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(s["description"] == "Travel Fund" for s in response.json())