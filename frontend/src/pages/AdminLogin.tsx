// 관리자 로그인 페이지 - notion_3 디자인 기준
// JWT 인증 흐름: POST /api/v1/auth/login → 토큰 저장 → /admin/dashboard 이동
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { token, setAuth } = useAuthStore();

  // 폼 상태
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [token, navigate]);

  // 로그인 폼 제출 핸들러
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/v1/auth/login', { username, password });
      // 인증 스토어에 토큰과 사용자명 저장
      setAuth(response.data.access_token, username);
      navigate('/admin/dashboard');
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 상단 헤더 (데스크톱만 표시) */}
      <header className="w-full sticky top-0 z-50 bg-background border-b border-outline-variant md:block hidden">
        <div className="flex justify-between items-center px-lg py-sm max-w-[900px] mx-auto">
          <div className="font-semibold text-h2 text-primary">Portfolio</div>
          <nav className="flex gap-md">
            <a href="/" className="text-body-lg text-on-surface-variant hover:bg-surface-container-low transition-colors px-sm py-xs rounded cursor-pointer">
              Home
            </a>
            <a href="/about" className="text-body-lg text-on-surface-variant hover:bg-surface-container-low transition-colors px-sm py-xs rounded cursor-pointer">
              About
            </a>
            <a href="/projects" className="text-body-lg text-on-surface-variant hover:bg-surface-container-low transition-colors px-sm py-xs rounded cursor-pointer">
              Projects
            </a>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 - 화면 중앙 정렬 */}
      <main className="flex-1 flex items-center justify-center px-md py-xl">
        <div className="w-full max-w-[400px] flex flex-col gap-xl">
          {/* 브랜딩/아이콘 섹션 */}
          <div className="flex flex-col items-center gap-sm">
            <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-xl">
              <span className="material-symbols-outlined text-[32px] text-primary">lock</span>
            </div>
            <h1 className="text-h1 text-center text-primary">관리자 로그인</h1>
            <p className="text-body-sm text-secondary text-center">계속하려면 자격 증명을 입력하세요.</p>
          </div>

          {/* 로그인 폼 */}
          <form className="flex flex-col gap-md" onSubmit={handleLogin}>
            {/* 아이디 입력 */}
            <div className="flex flex-col gap-xs">
              <label className="text-label text-secondary px-xs">아이디</label>
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex flex-col gap-xs">
              <label className="text-label text-secondary px-xs">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
              />
            </div>

            {/* 에러 메시지 표시 */}
            {error && (
              <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg text-body-sm">
                {error}
              </div>
            )}

            {/* 로그인 버튼 */}
            <div className="mt-md">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-container text-on-primary py-sm rounded-lg text-body-lg font-semibold hover:opacity-90 active:opacity-70 transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>

          {/* 안내 박스 */}
          <div className="bg-secondary-container/30 p-md rounded-xl flex gap-md items-start">
            <span className="text-xl">💡</span>
            <div className="flex flex-col">
              <p className="text-body-sm text-on-surface">
                권한이 없는 경우 액세스가 제한될 수 있습니다. 계정 생성이 필요한 경우 관리자에게 문의하세요.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full py-xl border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-lg max-w-[900px] mx-auto gap-md">
          <div className="text-label text-secondary">
            © 2024 Personal Portfolio. Built with minimalist intent.
          </div>
          <div className="flex gap-md">
            <a href="#" className="text-label text-secondary hover:text-primary underline underline-offset-4 transition-all opacity-80 hover:opacity-100">LinkedIn</a>
            <a href="#" className="text-label text-secondary hover:text-primary underline underline-offset-4 transition-all opacity-80 hover:opacity-100">GitHub</a>
            <a href="#" className="text-label text-secondary hover:text-primary underline underline-offset-4 transition-all opacity-80 hover:opacity-100">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
