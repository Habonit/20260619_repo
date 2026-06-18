"""
SQLAlchemy 2.0 async 데이터베이스 엔진 및 세션 설정 모듈
개발환경(SQLite)과 배포환경(PostgreSQL)을 DATABASE_URL 환경변수로 분기한다.
"""
import os
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

# DATABASE_URL 환경변수로 SQLite/PostgreSQL 분기 (절대 변경 금지)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./dev.db")

# SQLite는 check_same_thread=False 필요, PostgreSQL은 불필요
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

# 비동기 엔진 생성
engine = create_async_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False,  # SQL 로그 출력 (개발 시 True로 변경 가능)
)

# 비동기 세션 팩토리 생성
# expire_on_commit=False: 커밋 후 객체 만료 방지 (비동기 환경에서 필수)
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """SQLAlchemy ORM 모델의 기본 클래스"""
    pass


async def get_db() -> AsyncSession:
    """
    FastAPI 의존성 주입용 비동기 DB 세션 제공 함수.
    요청당 하나의 세션을 열고 요청 완료 후 자동으로 닫는다.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
