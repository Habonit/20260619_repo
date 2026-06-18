"""
User 모델 - 관리자 계정 관리
"""
from datetime import datetime, timezone
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(Base):
    """관리자 사용자 모델"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    # 사용자명 (유니크 제약)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    # bcrypt 해싱된 비밀번호
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    # 계정 생성 시각 (UTC)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username}>"
