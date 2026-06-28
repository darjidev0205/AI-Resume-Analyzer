import re
import fitz  # PyMuPDF
from typing import Dict, Any, List

def parse_pdf_text(file_bytes: bytes) -> str:
    """
    Extracts text from PDF bytes using PyMuPDF.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        raise ValueError(f"Failed to parse PDF file: {str(e)}")

def extract_contact_info(text: str) -> Dict[str, Any]:
    """
    Uses regex and heuristic logic to extract contact info and sections from parsed text.
    """
    # Initialize response structure
    result = {
        "name": "",
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": "",
        "skills": [],
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": []
    }

    # Clean text lines
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # 1. Extract Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        result["email"] = email_match.group(0)

    # 2. Extract Phone (various formats)
    phone_match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        result["phone"] = phone_match.group(0)

    # 3. Extract LinkedIn & GitHub
    linkedin_match = re.search(r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w\-]+/?', text, re.IGNORECASE)
    if linkedin_match:
        result["linkedin"] = linkedin_match.group(0)

    github_match = re.search(r'(?:https?://)?(?:www\.)?github\.com/[\w\-]+/?', text, re.IGNORECASE)
    if github_match:
        result["github"] = github_match.group(0)

    # 4. Extract Name (Heuristic: first line that doesn't contain email/phone/url and is short)
    for line in lines[:5]:
        # Skip if line contains common contact words or numbers
        if "@" in line or "github.com" in line.lower() or "linkedin.com" in line.lower() or "+" in line:
            continue
        if re.search(r'\d{3,}', line):  # Skip lines with large numbers (like phone or address)
            continue
        # Name should be relatively short
        if 2 <= len(line.split()) <= 4:
            result["name"] = line
            break
    
    if not result["name"] and lines:
        result["name"] = lines[0][:50]  # Fallback to the first line

    # 5. Extract Skills (Heuristic)
    # Common skill keywords
    tech_keywords = [
        "python", "javascript", "typescript", "java", "c++", "ruby", "golang", "php", "sql", "nosql",
        "react", "angular", "vue", "next.js", "vite", "nodejs", "express", "django", "flask", "fastapi",
        "spring", "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "git", "html", "css", "tailwind",
        "graphql", "rest api", "mongodb", "postgresql", "mysql", "redis", "pytorch", "tensorflow", "scikit-learn",
        "pandas", "numpy", "machine learning", "deep learning", "ai", "llm", "openai", "prompt engineering"
    ]
    
    text_lower = text.lower()
    found_skills = []
    for skill in tech_keywords:
        # Use word boundaries to avoid false positives (e.g. 'c' in 'cat')
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            # Format nicely
            formatted_skill = skill.title()
            if skill in ["next.js", "nodejs", "fastapi", "aws", "gcp", "ci/cd", "rest api", "html", "css", "llm", "ai", "c++"]:
                formatted_skill = {
                    "next.js": "Next.js", "nodejs": "Node.js", "fastapi": "FastAPI", "aws": "AWS",
                    "gcp": "GCP", "ci/cd": "CI/CD", "rest api": "REST API", "html": "HTML",
                    "css": "CSS", "llm": "LLM", "ai": "AI", "c++": "C++"
                }[skill]
            found_skills.append(formatted_skill)
    result["skills"] = found_skills

    # 6. Extract Section Content (Heuristics for Education, Experience, Projects, Certifications)
    current_section = None
    section_buffers = {
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": []
    }

    # Section header mappings
    section_headers = {
        "education": ["education", "academic background", "study", "university", "degrees"],
        "experience": ["experience", "employment history", "work history", "professional experience", "work experience"],
        "projects": ["projects", "personal projects", "key projects", "academic projects"],
        "certifications": ["certifications", "licenses", "courses", "credentials", "certificates"]
    }

    for line in lines:
        line_lower = line.lower()
        matched_new_section = False
        
        # Check if line matches a new section header
        for sec_name, keywords in section_headers.items():
            for kw in keywords:
                # Section header should be short and match the line closely
                if kw in line_lower and len(line) < 30:
                    current_section = sec_name
                    matched_new_section = True
                    break
            if matched_new_section:
                break
        
        if matched_new_section:
            continue
            
        if current_section and len(line) > 2:
            section_buffers[current_section].append(line)

    # Post-process sections: group lines into paragraphs/items
    # For education, check lines that look like degrees or schools
    for sec_name in ["education", "experience", "projects", "certifications"]:
        buff = section_buffers[sec_name]
        items = []
        current_item = []
        
        for line in buff:
            # If line starts with a bullet point or looks like a new item header (e.g. date, company name, bolded-like text)
            if line.startswith(('-', '•', '*', '▪')) or (re.search(r'\b(19|20)\d{2}\b', line) and len(line) < 50):
                if current_item:
                    items.append(" ".join(current_item))
                    current_item = []
                # Remove leading bullet characters
                cleaned_line = re.sub(r'^[-•*▪]\s*', '', line)
                current_item.append(cleaned_line)
            else:
                current_item.append(line)
                
        if current_item:
            items.append(" ".join(current_item))
            
        # Fallback if no bullet points found: just split by sentence/lines if list is empty
        if not items and buff:
            # Filter and take up to 5 main chunks
            items = [b for b in buff[:8]]
            
        result[sec_name] = items[:6]  # Limit size for cleanliness

    return result
