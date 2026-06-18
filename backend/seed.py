"""
초기 데이터 시딩 스크립트
- 관리자 계정 생성 (admin / admin1234)
- 프로필 데이터 삽입
- 샘플 프로젝트 3건 삽입

실행 방법: python seed.py
"""
import asyncio
import json
import sys
import os

# backend/ 디렉터리를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.security import hash_password
from app.models.user import User
from app.models.profile import Profile
from app.models.project import Project

# DB 연결 설정 — Railway는 postgresql:// 형식으로 주입하므로 asyncpg 형식으로 변환
_raw_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./dev.db")
DATABASE_URL = (
    _raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if _raw_url.startswith("postgresql://")
    else _raw_url
)
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_async_engine(DATABASE_URL, connect_args=connect_args)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def seed_admin(session: AsyncSession) -> None:
    """관리자 계정 생성 (이미 존재하면 건너뜀)"""
    result = await session.execute(select(User).where(User.username == "admin"))
    existing = result.scalar_one_or_none()

    if existing:
        print("  [건너뜀] admin 계정이 이미 존재합니다.")
        return

    admin = User(
        username="admin",
        hashed_password=hash_password("admin1234"),
    )
    session.add(admin)
    print("  [생성] admin 계정 생성 완료 (password: admin1234)")


async def seed_profile(session: AsyncSession) -> None:
    """프로필 데이터 삽입 (이미 존재하면 건너뜀)"""
    result = await session.execute(select(Profile).where(Profile.id == 1))
    existing = result.scalar_one_or_none()

    if existing:
        print("  [건너뜀] 프로필이 이미 존재합니다.")
        return

    profile = Profile(
        id=1,
        name="김이삭",
        title="AI Engineer",
        bio="비즈니스 문제를 기술로 해결하는 AI 엔지니어",
        skills=json.dumps(
            ["Python", "FastAPI", "React", "TypeScript", "LangChain"],
            ensure_ascii=False,
        ),
        achievements=json.dumps(
            [
                {
                    "emoji": "🚀",
                    "label": "주요 성과 01",
                    "description": "기존 시스템 마이그레이션으로 응답속도 40% 개선",
                },
                {
                    "emoji": "👥",
                    "label": "주요 성과 02",
                    "description": "신규 서비스 런칭 후 MAU 50,000명 돌파",
                },
                {
                    "emoji": "⚙️",
                    "label": "주요 성과 03",
                    "description": "CI/CD 자동화로 배포 주기 일 3회 이상 단축",
                },
            ],
            ensure_ascii=False,
        ),
        github_url="https://github.com/kimisaac",
        linkedin_url=None,
        twitter_url=None,
        resume_url=None,
    )
    session.add(profile)
    print("  [생성] 프로필 데이터 삽입 완료 (김이삭 AI Engineer)")


async def seed_projects(session: AsyncSession) -> None:
    """샘플 프로젝트 3건 삽입"""
    result = await session.execute(select(Project))
    existing_count = len(result.scalars().all())

    if existing_count > 0:
        print(f"  [건너뜀] 프로젝트 데이터가 이미 {existing_count}건 존재합니다.")
        return

    sample_projects = [
        Project(
            title="AI 챗봇 고객 서비스 시스템",
            description="LLM 기반 고객 응대 자동화 시스템으로 응답 시간을 80% 단축하고 고객 만족도를 향상시켰습니다.",
            period="2024년 01월 - 2024년 06월 (6개월)",
            role=json.dumps(["AI Engineer Lead", "Backend Developer"], ensure_ascii=False),
            tech_stack=json.dumps(
                ["Python", "LangChain", "FastAPI", "PostgreSQL", "Redis", "Docker"],
                ensure_ascii=False,
            ),
            content="<h2>프로젝트 개요</h2><p>LLM 기반 고객 응대 자동화 시스템 구축 프로젝트입니다.</p>",
            github_url="https://github.com/kimisaac/ai-chatbot",
            demo_url=None,
            thumbnail_url=None,
            emoji="🤖",
            is_featured=True,
            order=1,
        ),
        Project(
            title="실시간 데이터 파이프라인 구축",
            description="Kafka와 Spark를 활용한 실시간 로그 분석 파이프라인으로 기존 배치 처리 대비 지연 시간을 95% 개선했습니다.",
            period="2023년 06월 - 2023년 12월 (7개월)",
            role=json.dumps(["Data Engineer", "Architecture Design"], ensure_ascii=False),
            tech_stack=json.dumps(
                ["Apache Kafka", "Apache Spark", "Python", "AWS S3", "Airflow"],
                ensure_ascii=False,
            ),
            content="<h2>프로젝트 개요</h2><p>실시간 데이터 파이프라인 구축 프로젝트입니다.</p>",
            github_url="https://github.com/kimisaac/data-pipeline",
            demo_url=None,
            thumbnail_url=None,
            emoji="⚡",
            is_featured=True,
            order=2,
        ),
        Project(
            title="포트폴리오 웹 애플리케이션",
            description="FastAPI + React TypeScript 기반의 풀스택 포트폴리오 웹앱으로 Notion 스타일 미니멀 디자인을 적용했습니다.",
            period="2024년 06월 - 2024년 07월 (1개월)",
            role=json.dumps(
                ["Full Stack Developer", "UI/UX Design"], ensure_ascii=False
            ),
            tech_stack=json.dumps(
                ["FastAPI", "React", "TypeScript", "SQLAlchemy", "SQLite", "Tailwind CSS"],
                ensure_ascii=False,
            ),
            content="<h2>프로젝트 개요</h2><p>개인 포트폴리오 풀스택 웹 애플리케이션입니다.</p>",
            github_url="https://github.com/kimisaac/portfolio",
            demo_url="https://kimisaac.dev",
            thumbnail_url=None,
            emoji="🚀",
            is_featured=True,
            order=3,
        ),
    ]

    for project in sample_projects:
        session.add(project)

    print(f"  [생성] 샘플 프로젝트 {len(sample_projects)}건 삽입 완료")


async def main() -> None:
    """시딩 메인 함수"""
    print("=" * 50)
    print("포트폴리오 백엔드 초기 데이터 시딩 시작")
    print("=" * 50)

    async with AsyncSessionLocal() as session:
        print("\n[1/3] 관리자 계정 처리 중...")
        await seed_admin(session)

        print("\n[2/3] 프로필 데이터 처리 중...")
        await seed_profile(session)

        print("\n[3/3] 샘플 프로젝트 처리 중...")
        await seed_projects(session)

        await session.commit()

    await engine.dispose()

    print("\n" + "=" * 50)
    print("시딩 완료!")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
