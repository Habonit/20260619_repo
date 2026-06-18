"""
포트폴리오 백엔드 FastAPI 애플리케이션 진입점
- CORS 미들웨어 설정
- API 라우터 등록 (/api/v1/...)
- lifespan: 서버 시작 시 DB 테이블 생성 + 초기 데이터 시딩
"""
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.profile import Profile
from app.models.project import Project
from app.api.v1 import auth, projects, profile


async def _init_db() -> None:
    """테이블 생성 및 초기 데이터 시딩 (멱등)"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 관리자 계정
        result = await session.execute(select(User).where(User.username == "admin"))
        if not result.scalar_one_or_none():
            session.add(User(username="admin", hashed_password=hash_password("admin1234")))

        # 프로필
        result = await session.execute(select(Profile).where(Profile.id == 1))
        if not result.scalar_one_or_none():
            session.add(Profile(
                id=1,
                name="김이삭",
                title="AI Engineer",
                bio="비즈니스 문제를 기술로 해결하는 AI 엔지니어",
                skills=json.dumps(["Python", "FastAPI", "React", "TypeScript", "LangChain"], ensure_ascii=False),
                achievements=json.dumps([
                    {"emoji": "🚀", "label": "주요 성과 01", "description": "기존 시스템 마이그레이션으로 응답속도 40% 개선"},
                    {"emoji": "👥", "label": "주요 성과 02", "description": "신규 서비스 런칭 후 MAU 50,000명 돌파"},
                    {"emoji": "⚙️", "label": "주요 성과 03", "description": "CI/CD 자동화로 배포 주기 일 3회 이상 단축"},
                ], ensure_ascii=False),
                github_url="https://github.com/kimisaac",
            ))

        # 샘플 프로젝트 (없을 때만)
        result = await session.execute(select(Project))
        if not result.scalars().all():
            session.add_all([
                Project(
                    title="AI 챗봇 고객 서비스 시스템",
                    description="LLM 기반 고객 응대 자동화 시스템으로 응답 시간을 80% 단축하고 고객 만족도를 향상시켰습니다.",
                    period="2024년 01월 - 2024년 06월 (6개월)",
                    role=json.dumps(["AI Engineer Lead", "Backend Developer"], ensure_ascii=False),
                    tech_stack=json.dumps(["Python", "LangChain", "FastAPI", "PostgreSQL", "Redis", "Docker"], ensure_ascii=False),
                    content="<h2>프로젝트 개요</h2><p>LLM 기반 고객 응대 자동화 시스템 구축 프로젝트입니다.</p>",
                    github_url="https://github.com/kimisaac/ai-chatbot",
                    emoji="🤖", is_featured=True, order=1,
                ),
                Project(
                    title="실시간 데이터 파이프라인 구축",
                    description="Kafka와 Spark를 활용한 실시간 로그 분석 파이프라인으로 기존 배치 처리 대비 지연 시간을 95% 개선했습니다.",
                    period="2023년 06월 - 2023년 12월 (7개월)",
                    role=json.dumps(["Data Engineer", "Architecture Design"], ensure_ascii=False),
                    tech_stack=json.dumps(["Apache Kafka", "Apache Spark", "Python", "AWS S3", "Airflow"], ensure_ascii=False),
                    content="<h2>프로젝트 개요</h2><p>실시간 데이터 파이프라인 구축 프로젝트입니다.</p>",
                    github_url="https://github.com/kimisaac/data-pipeline",
                    emoji="⚡", is_featured=True, order=2,
                ),
                Project(
                    title="포트폴리오 웹 애플리케이션",
                    description="FastAPI + React TypeScript 기반의 풀스택 포트폴리오 웹앱으로 Notion 스타일 미니멀 디자인을 적용했습니다.",
                    period="2024년 06월 - 2024년 07월 (1개월)",
                    role=json.dumps(["Full Stack Developer", "UI/UX Design"], ensure_ascii=False),
                    tech_stack=json.dumps(["FastAPI", "React", "TypeScript", "SQLAlchemy", "SQLite", "Tailwind CSS"], ensure_ascii=False),
                    content="<h2>프로젝트 개요</h2><p>개인 포트폴리오 풀스택 웹 애플리케이션입니다.</p>",
                    github_url="https://github.com/kimisaac/portfolio",
                    demo_url="https://kimisaac.dev",
                    emoji="🚀", is_featured=True, order=3,
                ),
            ])

        await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await _init_db()
    yield
    await engine.dispose()


# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="김이삭 AI Engineer 포트폴리오 백엔드 REST API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS 미들웨어 등록 (프론트엔드에서 백엔드 API 호출 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록 (/api/v1 접두사)
API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(projects.router, prefix=API_PREFIX)
app.include_router(profile.router, prefix=API_PREFIX)


@app.get("/", tags=["헬스체크"], summary="서버 상태 확인")
async def root() -> dict:
    """서버 정상 동작 여부를 확인하는 헬스체크 엔드포인트"""
    return {
        "status": "ok",
        "message": f"{settings.APP_NAME} 서버가 정상 동작 중입니다.",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health", tags=["헬스체크"], summary="헬스체크")
async def health_check() -> dict:
    """Railway 등 배포 환경의 헬스체크용 엔드포인트"""
    return {"status": "healthy"}
