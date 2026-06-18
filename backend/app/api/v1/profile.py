"""
프로필 API 라우터 (항상 id=1 단일 레코드 기준)
GET /api/v1/profile  - 프로필 조회 (공개)
PUT /api/v1/profile  - 프로필 수정 (관리자 전용)
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["프로필"])

# 단일 프로필 레코드 ID (항상 1)
PROFILE_ID = 1

# 프로필이 없을 때 반환할 기본값 (seed.py 미실행 환경 대비)
DEFAULT_PROFILE = ProfileResponse(
    id=PROFILE_ID,
    name="김이삭",
    title="AI Engineer",
    bio="포트폴리오 소개 페이지입니다.",
    skills='[]',
    achievements='[]',
    github_url=None,
    linkedin_url=None,
    twitter_url=None,
    resume_url=None,
)


@router.get("", response_model=ProfileResponse, summary="프로필 조회")
async def get_profile(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProfileResponse:
    """포트폴리오 소유자의 프로필 정보를 조회한다. 데이터가 없으면 기본값을 반환한다."""
    result = await db.execute(select(Profile).where(Profile.id == PROFILE_ID))
    profile = result.scalar_one_or_none()

    # 프로필이 없으면 500 대신 기본값 반환
    if not profile:
        return DEFAULT_PROFILE

    return profile


@router.put("", response_model=ProfileResponse, summary="프로필 수정 (관리자 전용)")
async def update_profile(
    profile_in: ProfileUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(get_current_user)],
) -> ProfileResponse:
    """프로필 정보를 수정한다. JWT 토큰이 필요하다."""
    result = await db.execute(select(Profile).where(Profile.id == PROFILE_ID))
    profile = result.scalar_one_or_none()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로필 데이터가 없습니다. seed.py를 실행해 초기 데이터를 입력하세요.",
        )

    # None이 아닌 필드만 업데이트
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.add(profile)
    await db.flush()
    await db.refresh(profile)
    return profile
