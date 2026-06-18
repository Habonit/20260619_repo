// 프로젝트 상세 페이지 컴포넌트 - notion_2 디자인 기준
// 커버 이미지, 속성 테이블, 본문 content, GitHub/Demo 링크 버튼 구성
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Project } from '../types';

// 특정 프로젝트 fetcher 함수
const fetchProject = async (id: string): Promise<Project> => {
  const { data } = await api.get(`/api/v1/projects/${id}`);
  return data;
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 프로젝트 상세 데이터 조회
  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 상태
  if (isError || !project) {
    return (
      <div className="max-w-[900px] mx-auto px-md py-xl text-error">
        프로젝트 데이터를 불러오는 데 실패했습니다.
      </div>
    );
  }

  // role JSON 파싱 (역할 배열)
  let roles: string[] = [];
  try {
    roles = JSON.parse(project.role || '[]');
  } catch {
    // 단일 문자열일 경우 배열로 감싸기
    roles = project.role ? [project.role] : [];
  }

  // tech_stack JSON 파싱
  let techStack: string[] = [];
  try {
    techStack = JSON.parse(project.tech_stack || '[]');
  } catch {
    techStack = project.tech_stack ? [project.tech_stack] : [];
  }

  return (
    <div className="w-full pb-xl">
      {/* 커버 이미지 영역 */}
      <div className="w-full h-[307px] overflow-hidden bg-surface-container">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          // 썸네일 없을 때 회색 배경
          <div className="w-full h-full" style={{ backgroundColor: '#eeeeee' }} />
        )}
      </div>

      {/* 콘텐츠 캔버스 */}
      <div className="content-canvas -mt-12 relative z-10">
        {/* 이모지 */}
        <div className="text-6xl mb-md">{project.emoji}</div>

        {/* 프로젝트 제목 */}
        <h1 className="text-h1 text-primary mb-lg">{project.title}</h1>

        {/* Properties 테이블 */}
        <section className="mb-xl space-y-xs">
          {/* 기간 */}
          {project.period && (
            <div className="property-row">
              <div className="flex items-center text-on-surface-variant text-body-sm">
                <span
                  className="material-symbols-outlined text-[18px] opacity-60 mr-sm"
                >
                  calendar_today
                </span>
                <span>기간</span>
              </div>
              <div className="text-on-surface text-body-sm">{project.period}</div>
            </div>
          )}

          {/* 역할 */}
          {roles.length > 0 && (
            <div className="property-row">
              <div className="flex items-center text-on-surface-variant text-body-sm">
                <span
                  className="material-symbols-outlined text-[18px] opacity-60 mr-sm"
                >
                  person
                </span>
                <span>역할</span>
              </div>
              <div className="flex flex-wrap gap-xs">
                {roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-lg text-label"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 기술 스택 */}
          {techStack.length > 0 && (
            <div className="property-row">
              <div className="flex items-center text-on-surface-variant text-body-sm">
                <span
                  className="material-symbols-outlined text-[18px] opacity-60 mr-sm"
                >
                  terminal
                </span>
                <span>기술 스택</span>
              </div>
              <div className="flex flex-wrap gap-xs">
                {techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-surface-container text-on-surface px-sm py-xs rounded-lg text-label border border-outline-variant"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub URL */}
          {project.github_url && (
            <div className="property-row">
              <div className="flex items-center text-on-surface-variant text-body-sm">
                <span
                  className="material-symbols-outlined text-[18px] opacity-60 mr-sm"
                >
                  link
                </span>
                <span>GitHub</span>
              </div>
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface text-body-sm underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
              >
                {project.github_url}
              </a>
            </div>
          )}

          {/* Demo URL */}
          {project.demo_url && (
            <div className="property-row">
              <div className="flex items-center text-on-surface-variant text-body-sm">
                <span
                  className="material-symbols-outlined text-[18px] opacity-60 mr-sm"
                >
                  open_in_new
                </span>
                <span>데모</span>
              </div>
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-surface text-body-sm underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
              >
                {project.demo_url}
              </a>
            </div>
          )}
        </section>

        {/* 구분선 */}
        <hr className="border-outline-variant mb-xl" />

        {/* 본문 content (HTML 렌더링) */}
        {project.content && (
          <section
            className="mb-xl text-body-lg text-on-surface-variant leading-relaxed"
            // 관리자가 입력한 HTML 본문을 그대로 렌더링
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        )}

        {/* GitHub / Demo 링크 버튼 영역 */}
        {(project.github_url || project.demo_url) && (
          <div className="flex flex-wrap gap-md mb-xl">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm px-lg py-sm border border-outline-variant rounded-lg text-body-lg text-primary font-semibold hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">link</span>
                GitHub 보기
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-lg text-body-lg font-semibold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                데모 보기
              </a>
            )}
          </div>
        )}

        {/* 목록으로 돌아가기 버튼 */}
        <div className="flex justify-start mt-xl pt-xl border-t border-outline-variant">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-sm px-lg py-md rounded-lg border border-outline hover:bg-surface-container-high transition-all text-body-lg text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
