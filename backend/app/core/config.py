"""
환경변수 및 JWT 설정 모듈
pydantic-settings를 사용하여 .env 파일과 환경변수를 읽어온다.
"""
import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """애플리케이션 전역 설정"""

    # 앱 기본 정보
    APP_NAME: str = "포트폴리오 백엔드 API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # 데이터베이스 URL (개발: SQLite, 배포: PostgreSQL)
    DATABASE_URL: str = "sqlite+aiosqlite:///./dev.db"

    # JWT 설정
    SECRET_KEY: str = "portfolio-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    # 액세스 토큰 만료 시간 (분 단위)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24시간

    # CORS 허용 오리진 목록 (기본값: 로컬 개발용)
    # 배포 시 ALLOWED_ORIGINS 환경변수에 쉼표 구분 URL 지정
    # 예: ALLOWED_ORIGINS=https://portfolio.vercel.app,https://www.example.com
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
    ]

    # Pydantic v2 방식 설정 (class Config 대신 model_config 사용)
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


def _get_settings() -> Settings:
    """
    ALLOWED_ORIGINS 환경변수가 쉼표 구분 문자열로 오는 경우를 처리한다.
    Railway/Vercel 환경에서는 리스트 환경변수 대신 쉼표 구분 문자열을 사용한다.
    """
    raw_origins = os.getenv("ALLOWED_ORIGINS", "")
    if raw_origins:
        origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
        return Settings(ALLOWED_ORIGINS=origins)
    return Settings()


# 전역 설정 인스턴스
settings = _get_settings()
