from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pymongo.database import Database
from bson import ObjectId
from datetime import datetime, timedelta
import json

from app.database import get_db
from app.schemas import schemas
from app.routes.auth import get_current_user
from app.services.pdf_parser import parse_pdf_text, extract_contact_info
from app.services.openai_service import analyze_resume_with_ai
from app.services.scoring_service import calculate_local_ats_score

router = APIRouter(prefix="/resume", tags=["Resumes"])


@router.post("/upload", response_model=schemas.ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    print(file.filename)
    print(file.content_type)

    contents = await file.read()

    print(len(contents))

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded PDF is empty.")

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit.")

    try:
        parsed_text = parse_pdf_text(contents)

        if not parsed_text or not parsed_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract readable text from this PDF.",
            )

        parsed_data = extract_contact_info(parsed_text)

        db_resume = {
            "user_id": current_user["id"],
            "filename": file.filename,
            "file_size": len(contents),
            "content_type": file.content_type,
            "parsed_text": parsed_text,
            "parsed_data": parsed_data,
            "uploaded_at": datetime.utcnow(),
        }

        result = db.resumes.insert_one(db_resume)

        db_resume["id"] = str(result.inserted_id)
        db_resume["_id"] = str(result.inserted_id)

        return db_resume

    except HTTPException:
        raise

    except Exception as e:
        print("PDF upload/parse error:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing resume: {str(e)}",
        )


@router.post("/analyze", response_model=schemas.AnalysisResultResponse)
def analyze_resume(
    resume_id: str = Form(...),
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:
        resume = db.resumes.find_one(
            {
                "_id": ObjectId(resume_id),
                "user_id": current_user["id"],
            }
        )
    except Exception:
        resume = None

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied.",
        )

    try:
        analysis_data = analyze_resume_with_ai(
            resume["parsed_data"],
            resume["parsed_text"],
        )

        db_analysis = {
            "resume_id": str(resume["_id"]),
            "ats_score": analysis_data.get("ats_score", 0),
            "summary_score": analysis_data.get("summary_score", 0),
            "skills_score": analysis_data.get("skills_score", 0),
            "experience_score": analysis_data.get("experience_score", 0),
            "education_score": analysis_data.get("education_score", 0),
            "formatting_score": analysis_data.get("formatting_score", 0),
            "matched_keywords": analysis_data.get("matched_keywords", []),
            "missing_keywords": analysis_data.get("missing_keywords", []),
            "strengths": analysis_data.get("strengths", []),
            "weaknesses": analysis_data.get("weaknesses", []),
            "improvement_tips": analysis_data.get("improvement_tips", []),
            "recommended_bullet_points": analysis_data.get(
                "recommended_bullet_points", []
            ),
            "suggested_skills": analysis_data.get("suggested_skills", []),
            "created_at": datetime.utcnow(),
        }

        result = db.analysis_results.insert_one(db_analysis)

        db_analysis["id"] = str(result.inserted_id)
        db_analysis["_id"] = str(result.inserted_id)

        return db_analysis

    except Exception as e:
        print("Analysis error:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}",
        )


