import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    parsed_text = Column(Text, nullable=False)
    # parsed_data stores extracted Name, Email, Phone, LinkedIn, GitHub, Skills, Education, Experience, Projects, Certifications
    parsed_data = Column(JSON, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analysis_results = relationship("AnalysisResult", back_populates="resume", cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    ats_score = Column(Integer, nullable=False)
    summary_score = Column(Integer, nullable=False)
    skills_score = Column(Integer, nullable=False)
    experience_score = Column(Integer, nullable=False)
    education_score = Column(Integer, nullable=False)
    formatting_score = Column(Integer, nullable=False)
    
    # JSON columns for list properties
    matched_keywords = Column(JSON, nullable=True)
    missing_keywords = Column(JSON, nullable=True)
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    improvement_tips = Column(JSON, nullable=True)
    recommended_bullet_points = Column(JSON, nullable=True)
    suggested_skills = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resume = relationship("Resume", back_populates="analysis_results")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    match_score = Column(Integer, nullable=False)
    
    matched_keywords = Column(JSON, nullable=True)
    missing_keywords = Column(JSON, nullable=True)
    feedback = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resume = relationship("Resume", back_populates="job_matches")

    # Wait, relationship name is resume, back_populates should match job_matches in Resume
Resume.job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
