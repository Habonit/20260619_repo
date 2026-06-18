"""
Alembic 마이그레이션 환경 설정 모듈
SQLAlchemy 2.0 async 엔진에 맞춰 비동기 방식으로 마이그레이션을 실행한다.
"""
import asyncio
import os
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# alembic.ini 로깅 설정 적용
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# DATABASE_URL 환경변수로 연결 URL 오버라이드
# Railway는 postgresql:// 형식으로 주입하므로 asyncpg 드라이버 형식으로 변환
_raw_url = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./dev.db")
DATABASE_URL = (
    _raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if _raw_url.startswith("postgresql://")
    else _raw_url
)
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# 모든 ORM 모델을 임포트하여 autogenerate가 변경사항을 감지하도록 한다
from app.core.database import Base  # noqa: E402
from app.models.user import User  # noqa: E402, F401
from app.models.project import Project  # noqa: E402, F401
from app.models.profile import Profile  # noqa: E402, F401

# 마이그레이션 대상 메타데이터
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    오프라인 모드에서 마이그레이션 실행 (DB 연결 없이 SQL 스크립트 생성).
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """동기 연결을 사용하여 마이그레이션을 실행한다."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """비동기 엔진을 사용하여 마이그레이션을 실행한다."""
    # SQLite는 check_same_thread=False 필요
    connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """온라인 모드에서 비동기 마이그레이션을 실행한다."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
