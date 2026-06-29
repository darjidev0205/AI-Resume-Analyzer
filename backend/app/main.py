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
    allow_origins=["*"],  # Allow all origins for dev simplicity, configure strictly in prod
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
