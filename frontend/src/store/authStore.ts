// Zustand 인증 스토어 - JWT 토큰과 사용자 정보 관리
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      // 로그인 성공 시 토큰과 사용자명 저장
      setAuth: (token, username) => {
        localStorage.setItem('auth_token', token);
        set({ token, username });
      },
      // 로그아웃 시 인증 정보 초기화
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, username: null });
      },
    }),
    { name: 'auth-storage' }
  )
);
