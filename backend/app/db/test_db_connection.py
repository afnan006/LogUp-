import os
import ssl
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text  # <-- Important!
from dotenv import load_dotenv

# Load environment variables from ../../.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and not DATABASE_URL.startswith("postgresql+asyncpg"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

def get_ssl_context():
    ca_path = os.path.join(os.path.dirname(__file__), '../../ca.pem')
    if not os.path.exists(ca_path):
        print(f"❌ CA certificate not found at {ca_path}")
        print("Please download ca.pem from your Aiven dashboard and place it in the backend directory.")
        exit(1)
    ssl_context = ssl.create_default_context(cafile=ca_path)
    return ssl_context

async def test_connection():
    print(f"Trying: {DATABASE_URL}")
    ssl_context = get_ssl_context()
    engine = create_async_engine(
        DATABASE_URL or "bad_url",
        echo=True,
        connect_args={"ssl": ssl_context}
    )
    try:
        async with engine.begin() as conn:
            # FIX: wrap SQL string in text()
            await conn.execute(text("SELECT 1;"))
        print("✅ Database connection successful!")
    except SQLAlchemyError as e:
        print("❌ Database connection failed!")
        print(repr(e))

if __name__ == "__main__":
    asyncio.run(test_connection())
