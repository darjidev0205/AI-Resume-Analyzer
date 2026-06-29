import re
import fitz  # PyMuPDF
from typing import Dict, Any


def parse_pdf_text(file_bytes: bytes) -> str:
    """
    Extract text from uploaded PDF bytes using PyMuPDF.
    """

    if not file_bytes:
        raise ValueError("Uploaded PDF is empty.")

    if len(file_bytes) < 10:
        raise ValueError("Invalid PDF file. File is too small.")

    if not file_bytes.startswith(b"%PDF"):
        raise ValueError("Invalid PDF file. Please upload a real PDF document.")

    try:
        text_parts = []

        with fitz.open(stream=file_bytes, filetype="pdf") as doc:
            if doc.page_count == 0:
                raise ValueError("PDF has no pages.")

            for page in doc:
                page_text = page.get_text("text")
                if page_text:
                    text_parts.append(page_text)

        text = "\n".join(text_parts).strip()

        if not text:
            raise ValueError(
                "No readable text found in PDF. This may be a scanned image PDF."
            )

        return clean_text(text)

    except ValueError:
        raise

    except Exception as e:
        raise ValueError(f"Failed to parse PDF file: {str(e)}")


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text.
    """
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_contact_info(text: str) -> Dict[str, Any]:
    """
    Extract resume contact info, skills, and major sections.
    """

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
        "certifications": [],
    }

    if not text or not text.strip():
        return result

    text = clean_text(text)
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    text_lower = text.lower()

    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    if email_match:
        result["email"] = email_match.group(0)

    phone_match = re.search(
        r"(?:\+91[\s-]?)?[6-9]\d{9}|(?:\+?\d{1,3}[-.\s]?)?\d{10}",
        text,
    )
    if phone_match:
        result["phone"] = phone_match.group(0)

    linkedin_match = re.search(
        r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9_\-]+/?",
        text,
        re.IGNORECASE,
    )
    if linkedin_match:
        result["linkedin"] = linkedin_match.group(0)

    github_match = re.search(
        r"(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9_\-]+/?",
        text,
        re.IGNORECASE,
    )
    if github_match:
        result["github"] = github_match.group(0)

    for line in lines[:8]:
        clean_line = line.strip()

        skip_words = [
            "@",
            "linkedin",
            "github",
            "portfolio",
            "resume",
            "curriculum",
            "phone",
            "email",
        ]

        if any(word in clean_line.lower() for word in skip_words):
            continue

        if re.search(r"\d{3,}", clean_line):
            continue

        words = clean_line.split()

        if 2 <= len(words) <= 4 and len(clean_line) <= 60:
            result["name"] = clean_line
            break

    if not result["name"] and lines:
        result["name"] = lines[0][:60]

    tech_keywords = [
        "python",
        "java",
        "javascript",
        "typescript",
        "c",
        "c++",
        "html",
        "css",
        "bootstrap",
        "tailwind",
        "react",
        "react.js",
        "node.js",
        "nodejs",
        "express",
        "express.js",
        "fastapi",
        "flask",
        "django",
        "vite",
        "next.js",
        "mongodb",
        "mysql",
        "postgresql",
        "sql",
        "nosql",
        "firebase",
        "supabase",
        "redis",
        "git",
        "github",
        "docker",
        "aws",
        "azure",
        "gcp",
        "rest api",
        "api",
        "jwt",
        "oauth",
        "numpy",
        "pandas",
        "matplotlib",
        "seaborn",
        "scikit-learn",
        "sklearn",
        "machine learning",
        "deep learning",
        "data analysis",
        "data science",
        "ai",
        "ml",
        "llm",
        "openai",
        "nlp",
        "tableau",
        "power bi",
        "excel",
    ]

    skill_display_map = {
        "python": "Python",
        "java": "Java",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "c": "C",
        "c++": "C++",
        "html": "HTML",
        "css": "CSS",
        "bootstrap": "Bootstrap",
        "tailwind": "Tailwind CSS",
        "react": "React",
        "react.js": "React.js",
        "node.js": "Node.js",
        "nodejs": "Node.js",
        "express": "Express.js",
        "express.js": "Express.js",
        "fastapi": "FastAPI",
        "flask": "Flask",
        "django": "Django",
        "vite": "Vite",
        "next.js": "Next.js",
        "mongodb": "MongoDB",
        "mysql": "MySQL",
        "postgresql": "PostgreSQL",
        "sql": "SQL",
        "nosql": "NoSQL",
        "firebase": "Firebase",
        "supabase": "Supabase",
        "redis": "Redis",
        "git": "Git",
        "github": "GitHub",
        "docker": "Docker",
        "aws": "AWS",
        "azure": "Azure",
        "gcp": "GCP",
        "rest api": "REST API",
        "api": "API",
        "jwt": "JWT",
        "oauth": "OAuth",
        "numpy": "NumPy",
        "pandas": "Pandas",
        "matplotlib": "Matplotlib",
        "seaborn": "Seaborn",
        "scikit-learn": "Scikit-learn",
        "sklearn": "Scikit-learn",
        "machine learning": "Machine Learning",
        "deep learning": "Deep Learning",
        "data analysis": "Data Analysis",
        "data science": "Data Science",
        "ai": "AI",
        "ml": "ML",
        "llm": "LLM",
        "openai": "OpenAI",
        "nlp": "NLP",
        "tableau": "Tableau",
        "power bi": "Power BI",
        "excel": "Excel",
    }

    found_skills = []

    for skill in tech_keywords:
        pattern = r"(?<![A-Za-z0-9+#.])" + re.escape(skill) + r"(?![A-Za-z0-9+#.])"

        if re.search(pattern, text_lower):
            display_name = skill_display_map.get(skill, skill.title())

            if display_name not in found_skills:
                found_skills.append(display_name)

    result["skills"] = found_skills

    section_headers = {
        "education": [
            "education",
            "academic qualification",
            "academic background",
            "qualification",
        ],
        "experience": [
            "experience",
            "work experience",
            "professional experience",
            "employment",
            "internship",
        ],
        "projects": [
            "projects",
            "personal projects",
            "academic projects",
            "major projects",
        ],
        "certifications": [
            "certifications",
            "certificates",
            "courses",
            "licenses",
            "credentials",
        ],
    }

    section_buffers = {
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": [],
    }

    current_section = None

    for line in lines:
        normalized = re.sub(r"[^a-zA-Z ]", "", line).strip().lower()

        matched_section = None

        for section_name, headers in section_headers.items():
            for header in headers:
                if normalized == header or (
                    header in normalized and len(normalized) <= 35
                ):
                    matched_section = section_name
                    break

            if matched_section:
                break

        if matched_section:
            current_section = matched_section
            continue

        if current_section and len(line) > 2:
            section_buffers[current_section].append(line)

    for section_name, buffer in section_buffers.items():
        result[section_name] = group_section_items(buffer)

    return result


def group_section_items(lines: list) -> list:
    """
    Convert section lines into readable grouped items.
    """

    if not lines:
        return []

    items = []
    current_item = []

    new_item_patterns = [
        r"^[-•*▪]\s+",
        r"^\d+\.\s+",
        r"\b(19|20)\d{2}\b",
    ]

    for line in lines:
        is_new_item = any(re.search(pattern, line) for pattern in new_item_patterns)

        if is_new_item and current_item:
            items.append(" ".join(current_item).strip())
            current_item = []

        cleaned_line = re.sub(r"^[-•*▪]\s*", "", line).strip()

        if cleaned_line:
            current_item.append(cleaned_line)

    if current_item:
        items.append(" ".join(current_item).strip())

    if not items:
        items = lines[:6]

    clean_items = []

    for item in items:
        item = re.sub(r"\s+", " ", item).strip()

        if item and item not in clean_items:
            clean_items.append(item)

    return clean_items[:6]