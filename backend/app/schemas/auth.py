"""
인증 관련 Pydantic v2 스키마
"""
from pydantic import BaseModel


class LoginRequest(BaseModel):
    """로그인 요청 스키마"""
    username: str
    password: str


class TokenResponse(BaseModel):
    """JWT 토큰 응답 스키마"""
    access_token: str
    token_type: str = "bearer"


class ChangePasswordRequest(BaseModel):
    """비밀번호 변경 요청 스키마"""
    current_password: str
    new_password: str
