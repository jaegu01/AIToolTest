# GlassCalc Pro - 프로젝트 계획서

## 프로젝트 개요

**목표**: Claude Code의 고급 기능(Agent, Skill, MCP)을 활용한 멋진 UI/UX의 다기능 계산기 개발

**목적**:
1. Claude Code의 Agent, Skill, MCP 등 고급 기능 사용법을 팀원에게 공유
2. Glassmorphism 스타일의 세련된 UI/UX 구현
3. 개발 과정의 대화 기록을 체계적으로 정리하여 학습 자료로 활용

---

## 기술 스택

### Core
| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 15.x | React 프레임워크, App Router |
| **TypeScript** | 5.x | 타입 안정성 |
| **Tailwind CSS** | 3.x | 유틸리티 기반 스타일링 |

### UI/UX
| 라이브러리 | 용도 | 선택 이유 |
|------------|------|-----------|
| **shadcn/ui** | UI 컴포넌트 | Copy-paste 방식, 완전 커스터마이징 가능 |
| **Radix UI** | 접근성 컴포넌트 | WAI-ARIA 표준 준수 |
| **Framer Motion** | 애니메이션 | React 최적화, 선언적 API |
| **Lucide Icons** | 아이콘 | 벤치마크 93.5점, 미니멀 디자인 |

### 계산 & 시각화
| 라이브러리 | 용도 | 선택 이유 |
|------------|------|-----------|
| **Math.js** | 수식 파싱/계산 | 벤치마크 96.9점 최고 품질 |
| **Recharts** | 함수 그래프 | React 최적화, 반응형 지원 |

---

## 기능 명세

### 1. 공학용 계산기
- 기본 사칙연산
- 삼각함수 (sin, cos, tan, arcsin, arccos, arctan)
- 로그/지수 (log, ln, e^x, 10^x)
- 팩토리얼, 순열, 조합
- 복소수 연산
- 각도/라디안 변환
- 메모리 기능 (M+, M-, MR, MC)
- 계산 히스토리

### 2. 금융 계산기
- 대출 이자 계산 (원리금균등, 원금균등)
- 복리 계산기
- 투자 수익률 (ROI, IRR)
- 환율 변환
- 세금 계산기

### 3. 그래프 계산기
- 함수 입력 (y = f(x) 형태)
- 실시간 그래프 렌더링
- 줌/패닝 기능
- 여러 함수 동시 표시
- 교점, 극값 표시
- 그래프 내보내기 (PNG/SVG)

---

## UI/UX 디자인

### Glassmorphism 스타일 가이드

