from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- USER AUTH SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None


# --- ANALYSIS RESULT SCHEMAS ---
class AnalysisResultBase(BaseModel):
    ats_score: int
    summary_score: int
    skills_score: int
    experience_score: int
    education_score: int
    formatting_score: int
    matched_keywords: List[str] = []
    missing_keywords: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    improvement_tips: List[str] = []
    recommended_bullet_points: List[str] = []
    suggested_skills: List[str] = []

class AnalysisResultCreate(AnalysisResultBase):
    resume_id: str

class AnalysisResultResponse(AnalysisResultBase):
    id: str
    resume_id: str
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# --- JOB MATCH SCHEMAS ---
class JobMatchRequest(BaseModel):
    job_title: str
    job_description: str

class JobMatchResponse(BaseModel):
    id: str
    resume_id: str
    job_title: str
    job_description: str
    match_score: int
    matched_keywords: List[str] = []
    missing_keywords: List[str] = []
    feedback: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# --- RESUME SCHEMAS ---
class ResumeBase(BaseModel):
    filename: str

class ResumeCreate(ResumeBase):
    user_id: str
    parsed_text: str
    parsed_data: Optional[Dict[str, Any]] = None

class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    uploaded_at: datetime
    parsed_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        orm_mode = True

class ResumeDetailResponse(ResumeResponse):
    parsed_text: str
    analysis_results: List[AnalysisResultResponse] = []
    job_matches: List[JobMatchResponse] = []

    class Config:
        from_attributes = True
        orm_mode = True


# --- DASHBOARD STATS ---
class DashboardStatsResponse(BaseModel):
    total_resumes: int
    average_ats_score: float
    scans_this_month: int
    recent_resumes: List[ResumeResponse]
