import bcrypt
from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt # pyright: ignore[reportMissingModuleSource]
from fastapi import HTTPException # pyright: ignore[reportMissingImports]
from app.config import settings

MAX_BCRYPT_PASSWORD_BYTES = 72

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if len(plain_password.encode("utf-8")) > MAX_BCRYPT_PASSWORD_BYTES:
            return False
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    if len(password.encode("utf-8")) > MAX_BCRYPT_PASSWORD_BYTES:
        raise HTTPException(
            status_code=400,
            detail="Password must be 72 bytes or less"
        )
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode = {
        "exp": expire,
        "sub": str(subject)
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt
