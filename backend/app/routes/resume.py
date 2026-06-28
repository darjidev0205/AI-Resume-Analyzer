from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import models
from app.schemas import schemas
from app.routes.auth import get_current_user
from app.services.pdf_parser import parse_pdf_text, extract_contact_info
from app.services.openai_service import analyze_resume_with_ai
from app.services.scoring_service import calculate_local_ats_score

router = APIRouter(prefix="/resume", tags=["Resumes"])

@router.post("/upload", response_model=schemas.ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    # Read file bytes (and limit size to e.g. 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the limit of 5MB."
        )

    try:
        # Extract text and details
        parsed_text = parse_pdf_text(contents)
        parsed_data = extract_contact_info(parsed_text)
        
        # Save to DB
        db_resume = models.Resume(
            user_id=current_user.id,
            filename=file.filename,
            parsed_text=parsed_text,
            parsed_data=parsed_data
        )
        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)
        
        return db_resume
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing resume: {str(e)}"
        )

@router.post("/analyze", response_model=schemas.AnalysisResultResponse)
def analyze_resume(
    resume_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify resume ownership
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied."
        )
        
    try:
        # Perform AI analysis
        analysis_data = analyze_resume_with_ai(resume.parsed_data, resume.parsed_text)
        
        # Save analysis results
        db_analysis = models.AnalysisResult(
            resume_id=resume.id,
            ats_score=analysis_data["ats_score"],
            summary_score=analysis_data["summary_score"],
            skills_score=analysis_data["skills_score"],
            experience_score=analysis_data["experience_score"],
            education_score=analysis_data["education_score"],
            formatting_score=analysis_data["formatting_score"],
            matched_keywords=analysis_data["matched_keywords"],
            missing_keywords=analysis_data["missing_keywords"],
            strengths=analysis_data["strengths"],
            weaknesses=analysis_data["weaknesses"],
            improvement_tips=analysis_data["improvement_tips"],
            recommended_bullet_points=analysis_data["recommended_bullet_points"],
            suggested_skills=analysis_data["suggested_skills"]
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        
        return db_analysis
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/job-match", response_model=schemas.JobMatchResponse)
def job_match_resume(
    resume_id: int = Form(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify resume ownership
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied."
        )
        
    try:
        # Use OpenAI if key is present to get feedback, otherwise fallback to local calculation
        from app.services.openai_service import settings
        from openai import OpenAI
        
        matched_kws = []
        missing_kws = []
        feedback = ""
        match_score = 0
        
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip():
            try:
                client = OpenAI(api_key=settings.OPENAI_API_KEY)
                prompt = f"""
                Analyze how well the following resume matches the job description.
                Resume details:
                {resume.parsed_text}
                
                Job Title: {job_title}
                Job Description:
                {job_description}
                
                Compare the skills, experience, and certifications.
                Return ONLY a JSON response in the following format:
                {{
                  "match_score": <number between 0 and 100>,
                  "matched_keywords": [<list of matched skills/terms>],
                  "missing_keywords": [<list of missing but required skills/terms>],
                  "feedback": "<detailed feedback paragraph detailing gaps and recommendations>"
                }}
                """
                
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are an ATS job matching scanner that outputs strictly valid JSON format."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2
                )
                res_content = response.choices[0].message.content.strip()
                if res_content.startswith("```json"):
                    res_content = res_content[7:]
                if res_content.endswith("```"):
                    res_content = res_content[:-3]
                res_content = res_content.strip()
                
                res_json = json.loads(res_content)
                match_score = res_json["match_score"]
                matched_kws = res_json["matched_keywords"]
                missing_kws = res_json["missing_keywords"]
                feedback = res_json["feedback"]
            except Exception:
                # Local matching on error
                local_m = calculate_local_ats_score(resume.parsed_data, resume.parsed_text, job_description)
                match_score = local_m["ats_score"]
                matched_kws = local_m["matched_keywords"]
                missing_kws = local_m["missing_keywords"]
                feedback = f"Based on your profile, you match {match_score}% of the requirements. Focus on adding key skills like: {', '.join(missing_kws[:3])}."
        else:
            # Local matching
            local_m = calculate_local_ats_score(resume.parsed_data, resume.parsed_text, job_description)
            match_score = local_m["ats_score"]
            matched_kws = local_m["matched_keywords"]
            missing_kws = local_m["missing_keywords"]
            feedback = f"Your resume has a matching index of {match_score}% with the job description. The top missing keywords to incorporate are {', '.join(missing_kws[:4])}. To improve compatibility, rewrite your projects section using some of the matched technical keywords."
            
        # Save job match results
        db_match = models.JobMatch(
            resume_id=resume.id,
            job_title=job_title,
            job_description=job_description,
            match_score=match_score,
            matched_keywords=matched_kws,
            missing_keywords=missing_kws,
            feedback=feedback
        )
        db.add(db_match)
        db.commit()
        db.refresh(db_match)
        
        return db_match
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job matching failed: {str(e)}"
        )

@router.get("/history", response_model=List[schemas.ResumeResponse])
def get_resume_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resumes = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).order_by(models.Resume.uploaded_at.desc()).all()
    return resumes

@router.get("/dashboard-stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resumes = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).all()
    resume_ids = [r.id for r in resumes]
    
    total_resumes = len(resumes)
    
    # Calculate average ATS score
    avg_score = 0.0
    if resume_ids:
        # Get latest analysis for each resume
        latest_analyses = []
        for rid in resume_ids:
            latest = db.query(models.AnalysisResult).filter(
                models.AnalysisResult.resume_id == rid
            ).order_by(models.AnalysisResult.created_at.desc()).first()
            if latest:
                latest_analyses.append(latest.ats_score)
        
        if latest_analyses:
            avg_score = sum(latest_analyses) / len(latest_analyses)
            
    # Count uploads in last 30 days
    thirty_days_ago = func.now() - func.cast('30 days', func.INTERVAL) if db.bind.name == 'postgresql' else func.datetime('now', '-30 days')
    scans_this_month = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id,
        models.Resume.uploaded_at >= thirty_days_ago
    ).count()
    
    recent_resumes = db.query(models.Resume).filter(
        models.Resume.user_id == current_user.id
    ).order_by(models.Resume.uploaded_at.desc()).limit(5).all()
    
    return {
        "total_resumes": total_resumes,
        "average_ats_score": round(avg_score, 1),
        "scans_this_month": scans_this_month,
        "recent_resumes": recent_resumes
    }

@router.get("/{id}", response_model=schemas.ResumeDetailResponse)
def get_resume_detail(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == id,
        models.Resume.user_id == current_user.id
    ).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied."
        )
    return resume
import json  # Import json for openai API call parser
