"""
Project 관련 Pydantic v2 스키마
"""
import json
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class ProjectBase(BaseModel):
    """프로젝트 공통 필드"""
    title: str
    description: str
    period: str
    role: str = '[]'
    tech_stack: str = '[]'
    content: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    emoji: str = "🚀"
    is_featured: bool = False
    order: int = 0

    @field_validator("role", "tech_stack", mode="before")
    @classmethod
    def validate_json_array(cls, v):
        """리스트로 전달된 경우 JSON 문자열로 변환한다."""
        if isinstance(v, list):
            return json.dumps(v, ensure_ascii=False)
        return v


class ProjectCreate(ProjectBase):
    """프로젝트 생성 요청 스키마"""
    pass


class ProjectUpdate(BaseModel):
    """프로젝트 수정 요청 스키마 (모든 필드 선택사항)"""
    title: Optional[str] = None
    description: Optional[str] = None
    period: Optional[str] = None
    role: Optional[str] = None
    tech_stack: Optional[str] = None
    content: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    emoji: Optional[str] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None

    @field_validator("role", "tech_stack", mode="before")
    @classmethod
    def validate_json_array(cls, v):
        """리스트로 전달된 경우 JSON 문자열로 변환한다."""
        if v is None:
            return v
        if isinstance(v, list):
            return json.dumps(v, ensure_ascii=False)
        return v


class ProjectResponse(ProjectBase):
    """프로젝트 응답 스키마"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
