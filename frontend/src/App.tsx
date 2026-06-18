// 앱 루트 컴포넌트 - 라우팅 설정
// 페이지 컴포넌트는 Task 4, 5에서 실제 구현 예정
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// 플레이스홀더 페이지 컴포넌트 (Task 4에서 실제 구현)
function Home() {
  return <div className="max-w-[900px] mx-auto px-md py-xl text-on-surface">홈 페이지 (Task 4에서 구현)</div>;
}

function About() {
  return <div className="max-w-[900px] mx-auto px-md py-xl text-on-surface">소개 페이지 (Task 4에서 구현)</div>;
}

function Projects() {
  return <div className="max-w-[900px] mx-auto px-md py-xl text-on-surface">프로젝트 목록 (Task 4에서 구현)</div>;
}

function ProjectDetail() {
  return <div className="max-w-[900px] mx-auto px-md py-xl text-on-surface">프로젝트 상세 (Task 4에서 구현)</div>;
}

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
