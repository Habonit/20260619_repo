// axios 인스턴스 설정 - 백엔드 API 클라이언트
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
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
