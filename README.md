# AI Resume & ATS Analyzer

AI-powered Applicant Tracking System (ATS) resume checker that analyzes PDF resumes, highlights missing keywords, evaluates format compatibility, matches profiles against job descriptions, and outputs detailed AI-based suggestions.

---

## Technical Stack

- **Backend**: Python 3.x, FastAPI, Pydantic, SQLAlchemy, PyMuPDF (fitz)
- **Frontend**: React.js, Vite, Tailwind CSS, Axios, Recharts, Framer Motion, Lucide icons
- **AI Integration**: OpenAI API (with a fully functional local heuristic fallback)
- **Database**: PostgreSQL (falls back to SQLite local database file automatically if not configured)

---

## Project Structure

```
AI Resume Analyzer/
├── backend/
│   ├── app/
│   │   ├── models/        # SQLAlchemy models (User, Resume, etc.)
│   │   ├── routes/        # Auth & Resume endpoint controllers
│   │   ├── schemas/       # Pydantic schemas for serialization
│   │   ├── services/      # PDF Parser, Scoring, and OpenAI client wrappers
│   │   ├── utils/         # JWT and password helper utilities
│   │   ├── config.py      # App configurations loader
│   │   ├── database.py    # Database connection manager
│   │   └── main.py        # FastAPI app initialization
│   ├── .env               # Local configuration environment variables
│   ├── .env.example       # Template for settings configuration
│   └── requirements.txt   # Python package dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI widgets (Navbar, ScoreCircle, etc.)
│   │   ├── pages/         # Views (Dashboard, Result, Upload, Profile, etc.)
│   │   ├── services/      # Axios API layer configurations
│   │   ├── App.jsx        # Routing configuration
│   │   ├── index.css      # Design tokens, gradients, and scrollbars
│   │   └── main.jsx       # React mount entrypoint
│   ├── .env               # Frontend environment settings
│   ├── .env.example       # Frontend template configuration
│   ├── tailwind.config.js # Custom dark/neon design configurations
│   └── package.json       # App scripts and npm dependencies
│
└── README.md              # Installation and setup instructions
```

---

## Setup & Running Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

---

### 2. Backend Installation & Run
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create/verify `.env` configuration. A default `.env` is already configured for SQLite out of the box. Add your OpenAI API key for real AI suggestions:
   ```env
   JWT_SECRET=your_jwt_secret_key_here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   OPENAI_API_KEY=your_openai_api_key_here
   ```


5. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *The Swagger interactive documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).*

---

### 3. Frontend Installation & Run
1. Open a new terminal tab/session and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install the packages:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The web application will launch at [http://localhost:5173](http://localhost:5173).*

---

## Key Features

1. **User Authentication**: Secure Register/Login system signing JWT tokens.
2. **Resume PDF Parsing**: PyMuPDF extraction parses text immediately upon upload, validating file size (< 5MB) and type.
3. **ATS Rating Dashboard**: Scores overall compatibility and breaks metrics down (Summary, Skills, Experience, Education, Layout).
4. **Keyword Scanner**: Displays matched keywords and alerts the candidate on missing key technical skills.
5. **Role Matcher**: Pasting target job description outputs a fit index alongside custom gaps analysis.
6. **Quantified Rewrites**: Generates tailored replacements for weaker experience bullet points utilizing action verbs and metrics.
