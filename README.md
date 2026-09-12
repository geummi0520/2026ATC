# 2026 ATC Web

2026 ATC(Art & Technology Conference) 공식 웹사이트 프론트엔드 프로젝트입니다.

## 기술 스택

- Next.js 16
- React 19
- JavaScript
- App Router
- styled-components
- ESLint

## 시작하기

### 1. 의존성 설치

프로젝트 루트에서 다음 명령어를 실행합니다.

```bash
npm ci
```

`package-lock.json`을 갱신해야 하는 경우에는 `npm install`을 사용합니다.

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 3. 코드 검사

```bash
npm run lint
```

### 4. Production build 확인

```bash
npm run build
```

### 5. Production 서버 실행

먼저 build를 완료한 후 실행합니다.

```bash
npm run start
```

## 주요 경로

| URL                | 페이지              |
| ------------------ | ------------------- |
| `/`                | Main 및 Onboarding  |
| `/about`           | About               |
| `/works`           | Works 목록과 배치도 |
| `/works/[workId]`  | 작품 상세           |
| `/program`         | Program             |
| `/archive/staff`   | Staff Credit        |
| `/archive/artist`  | Artist Credit       |
| `/archive/artbook` | Artbook             |

`/archive` 자체 페이지는 사용하지 않습니다. Works 목록과 배치도는 별도 route를 만들지 않고 `/works` 안에서 view mode로 전환합니다.

## 폴더 구조

```text
2026-atc-web
├── public
│   ├── icons       # SVG 아이콘
│   ├── images      # 그래픽, 작품 및 배경 이미지
│   ├── logo        # ATC 및 협력사 로고
│   └── fonts       # 로컬 폰트
│
├── src
│   ├── app         # App Router 페이지와 레이아웃
│   │   ├── layout.jsx
│   │   └── (main)  # URL에 포함되지 않는 공통 Layout route group
│   ├── components
│   │   ├── common  # 여러 페이지에서 실제로 재사용하는 UI
│   │   ├── layout  # 페이지 전체 배치 구조
│   │   ├── onboarding
│   │   ├── main
│   │   ├── about
│   │   ├── works
│   │   ├── program
│   │   └── archive
│   ├── constants   # route 등 반복해서 사용하는 고정값
│   ├── data        # 작품과 프로그램 등 실제 콘텐츠 데이터
│   ├── hooks       # React Hook 기반 재사용 로직
│   ├── lib         # 외부 라이브러리와 전역 Provider 설정
│   ├── locales     # 공통 UI의 한국어·영어 문구
│   ├── styles      # 전역 스타일, 디자인 토큰, media helper
│   └── utils       # React와 무관한 공통 함수
│
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
└── package.json
```

## 폴더 사용 규칙

### `src/app`

- `page.jsx`와 `layout.jsx`는 routing과 컴포넌트 조합만 담당합니다.
- 실제 UI와 인터랙션은 가능한 한 `src/components`에서 구현합니다.
- 공통 `MainLayout`은 `src/app/(main)/layout.jsx`에서 적용합니다.
- `(main)`은 route group이므로 실제 URL에는 포함되지 않습니다.

### `src/components`

- 페이지 전용 컴포넌트는 해당 페이지 이름의 폴더에서 관리합니다.
- 두 개 이상의 페이지에서 실제로 사용하는 UI만 `common`에 둡니다.
- 간단한 컴포넌트는 `ComponentName.jsx` 한 파일로 관리할 수 있습니다.
- 스타일이 길어져 분리가 필요한 경우에만 다음 구조를 사용합니다.

```text
ComponentName
├── index.jsx
└── styles.js
```

### `src/data`와 `src/locales`

- 작품명과 작품 설명 같은 콘텐츠 번역은 `data`에서 관리합니다.
- Navigation과 Button 같은 공통 UI 문구는 `locales`에서 관리합니다.
- Works Gallery, Map, Detail은 동일한 작품 데이터를 공유합니다.

### `src/styles`

- `GlobalStyle.js`: reset과 기본 element 스타일
- `theme.js`: light/dark 디자인 토큰과 공통 breakpoint
- `media.js`: 공통 media query helper
- 컴포넌트 전용 스타일을 전역 스타일에 추가하지 않습니다.
- 현재 CSS 기준은 `1rem = 10px`입니다.
- border와 breakpoint는 `px`을 사용합니다.

### 파일 이름과 확장자

- JSX가 포함된 파일은 `.jsx`를 사용합니다.
- JSX가 없는 일반 JavaScript 파일은 `.js`를 사용합니다.
- React 컴포넌트 이름은 PascalCase를 사용합니다.
- Hook은 `use` 접두어를 사용합니다.
- 상수는 `UPPER_SNAKE_CASE`를 사용합니다.
- import는 가능한 한 `@/*` alias를 사용합니다.
