// 관리자 대시보드 페이지 - notion_5 디자인 기준
// 사이드바 + 프로젝트 테이블 + CRUD 모달
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import type { Project } from '../types';
import ProjectModal from '../components/admin/ProjectModal';
import ChangePasswordModal from '../components/admin/ChangePasswordModal';

// 전체 프로젝트 목록 fetcher 함수
const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get('/api/v1/projects');
  return data;
};

// 사이드바 섹션 타입
type SidebarSection = 'profile' | 'projects' | 'settings';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, username, clearAuth } = useAuthStore();

  // 활성 사이드바 메뉴 상태 (기본: projects)
  const [activeSection, setActiveSection] = useState<SidebarSection>('projects');

  // 모달 상태
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // 토큰 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!token) {
      navigate('/admin');
    }
  }, [token, navigate]);

  // 프로젝트 목록 조회 (React Query)
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  // 로그아웃 핸들러
  const handleLogout = () => {
    clearAuth();
    navigate('/admin');
  };

  // 프로젝트 삭제 핸들러
  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) return;
    try {
      await api.delete(`/api/v1/projects/${project.id}`);
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch {
      alert('프로젝트 삭제 중 오류가 발생했습니다.');
    }
  };

  // 새 프로젝트 추가 모달 열기
  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  // 프로젝트 수정 모달 열기
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  // Settings 메뉴 클릭 → 비밀번호 변경 모달
  const handleSettingsClick = () => {
    setActiveSection('settings');
    setShowChangePasswordModal(true);
  };

  // 토큰이 없는 경우 렌더링하지 않음 (useEffect에서 리다이렉트 처리)
  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* === 사이드바 === */}
      <aside className="w-[240px] h-full fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant z-40 hidden md:flex flex-col">
        {/* 사이드바 헤더 */}
        <div className="p-md flex items-center gap-sm">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              dashboard
            </span>
          </div>
          <div>
            <h1 className="text-[16px] font-semibold text-primary leading-tight">Admin Dashboard</h1>
            <p className="text-body-sm text-on-surface-variant">Management</p>
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col gap-xs p-md flex-1">
          {/* Profile */}
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex items-center gap-sm px-md py-xs rounded-lg text-left transition-all cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span className="text-body-sm">Profile</span>
          </button>

          {/* Projects (기본 활성) */}
          <button
            onClick={() => setActiveSection('projects')}
            className={`flex items-center gap-sm px-md py-xs rounded-lg text-left transition-all cursor-pointer ${
              activeSection === 'projects'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">folder</span>
            <span className="text-body-sm">Projects</span>
          </button>

          {/* Settings → 비밀번호 변경 모달 */}
          <button
            onClick={handleSettingsClick}
            className={`flex items-center gap-sm px-md py-xs rounded-lg text-left transition-all cursor-pointer ${
              activeSection === 'settings'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="text-body-sm">Settings</span>
          </button>
        </nav>

        {/* 사이드바 하단: 사용자 정보 + 로그아웃 */}
        <div className="p-md border-t border-outline-variant">
          <div className="flex items-center justify-between px-xs py-xs">
            <div className="flex items-center gap-sm">
              <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] text-secondary">person</span>
              </div>
              <span className="text-label text-secondary">{username ?? 'Admin User'}</span>
            </div>
            <button
              onClick={handleLogout}
              title="로그아웃"
              className="p-xs hover:bg-surface-container-high rounded text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* === 메인 영역 (사이드바 너비만큼 마진) === */}
      <main className="flex-1 md:ml-[240px] min-h-screen">
        {/* 상단 헤더 */}
        <header className="w-full sticky top-0 z-50 bg-background border-b border-outline-variant">
          <div className="flex justify-between items-center px-lg py-sm max-w-[900px] mx-auto">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary text-[18px]">folder</span>
              <span className="text-body-lg font-semibold">전체 프로젝트</span>
            </div>
            <div className="flex items-center gap-md">
              {/* 모바일용 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="md:hidden flex items-center gap-xs text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className="max-w-[900px] mx-auto px-lg py-xl">
          {/* 페이지 제목 + 설명 */}
          <div className="mb-xl">
            <h2 className="text-h1 mb-md">💻 프로젝트 리스트</h2>
            <p className="text-body-lg text-secondary mb-xl">
              포트폴리오에 게시된 모든 프로젝트를 관리하고 편집합니다.
            </p>

            {/* 탭 + 새 프로젝트 버튼 */}
            <div className="flex items-center justify-between gap-md border-b border-outline-variant pb-sm">
              <div className="flex items-center gap-md">
                <button className="flex items-center gap-xs text-body-sm text-primary font-semibold border-b-2 border-primary pb-sm -mb-[9px] px-sm">
                  <span className="material-symbols-outlined text-[18px]">table_chart</span>
                  표
                </button>
              </div>
              <button
                onClick={handleAddProject}
                className="flex items-center gap-xs px-md py-xs bg-primary-container text-on-primary rounded-lg text-body-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                새 프로젝트 추가
              </button>
            </div>
          </div>

          {/* 프로젝트 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant text-label uppercase tracking-wider">
                  <th className="py-sm px-md font-medium w-8">이모지</th>
                  <th className="py-sm px-md font-medium">제목</th>
                  <th className="py-sm px-md font-medium hidden md:table-cell">기간</th>
                  <th className="py-sm px-md font-medium hidden lg:table-cell">기술스택</th>
                  <th className="py-sm px-md font-medium text-right">작업</th>
                </tr>
              </thead>
              <tbody className="text-body-sm">
                {/* 로딩 상태 */}
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="py-xl text-center text-on-surface-variant">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                )}

                {/* 에러 상태 */}
                {isError && (
                  <tr>
                    <td colSpan={5} className="py-xl text-center text-error">
                      프로젝트 목록을 불러오는 데 실패했습니다.
                    </td>
                  </tr>
                )}

                {/* 프로젝트 목록이 비어있는 경우 */}
                {!isLoading && !isError && (!projects || projects.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-xl text-center text-on-surface-variant">
                      등록된 프로젝트가 없습니다. 새 프로젝트를 추가해보세요.
                    </td>
                  </tr>
                )}

                {/* 프로젝트 행 목록 */}
                {(projects ?? []).map((project) => (
                  <ProjectTableRow
                    key={project.id}
                    project={project}
                    onEdit={() => handleEditProject(project)}
                    onDelete={() => handleDeleteProject(project)}
                  />
                ))}
              </tbody>
            </table>

            {/* 테이블 하단 추가 버튼 */}
            <button
              onClick={handleAddProject}
              className="w-full flex items-center gap-sm py-md px-md text-on-surface-variant hover:bg-surface-container-low transition-colors group"
            >
              <span className="material-symbols-outlined text-secondary text-[18px] opacity-50 group-hover:opacity-100">add</span>
              <span className="text-body-sm">새로운 데이터 추가</span>
            </button>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="w-full py-xl border-t border-outline-variant mt-xl">
          <div className="flex flex-col md:flex-row justify-between items-center px-lg max-w-[900px] mx-auto gap-md">
            <div className="text-label text-secondary">
              © 2024 Personal Portfolio. Built with minimalist intent.
            </div>
            <div className="flex gap-md">
              <a href="#" className="text-label text-secondary hover:text-primary underline underline-offset-4 transition-all">LinkedIn</a>
              <a href="#" className="text-label text-secondary hover:text-primary underline underline-offset-4 transition-all">GitHub</a>
              <a href="#" className="text-label text-secondary hover:text-primary underline underline-offset-4 transition-all">Twitter</a>
            </div>
          </div>
        </footer>
      </main>

      {/* 프로젝트 추가/수정 모달 */}
      {showProjectModal && (
        <ProjectModal
          editingProject={editingProject}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
        />
      )}

      {/* 비밀번호 변경 모달 */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => {
            setShowChangePasswordModal(false);
            setActiveSection('projects');
          }}
        />
      )}
    </div>
  );
}

