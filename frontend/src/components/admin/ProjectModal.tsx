// 프로젝트 추가/수정 모달 컴포넌트
// 추가 시: POST /api/v1/projects, 수정 시: PUT /api/v1/projects/{id}
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { Project } from '../../types';

interface ProjectModalProps {
  // null이면 추가 모드, 값이 있으면 수정 모드
  editingProject: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ editingProject, onClose }: ProjectModalProps) {
  const queryClient = useQueryClient();

  // 폼 필드 상태
  const [emoji, setEmoji] = useState('🚀');
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 수정 모드일 때 기존 데이터 채우기
  useEffect(() => {
    if (editingProject) {
      setEmoji(editingProject.emoji || '🚀');
      setTitle(editingProject.title || '');
      setPeriod(editingProject.period || '');
      setDescription(editingProject.description || '');
      setContent(editingProject.content || '');
      setGithubUrl(editingProject.github_url || '');
      setDemoUrl(editingProject.demo_url || '');
      setThumbnailUrl(editingProject.thumbnail_url || '');
      setIsFeatured(editingProject.is_featured || false);
      setOrder(editingProject.order || 0);

      // JSON 배열 문자열 → 쉼표 구분 텍스트로 변환
      try {
        const roles = JSON.parse(editingProject.role || '[]') as string[];
        setRoleInput(roles.join(', '));
      } catch {
        setRoleInput('');
      }
      try {
        const techs = JSON.parse(editingProject.tech_stack || '[]') as string[];
        setTechInput(techs.join(', '));
      } catch {
        setTechInput('');
      }
    }
  }, [editingProject]);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 쉼표 구분 문자열 → JSON 배열 문자열 변환
      const roleJson = JSON.stringify(
        roleInput.split(',').map((s) => s.trim()).filter(Boolean)
      );
      const techJson = JSON.stringify(
        techInput.split(',').map((s) => s.trim()).filter(Boolean)
      );

      const data = {
        emoji,
        title,
        period,
        role: roleJson,
        tech_stack: techJson,
        description,
        content,
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
        thumbnail_url: thumbnailUrl || null,
        is_featured: isFeatured,
        order,
      };

      if (editingProject) {
        // 수정 요청
        await api.put(`/api/v1/projects/${editingProject.id}`, data);
      } else {
        // 추가 요청
        await api.post('/api/v1/projects', data);
      }

      // 프로젝트 목록 캐시 무효화 → 자동 재조회
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    } catch {
      setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 오버레이 배경
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md"
      onClick={(e) => {
        // 오버레이 클릭 시 모달 닫기 (모달 내부 클릭은 버블링 방지)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 모달 본체 */}
      <div className="bg-surface-container-lowest rounded-xl w-full max-w-2xl overflow-auto max-h-[90vh] shadow-lg">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-lg border-b border-outline-variant">
          <h2 className="text-h3 text-primary">
            {editingProject ? '프로젝트 수정' : '새 프로젝트 추가'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-xs hover:bg-surface-container-high rounded text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-lg flex flex-col gap-md">
          {/* 이모지 + 제목 (한 행) */}
          <div className="flex gap-sm">
            <div className="flex flex-col gap-xs w-20">
              <label className="text-label text-secondary px-xs">이모지</label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="notion-input w-full px-sm py-sm rounded-lg text-body-sm bg-surface-container-lowest text-center text-xl"
              />
            </div>
            <div className="flex flex-col gap-xs flex-1">
              <label className="text-label text-secondary px-xs">제목 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="프로젝트 제목"
                className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
              />
            </div>
          </div>

          {/* 기간 */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">기간</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="예: 2024년 1월 - 현재"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
            />
          </div>

          {/* 역할 */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">역할 (쉼표로 구분)</label>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="예: Frontend Lead, UI/UX Designer"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
            />
          </div>

          {/* 기술 스택 */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">기술 스택 (쉼표로 구분)</label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="예: React, TypeScript, Tailwind CSS"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="프로젝트 간단 설명"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline resize-none"
            />
          </div>

          {/* 상세 내용 (HTML) */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">상세 내용 (HTML)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="<p>상세 프로젝트 설명 HTML...</p>"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline resize-none font-mono"
            />
          </div>

          {/* URL 입력 (3개 한 행) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label text-secondary px-xs">GitHub URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label text-secondary px-xs">데모 URL</label>
              <input
                type="text"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo.example.com"
                className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label text-secondary px-xs">썸네일 URL</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://image.example.com/..."
                className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
              />
            </div>
          </div>

          {/* 순서 + Featured 체크박스 (한 행) */}
          <div className="flex gap-md items-center">
            <div className="flex flex-col gap-xs w-24">
              <label className="text-label text-secondary px-xs">순서</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest"
              />
            </div>
            <div className="flex items-center gap-xs mt-lg">
              <input
                type="checkbox"
                id="is_featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="is_featured" className="text-body-sm text-on-surface cursor-pointer">
                Featured 프로젝트
              </label>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg text-body-sm">
              {error}
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-sm pt-sm border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-lg py-sm border border-outline-variant rounded-lg text-body-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-lg py-sm bg-primary-container text-on-primary rounded-lg text-body-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? '저장 중...' : editingProject ? '수정 저장' : '프로젝트 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
