"""
프로필 API 테스트
GET /api/v1/profile
PUT /api/v1/profile
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User
from app.models.profile import Profile


async def get_auth_token(client: AsyncClient, db_session: AsyncSession) -> str:
    """테스트용 인증 토큰 획득 헬퍼"""
    user = User(username="admin", hashed_password=hash_password("admin1234"))
    db_session.add(user)
    await db_session.commit()

    response = await client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "admin1234"},
    )
    return response.json()["access_token"]


async def create_test_profile(session: AsyncSession) -> Profile:
    """테스트용 프로필 생성 헬퍼"""
    profile = Profile(
        id=1,
        name="김이삭",
        title="AI Engineer",
        bio="테스트용 자기소개",
        skills='["Python", "FastAPI"]',
        achievements='[]',
    )
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile


@pytest.mark.asyncio
async def test_get_profile(client: AsyncClient, db_session: AsyncSession):
    """프로필을 조회할 수 있어야 한다."""
    await create_test_profile(db_session)

    response = await client.get("/api/v1/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "김이삭"
    assert data["title"] == "AI Engineer"


@pytest.mark.asyncio
async def test_get_profile_not_found(client: AsyncClient, db_session: AsyncSession):
    """프로필이 없을 때 404 에러가 반환되어야 한다."""
    response = await client.get("/api/v1/profile")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_profile(client: AsyncClient, db_session: AsyncSession):
    """인증된 사용자가 프로필을 수정할 수 있어야 한다."""
    await create_test_profile(db_session)
    token = await get_auth_token(client, db_session)

    response = await client.put(
        "/api/v1/profile",
        json={"bio": "수정된 자기소개입니다."},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["bio"] == "수정된 자기소개입니다."


@pytest.mark.asyncio
async def test_update_profile_without_auth(client: AsyncClient, db_session: AsyncSession):
    """인증 없이 프로필 수정 시 403 에러가 반환되어야 한다."""
    await create_test_profile(db_session)

    response = await client.put(
        "/api/v1/profile",
        json={"bio": "수정된 자기소개"},
    )
    assert response.status_code == 403
