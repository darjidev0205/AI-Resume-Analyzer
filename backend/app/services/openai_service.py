import json
from typing import Dict, Any, List
from openai import OpenAI
from app.config import settings
from app.services.scoring_service import calculate_local_ats_score, ACTION_VERBS

def analyze_resume_with_ai(parsed_data: Dict[str, Any], text: str, job_desc: str = None) -> Dict[str, Any]:
    """
    Analyzes resume text using OpenAI or defaults to high-fidelity mock analysis.
    """
    api_key = settings.OPENAI_API_KEY

    if api_key and api_key.strip():
        try:
            client = OpenAI(api_key=api_key)
            
            prompt = f"""
            You are an expert ATS (Applicant Tracking System) parser and professional resume reviewer.
            Analyze the following resume text.
            
            {f"Match it against this Job Description:\n=== JOB DESCRIPTION ===\n{job_desc}\n========================" if job_desc else "Perform a general industry-standard resume analysis."}
            
            === RESUME TEXT ===
            {text}
            ===================
            
            Provide a detailed assessment of this resume in JSON format.
            You must return ONLY a JSON object matching the following structure:
            {{
              "ats_score": <number between 0 and 100>,
              "summary_score": <number between 0 and 100>,
              "skills_score": <number between 0 and 100>,
              "experience_score": <number between 0 and 100>,
              "education_score": <number between 0 and 100>,
              "formatting_score": <number between 0 and 100>,
              "matched_keywords": [<string list of skills/keywords found in resume>],
              "missing_keywords": [<string list of relevant keywords or skills that are missing>],
              "strengths": [<string list of resume strengths>],
              "weaknesses": [<string list of weaknesses or areas of improvement>],
              "improvement_tips": [<string list of concrete actionable tips to improve the resume>],
              "recommended_bullet_points": [<string list of rewritten experience bullet points using action verbs and quantifiable achievements>],
              "suggested_skills": [<string list of technical/soft skills to add>]
            }}
            
            Ensure the response is valid JSON and contains only the JSON object. Do not include markdown code block formatting.
            """

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional ATS resume scanner that outputs strictly valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )
            
            res_content = response.choices[0].message.content.strip()
            # In case model returned markdown fences
            if res_content.startswith("```json"):
                res_content = res_content[7:]
            if res_content.endswith("```"):
                res_content = res_content[:-3]
            res_content = res_content.strip()
            
            return json.loads(res_content)
        except Exception as e:
            # Fall back to high-fidelity mock analysis on exception
            print(f"OpenAI API call failed: {str(e)}. Falling back to local analysis.")
            return generate_high_fidelity_mock_analysis(parsed_data, text, job_desc)
    else:
        return generate_high_fidelity_mock_analysis(parsed_data, text, job_desc)

def generate_high_fidelity_mock_analysis(parsed_data: Dict[str, Any], text: str, job_desc: str = None) -> Dict[str, Any]:
    """
    Generates structured high-fidelity mockup suggestions and scores when OpenAI is not active.
    """
    # Use scoring service to compute base scores and keywords
    local_metrics = calculate_local_ats_score(parsed_data, text, job_desc)
    
    # Generate tailored lists based on the resume contents
    strengths = []
    weaknesses = []
    tips = []
    bullets = []
    suggested_skills = []
    
    # Dynamic Strengths
    if parsed_data.get("name"):
        strengths.append("Clear contact details with contact name provided.")
    if len(parsed_data.get("skills", [])) >= 8:
        strengths.append(f"Strong tech stack visibility with {len(parsed_data['skills'])} skills listed.")
    else:
        strengths.append("Structured technical skills list is visible.")
        
    if len(parsed_data.get("experience", [])) >= 3:
        strengths.append("Good chronologically ordered experience history.")
    if parsed_data.get("linkedin"):
        strengths.append("Professional online presence linked (LinkedIn).")
        
    # Dynamic Weaknesses
    if not parsed_data.get("phone"):
        weaknesses.append("Missing phone number makes it difficult for recruiters to reach out.")
    if not parsed_data.get("github") and "software" in text.lower():
        weaknesses.append("Missing GitHub link makes it harder to showcase active projects.")
    if len(parsed_data.get("skills", [])) < 5:
        weaknesses.append("Limited list of technical skills found. Suggest detailing more technologies.")
    
    # Action verbs check
    exp_text = " ".join(parsed_data.get("experience", [])).lower()
    has_action_verbs = any(verb in exp_text for verb in ACTION_VERBS)
    if not has_action_verbs:
        weaknesses.append("Work experience bullet points lack strong action verbs (e.g., 'Led', 'Designed', 'Architected').")
    
    if len(text) < 1500:
        weaknesses.append("Resume length is a bit short. Add more project context or specific contributions.")
    elif len(text) > 6000:
        weaknesses.append("Resume contains excessive text. Keep it concise (1-2 pages maximum).")

    # Dynamic Tips & Bullet point rewrites
    if not parsed_data.get("linkedin") or not parsed_data.get("phone"):
        tips.append("Complete the profile/header section with your email, phone, GitHub, and LinkedIn handles.")
        
    tips.append("Use the X-Y-Z formula for bullet points: 'Accomplished [X], as measured by [Y], by doing [Z]'.")
    tips.append("Ensure your resume has a clean single-column layout, which is highly compatible with ATS parsers.")
    tips.append("Group your technical skills into clear subcategories (e.g. Languages, Frameworks, Databases, Tools).")

    # Dynamic recommended bullet points
    experience_lines = parsed_data.get("experience", [])
    if experience_lines:
        for idx, line in enumerate(experience_lines[:3]):
            cleaned_line = line.strip()
            if len(cleaned_line) > 15:
                bullets.append(f"Instead of '{cleaned_line[:60]}...', use: 'Spearheaded development of core features, boosting performance by 25% and reducing system load.'")
    
    # Default bullets if no experience parsed
    if not bullets:
        bullets = [
            "Initiated and designed a scalable microservices architecture that improved API throughput by 35%.",
            "Collaborated with cross-functional teams to deploy React applications on AWS, reducing deployment times by 40%.",
            "Optimized SQL query performance across key application tables, cutting page load times by 1.2s."
        ]

    # Dynamic suggested skills to add
    base_skills = [s.lower() for s in parsed_data.get("skills", [])]
    expected_skills = ["Docker", "Kubernetes", "AWS", "CI/CD", "TypeScript", "FastAPI", "PostgreSQL", "React", "System Design"]
    for skill in expected_skills:
        if skill.lower() not in base_skills:
            suggested_skills.append(skill)
            
    if job_desc:
        # Suggest missing keywords as skills
        for kw in local_metrics["missing_keywords"][:5]:
            if kw not in suggested_skills:
                suggested_skills.append(kw)

    return {
        "ats_score": local_metrics["ats_score"],
        "summary_score": local_metrics["summary_score"],
        "skills_score": local_metrics["skills_score"],
        "experience_score": local_metrics["experience_score"],
        "education_score": local_metrics["education_score"],
        "formatting_score": local_metrics["formatting_score"],
        "matched_keywords": local_metrics["matched_keywords"],
        "missing_keywords": local_metrics["missing_keywords"],
        "strengths": strengths or ["Standard resume formatting", "Key sections are present"],
        "weaknesses": weaknesses or ["Could benefit from more quantifiable achievements"],
        "improvement_tips": tips or ["Add more numbers to quantify impact", "Tailor summary to target job profiles"],
        "recommended_bullet_points": bullets[:4],
        "suggested_skills": suggested_skills[:6]
    }
