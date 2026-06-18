/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind가 클래스를 스캔할 파일 경로
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 디자인 시스템 색상 토큰 (design/stitch_ HTML과 동일)
      colors: {
        "primary": "#21201a",
        "on-primary": "#ffffff",
        "primary-container": "#37352f",
        "on-primary-container": "#a19d95",
        "background": "#f9f9f9",
        "on-background": "#1a1c1c",
        "surface": "#f9f9f9",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#49473f",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "outline": "#7a776e",
        "outline-variant": "#cbc6bc",
        "secondary": "#5f5e5c",
        "on-secondary": "#ffffff",
        "secondary-container": "#e2dfdb",
        "on-secondary-container": "#636360",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "tertiary": "#002141",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#003666",
        "on-tertiary-container": "#50a0ff",
      },
      // 간격 토큰
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "40px",
        "container-max": "900px",
        "sidebar-width": "240px",
      },
      // 테두리 반경 토큰
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      // 폰트 크기 토큰
      fontSize: {
        h1: ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1-mobile": ["30px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["30px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        label: ["12px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "500" }],
        mono: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      // 폰트 패밀리 토큰
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Courier Prime", "monospace"],
      },
    },
  },
  plugins: [],
};
