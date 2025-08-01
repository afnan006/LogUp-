from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db
from app.api.auth import router as auth_router
from app.api.transactions import router as transactions_router
from app.api.debts import router as debts_router
from app.api.split_expenses import router as split_expenses_router
from app.api.subscriptions import router as subscriptions_router
from app.api.budgets import router as budgets_router
from app.api.goals import router as goals_router
from app.api.savings import router as savings_router
from app.api.friends import router as friends_router
from app.api.messages import router as messages_router
from app.api.notifications import router as notifications_router
from app.api.permissions import router as permissions_router
from app.api.templates import router as templates_router
from app.api.widgets import router as widgets_router
from app.api.analytics import router as analytics_router
from app.api.dashboard import router as dashboard_router
from app.api.chat import router as chat_router
from app.api.receipts import router as receipts_router
from app.api.sms import router as sms_router

app = FastAPI(title="LogUp Backend")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routers
app.include_router(auth_router)
app.include_router(transactions_router)
app.include_router(debts_router)
app.include_router(split_expenses_router)
app.include_router(subscriptions_router)
app.include_router(budgets_router)
app.include_router(goals_router)
app.include_router(savings_router)
app.include_router(friends_router)
app.include_router(messages_router)
app.include_router(notifications_router)
app.include_router(permissions_router)
app.include_router(templates_router)
app.include_router(widgets_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)
app.include_router(chat_router)
app.include_router(receipts_router)
app.include_router(sms_router)

@app.on_event("startup")
async def startup_event():
    init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to LogUp Backend"}