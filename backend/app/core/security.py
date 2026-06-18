"""
JWT 토큰 발급/검증 및 비밀번호 해싱 모듈
python-jose와 passlib[bcrypt]를 사용한다.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# bcrypt 해싱 컨텍스트
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """평문 비밀번호를 bcrypt로 해싱하여 반환한다."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """평문 비밀번호와 해시된 비밀번호를 비교하여 일치 여부를 반환한다."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    JWT 액세스 토큰을 생성하여 반환한다.

    Args:
        data: 토큰에 담을 페이로드 딕셔너리 (예: {"sub": "admin"})
        expires_delta: 만료 시간 (None이면 기본값 사용)

    Returns:
        인코딩된 JWT 문자열
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[str]:
    """
    JWT 토큰을 검증하고 username(sub 클레임)을 반환한다.
    유효하지 않은 토큰이면 None을 반환한다.

    Args:
        token: 검증할 JWT 문자열

    Returns:
        토큰의 sub 클레임 값(username) 또는 None
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        username: Optional[str] = payload.get("sub")
        return username
    except JWTError:
        return None
