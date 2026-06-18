"""
프로젝트 CRUD API 테스트
GET/POST /api/v1/projects
GET/PUT/DELETE /api/v1/projects/{id}
"""
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User


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


SAMPLE_PROJECT = {
    "title": "테스트 프로젝트",
    "description": "테스트용 프로젝트 설명입니다.",
    "period": "2024년 01월 - 2024년 06월 (6개월)",
    "role": '["Backend Developer"]',
    "tech_stack": '["Python", "FastAPI"]',
    "emoji": "🚀",
    "is_featured": False,
    "order": 1,
}


@pytest.mark.asyncio
async def test_get_projects_empty(client: AsyncClient, db_session: AsyncSession):
    """프로젝트가 없을 때 빈 배열을 반환해야 한다."""
    response = await client.get("/api/v1/projects")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_project(client: AsyncClient, db_session: AsyncSession):
    """인증된 사용자가 프로젝트를 생성할 수 있어야 한다."""
    token = await get_auth_token(client, db_session)

    response = await client.post(
        "/api/v1/projects",
        json=SAMPLE_PROJECT,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == SAMPLE_PROJECT["title"]
    assert data["id"] is not None


@pytest.mark.asyncio
async def test_create_project_without_auth(client: AsyncClient, db_session: AsyncSession):
    """인증 없이 프로젝트 생성 시 403 에러가 반환되어야 한다."""
    response = await client.post("/api/v1/projects", json=SAMPLE_PROJECT)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_get_project_detail(client: AsyncClient, db_session: AsyncSession):
    """생성한 프로젝트의 상세 정보를 조회할 수 있어야 한다."""
    token = await get_auth_token(client, db_session)

    # 프로젝트 생성
    create_response = await client.post(
        "/api/v1/projects",
        json=SAMPLE_PROJECT,
        headers={"Authorization": f"Bearer {token}"},
    )
    project_id = create_response.json()["id"]

    # 상세 조회
    response = await client.get(f"/api/v1/projects/{project_id}")
    assert response.status_code == 200
    assert response.json()["id"] == project_id


@pytest.mark.asyncio
async def test_update_project(client: AsyncClient, db_session: AsyncSession):
    """인증된 사용자가 프로젝트를 수정할 수 있어야 한다."""
    token = await get_auth_token(client, db_session)

    # 프로젝트 생성
    create_response = await client.post(
        "/api/v1/projects",
        json=SAMPLE_PROJECT,
        headers={"Authorization": f"Bearer {token}"},
    )
    project_id = create_response.json()["id"]

    # 수정
    response = await client.put(
        f"/api/v1/projects/{project_id}",
        json={"title": "수정된 프로젝트 제목"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "수정된 프로젝트 제목"


@pytest.mark.asyncio
async def test_delete_project(client: AsyncClient, db_session: AsyncSession):
    """인증된 사용자가 프로젝트를 삭제할 수 있어야 한다."""
    token = await get_auth_token(client, db_session)

    # 프로젝트 생성
    create_response = await client.post(
        "/api/v1/projects",
        json=SAMPLE_PROJECT,
        headers={"Authorization": f"Bearer {token}"},
    )
    project_id = create_response.json()["id"]

    # 삭제
    response = await client.delete(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 204

    # 삭제 후 조회 시 404
    get_response = await client.get(f"/api/v1/projects/{project_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_get_nonexistent_project(client: AsyncClient, db_session: AsyncSession):
    """존재하지 않는 프로젝트 조회 시 404 에러가 반환되어야 한다."""
    response = await client.get("/api/v1/projects/99999")
    assert response.status_code == 404
