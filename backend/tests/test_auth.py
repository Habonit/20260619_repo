"""
인증 API 테스트
POST /api/v1/auth/login
POST /api/v1/auth/change-password
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User


async def create_test_user(session: AsyncSession, username: str = "admin", password: str = "admin1234") -> User:
    """테스트용 사용자 생성 헬퍼 함수"""
    user = User(
        username=username,
        hashed_password=hash_password(password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, db_session: AsyncSession):
    """정상 로그인 시 JWT 토큰이 반환되어야 한다."""
    await create_test_user(db_session)

    response = await client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "admin1234"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, db_session: AsyncSession):
    """잘못된 비밀번호로 로그인 시 401 에러가 반환되어야 한다."""
    await create_test_user(db_session)

    response = await client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "wrongpassword"},
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient, db_session: AsyncSession):
    """존재하지 않는 사용자로 로그인 시 401 에러가 반환되어야 한다."""
    response = await client.post(
        "/api/v1/auth/login",
        json={"username": "nobody", "password": "password"},
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_change_password_success(client: AsyncClient, db_session: AsyncSession):
    """인증된 사용자가 비밀번호를 변경할 수 있어야 한다."""
    await create_test_user(db_session)

    # 로그인하여 토큰 획득
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "admin1234"},
    )
    token = login_response.json()["access_token"]

    # 비밀번호 변경
    response = await client.post(
        "/api/v1/auth/change-password",
        json={"current_password": "admin1234", "new_password": "newpassword123"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert "message" in response.json()


@pytest.mark.asyncio
async def test_access_protected_without_token(client: AsyncClient, db_session: AsyncSession):
    """토큰 없이 보호된 엔드포인트 접근 시 403 에러가 반환되어야 한다."""
    response = await client.post(
        "/api/v1/auth/change-password",
        json={"current_password": "admin1234", "new_password": "newpassword123"},
    )

    assert response.status_code == 403  # HTTPBearer는 토큰 미제공 시 403 반환


@pytest.mark.asyncio
async def test_change_password_wrong_current(client: AsyncClient, db_session: AsyncSession):
    """현재 비밀번호가 틀리면 400 에러가 반환되어야 한다."""
    await create_test_user(db_session)

    # 로그인하여 토큰 획득
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "admin1234"},
    )
    token = login_response.json()["access_token"]

    # 잘못된 현재 비밀번호로 변경 시도
    response = await client.post(
        "/api/v1/auth/change-password",
        json={"current_password": "wrongpassword", "new_password": "newpassword123"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 400
