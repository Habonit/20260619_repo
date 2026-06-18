"""
환경변수 및 JWT 설정 모듈
pydantic-settings를 사용하여 .env 파일과 환경변수를 읽어온다.
"""
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

    # CORS 허용 오리진 — 쉼표 구분 문자열로 환경변수 주입
    # 예: ALLOWED_ORIGINS=https://portfolio.vercel.app,http://localhost:5173
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:5174"

    # Pydantic v2 방식 설정
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        """ALLOWED_ORIGINS 쉼표 구분 문자열을 리스트로 변환"""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


# 전역 설정 인스턴스
settings = Settings()
