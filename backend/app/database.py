import os
from pymongo import MongoClient
from app.config import settings

DATABASE_URL = settings.DATABASE_URL

if not DATABASE_URL:
    DATABASE_URL = "mongodb://localhost:27017/resume_analyzer"

# Initialize MongoClient
client = MongoClient(DATABASE_URL)

# Extract database name from connection string or default to "resume_analyzer"
db_name = None
try:
    from pymongo.uri_parser import parse_uri
    parsed = parse_uri(DATABASE_URL)
    db_name = parsed.get("database")
except Exception:
    pass

if not db_name:
    db_name = "resume_analyzer"

db_client = client[db_name]

def get_db():
    yield db_client

