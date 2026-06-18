"""
Profile 모델 - 포트폴리오 소유자 프로필 (항상 id=1 단일 레코드)
"""
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Profile(Base):
    """포트폴리오 소유자 프로필 모델 (단일 레코드, id=1 고정)"""
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # 이름
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    # 직함/역할 (예: "AI Engineer")
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    # 자기소개 문구
    bio: Mapped[str] = mapped_column(Text, nullable=False)

    # 기술 목록 - JSON 배열 문자열 (예: '["Python", "FastAPI", "React"]')
    skills: Mapped[str] = mapped_column(Text, nullable=False, default='[]')

    # 주요 성과 - JSON 배열 문자열
    # 예: '[{"emoji":"🚀","label":"성과01","description":"..."}]'
    achievements: Mapped[str] = mapped_column(Text, nullable=False, default='[]')

    # 소셜/외부 링크 (선택사항)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    twitter_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    def __repr__(self) -> str:
        return f"<Profile id={self.id} name={self.name}>"
