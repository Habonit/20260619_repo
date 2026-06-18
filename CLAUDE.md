# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 모든 답변과 코드 주석은 **한국어**로 작성한다.

## 프로젝트 개요
김이삭(AI Engineer) 1인 포트폴리오 풀스택 웹앱.
- 프론트엔드: `frontend/` — TypeScript + React (Vite) → Vercel 배포
- 백엔드: `backend/` — FastAPI + SQLAlchemy → Railway 배포
- DB: 개발 `sqlite+aiosqlite:///./dev.db` / 배포 `postgresql+asyncpg://...` (`DATABASE_URL` 환경변수로 분기)
- 디자인 원본: `design/stitch_.zip` 내 6개 HTML 파일 (Tailwind CSS)

## 아키텍처

### 프론트엔드 (`frontend/`)
- Vite + React 18 + TypeScript
- 상태: React Query (서버 상태) · Zustand (클라이언트 상태)
- 라우팅: React Router v6
- 스타일: Tailwind CSS — `design/stitch_.zip > document_logic/DESIGN.md` 토큰 적용
- 페이지: `Home` · `About` · `Projects(목록/상세)` · `Admin(로그인/대시보드)`

### 백엔드 (`backend/`)
- FastAPI + Pydantic v2 + SQLAlchemy 2.0 (async)
- Alembic 마이그레이션
- JWT 인증 (관리자 전용, `/api/v1/auth`)
- 주요 라우터: `/api/v1/projects` · `/api/v1/profile` · `/api/v1/auth`

### DB 분기 (`backend/app/core/database.py`)
```python
# SQLite(개발)와 PostgreSQL(배포)을 DATABASE_URL 하나로 분기
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
```

## 개발 명령어

### 프론트엔드
```bash
cd frontend && npm install
npm run dev          # http://localhost:5173
npm run build && npm run preview
npm run test         # Vitest 전체
npm run test -- src/components/Card.test.tsx  # 단일 파일
```

### 백엔드
```bash
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # http://localhost:8000/docs
alembic upgrade head
pytest                            # 전체 테스트
pytest tests/test_projects.py -v  # 단일 파일
```

## 도구 사용 규칙 (MCP · 플러그인 필수)

| 상황 | 사용 도구 |
|---|---|
| 라이브러리 문법 불확실 | **context7** MCP로 공식 문서 확인 후 작성 |
| 화면 렌더링 점검 | **playwright** MCP로 `localhost:5173` 직접 열어 확인 |
| 기능 구현 | **TDD** — 테스트 먼저 작성 → 구현 → 통과 확인 |
| 대규모 병렬 작업 | **subagent-driven-development** 스킬 활용 |

문서 확인 없이 React·FastAPI·SQLAlchemy API 문법을 가정하지 않는다.

## Karpathy 4원칙 (모든 작업에 적용)

1. **가정 명시** — 불확실한 동작은 실행 전 명시적으로 기록
2. **단순함** — 작동하는 최소한의 코드를 먼저, 추상화는 필요 시에만
3. **외과적 수정** — 요청 범위 밖 코드는 건드리지 않음
4. **검증 루프** — 변경 후 반드시 테스트 실행·통과 확인

## 디자인 시스템 (design/stitch_.zip)

- 스타일: Notion 스타일 미니멀리즘, `document-first` 철학
- 컬러: primary `#21201a` · background `#f9f9f9` · accent `#50a0ff`
- 폰트: Inter (본문 line-height 1.6) · Courier Prime (코드블록)
- 레이아웃: max-width 900px · sidebar 240px · spacing unit 4px
- 화면 구성 (stitch_ 폴더명 → 역할):
  - `notion_1` → 홈/히어로
  - `about_notion` → 소개(About)
  - `notion_4` → 프로젝트 목록 (프로젝트 보드)
  - `notion_2` → 프로젝트 상세
  - `notion_3` → 관리자 로그인
  - `notion_5` → 관리자 대시보드
