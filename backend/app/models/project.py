"""
Project 모델 - 포트폴리오 프로젝트 항목
"""
from datetime import datetime, timezone
from sqlalchemy import Boolean, Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Project(Base):
    """포트폴리오 프로젝트 모델"""
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # 프로젝트 제목
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    # 프로젝트 요약 설명
    description: Mapped[str] = mapped_column(Text, nullable=False)
    # 진행 기간 (예: "2023년 10월 - 2024년 2월 (5개월)")
    period: Mapped[str] = mapped_column(String(100), nullable=False)

    # 담당 역할 - JSON 배열 문자열 (예: '["Frontend Lead", "UI/UX Designer"]')
    role: Mapped[str] = mapped_column(Text, nullable=False, default='[]')
    # 기술 스택 - JSON 배열 문자열 (예: '["Python", "FastAPI", "React"]')
    tech_stack: Mapped[str] = mapped_column(Text, nullable=False, default='[]')

    # Notion 스타일 HTML 본문 (상세 페이지용, 선택사항)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)

    # 외부 링크 (선택사항)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    demo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # 목록 표시용 이모지 (기본값: 로켓)
    emoji: Mapped[str] = mapped_column(String(10), nullable=False, default="🚀")
    # 주요 프로젝트 여부 (홈 화면 노출 기준)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    # 목록 정렬 순서 (오름차순)
    order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # 생성/수정 시각 (UTC)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id} title={self.title}>"
