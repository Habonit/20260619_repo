"""
Profile 관련 Pydantic v2 스키마
"""
import json
from typing import Optional
from pydantic import BaseModel, field_validator


class ProfileBase(BaseModel):
    """프로필 공통 필드"""
    name: str
    title: str
    bio: str
    skills: str = '[]'
    achievements: str = '[]'
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    resume_url: Optional[str] = None

    @field_validator("skills", "achievements", mode="before")
    @classmethod
    def validate_json_field(cls, v):
        """리스트/딕셔너리로 전달된 경우 JSON 문자열로 변환한다."""
        if isinstance(v, (list, dict)):
            return json.dumps(v, ensure_ascii=False)
        return v


class ProfileUpdate(BaseModel):
    """프로필 수정 요청 스키마 (모든 필드 선택사항)"""
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[str] = None
    achievements: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    resume_url: Optional[str] = None

    @field_validator("skills", "achievements", mode="before")
    @classmethod
    def validate_json_field(cls, v):
        """리스트/딕셔너리로 전달된 경우 JSON 문자열로 변환한다."""
        if v is None:
            return v
        if isinstance(v, (list, dict)):
            return json.dumps(v, ensure_ascii=False)
        return v


class ProfileResponse(ProfileBase):
    """프로필 응답 스키마"""
    id: int

    model_config = {"from_attributes": True}
