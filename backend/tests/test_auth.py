import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from fastapi import status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.db.models.user import User
from app.db.schemas.user import UserCreate
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
async def test_signup_success(client: TestClient, db_session: Session):
    db_session.query(User).filter(User.email == "newuser@example.com").delete()
    db_session.commit()
    user_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password123",
        "phone_number": "9876543210"
    }
    response = client.post("/auth/signup", json=user_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["email"] == "newuser@example.com"
    db_user = db_session.query(User).filter(User.email == "newuser@example.com").first()
    assert db_user is not None
    assert db_user.username == "newuser"

@pytest.mark.asyncio
async def test_signup_duplicate_email(client: TestClient):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
        "phone_number": "9876543210"
    }
    response = client.post("/auth/signup", json=user_data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already registered" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_success(client: TestClient):
    login_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
        "phone_number": "1234567890"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Login successful"
    assert "user_id" in response.json()

@pytest.mark.asyncio
async def test_login_invalid_credentials(client: TestClient):
    login_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "wrongpassword",
        "phone_number": "1234567890"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid email or password" in response.json()["detail"]