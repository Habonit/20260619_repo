# 포트폴리오 풀스택 앱 구현 계획

## 목표
design/stitch_.zip 디자인 기준으로 React+TS 프론트엔드 + FastAPI+SQLite 백엔드를 구축한다.
Playwright E2E 테스트(사용자/관리자 시나리오) 통과가 완료 조건이다.

## 디자인 매핑
- `notion_1` → 홈/히어로 (Home)
- `about_notion` → 소개 (About)
- `notion_4` → 프로젝트 목록 (Projects Gallery)
- `notion_2` → 프로젝트 상세 (Project Detail)
- `notion_3` → 관리자 로그인 (Admin Login)
- `notion_5` → 관리자 대시보드 (Admin Dashboard)

## 디자인 시스템 핵심 값
- primary: `#21201a`
- background: `#f9f9f9`
- accent(tertiary-container → on-tertiary-container): `#50a0ff`
- container-max: 900px, sidebar-width: 240px
- 폰트: Inter (본문), Courier Prime (코드)

## Global Constraints
- 모든 코드·주석·커밋 메시지: **한국어**
- 백엔드: Python 3.11+, FastAPI, SQLAlchemy 2.0 async, Alembic, SQLite(개발)
- 프론트엔드: Node 18+, Vite, React 18, TypeScript strict, Tailwind CSS
- 관리자 초기 계정: username=`admin`, password=`admin1234`
- 관리자는 비밀번호를 대시보드에서 변경 가능
- CORS: 프론트(localhost:5173) 허용
- API base URL: `http://localhost:8000`
- JWT: Bearer 토큰, 만료 24시간

---

## Task 1: 백엔드 기반 세팅

### 목표
FastAPI 프로젝트 구조를 생성하고 DB 모델·마이그레이션·초기 데이터를 설정한다.

### 파일 구조
```
backend/
  app/
    core/
      config.py        # 환경변수, JWT 설정
      database.py      # SQLAlchemy async engine + session
      security.py      # JWT 발급/검증, 비밀번호 해싱
    models/
      user.py          # User 모델 (id, username, hashed_password)
      project.py       # Project 모델
      profile.py       # Profile 모델
    schemas/
      auth.py
      project.py
      profile.py
    api/
      v1/
        auth.py        # POST /api/v1/auth/login, POST /api/v1/auth/change-password
        projects.py    # CRUD
        profile.py     # GET/PUT
        __init__.py
      __init__.py
    main.py            # FastAPI app, CORS, 라우터 등록
  alembic/
    versions/
    env.py
  alembic.ini
  requirements.txt
  seed.py              # admin 초기 계정 시딩
```

### 모델 스펙
**User**: id(int PK), username(str unique), hashed_password(str), created_at

**Project**:
- id(int PK)
- title(str)
- description(str)
- period(str)  # "2023년 10월 - 2024년 2월 (5개월)"
- role(str)    # JSON array string: '["Frontend Lead", "UI/UX Designer"]'
- tech_stack(str)  # JSON array string
- content(str nullable)  # Notion-style rich text (HTML or markdown)
- github_url(str nullable)
- demo_url(str nullable)
- thumbnail_url(str nullable)
- emoji(str default "🚀")
- is_featured(bool default false)
- order(int default 0)
- created_at, updated_at

**Profile**:
- id(int PK, always 1)
- name(str)
- title(str)  # "AI Engineer"
- bio(str)
- skills(str)  # JSON array
- achievements(str)  # JSON array of {emoji, label, description}
- github_url(str nullable)
- linkedin_url(str nullable)
- twitter_url(str nullable)
- resume_url(str nullable)

### 초기 데이터 (seed.py)
- admin 계정: username=admin, password=admin1234 (bcrypt 해싱)
- Profile 1건: 김이삭 AI Engineer 프로필
- 샘플 Project 3건

