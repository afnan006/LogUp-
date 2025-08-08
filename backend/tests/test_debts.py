import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.models.debt import Debt
from app.db.schemas.debt import DebtCreate, Debt as DebtSchema
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
async def test_create_debt(client: TestClient, db_session: Session, test_user: User):
    debt_data = {
        "user_id": test_user.id,
        "creditor_id": test_user.id,
        "amount": 200.00,
        "description": "Lunch debt"
    }
    response = client.post("/debts", json=debt_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["amount"] == 200.00
    db_debt = db_session.query(Debt).filter(Debt.description == "Lunch debt").first()
    assert db_debt is not None
    assert db_debt.user_id == test_user.id

@pytest.mark.asyncio
async def test_get_debts(client: TestClient, db_session: Session, test_user: User):
    debt = Debt(
        user_id=test_user.id,
        creditor_id=test_user.id,
        amount=300.00,
        description="Movie debt"
    )
    db_session.add(debt)
    db_session.commit()
    response = client.get(f"/debts?user_id={test_user.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1
    assert any(d["description"] == "Movie debt" for d in response.json())

@pytest.mark.asyncio
async def test_settle_debt(client: TestClient, db_session: Session, test_user: User):
    debt = Debt(
        user_id=test_user.id,
        creditor_id=test_user.id,
        amount=100.00,
        description="Coffee debt"
    )
    db_session.add(debt)
    db_session.commit()
    response = client.post(f"/debts/{debt.id}/settle")
    assert response.status_code == status.HTTP_200_OK
    db_debt = db_session.query(Debt).filter(Debt.id == debt.id).first()
    assert db_debt is None