// 프로젝트 테이블 행 컴포넌트 (분리하여 가독성 향상)
interface ProjectTableRowProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

function ProjectTableRow({ project, onEdit, onDelete }: ProjectTableRowProps) {
  // tech_stack JSON 파싱 (최대 3개 표시)
  let techStack: string[] = [];
  try {
    techStack = JSON.parse(project.tech_stack || '[]');
  } catch {
    techStack = [];
  }
  const visibleTech = techStack.slice(0, 3);

  return (
    <tr className="notion-table-row border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
      {/* 이모지 */}
      <td className="py-md px-md">
        <span className="text-lg">{project.emoji}</span>
      </td>

      {/* 제목 */}
      <td className="py-md px-md">
        <span className="font-semibold text-primary">{project.title}</span>
        {project.is_featured && (
          <span className="ml-sm px-xs py-[1px] bg-tertiary-container text-on-tertiary-container rounded text-[10px] font-bold uppercase">
            Featured
          </span>
        )}
      </td>

      {/* 기간 (데스크톱만) */}
      <td className="py-md px-md text-on-surface-variant hidden md:table-cell">
        {project.period || '-'}
      </td>

      {/* 기술스택 (대형 화면만) */}
      <td className="py-md px-md hidden lg:table-cell">
        <div className="flex flex-wrap gap-xs">
          {visibleTech.map((tech, idx) => (
            <span
              key={idx}
              className="px-xs py-[1px] bg-secondary-container text-on-secondary-container rounded text-[11px] font-medium"
            >
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="px-xs py-[1px] bg-surface-container text-on-surface-variant rounded text-[11px]">
              +{techStack.length - 3}
            </span>
          )}
        </div>
      </td>

      {/* 수정/삭제 버튼 */}
      <td className="py-md px-md text-right">
        <div className="row-actions flex justify-end gap-xs">
          <button
            onClick={onEdit}
            title="수정"
            className="p-1 hover:bg-surface-container-high rounded text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={onDelete}
            title="삭제"
            className="p-1 hover:bg-error-container rounded text-error transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
