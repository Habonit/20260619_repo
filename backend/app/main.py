"""
포트폴리오 백엔드 FastAPI 애플리케이션 진입점
- CORS 미들웨어 설정
- API 라우터 등록 (/api/v1/...)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import auth, projects, profile

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="김이삭 AI Engineer 포트폴리오 백엔드 REST API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 미들웨어 등록 (프론트엔드에서 백엔드 API 호출 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
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
