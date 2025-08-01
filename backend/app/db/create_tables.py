from app.db.database import init_db
from app.db.models import *  # Import all models to register them

if __name__ == "__main__":
    init_db()
    print("Tables created successfully!")