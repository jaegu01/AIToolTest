# GlassCalc Pro

Glassmorphism 스타일의 다기능 계산기 프로젝트

## Features

### 12종 계산기
- **Engineering** - 공학용 계산기 (삼각함수, 로그, 지수)
- **Financial** - 금융 계산기 (대출, 복리, 투자)
- **Graph** - 그래프 계산기 (함수 시각화)
- **Unit** - 단위 변환기 (길이, 무게, 온도, 압력, 데이터)
- **Programmer** - 프로그래머 계산기 (진법 변환, 비트 연산)
- **Statistics** - 통계 계산기 (평균, 표준편차, 회귀분석)
- **DateTime** - 날짜/시간 계산기 (D-Day, 나이, 타임존)
- **Matrix** - 행렬 계산기 (행렬 연산, 역행렬, 고유값)
- **Physics** - 물리 계산기 (운동, 힘, 에너지, 전기)
- **Chemistry** - 화학 계산기 (분자량, 몰, pH)
- **Health** - 건강 계산기 (BMI, BMR, 심박수)
- **Color** - 색상 계산기 (HEX, RGB, HSL 변환)

### UI/UX
- Glassmorphism 디자인
- 3D 효과 (Three.js)
- 파티클 배경 (tsparticles)
- 6가지 테마
- 4가지 사운드 테마
- 햅틱 피드백
- 커맨드 팔레트 (Ctrl+K)

### 다국어 지원
- 한국어 (ko)
- English (en)
- 日本語 (ja)
- 简体中文 (zh-CN)
- 繁體中文 (zh-TW)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + shadcn/ui
- **Animation**: Framer Motion
- **3D**: Three.js + React Three Fiber
- **State**: Zustand
- **Database**: Dexie.js (IndexedDB)
- **i18n**: next-intl
- **Math**: Math.js
- **Charts**: Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## Project Structure

```
src/
├── app/[locale]/           # 12개 계산기 라우트
├── components/
│   ├── ui/                 # 기본 UI 컴포넌트
│   ├── calculator/         # 계산기 컴포넌트
│   ├── 3d/                 # Three.js 컴포넌트
│   ├── animations/         # 파티클/효과
│   └── providers/          # Context Providers
├── hooks/                  # 커스텀 React 훅
├── stores/                 # Zustand 스토어
├── services/               # 서비스 레이어
├── lib/                    # 유틸리티 함수
├── i18n/                   # 다국어 설정
└── styles/                 # 전역 스타일
```

## Claude Code Integration

이 프로젝트는 Claude Code의 고급 기능을 활용합니다:

- **Custom Skills**: calc-test, i18n-check, perf-audit 등
- **Custom Agents**: performance-optimizer, accessibility-expert 등
- **Custom Commands**: /log-session, /review-code 등
- **MCP Servers**: context7, playwright 등

자세한 내용은 `CLAUDE.md`를 참조하세요.

## License

MIT