@router.post("/job-match", response_model=schemas.JobMatchResponse)
def job_match_resume(
    resume_id: str = Form(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:
        resume = db.resumes.find_one(
            {
                "_id": ObjectId(resume_id),
                "user_id": current_user["id"],
            }
        )
    except Exception:
        resume = None

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied.",
        )

    try:
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

Resume:
{resume["parsed_text"]}

Job Title:
{job_title}

Job Description:
{job_description}

Return ONLY valid JSON:
{{
  "match_score": 0,
  "matched_keywords": [],
  "missing_keywords": [],
  "feedback": ""
}}
"""

                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an ATS job matching scanner. Return only valid JSON.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.2,
                )

                res_content = response.choices[0].message.content.strip()

                if res_content.startswith("```json"):
                    res_content = res_content[7:]

                if res_content.endswith("```"):
                    res_content = res_content[:-3]

                res_json = json.loads(res_content.strip())

                match_score = res_json.get("match_score", 0)
                matched_kws = res_json.get("matched_keywords", [])
                missing_kws = res_json.get("missing_keywords", [])
                feedback = res_json.get("feedback", "")

            except Exception:
                local_m = calculate_local_ats_score(
                    resume["parsed_data"],
                    resume["parsed_text"],
                    job_description,
                )

                match_score = local_m.get("ats_score", 0)
                matched_kws = local_m.get("matched_keywords", [])
                missing_kws = local_m.get("missing_keywords", [])
                feedback = (
                    f"Based on your profile, you match {match_score}% of the requirements. "
                    f"Focus on adding key skills like: {', '.join(missing_kws[:3])}."
                )

        else:
            local_m = calculate_local_ats_score(
                resume["parsed_data"],
                resume["parsed_text"],
                job_description,
            )

            match_score = local_m.get("ats_score", 0)
            matched_kws = local_m.get("matched_keywords", [])
            missing_kws = local_m.get("missing_keywords", [])
            feedback = (
                f"Your resume has a matching index of {match_score}% with the job description. "
                f"The top missing keywords are {', '.join(missing_kws[:4])}."
            )

        db_match = {
            "resume_id": str(resume["_id"]),
            "job_title": job_title,
            "job_description": job_description,
            "match_score": match_score,
            "matched_keywords": matched_kws,
            "missing_keywords": missing_kws,
            "feedback": feedback,
            "created_at": datetime.utcnow(),
        }

        result = db.job_matches.insert_one(db_match)

        db_match["id"] = str(result.inserted_id)
        db_match["_id"] = str(result.inserted_id)

        return db_match

    except Exception as e:
        print("Job matching error:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Job matching failed: {str(e)}",
        )


@router.get("/history", response_model=List[schemas.ResumeResponse])
def get_resume_history(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    resumes_cursor = db.resumes.find({"user_id": current_user["id"]}).sort(
        "uploaded_at", -1
    )

    resumes = []

    for r in resumes_cursor:
        r["id"] = str(r["_id"])
        r["_id"] = str(r["_id"])
        resumes.append(r)

    return resumes


@router.get("/dashboard-stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    resumes_cursor = db.resumes.find({"user_id": current_user["id"]})

    resumes = []

    for r in resumes_cursor:
        r["id"] = str(r["_id"])
        r["_id"] = str(r["_id"])
        resumes.append(r)

    resume_ids = [r["id"] for r in resumes]
    total_resumes = len(resumes)

    avg_score = 0.0

    if resume_ids:
        latest_analyses = []

        for rid in resume_ids:
            latest = db.analysis_results.find_one(
                {"resume_id": rid},
                sort=[("created_at", -1)],
            )

            if latest:
                latest_analyses.append(latest.get("ats_score", 0))

        if latest_analyses:
            avg_score = sum(latest_analyses) / len(latest_analyses)

    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    scans_this_month = db.resumes.count_documents(
        {
            "user_id": current_user["id"],
            "uploaded_at": {"$gte": thirty_days_ago},
        }
    )

    recent_resumes = sorted(
        resumes,
        key=lambda x: x.get("uploaded_at", datetime.min),
        reverse=True,
    )[:5]

    return {
        "total_resumes": total_resumes,
        "average_ats_score": round(avg_score, 1),
        "scans_this_month": scans_this_month,
        "recent_resumes": recent_resumes,
    }


@router.get("/{id}", response_model=schemas.ResumeDetailResponse)
def get_resume_detail(
    id: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    try:
        resume = db.resumes.find_one(
            {
                "_id": ObjectId(id),
                "user_id": current_user["id"],
            }
        )
    except Exception:
        resume = None

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied.",
        )

    resume["id"] = str(resume["_id"])
    resume["_id"] = str(resume["_id"])

    analysis_cursor = db.analysis_results.find({"resume_id": resume["id"]}).sort(
        "created_at", -1
    )

    analysis_results = []

    for ar in analysis_cursor:
        ar["id"] = str(ar["_id"])
        ar["_id"] = str(ar["_id"])
        analysis_results.append(ar)

    job_cursor = db.job_matches.find({"resume_id": resume["id"]}).sort(
        "created_at", -1
    )

    job_matches = []

    for jm in job_cursor:
        jm["id"] = str(jm["_id"])
        jm["_id"] = str(jm["_id"])
        job_matches.append(jm)

    resume["analysis_results"] = analysis_results
    resume["job_matches"] = job_matches

    return resume