```css
/* 기본 Glass 카드 */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 버튼 호버 효과 */
.glass-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

### 색상 팔레트
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Violet)
- **Background Gradient**: `linear-gradient(135deg, #667eea, #764ba2)`
- **Glass White**: `rgba(255, 255, 255, 0.15)`
- **Border**: `rgba(255, 255, 255, 0.2)`

### 애니메이션 원칙
- 버튼 클릭: 스케일 축소 → 복귀 (0.95 → 1.0)
- 페이지 전환: 페이드 + 슬라이드 (300ms)
- 결과 표시: 숫자 롤링 애니메이션
- 로딩: 펄스 애니메이션

---

## 프로젝트 구조

```
TestProject/
├── .claude/
│   ├── commands/           # 커스텀 슬래시 명령어
│   │   ├── log-session.md  # 세션 로깅 명령어
│   │   └── review-code.md  # 코드 리뷰 명령어
│   ├── skills/             # 프로젝트별 스킬
│   │   └── calc-test.md    # 계산기 테스트 스킬
│   └── agents/
│       └── error-log-analyzer.md
├── docs/
│   ├── PROJECT_PLAN.md     # 이 문서
│   ├── CLAUDE_CODE_GUIDE.md # Claude Code 고급 기능 가이드
│   ├── conversation-logs/   # 대화 기록 저장
│   │   └── YYYY-MM-DD_topic.md
│   └── api/                # API 문서
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── engineering/    # 공학용 계산기
│   │   ├── financial/      # 금융 계산기
│   │   └── graph/          # 그래프 계산기
│   ├── components/
│   │   ├── ui/             # shadcn/ui 컴포넌트
│   │   ├── calculator/     # 계산기 컴포넌트
│   │   └── graph/          # 그래프 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   ├── lib/                # 유틸리티
│   │   ├── calculator.ts   # 계산 로직
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── tests/
│   ├── unit/               # 단위 테스트
│   └── e2e/                # E2E 테스트
├── scripts/
│   └── setup.sh            # 초기 설정 스크립트
├── .env.example
├── .gitignore
├── CLAUDE.md
├── package.json
└── README.md
```

---

## 개발 단계

### Phase 1: 프로젝트 설정 (Day 1)
- [ ] Next.js + TypeScript 초기화
- [ ] Tailwind CSS 설정
- [ ] shadcn/ui 설정
- [ ] 기본 레이아웃 구성
- [ ] Glassmorphism 테마 설정

### Phase 2: 공학용 계산기 (Day 2-3)
- [ ] 계산기 UI 구현
- [ ] Math.js 연동
- [ ] 기본 연산 기능
- [ ] 고급 함수 (삼각함수, 로그)
- [ ] 히스토리 기능
- [ ] 애니메이션 적용

### Phase 3: 금융 계산기 (Day 4)
- [ ] 대출 계산기 UI/로직
- [ ] 복리 계산기
- [ ] 투자 수익률 계산기

### Phase 4: 그래프 계산기 (Day 5-6)
- [ ] 함수 입력 파서
- [ ] Recharts 연동
- [ ] 실시간 그래프 렌더링
- [ ] 줌/패닝 기능
- [ ] 다중 함수 표시

### Phase 5: 통합 & 최적화 (Day 7)
- [ ] 페이지 간 네비게이션
- [ ] 반응형 디자인
- [ ] 성능 최적화
- [ ] 테스트 작성
- [ ] 문서화

---

## Claude Code 활용 계획

### 사용할 고급 기능

#### 1. MCP (Model Context Protocol)
- **Context7**: 라이브러리 최신 문서 조회
- **Obsidian MCP**: 개발 노트 및 대화 기록 저장
- **Browser MCP**: UI 테스트 자동화

#### 2. Custom Agents
- **error-log-analyzer**: 에러 분석 및 디버깅
- **Explore Agent**: 코드베이스 탐색
- **Plan Agent**: 구현 계획 수립

#### 3. Custom Skills
- **/commit**: 커밋 메시지 자동 생성
- **/security-audit**: 보안 취약점 검사
- 커스텀 스킬 추가 예정

#### 4. Custom Commands
- `/log-session`: 현재 세션 대화 기록
- `/review-code`: 코드 리뷰 요청

---

## 대화 기록 관리

### 기록 형식
각 세션의 대화 기록은 다음 형식으로 저장:

```markdown
# [날짜] 세션 제목

## 목표
- 이번 세션에서 달성할 목표

## 사용한 Claude Code 기능
- 사용한 Agent, Skill, MCP 목록

## 주요 대화 내용
- 핵심 질문과 답변 요약

## 결과물
- 생성/수정된 파일 목록

## 배운 점
- 새로 알게 된 기능이나 팁
```

### 기록 폴더 구조
```
docs/conversation-logs/
├── 2025-01-16_project-setup.md
├── 2025-01-17_engineering-calc.md
└── ...
```

---

## 성공 지표

1. **기능 완성도**: 모든 계산기 기능 정상 동작
2. **UI/UX 품질**: Glassmorphism 스타일 일관성
3. **문서화**: 모든 세션 대화 기록 완료
4. **학습 자료**: 팀원이 이해할 수 있는 가이드 완성
5. **코드 품질**: TypeScript 에러 0, 린트 경고 0

---

*작성일: 2025-01-16*
*마지막 업데이트: 2025-01-16*
