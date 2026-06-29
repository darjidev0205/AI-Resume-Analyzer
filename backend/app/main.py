# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, resume

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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "AI Resume Analyzer API is running successfully."
    }
