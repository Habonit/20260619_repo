// About 페이지 컴포넌트 - about_notion 디자인 기준
// 프로필 정보, 기술 스택 카드, GitHub/LinkedIn 링크 구성
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Profile } from '../types';

// 프로필 데이터 fetcher 함수
const fetchProfile = async (): Promise<Profile> => {
  const { data } = await api.get('/api/v1/profile');
  return data;
};

export default function About() {
  // 프로필 데이터 조회
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 에러 상태
  if (isError || !profile) {
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

  return (
    <div className="max-w-[900px] mx-auto px-md py-xl">
      {/* 히어로 섹션 */}
      <header className="mb-xl">
        <h1 className="text-h1 mb-sm">✨ 안녕하세요, {profile.name}입니다</h1>
        <p className="text-body-lg text-on-surface-variant max-w-[700px]">
          {profile.bio}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
        {/* 왼쪽: 프로필 정보 */}
        <section className="md:col-span-4 flex flex-col gap-lg">
          {/* 프로필 아바타 플레이스홀더 */}
          <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container aspect-square flex items-center justify-center">
            <span className="material-symbols-outlined text-[80px] text-on-surface-variant opacity-40">
              account_circle
            </span>
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <span className="text-label text-on-surface-variant uppercase">Name</span>
              <span className="text-body-lg font-medium">{profile.name}</span>
            </div>
            <div className="flex flex-col gap-xs">
              <span className="text-label text-on-surface-variant uppercase">Role</span>
              <span className="text-body-lg font-medium">{profile.title}</span>
            </div>
          </div>

          {/* 연락처/링크 섹션 */}
          <div className="flex flex-col gap-sm">
            <h3 className="text-label text-on-surface-variant border-b border-outline-variant pb-xs mb-xs uppercase">
              Links
            </h3>

            {/* GitHub 링크 */}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm p-sm border border-outline-variant bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors group"
              >
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                  link
                </span>
                <span className="text-body-sm">GitHub</span>
              </a>
            )}

            {/* LinkedIn 링크 */}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm p-sm border border-outline-variant bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors group"
              >
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                  link
                </span>
                <span className="text-body-sm">LinkedIn</span>
              </a>
            )}

            {/* Twitter 링크 */}
            {profile.twitter_url && (
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm p-sm border border-outline-variant bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors group"
              >
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                  link
                </span>
                <span className="text-body-sm">Twitter</span>
              </a>
            )}
          </div>
        </section>

        {/* 오른쪽: 상세 정보 */}
        <section className="md:col-span-8 flex flex-col gap-xl">
          {/* Bio 콜아웃 박스 */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex gap-md items-start">
            <span className="text-2xl">📝</span>
            <p className="text-body-lg leading-relaxed text-on-surface-variant">
              {profile.bio}
            </p>
          </div>

          {/* 기술 스택 섹션 */}
          {skills.length > 0 && (
            <div className="flex flex-col gap-md">
              <h2 className="text-h2 border-b border-outline-variant pb-sm flex items-center gap-sm">
                <span className="material-symbols-outlined">terminal</span>
                기술 스택
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-sm border border-outline-variant bg-surface-container-lowest rounded-lg hover:bg-surface-container-low transition-colors flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      code
                    </span>
                    <span className="text-body-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 외부 링크 버튼 그룹 */}
          <div className="flex flex-wrap gap-md">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm px-lg py-sm border border-outline-variant bg-surface-container-lowest rounded-xl text-body-lg font-semibold text-primary hover:bg-surface-container-low transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">link</span>
                GitHub
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm px-lg py-sm border border-outline-variant bg-surface-container-lowest rounded-xl text-body-lg font-semibold text-primary hover:bg-surface-container-low transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">link</span>
                LinkedIn
              </a>
            )}
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-xl text-body-lg font-semibold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                이력서 다운로드
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
