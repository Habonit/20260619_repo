// 공통 헤더 컴포넌트 - notion_1 디자인 기준
import { NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-outline-variant">
      <div className="max-w-[900px] mx-auto px-md flex items-center justify-between h-14">
        {/* 로고 */}
        <NavLink
          to="/"
          className="font-bold text-h2 text-primary leading-none"
        >
          Portfolio
        </NavLink>

        {/* 네비게이션 링크 */}
        <nav className="flex items-center gap-lg">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors pb-xs ${
                isActive ? 'text-primary border-b-2 border-primary' : ''
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors pb-xs ${
                isActive ? 'text-primary border-b-2 border-primary' : ''
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `text-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors pb-xs ${
                isActive ? 'text-primary border-b-2 border-primary' : ''
              }`
            }
          >
            Projects
          </NavLink>
        </nav>

        {/* 우측 아이콘 영역 */}
        <div className="flex items-center gap-sm">
          {/* 검색 아이콘 */}
          <button
            className="p-xs text-on-surface-variant hover:text-primary transition-colors"
            aria-label="검색"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          {/* 관리자 아이콘 - 클릭 시 /admin 이동 */}
          <button
            onClick={() => navigate('/admin')}
            className="p-xs text-on-surface-variant hover:text-primary transition-colors"
            aria-label="관리자 페이지로 이동"
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
