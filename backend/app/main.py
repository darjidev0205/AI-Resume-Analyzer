# pyrefly: ignore [missing-import]
import logging
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, resume

# Set up logging
logger = logging.getLogger("uvicorn.error")

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Backend API services for parsing resumes, calculating ATS scores, matching job requirements and generating improvements recommendations.",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ai-resume-analyzer-chi-kohl-42.vercel.app",
        "https://ai-resume-analyzer-git-main-darjidev0205s-projects.vercel.app",
        "https://ai-resume-analyzer-pxyhxo7mm-darjidev0205s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(resume.router, prefix="/api")

@app.on_event("startup")
def startup_event():
    try:
        from app.database import client, db
        # Test connection by pinging the admin database
        client.admin.command("ping")
        logger.info("Successfully connected to MongoDB Atlas.")
        
        # Ensure unique index on users email
        db.users.create_index("email", unique=True)
        logger.info("Unique index on users.email verified/created.")
    except Exception as e:
        logger.error(f"Database connection failed or index creation failed: {e}")

@app.get("/")
def read_root():
    try:
        from app.database import client
        client.admin.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
        
    return {
        "status": "online",
        "message": "AI Resume Analyzer API is running successfully.",
        "database": db_status
    }

@app.get("/health")
def health_check():
    try:
        from app.database import client
        client.admin.command("ping")
        return {
            "status": "ok",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "detail": str(e)
        }

