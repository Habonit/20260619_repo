// axios 인스턴스 설정 - 백엔드 API 클라이언트
// VITE_API_URL 환경변수로 API 서버 주소를 지정한다.
// 개발: http://localhost:8000 (frontend/.env)
// 배포: Railway URL (frontend/.env.production 또는 Vercel 환경변수)
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// 요청 인터셉터: JWT 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
