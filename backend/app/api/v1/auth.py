"""
인증 API 라우터
POST /api/v1/auth/login      - JWT 토큰 발급
POST /api/v1/auth/change-password - 비밀번호 변경 (관리자 전용)
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import ChangePasswordRequest, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["인증"])

# HTTP Bearer 토큰 추출기
security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """
    Authorization 헤더에서 JWT 토큰을 검증하고 현재 사용자를 반환하는 의존성 함수.
    유효하지 않은 토큰이면 401 에러를 발생시킨다.
    """
    token = credentials.credentials
    username = decode_access_token(token)

    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 인증 토큰입니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자를 찾을 수 없습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


@router.post("/login", response_model=TokenResponse, summary="관리자 로그인")
async def login(
    request: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    """
    사용자명과 비밀번호로 로그인하여 JWT 액세스 토큰을 발급한다.
    """
    # 사용자 조회
    result = await db.execute(select(User).where(User.username == request.username))
    user = result.scalar_one_or_none()

    # 사용자 없거나 비밀번호 불일치 시 401 에러
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자명 또는 비밀번호가 올바르지 않습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # JWT 토큰 생성
    access_token = create_access_token(data={"sub": user.username})

    return TokenResponse(access_token=access_token)


@router.post("/change-password", summary="비밀번호 변경 (관리자 전용)")
async def change_password(
    request: ChangePasswordRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """
    현재 비밀번호를 확인하고 새 비밀번호로 변경한다.
    """
    # 현재 비밀번호 검증
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="현재 비밀번호가 올바르지 않습니다.",
        )

    # 새 비밀번호 해싱 후 저장
    current_user.hashed_password = hash_password(request.new_password)
    db.add(current_user)

    return {"message": "비밀번호가 성공적으로 변경되었습니다."}
