from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pymongo.database import Database
from app.database import get_db
from app.config import settings
from app.schemas import schemas
from app.utils.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login-form-compatibility")

def get_current_user(token: str = Depends(oauth2_scheme), db: Database = Depends(get_db)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    user["id"] = str(user["_id"])
    return user

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Database = Depends(get_db)):
    # Check if user already exists
    user = db.users.find_one({"email": user_in.email})
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists in the system.",
        )
    
    hashed_password = get_password_hash(user_in.password)
    db_user = {
        "email": user_in.email,
        "hashed_password": hashed_password,
        "full_name": user_in.full_name,
        "created_at": datetime.utcnow()
    }
    result = db.users.insert_one(db_user)
    db_user["id"] = str(result.inserted_id)
    db_user["name"] = db_user["full_name"]
    
    # Generate token
    access_token = create_access_token(subject=db_user["email"])
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserCreate, db: Database = Depends(get_db)):
    user = db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    user["id"] = str(user["_id"])
    user["name"] = user.get("full_name")
    access_token = create_access_token(subject=user["email"])
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

