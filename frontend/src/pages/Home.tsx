// 홈 페이지 컴포넌트 - notion_1 디자인 기준
// 히어로 섹션, 성과 카드, Featured 프로젝트, 기술 스택 뱃지 구성
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Profile, Project, Achievement } from '../types';

// 프로필 데이터 fetcher 함수
const fetchProfile = async (): Promise<Profile> => {
  const { data } = await api.get('/api/v1/profile');
  return data;
};

// Featured 프로젝트 fetcher 함수
const fetchFeaturedProjects = async (): Promise<Project[]> => {
  const { data } = await api.get('/api/v1/projects?featured_only=true');
  return data;
};

// 성과 카드 배경색 (최대 3개)
const ACHIEVEMENT_BG_COLORS = ['#f0f7ff', '#fefce8', '#f5f3ff'];

export default function Home() {
  const navigate = useNavigate();

  // 프로필 데이터 조회
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });

  // Featured 프로젝트 조회
  const { data: featuredProjects } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: fetchFeaturedProjects,
  });

  // 로딩 상태
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 상태
  if (profileError || !profile) {
    return (
      <div className="max-w-[900px] mx-auto px-md py-xl text-error">
        프로필 데이터를 불러오는 데 실패했습니다.
      </div>
    );
  }

  // skills JSON 파싱
  let skills: string[] = [];
  try {
    skills = JSON.parse(profile.skills || '[]');
  } catch {
    skills = [];
  }

  // achievements JSON 파싱 (최대 3개)
  let achievements: Achievement[] = [];
  try {
    achievements = (JSON.parse(profile.achievements || '[]') as Achievement[]).slice(0, 3);
  } catch {
    achievements = [];
  }

  // Featured 프로젝트 첫 번째 항목
  const featuredProject = featuredProjects?.[0] ?? null;

  return (
    <main className="max-w-[900px] mx-auto px-md py-xl">
      {/* 섹션 1: 히어로 */}
      <section className="mb-xl">
        <div className="flex flex-col gap-sm">
          {/* 이름 배지 + 직함 */}
          <div className="flex items-center gap-sm mt-xs">
            <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-lg text-label uppercase tracking-widest">
              {profile.title}
            </span>
            <span className="text-on-surface-variant text-body-lg opacity-70">
              {profile.name}
            </span>
          </div>

          {/* 이름 H1 */}
          <h1 className="text-h1 text-on-surface tracking-tight">
            {profile.name}의 포트폴리오
          </h1>

          {/* bio 텍스트 */}
          <p className="mt-md text-body-lg text-on-surface-variant max-w-2xl">
            {profile.bio}
          </p>

          {/* 버튼 그룹 */}
          <div className="flex gap-md mt-lg">
            {/* 프로젝트 보기 버튼 */}
            <button
              onClick={() => navigate('/projects')}
              className="bg-primary text-on-primary px-lg py-sm rounded-xl text-body-lg font-semibold hover:opacity-90 transition-all flex items-center gap-xs"
            >
              <span>프로젝트 보기</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            {/* 이력서 다운로드 버튼 */}
            <a
              href={profile.resume_url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!profile.resume_url}
              className={`border border-outline-variant bg-surface-container-lowest text-primary px-lg py-sm rounded-xl text-body-lg font-semibold transition-all flex items-center gap-xs ${
                profile.resume_url
                  ? 'hover:bg-surface-container-low cursor-pointer'
                  : 'opacity-40 cursor-not-allowed pointer-events-none'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">download</span>
              <span>이력서 다운로드</span>
            </a>
          </div>
        </div>
      </section>

      {/* 섹션 2: 주요 성과 카드 (벤토 그리드 3개) */}
      {achievements.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
          {achievements.map((item, idx) => (
            <div
              key={idx}
              className="border border-outline-variant rounded-xl p-md flex flex-col gap-sm"
              style={{ backgroundColor: ACHIEVEMENT_BG_COLORS[idx] }}
            >
              <div className="flex items-center gap-sm">
                <span className="text-h3">{item.emoji}</span>
                <span className="text-h3 text-primary">{item.label}</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                {item.description}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* 섹션 3: 구분선 */}
      <div className="w-full h-[1px] bg-outline-variant my-xl" />

      {/* 섹션 4: Featured 이미지 섹션 */}
      {featuredProject && (
        <section className="mb-xl">
          <div
            className="relative w-full h-[400px] rounded-xl overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/projects/${featuredProject.id}`)}
          >
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10" />

            {/* 썸네일 이미지 또는 플레이스홀더 */}
            {featuredProject.thumbnail_url ? (
              <img
                src={featuredProject.thumbnail_url}
                alt={featuredProject.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-container to-secondary-container transition-transform duration-700 group-hover:scale-105" />
            )}

            {/* Featured 라벨 + 프로젝트 제목 */}
            <div className="absolute bottom-lg left-lg z-20 text-on-primary">
              <span className="text-label uppercase tracking-widest opacity-80">
                Featured Work
              </span>
              <h2 className="text-h2 mt-xs">
                {featuredProject.emoji} {featuredProject.title}
              </h2>
            </div>
          </div>
        </section>
      )}

      {/* 섹션 5: 기술 스택 뱃지 */}
      {skills.length > 0 && (
        <section className="mb-xl">
          <h3 className="text-h3 mb-lg flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">terminal</span>
            기술 스택
          </h3>
          <div className="flex flex-wrap gap-md">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-xs px-md py-sm bg-surface-container border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors cursor-default"
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
                <span className="text-body-sm font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