### 수락 기준
- `cd backend && pip install -r requirements.txt && alembic upgrade head && python seed.py` 성공
- `uvicorn app.main:app --reload --port 8000` 실행 시 `/docs` 정상 접근

---

## Task 2: 백엔드 API 엔드포인트 구현

### 목표
모든 REST API 엔드포인트를 구현하고 pytest로 검증한다.

### 엔드포인트 스펙

**Auth** (`/api/v1/auth`)
- `POST /login` → body: {username, password} → {access_token, token_type}
- `POST /change-password` → (JWT 필요) body: {current_password, new_password} → 200 OK

**Profile** (`/api/v1/profile`)
- `GET /` → Profile 반환 (인증 불필요)
- `PUT /` → (JWT 필요) Profile 수정

**Projects** (`/api/v1/projects`)
- `GET /` → Project 목록 (order 기준 정렬, 인증 불필요)
- `GET /{id}` → Project 상세 (인증 불필요)
- `POST /` → (JWT 필요) 새 Project 생성
- `PUT /{id}` → (JWT 필요) Project 수정
- `DELETE /{id}` → (JWT 필요) Project 삭제

### 테스트 파일
`backend/tests/test_auth.py`, `test_projects.py`, `test_profile.py`

### 수락 기준
- `pytest backend/tests/ -v` 모두 통과
- 로그인 → 토큰 발급 → 인증 엔드포인트 접근 가능

---

## Task 3: 프론트엔드 기반 세팅

### 목표
Vite+React+TS 프로젝트를 생성하고 디자인 시스템·라우팅·상태관리를 설정한다.

### 파일 구조
```
frontend/
  src/
    components/
      layout/
        Header.tsx
        Footer.tsx
        Layout.tsx
    lib/
      api.ts          # axios 인스턴스, baseURL=http://localhost:8000
    store/
      authStore.ts    # Zustand: token, username, setAuth, clearAuth
    types/
      index.ts        # Project, Profile 타입
    pages/            # (Task 4, 5에서 채움)
    App.tsx
    main.tsx
  tailwind.config.js  # 디자인 토큰 적용
  vite.config.ts
  package.json
```

### Tailwind 디자인 토큰 (tailwind.config.js)
DESIGN.md의 colors, typography, spacing, borderRadius를 extend에 정확히 매핑한다.
주요 색상:
- primary: #21201a
- background: #f9f9f9
- on-tertiary-container: #50a0ff (accent)
- surface-container: #eeeeee
- outline-variant: #cbc6bc

### 공통 컴포넌트
- `Header.tsx`: Portfolio 로고 + Home/About/Projects 네비게이션 + search/account_circle 아이콘
- `Footer.tsx`: © 문구 + LinkedIn/GitHub/Twitter 링크
- `Layout.tsx`: Header + children + Footer 감싸기

### 수락 기준
- `cd frontend && npm install && npm run build` 성공 (타입 에러 없음)
- `npm run dev` 시 localhost:5173 에서 Header/Footer 표시됨

---

## Task 4: 프론트엔드 공개 페이지 구현

### 목표
방문자가 보는 4개 페이지를 design HTML을 기반으로 React 컴포넌트로 구현하고 API와 연동한다.

### 페이지 스펙

**Home (`/`)** — notion_1 기준
- 히어로: 이름/직함/bio + "프로젝트 보기" 버튼 → /projects + "이력서 다운로드" 버튼
- 주요 성과 3개 벤토 카드 (achievements 배열에서)
- 구분선
- Featured 이미지 섹션 (is_featured=true인 프로젝트 썸네일)
- 기술 스택 뱃지 목록 (skills 배열에서)

**About (`/about`)** — about_notion 기준
- 프로필 사진 섹션
- 이름/직함/bio
- 기술 스택 카드
- 링크 (GitHub, LinkedIn)

