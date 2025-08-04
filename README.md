# 💰 LogUp - Own Your Sh!t frfr
Intelligent Financial Management Platform

<div align="center">

![LogUp Banner](https://via.placeholder.com/800x200/1f2937/ffffff?text=LogUp+-+Smart+Financial+Management)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Empowering users to take full control of their personal finances with AI-driven insights**

[🚀 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📦 Installation](#-installation) • [🔄 Current Development](#-current-development) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Current Development](#-current-development)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

LogUp is a sophisticated financial management application designed to revolutionize personal finance management through intelligent automation and AI-driven insights. Built with modern technologies, LogUp provides a comprehensive suite of tools for expense tracking, budget management, debt monitoring, and financial goal setting.

### 🌟 What Makes LogUp Special?

- **AI-Powered Intelligence**: Leveraging RAG (Retrieval-Augmented Generation) models with vector databases
- **Centralized Chat Interface**: Natural language interaction with your financial data
- **Smart Automation**: Intelligent categorization and personalized recommendations
- **Modern Architecture**: Built with FastAPI, React, and cutting-edge technologies

## ✨ Features

### 🏦 Core Financial Management
- **💳 Expense Tracking** - Record and categorize transactions effortlessly
- **📊 Budget Management** - Set and monitor spending limits across categories
- **🎯 Goal Setting** - Create and track personalized financial objectives
- **💰 Debt Tracking** - Manage lent/borrowed money with friends and family
- **🤝 Split Expenses** - Simplify shared expenses among participants
- **📱 Transaction History** - Detailed logs with advanced search and filtering

### 🤖 AI-Powered Features
- **🧠 Intelligent Chatbot** - Natural language financial assistant
- **📄 OCR Receipt Scanning** - Extract transaction details from receipts
- **🔍 Smart Categorization** - AI-driven expense categorization
- **📈 Personalized Insights** - Data-driven recommendations and analysis
- **🔔 Smart Notifications** - Intelligent alerts for bills and overspending

### 📊 Analytics & Insights
- **📈 Spending Patterns** - Detailed analysis of financial behavior
- **📉 Trend Analysis** - Historical data visualization
- **🎯 Goal Progress** - Visual tracking of financial objectives
- **💡 AI Recommendations** - Personalized financial advice

## 🛠️ Tech Stack

### Backend
```
🚀 FastAPI          - Modern, fast web framework for building APIs
🐘 PostgreSQL       - Robust relational database
🔧 SQLAlchemy       - Python SQL toolkit and ORM
🔐 OAuth2 + JWT     - Secure authentication system
🧪 Pytest          - Comprehensive testing framework
```

### Frontend
```
⚛️  React + TypeScript  - Type-safe component-based UI
🎨 TailwindCSS          - Utility-first CSS framework
🎭 Framer Motion        - Smooth animations and transitions
🧭 React Router         - Client-side routing
🎯 Context API          - State management
🎪 Lucide React         - Beautiful icon library
⚡ Vite                 - Lightning-fast build tool
```

### AI & Data
```
🤖 Qdrant             - Vector database for embeddings
🧠 RAG LLMs           - Retrieval-Augmented Generation models
🔤 OpenAI/Hugging Face - NLP and language models
📊 Vector Embeddings   - Semantic search capabilities
```

## 🏗️ Architecture

```mermaid
graph TB
    A[React Frontend] --> B[FastAPI Backend]
    B --> C[PostgreSQL Database]
    B --> D[Qdrant Vector DB]
    B --> E[AI Services]
    E --> F[RAG LLMs]
    E --> G[OCR Engine]
    B --> H[Authentication Service]
    B --> I[Analytics Engine]
```

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/logup.git
cd logup/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
python app/db/create_tables.py

# Run the server
uvicorn main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/logup
SECRET_KEY=your-secret-key
QDRANT_URL=http://localhost:6333
OPENAI_API_KEY=your-openai-key
```

## 🔄 Current Development

### 🧪 Backend Testing Phase
Currently focused on comprehensive backend testing to ensure:
- ✅ API endpoint reliability
- ✅ Database operation integrity
- ✅ Authentication security
- ✅ Service layer functionality
- ✅ Error handling robustness

### 🤖 AI Services Integration
Next phase involves implementing AI-powered features:

```python
# AI Service Architecture
class ChatService:
    def __init__(self):
        self.qdrant_client = QdrantClient()
        self.llm_model = initialize_rag_model()
    
    async def process_query(self, user_query: str):
        # Vector similarity search
        relevant_data = await self.qdrant_client.search(user_query)
        
        # RAG-based response generation
        response = await self.llm_model.generate(
            query=user_query,
            context=relevant_data
        )
        
        return response
```

**AI Features in Development:**
- 🧠 Natural Language Processing for financial queries
- 📊 Intelligent data summarization and insights
- 🎯 Personalized recommendation engine
- 🔍 Semantic search across financial data
- 🤖 Conversational interface for all app features

## 📁 Project Structure

<details>
<summary>🖱️ Click to expand project structure</summary>

```
logup/
├── 📁 backend/
│   ├── 📄 main.py
│   ├── 📄 requirements.txt
│   ├── 📁 app/
│   │   ├── 📁 api/          # API endpoints
│   │   ├── 📁 db/           # Database models & schemas
│   │   ├── 📁 services/     # Business logic
│   │   └── 📁 middleware/   # Custom middleware
│   └── 📁 tests/           # Test suites
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📄 App.tsx
│   │   ├── 📁 pages/        # React pages
│   │   ├── 📁 components/   # Reusable components
│   │   └── 📁 contexts/     # State management
│   ├── 📄 package.json
│   └── 📄 vite.config.ts
└── 📄 README.md
```
</details>

## 📚 API Documentation

Once the server is running, access the interactive API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints
```
🔐 Authentication
POST   /auth/login           # User login
POST   /auth/register        # User registration
POST   /auth/refresh         # Token refresh

💰 Transactions
GET    /transactions         # List transactions
POST   /transactions         # Create transaction
PUT    /transactions/{id}    # Update transaction
DELETE /transactions/{id}    # Delete transaction

🤖 AI Chat
POST   /chat/query           # Process natural language query
GET    /chat/history         # Chat history
POST   /chat/insights        # Generate insights
```

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_transactions.py -v
```

### Frontend Tests
```bash
# Run component tests
npm test

# Run e2e tests
npm run test:e2e
```

## 🗺️ Roadmap

### Phase 1: Foundation (Completed ✅)
- [x] Core backend API development
- [x] React frontend implementation
- [x] Basic CRUD operations
- [x] Authentication system

### Phase 2: Testing & Stability (In Progress 🔄)
- [x] Comprehensive backend testing
- [ ] Frontend component testing
- [ ] Integration testing
- [ ] Performance optimization

### Phase 3: AI Integration (Next 🎯)
- [ ] Qdrant vector database setup
- [ ] RAG model implementation
- [ ] Chatbot interface
- [ ] Smart categorization
- [ ] Personalized insights

### Phase 4: Advanced Features (Future 🚀)
- [ ] Mobile applications (iOS/Android)
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Real-time notifications

## 🤝 Contributing

As the primary developer, I welcome contributions that align with the project's vision. Here's how you can contribute:

### Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

### Areas for Contribution
- 🐛 Bug fixes and improvements
- 📚 Documentation enhancements
- 🧪 Test coverage expansion
- 🎨 UI/UX improvements
- 🔧 Performance optimizations

## 📈 Development Stats

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/afnan006/LogUp-)
![GitHub last commit](https://img.shields.io/github/last-commit/afnan006/LogUp-)
![GitHub issues](https://img.shields.io/github/issues/afnan006/LogUp-)
![GitHub pull requests](https://img.shields.io/github/issues-pr/afnan006/LogUp-)
![GitHub repo size](https://img.shields.io/github/repo-size/afnan006/LogUp-)
![GitHub top language](https://img.shields.io/github/languages/top/afnan006/LogUp-)
![GitHub stars](https://img.shields.io/github/stars/afnan006/LogUp-)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

**Developer**: Afnan Ahmed
**Email**: afnan006cs@gmail.com  
**LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/afnan006)  

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and lots of ☕

</div>
