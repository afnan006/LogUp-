LogUp - Personal Finance Management Application
Overview
LogUp is a comprehensive personal finance management application designed to empower users with tools to track expenses, manage budgets, split bills with friends, monitor subscriptions, and set financial goals. The application combines a robust backend built with FastAPI and SQLAlchemy with a modern, responsive frontend developed using React, TypeScript, and Tailwind CSS. LogUp aims to provide an intuitive and engaging user experience, integrating AI-driven insights and social features to make financial management seamless and collaborative.
Features
Core Functionality

Expense Tracking: Log and categorize transactions to monitor spending habits.
Budget Management: Create, update, and track budgets for various categories with customizable periods.
Debt Management: Record and manage debts owed to or by friends, with status tracking (pending/paid).
Bill Splitting: Split expenses among friends using equal, percentage-based, or custom amount methods, with automated settlement calculations.
Subscription Management: Track recurring subscriptions with details like billing cycles, due dates, and status (active/paused/cancelled).
Financial Goals: Set and monitor savings goals with target amounts and deadlines.
Social Features: Connect with friends to collaborate on shared expenses and communicate via in-app messaging.
AI-Driven Insights: Generate personalized financial stories and predictions based on user spending patterns (currently in development).
Receipt Processing: Upload and process receipts for expense tracking (placeholder for future OCR integration).
SMS Integration: Send notifications or reminders via SMS (placeholder for future Twilio integration).
Customizable Widgets: Configure dashboard widgets to display key financial metrics.
Notifications: Receive nudges and alerts for budget limits, due dates, and financial milestones.

Technical Highlights

Backend: Built with FastAPI for high-performance API endpoints, using SQLAlchemy for ORM and PostgreSQL for data persistence.
Frontend: Developed with React and TypeScript, styled with Tailwind CSS for a responsive and modern UI.
Database: Structured with models for users, transactions, budgets, debts, friends, goals, savings, messages, notifications, permissions, templates, and widget configurations.
Authentication: Secure user signup and login with bcrypt password hashing.
CORS Support: Configured to allow seamless communication with the frontend running on http://localhost:5173.
Modular Architecture: Organized into services, middleware, and utilities for maintainability and scalability.

Project Structure
afnan006-logup-/
├── backend/
│   ├── app/
│   │   ├── api/                    # API endpoints for various features
│   │   ├── config/                 # Configuration settings
│   │   ├── db/                     # Database models, schemas, and utilities
│   │   ├── middleware/             # Authentication middleware
│   │   ├── services/               # Business logic for various features
│   │   └── utils/                  # Helper functions
│   ├── tests/                      # Unit tests for API endpoints
│   ├── main.py                     # FastAPI application entry point
│   ├── requirements.txt            # Python dependencies
│   └── README.md                   # Backend-specific documentation
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   ├── contexts/               # React context for state management
│   │   ├── lib/                    # Firebase integration
│   │   └── pages/                  # Page components for different views
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Node.js dependencies
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── vite.config.ts              # Vite configuration
│   └── tsconfig.json               # TypeScript configuration

Installation
Prerequisites

Backend:
Python 3.8+
PostgreSQL
pip for installing Python dependencies


Frontend:
Node.js 16+
npm or yarn for installing dependencies



Backend Setup

Clone the Repository:
git clone https://github.com/afnan006/logup.git
cd logup/backend


Set Up a Virtual Environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


Install Dependencies:
pip install -r requirements.txt


Configure Environment Variables:

Create a .env file in the backend/ directory.
Add the following variables:DATABASE_URL=postgresql://user:password@localhost:5432/logup_db
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=10
DB_ECHO=False


Ensure a ca.pem certificate is present for SSL-secured database connections (if applicable).


Initialize the Database:
python app/db/create_tables.py


Run the Backend:
uvicorn main:app --reload

The API will be available at http://localhost:8000.


Frontend Setup

Navigate to the Frontend Directory:
cd frontend


Install Dependencies:
npm install


Run the Development Server:
npm run dev

The frontend will be available at http://localhost:5173.


Usage

Sign Up / Log In: Access the application via the frontend and create an account or log in using the /auth/signup or /auth/login endpoints.
Dashboard: View a summary of expenses, savings, and debts via the /analytics/summary endpoint.
Manage Finances:
Add and track transactions, budgets, debts, and savings through their respective pages.
Split expenses with friends on the SplitExpensePage.
Monitor subscriptions and their due dates on the SubscriptionsPage.


Social Features: Add friends, send messages, and collaborate on shared expenses.
AI Insights: View AI-generated financial stories on the StoryPage (currently a static placeholder, pending AI integration).

API Endpoints
The backend provides RESTful API endpoints for various features. Below is a summary of key endpoints:



Endpoint
Method
Description



/auth/signup
POST
Register a new user


/auth/login
POST
Authenticate a user


/transactions/
GET/POST/PUT/DELETE
Manage user transactions


/budgets/
GET/POST/PUT/DELETE
Manage budgets


/debts/
GET/POST/PUT/DELETE
Manage debts


/split_expenses/
GET/POST/PUT/DELETE
Manage split expenses


/subscriptions/
GET/POST/PUT/DELETE
Manage subscriptions


/goals/
GET/POST/PUT/DELETE
Manage financial goals


/savings/
GET/POST/PUT/DELETE
Manage savings


/friends/
GET/POST/PUT/DELETE
Manage friends


/messages/
GET/POST/DELETE
Manage messages


/notifications/
GET/POST/PUT/DELETE
Manage notifications


/analytics/summary
GET
Fetch financial summary


/chat/message
POST
Send AI chat messages (placeholder)


/receipts/upload
POST
Upload receipts (placeholder)


/sms/send
POST
Send SMS (placeholder)


For detailed API documentation, refer to the auto-generated OpenAPI docs at http://localhost:8000/docs.
Current Development Focus
Backend Testing
We are actively working on comprehensive unit and integration tests for the backend to ensure reliability and robustness. The tests/ directory contains test files for each API module, covering authentication, transactions, budgets, debts, and more. The focus is on achieving high test coverage and validating edge cases.
AI Integration
The next phase of development involves enhancing LogUp with AI-driven features, including:

Centralized Chatbot: Integrating a chatbot powered by a vector database (Qdrant) and large language models (LLMs) to centralize manual features. Users will be able to manage transactions, budgets, debts, and splits through natural language commands.
Retrieval-Augmented Generation (RAG): Implementing RAG to provide context-aware financial insights and recommendations based on user data.
Financial Story Generation: Enhancing the StoryPage with dynamic, AI-generated narratives about spending patterns, savings opportunities, and financial predictions.

Future Enhancements

Receipt OCR: Integrate optical character recognition for automatic expense extraction from uploaded receipts.
SMS Notifications: Implement Twilio integration for real-time SMS alerts.
Advanced Analytics: Develop detailed financial analytics with visualizations and predictive models.
Mobile App: Extend LogUp to native iOS and Android applications.
Multi-Currency Support: Enable tracking of expenses in multiple currencies.
Group Budgeting: Allow collaborative budgeting for shared households or teams.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request with a detailed description of your changes.

Please ensure code adheres to the project's linting and formatting standards (ESLint for frontend, Black for backend).
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or feedback, please reach out via GitHub Issues or contact the maintainer at [your-email@example.com].
