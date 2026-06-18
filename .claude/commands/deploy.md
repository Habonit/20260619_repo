배포를 단계별로 안내해줘. 백엔드는 Railway(PostgreSQL 포함), 프론트는 Vercel로 배포한다.

다음 순서로 진행하되, 로그인·계정 생성·결제수단 등 사람이 직접 해야 하는 단계에서는
반드시 "⏸ 여기서 멈춥니다 — [해야 할 작업]을 완료한 뒤 '계속'을 입력해주세요"라고 말하고 기다려라.

## 배포 순서

### 1단계 — Railway 백엔드 배포
1. `backend/` 빌드 설정 확인 (Procfile 또는 railway.json)
2. 환경변수 목록 정리: `DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS`
3. Railway 가입·프로젝트 생성 안내 (⏸ 로그인 필요)
4. PostgreSQL 애드온 추가 → `DATABASE_URL` 자동 주입 확인
5. `alembic upgrade head` 실행 방법 안내
6. 배포 URL 확인 → `/docs` 엔드포인트 테스트

### 2단계 — Vercel 프론트엔드 배포
1. `frontend/.env.production` 에 `VITE_API_URL=<Railway URL>` 설정
2. `npm run build` 로컬 확인
3. Vercel 가입·프로젝트 연결 안내 (⏸ 로그인 필요)
4. 환경변수 `VITE_API_URL` 등록
5. 배포 → 도메인 확인

### 3단계 — 연결 검증
playwright MCP로 Vercel 도메인 열어 두 시나리오(방문자·관리자) E2E 통과 확인.
