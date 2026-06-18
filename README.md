# 김이삭 · AI Engineer 포트폴리오

> 비즈니스 문제를 기술로 해결하는 AI 엔지니어의 1인 풀스택 포트폴리오 웹앱.
> Notion 스타일 미니멀리즘으로 설계한 React + FastAPI 프로젝트입니다.

<div align="center">

## 🔗 바로 보기

### ▶ [**라이브 데모 (프론트엔드 · Vercel)**](https://portfolio-frontend-ebon-kappa.vercel.app)
### ▶ [**API 문서 (백엔드 · Railway / Swagger)**](https://portfolio-api-production-3946.up.railway.app/docs)

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-frontend-ebon-kappa.vercel.app)
[![API Docs](https://img.shields.io/badge/🔗_API_Docs-Railway-8B5CF6?style=for-the-badge&logo=railway&logoColor=white)](https://portfolio-api-production-3946.up.railway.app/docs)

</div>

---

## 📖 프로젝트 소개

AI 엔지니어 김이삭의 경력·프로젝트를 보여주는 포트폴리오 웹 애플리케이션입니다.
방문자는 프로필과 프로젝트를 열람할 수 있고, 관리자는 로그인 후 대시보드에서 프로젝트를 직접 CRUD 할 수 있습니다.

- **방문자 화면**: 홈(히어로) · 소개(About) · 프로젝트 목록 · 프로젝트 상세
- **관리자 화면**: 로그인(JWT) · 대시보드(프로젝트 관리)
- **디자인 철학**: Notion 스타일 `document-first` 미니멀리즘 (primary `#21201a`, accent `#50a0ff`, Inter 폰트)

> 🧪 **데모 관리자 계정** — 라이브 데모에서 직접 관리자 기능을 체험해 보세요.
> `username: admin` / `password: admin1234` (포트폴리오 공개용 데모 계정)

---

## 🛠 기술 스택

### 프론트엔드 (`frontend/`) → Vercel
- **React 19** + **TypeScript** + **Vite**
- **React Query** (서버 상태) · **Zustand** (클라이언트 상태)
- **React Router v7** (라우팅) · **axios** (API 클라이언트)
- **Tailwind CSS** (디자인 토큰 기반 스타일링)

### 백엔드 (`backend/`) → Railway
- **FastAPI** + **Pydantic v2**
- **SQLAlchemy 2.0 (async)** + **Alembic** (마이그레이션)
- **JWT 인증** (관리자 전용, `python-jose` · `passlib[bcrypt]`)
- DB 드라이버: **asyncpg** (PostgreSQL) / **aiosqlite** (SQLite)

### 데이터베이스
- 개발: **SQLite** (`sqlite+aiosqlite:///./dev.db`)
- 배포: **PostgreSQL** (Railway) — `DATABASE_URL` 환경변수 하나로 분기

---

## 🚀 로컬 실행 방법

### 1) 백엔드 (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → API 문서: http://localhost:8000/docs
```
서버 최초 실행 시 테이블 생성과 초기 데이터(관리자 계정·프로필·샘플 프로젝트)가 자동 시딩됩니다.

### 2) 프론트엔드 (React + Vite)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```
프론트엔드는 `frontend/.env`의 `VITE_API_URL`(기본값 `http://localhost:8000`)로 백엔드에 연결합니다.

### 테스트
```bash
# 백엔드
cd backend && pytest

# 프론트엔드
cd frontend && npm run test
```

---

## 📂 프로젝트 구조

```
.
├── frontend/            # React + TypeScript (Vite) → Vercel
│   ├── src/
│   │   ├── lib/api.ts   # axios 인스턴스 (VITE_API_URL)
│   │   └── ...
│   └── vercel.json      # SPA 라우팅 fallback (deep link 404 방지)
├── backend/             # FastAPI + SQLAlchemy → Railway
│   ├── app/
│   │   ├── api/v1/      # auth · projects · profile 라우터
│   │   ├── core/        # config · database · security
│   │   └── main.py      # 앱 진입점 (lifespan 시딩 + CORS)
│   ├── alembic/         # 마이그레이션
│   └── requirements.txt
├── design/              # Stitch 디자인 원본 (Notion 스타일 HTML)
└── CLAUDE.md            # 개발 가이드(에이전트/규칙)
```

---

## 🌐 API 개요

| 메서드 | 경로 | 설명 |
|---|---|---|
| `GET` | `/health` | 헬스체크 |
| `POST` | `/api/v1/auth/login` | 관리자 로그인 (JWT 발급) |
| `GET` | `/api/v1/projects` | 프로젝트 목록 |
| `GET` | `/api/v1/projects/{id}` | 프로젝트 상세 |
| `GET` | `/api/v1/profile` | 프로필 조회 |

전체 명세는 [Swagger 문서](https://portfolio-api-production-3946.up.railway.app/docs)에서 확인할 수 있습니다.

---

## ☁️ 배포

- **프론트엔드**: Vercel (Vite 프리셋, `vercel.json`으로 SPA fallback 처리)
- **백엔드**: Railway (Nixpacks 빌드, PostgreSQL 애드온)
- 백엔드 `ALLOWED_ORIGINS` 환경변수로 프론트엔드 도메인 CORS 허용
- `SECRET_KEY`, `DATABASE_URL` 등 시크릿은 각 플랫폼 환경변수로 주입 (코드에 미포함)
