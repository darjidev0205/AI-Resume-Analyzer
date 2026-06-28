import re
from typing import Dict, Any, List, Set

# List of powerful action verbs for resume checking
ACTION_VERBS = {
    "led", "managed", "designed", "built", "implemented", "created", "developed", 
    "spearheaded", "engineered", "optimized", "increased", "reduced", "delivered", 
    "collaborated", "architected", "formulated", "initiated", "overhauled", "solved"
}

# General industry/technical keywords across domains
INDUSTRY_KEYWORDS = {
    "agile", "scrum", "software development", "database", "git", "ci/cd", "cloud",
    "restful", "api", "architecture", "microservices", "testing", "unit test",
    "docker", "kubernetes", "system design", "sql", "nosql", "security", "analytics",
    "data science", "machine learning", "frontend", "backend", "full stack", "devops",
    "project management", "leadership", "communication", "problem solving"
}

def clean_word(word: str) -> str:
    return re.sub(r'[^\w\-\.]', '', word.lower())

def extract_keywords_from_text(text: str) -> Set[str]:
    """
    Finds keywords from a preset of industry keywords that exist in the text.
    """
    words = {clean_word(w) for w in re.split(r'[\s,;:\(\)\{\}\[\]\n\r/]+', text)}
    
    found = set()
    # Check individual words
    for word in words:
        if word in INDUSTRY_KEYWORDS:
            found.add(word)
            
    # Check multi-word keywords
    text_lower = text.lower()
    for kw in INDUSTRY_KEYWORDS:
        if " " in kw and kw in text_lower:
            found.add(kw)
            
    return found

def calculate_local_ats_score(parsed_data: Dict[str, Any], text: str, job_desc: str = None) -> Dict[str, Any]:
    """
    Calculates detailed ATS score using local parsing heuristics.
    """
    # 1. Contact / Profile Completeness (10%)
    contact_score = 0
    if parsed_data.get("name"): contact_score += 3
    if parsed_data.get("email"): contact_score += 3
    if parsed_data.get("phone"): contact_score += 2
    if parsed_data.get("linkedin") or parsed_data.get("github"): contact_score += 2
    # convert to scale of 100
    contact_final = contact_score * 10

    # 2. Formatting Quality (15%)
    # Scored by presence of major sections
    sections_found = 0
    if parsed_data.get("skills"): sections_found += 1
    if parsed_data.get("experience"): sections_found += 1
    if parsed_data.get("education"): sections_found += 1
    if parsed_data.get("projects"): sections_found += 1
    
    formatting_final = 50 + (sections_found * 12.5) # Minimum 50, up to 100
    if len(text) > 4000: # penalize too long
        formatting_final -= 10
    elif len(text) < 1000: # penalize too short
        formatting_final -= 15

    # 3. Education Relevance (10%)
    # Scored by presence of degree keywords
    edu_text = " ".join(parsed_data.get("education", [])).lower()
    edu_score = 60 # Base score for having an education section
    if not parsed_data.get("education"):
        edu_score = 0
    else:
        degrees = ["bachelor", "master", "phd", "b.s.", "m.s.", "b.tech", "m.tech", "degree", "computer science", "engineering"]
        for deg in degrees:
            if deg in edu_text or deg in text.lower():
                edu_score += 8
        edu_score = min(edu_score, 100)

    # 4. Experience Quality (20%)
    # Scored by action verbs and count of details
    exp_items = parsed_data.get("experience", [])
    exp_text = " ".join(exp_items).lower()
    
    # Count action verbs in experience
    verb_count = 0
    for verb in ACTION_VERBS:
        if re.search(r'\b' + re.escape(verb) + r'\b', exp_text):
            verb_count += 1
            
    # Base experience score
    if not exp_items:
        exp_final = 0
    else:
        exp_final = 60 + (verb_count * 5) + (len(exp_items) * 5)
        exp_final = min(exp_final, 100)

    # 5. Skills Match (20%)
    # Scored by number of skills extracted
    skills = parsed_data.get("skills", [])
    if not skills:
        skills_final = 0
    else:
        skills_final = 50 + (len(skills) * 5)
        skills_final = min(skills_final, 100)

    # 6. Keyword Match (25%)
    # If job description is provided, compare keywords. If not, match against industry standards.
    matched_kws = []
    missing_kws = []
    
    if job_desc:
        # Extract keywords from job description
        job_words = re.split(r'[\s,;:\(\)\{\}\[\]\n\r/]+', job_desc.lower())
        job_kws = set()
        
        # 1. Look for technical skills/industry terms in job desc
        for word in job_words:
            cleaned = clean_word(word)
            if cleaned in INDUSTRY_KEYWORDS or cleaned in [s.lower() for s in skills]:
                job_kws.add(cleaned)
                
        # Handle multi-word keywords in job description
        job_desc_lower = job_desc.lower()
        for kw in INDUSTRY_KEYWORDS:
            if " " in kw and kw in job_desc_lower:
                job_kws.add(kw)
                
        # Default job keywords if none found
        if not job_kws:
            job_kws = {"agile", "git", "software development", "database", "api"}
            
        resume_text_lower = text.lower()
        for kw in job_kws:
            if kw in resume_text_lower:
                matched_kws.append(kw.title())
            else:
                missing_kws.append(kw.title())
                
        if len(job_kws) > 0:
            keyword_final = (len(matched_kws) / len(job_kws)) * 100
        else:
            keyword_final = 100
    else:
        # Match against general industry keywords
        resume_kws = extract_keywords_from_text(text)
        # Select a sample of expected general keywords (e.g. 10)
        expected = ["agile", "git", "api", "database", "software development", "testing", "cloud", "architecture"]
        for kw in expected:
            if kw in resume_kws:
                matched_kws.append(kw.title())
            else:
                missing_kws.append(kw.title())
        
        keyword_final = 50 + (len(matched_kws) * 6.25)
        keyword_final = min(keyword_final, 100)

    # Compute overall weighted ATS score
    # Keyword: 25%, Skills: 20%, Experience: 20%, Education: 10%, Formatting: 15%, Contact: 10%
    overall_score = int(
        (keyword_final * 0.25) +
        (skills_final * 0.20) +
        (exp_final * 0.20) +
        (edu_score * 0.10) +
        (formatting_final * 0.15) +
        (contact_final * 0.10)
    )
    
    return {
        "ats_score": min(overall_score, 100),
        "summary_score": min(int(contact_final * 0.8 + formatting_final * 0.2), 100),
        "skills_score": int(skills_final),
        "experience_score": int(exp_final),
        "education_score": int(edu_score),
        "formatting_score": int(formatting_final),
        "matched_keywords": matched_kws,
        "missing_keywords": missing_kws
    }
