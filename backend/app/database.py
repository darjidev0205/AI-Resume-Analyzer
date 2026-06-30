from pymongo import MongoClient
from app.config import settings

client = MongoClient(
    settings.MONGODB_URL,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
    socketTimeoutMS=5000,
)

db = client[settings.DATABASE_NAME]

def get_db():
    return db

