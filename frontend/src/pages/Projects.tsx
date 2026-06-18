// 프로젝트 목록 페이지 컴포넌트 - notion_4 갤러리 기준
// 검색 바 + auto-fill 갤러리 그리드 구성
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Project } from '../types';

// 전체 프로젝트 목록 fetcher 함수
const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get('/api/v1/projects');
  return data;
};

export default function Projects() {
  const navigate = useNavigate();
  // 클라이언트 사이드 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 프로젝트 목록 조회
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="max-w-[900px] mx-auto px-md py-xl text-error">
        프로젝트 목록을 불러오는 데 실패했습니다.
      </div>
    );
  }

  // 검색어로 프로젝트 필터링 (제목 기준, 클라이언트 사이드)
  const filteredProjects = (projects ?? []).filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[900px] mx-auto px-md py-xl">
      {/* 페이지 헤더 */}
      <header className="mb-xl">
        <div className="flex items-center gap-sm mb-sm">
          <span className="text-2xl">📁</span>
          <h1 className="text-h1">프로젝트 보드</h1>
        </div>
        <p className="text-on-surface-variant max-w-2xl">
          지금까지 진행한 프로젝트들을 갤러리 뷰로 정리했습니다. 각 카드를 클릭하여 상세 내용을 확인하세요.
        </p>

        {/* 검색 입력 */}
        <div className="mt-lg">
          <div className="flex items-center gap-xs border border-outline-variant rounded-lg px-md py-sm bg-surface-container-lowest max-w-md">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              placeholder="프로젝트 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-body-sm text-on-surface placeholder:text-on-surface-variant"
            />
            {/* 검색어 초기화 버튼 */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 프로젝트 갤러리 그리드 */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-xl text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] mb-md block">search_off</span>
          <p className="text-body-lg">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 프로젝트 카드 컴포넌트
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  // tech_stack JSON 파싱
  let techStack: string[] = [];
  try {
    techStack = JSON.parse(project.tech_stack || '[]');
  } catch {
    techStack = [];
  }

  // 기술 스택 최대 3개 표시, 나머지 "+N" 표시
  const visibleTech = techStack.slice(0, 3);
  const remainingCount = techStack.length - visibleTech.length;

  return (
    <div
      onClick={onClick}
      className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:shadow-sm transition-shadow cursor-pointer group"
    >
      {/* 썸네일 이미지 영역 (h-48 = 192px) */}
      <div className="h-48 bg-surface-container overflow-hidden">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // 썸네일 없을 때 이모지 플레이스홀더
          <div className="w-full h-full flex items-center justify-center bg-surface-container transition-transform duration-500 group-hover:scale-105">
            <span className="text-[64px]">{project.emoji}</span>
          </div>
        )}
      </div>

      {/* 카드 본문 */}
      <div className="p-md space-y-sm">
        {/* 이모지 + 제목 */}
        <h3 className="text-[18px] font-semibold text-primary leading-snug">
          {project.thumbnail_url && <span className="mr-xs">{project.emoji}</span>}
          {project.title}
        </h3>

        {/* 기간 */}
        {project.period && (
          <div className="flex items-center gap-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span className="text-body-sm">{project.period}</span>
          </div>
        )}

        {/* 기술 스택 뱃지 */}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-xs pt-sm">
            {visibleTech.map((tech, idx) => (
              <span
                key={idx}
                className="px-xs py-[2px] bg-secondary-container text-on-secondary-container rounded text-[11px] font-medium"
              >
                {tech}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-xs py-[2px] bg-surface-container text-on-surface-variant rounded text-[11px] font-medium">
                +{remainingCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