**Projects (`/projects`)** — notion_4 기준 (사이드바 없이 공개용은 갤러리만)
- 검색/필터 바
- auto-fill 갤러리 그리드 (gallery-grid: auto-fill minmax 280px)
- 각 카드: 썸네일 + 이모지 + 제목 + 기간 + 기술스택 뱃지
- 클릭 → /projects/{id}

**Project Detail (`/projects/:id`)** — notion_2 기준
- 커버 이미지 (thumbnail_url)
- 이모지 + 프로젝트 제목
- Properties 테이블: 기간, 역할, 기술스택
- 본문 content (HTML 렌더)
- GitHub/Demo 링크 버튼

### 수락 기준
- 각 페이지 정상 렌더링
- API 데이터 연동 (React Query useQuery)
- 라우팅 정상 동작

---

## Task 5: 프론트엔드 관리자 페이지 구현

### 목표
관리자 로그인 및 대시보드 페이지를 구현하고 JWT 인증 흐름을 연결한다.

### 페이지 스펙

**Admin Login (`/admin`)** — notion_3 기준
- 잠금 아이콘 + "관리자 로그인" 제목
- username/password 입력 필드
- "로그인" 버튼 → POST /api/v1/auth/login → 성공 시 토큰 저장 후 /admin/dashboard로 이동
- 실패 시 에러 메시지 표시

**Admin Dashboard (`/admin/dashboard`)** — notion_5 기준
- 좌측 사이드바: Profile / Experience / Projects / Settings 메뉴
  - Projects 메뉴 활성 상태 (기본)
  - Settings 메뉴 → 비밀번호 변경 모달 열기
- 메인 영역: 프로젝트 테이블
  - 컬럼: 이모지, 제목, 기간, 기술스택, 액션(수정/삭제)
  - "새 프로젝트 추가" 버튼 → 모달 폼
- JWT 없이 접근 시 /admin으로 리다이렉트

**비밀번호 변경 모달**
- 현재 비밀번호, 새 비밀번호, 확인 입력
- POST /api/v1/auth/change-password
- 성공 시 모달 닫기

**프로젝트 추가/수정 모달**
- 필드: emoji, title, period, role(쉼표 구분), tech_stack(쉼표 구분), description, content, github_url, demo_url, is_featured, order
- 저장 → POST 또는 PUT → React Query invalidate → 테이블 갱신

### 수락 기준
- admin/admin1234 로그인 성공 및 대시보드 이동
- 프로젝트 CRUD 동작
- 비밀번호 변경 동작
- 토큰 없이 대시보드 접근 불가

---

## Task 6: Playwright E2E 테스트 및 버그 수정

### 목표
playwright MCP로 실제 브라우저에서 두 시나리오를 검증하고 발견된 이슈를 수정한다.

### 사용자 시나리오
1. localhost:5173 접속 → 홈 페이지 로드 확인
2. 네비게이션 "About" 클릭 → About 페이지 확인
3. 네비게이션 "Projects" 클릭 → 프로젝트 갤러리 확인 (프로젝트 카드 최소 1개)
4. 프로젝트 카드 클릭 → 상세 페이지 확인 (제목, 기간, 기술스택 표시)
5. "프로젝트 보기" 버튼 (홈) → /projects 이동 확인

### 관리자 시나리오
1. localhost:5173/admin 접속 → 로그인 폼 확인
2. admin/admin1234 입력 → 로그인 → 대시보드 이동 확인
3. "새 프로젝트 추가" 버튼 → 모달 열림 확인
4. 프로젝트 정보 입력 → 저장 → 테이블에 추가됨 확인
5. 수정 버튼 → 모달 → 수정 → 반영 확인
6. 삭제 버튼 → 확인 → 테이블에서 제거 확인
7. Settings → 비밀번호 변경 모달 → 새 비밀번호 입력 → 성공 확인
8. 변경된 비밀번호로 재로그인 확인 (로그아웃 후)

### 수락 기준
- 두 시나리오 모두 Playwright 오류 없이 통과
