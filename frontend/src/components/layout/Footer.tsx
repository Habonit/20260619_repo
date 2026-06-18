// 공통 푸터 컴포넌트
export default function Footer() {
  return (
    <footer className="border-t border-outline-variant mt-xl">
      <div className="max-w-[900px] mx-auto px-md py-lg flex flex-col sm:flex-row items-center justify-between gap-md">
        {/* 저작권 문구 */}
        <p className="text-body-sm text-on-surface-variant">
          © 2024 김이삭 Portfolio. Built with minimalist intent.
        </p>

        {/* 소셜 링크 */}
        <div className="flex items-center gap-md">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
