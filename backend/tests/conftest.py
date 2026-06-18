"""
pytest 공통 픽스처 설정
인메모리 SQLite DB를 사용하여 각 테스트 간 격리를 보장한다.
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import Base, get_db
from app.main import app

# 테스트용 인메모리 SQLite DB URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

# 테스트용 엔진
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# 테스트용 세션 팩토리
TestAsyncSessionLocal = async_sessionmaker(
    test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest_asyncio.fixture(scope="function")
async def db_session():
    """각 테스트 함수마다 새로운 DB 세션을 생성하고 테스트 후 롤백한다."""
    # 테이블 생성
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestAsyncSessionLocal() as session:
        yield session

    # 테스트 후 테이블 삭제 (격리)
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession):
    """테스트용 FastAPI 비동기 HTTP 클라이언트"""

    async def override_get_db():
        """테스트 DB 세션으로 의존성 오버라이드"""
        try:
            yield db_session
            await db_session.commit()
        except Exception:
            await db_session.rollback()
            raise

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
