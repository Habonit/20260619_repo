// 앱 루트 컴포넌트 - 라우팅 설정
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// 공개 페이지 컴포넌트 (Task 4 구현 완료)
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

// 관리자 페이지 컴포넌트 (Task 5에서 실제 구현)
function AdminLogin() {
  return <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">관리자 로그인 (Task 5에서 구현)</div>;
}

function AdminDashboard() {
  return <div className="min-h-screen bg-background text-on-surface p-md">관리자 대시보드 (Task 5에서 구현)</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 일반 페이지 - Layout(Header+Footer) 포함 */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/projects/:id" element={<Layout><ProjectDetail /></Layout>} />

        {/* 관리자 페이지 - Layout 미포함 */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 알 수 없는 경로는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
