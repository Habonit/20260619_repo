// 비밀번호 변경 모달 컴포넌트
// POST /api/v1/auth/change-password → 성공 시 모달 닫기
import { useState } from 'react';
import api from '../../lib/api';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  // 폼 상태
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 비밀번호 변경 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 클라이언트 검증: 새 비밀번호 일치 여부
    if (newPw !== newPwConfirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 최소 길이 검증
    if (newPw.length < 6) {
      setError('새 비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/v1/auth/change-password', {
        current_password: currentPw,
        new_password: newPw,
      });
      // 성공 상태 표시 후 모달 닫기
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setError('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 오버레이 배경
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 모달 본체 */}
      <div className="bg-surface-container-lowest rounded-xl w-full max-w-md shadow-lg">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-lg border-b border-outline-variant">
          <h2 className="text-h3 text-primary">비밀번호 변경</h2>
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
          {/* 성공 메시지 */}
          {success && (
            <div className="px-md py-sm bg-secondary-container text-on-secondary-container rounded-lg text-body-sm text-center">
              비밀번호가 변경되었습니다.
            </div>
          )}

          {/* 현재 비밀번호 */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">현재 비밀번호</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
              placeholder="현재 비밀번호 입력"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
            />
          </div>

          {/* 새 비밀번호 */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">새 비밀번호</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              placeholder="새 비밀번호 입력 (6자 이상)"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
            />
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="flex flex-col gap-xs">
            <label className="text-label text-secondary px-xs">새 비밀번호 확인</label>
            <input
              type="password"
              value={newPwConfirm}
              onChange={(e) => setNewPwConfirm(e.target.value)}
              required
              placeholder="새 비밀번호 다시 입력"
              className="notion-input w-full px-md py-sm rounded-lg text-body-sm bg-surface-container-lowest placeholder:text-outline"
            />
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
              disabled={isSubmitting || success}
              className="px-lg py-sm bg-primary-container text-on-primary rounded-lg text-body-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
