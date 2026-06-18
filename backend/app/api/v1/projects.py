"""
프로젝트 CRUD API 라우터
GET    /api/v1/projects        - 프로젝트 목록 조회
POST   /api/v1/projects        - 프로젝트 추가 (관리자 전용)
GET    /api/v1/projects/{id}   - 프로젝트 상세 조회
PUT    /api/v1/projects/{id}   - 프로젝트 수정 (관리자 전용)
DELETE /api/v1/projects/{id}   - 프로젝트 삭제 (관리자 전용)
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["프로젝트"])


@router.get("", response_model=list[ProjectResponse], summary="프로젝트 목록 조회")
async def get_projects(
    db: Annotated[AsyncSession, Depends(get_db)],
    featured_only: bool = False,
) -> list[ProjectResponse]:
    """
    모든 프로젝트를 정렬 순서(order) 기준으로 조회한다.
    featured_only=true이면 is_featured=True인 항목만 반환한다.
    """
    query = select(Project).order_by(Project.order, Project.created_at.desc())

    if featured_only:
        query = query.where(Project.is_featured == True)

    result = await db.execute(query)
    projects = result.scalars().all()
    return list(projects)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="프로젝트 추가 (관리자 전용)",
)
async def create_project(
    project_in: ProjectCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(get_current_user)],
) -> ProjectResponse:
    """새 프로젝트를 생성한다. JWT 토큰이 필요하다."""
    project = Project(**project_in.model_dump())
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse, summary="프로젝트 상세 조회")
async def get_project(
    project_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProjectResponse:
    """특정 프로젝트의 상세 정보를 조회한다."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"프로젝트 ID {project_id}를 찾을 수 없습니다.",
        )

    return project


@router.put("/{project_id}", response_model=ProjectResponse, summary="프로젝트 수정 (관리자 전용)")
async def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(get_current_user)],
) -> ProjectResponse:
    """특정 프로젝트를 수정한다. JWT 토큰이 필요하다."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"프로젝트 ID {project_id}를 찾을 수 없습니다.",
        )

    # None이 아닌 필드만 업데이트
    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.add(project)
    await db.flush()
    await db.refresh(project)
    return project


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="프로젝트 삭제 (관리자 전용)",
)
async def delete_project(
    project_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(get_current_user)],
) -> None:
    """특정 프로젝트를 삭제한다. JWT 토큰이 필요하다."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"프로젝트 ID {project_id}를 찾을 수 없습니다.",
        )

    await db.delete(project)
