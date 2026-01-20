# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GlassCalc Pro** - Glassmorphism 스타일의 다기능 계산기 프로젝트

### 목적
1. Claude Code 고급 기능(Agent, Skill, MCP) 활용법 팀 공유
2. 세련된 UI/UX의 계산기 구현
3. 개발 과정 대화 기록을 학습 자료로 정리

### 계산기 종류
- **공학용 계산기**: 삼각함수, 로그, 지수 등
- **금융 계산기**: 대출, 복리, 투자 수익률
- **그래프 계산기**: 함수 그래프 시각화

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.x |
| Styling | Tailwind CSS 3.x |
| UI Components | shadcn/ui, Radix UI |
| Animation | Framer Motion |
| Icons | Lucide Icons |
| Math | Math.js |
| Charts | Recharts |

---

## Commands

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 린트 검사
npm run lint

# 타입 체크
npm run type-check
```

---

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈 (계산기 선택)
│   ├── engineering/        # 공학용 계산기
│   ├── financial/          # 금융 계산기
│   └── graph/              # 그래프 계산기
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── calculator/         # 계산기 전용 컴포넌트
│   └── graph/              # 그래프 전용 컴포넌트
├── hooks/                  # 커스텀 React 훅
├── lib/
│   ├── calculator.ts       # 계산 로직 (Math.js 래퍼)
│   └── utils.ts            # 유틸리티 함수
└── styles/
    └── globals.css         # 전역 스타일, Glassmorphism
```

---

## Active MCP Servers

| Server | Purpose |
|--------|---------|
| **context7** | 라이브러리 최신 문서 조회 |
| **obsidian-mcp** | 개발 노트 및 대화 기록 저장 |
| **Claude_in_Chrome** | UI 테스트 및 브라우저 자동화 |

---

## Custom Agents

### error-log-analyzer
Located in `.claude/agents/error-log-analyzer.md`

에러 로그 분석 및 디버깅용 에이전트:
- 환경 설정 평가
- 에러 메시지/스택 트레이스 분석
- 근본 원인 vs 증상 식별
- 우선순위별 권장 조치 제공

**호출**: Task 도구 사용 또는 에러 발생 시 자동 실행

---

## Custom Skills

### /commit
커밋 메시지 자동 생성 (Conventional Commits 형식)

### /security-audit
코드 및 의존성 보안 취약점 검사

---

## Custom Commands (예정)

| Command | Description |
|---------|-------------|
| `/log-session` | 현재 세션 대화를 docs/conversation-logs/에 저장 |
| `/review-code` | 코드 리뷰 요청 및 피드백 생성 |

---

## Conversation Logging

모든 개발 세션의 대화 기록은 `docs/conversation-logs/`에 저장됩니다.

### 파일명 규칙
```
YYYY-MM-DD_session-topic.md
```

### 기록 내용
- 세션 목표
- 사용한 Claude Code 기능 (Agent, Skill, MCP)
- 주요 질문과 답변
- 생성/수정된 파일
- 배운 점과 팁

---

## Environment Variables

프로젝트에 필요한 환경 변수 (`.env.example` 참조):

```
# 없음 - 현재 로컬 전용 프로젝트
```

---

## Key Patterns

### Glassmorphism 스타일
```tsx
// Tailwind 클래스 조합
className="backdrop-blur-md bg-white/15 border border-white/20 rounded-xl"
```

### 애니메이션 패턴
```tsx
// Framer Motion 기본 패턴
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### 계산 로직 패턴
```tsx
// Math.js 사용
import { evaluate } from 'mathjs'
const result = evaluate('sin(45 deg) ^ 2')
```

---

## Workflow Rules (Claude 행동 규칙)

### 코드 수정 후 커밋
- 코드 수정 작업이 완료되면 **반드시** 사용자에게 "커밋할까요?" 확인
- 사용자가 승인하면 `/commit` 스킬을 사용하여 커밋 진행
- Conventional Commits 형식 준수

### 대화 로깅
- 중요한 기능 구현이나 학습 포인트가 있는 세션은 `docs/conversation-logs/`에 기록
- Claude Code 기능 활용 예시는 특히 상세히 기록

---

## Claude Code 기능 활용 가이드

이 섹션은 팀원들에게 Claude Code의 고급 기능 사용법을 공유하기 위한 가이드입니다.

### 1. MCP (Model Context Protocol) Servers

MCP 서버는 Claude에게 외부 도구와 데이터 소스에 대한 접근 권한을 부여합니다.

#### 설정 방법
```bash
# MCP 서버 추가
claude mcp add <서버명> -- <실행 명령어>

# 예시: Context7 (라이브러리 문서 조회)
claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp

# 설정 확인
claude mcp list
```

#### 현재 프로젝트에서 사용 중인 MCP
| Server | 용도 | 사용 예시 |
|--------|------|----------|
| `context7` | 최신 라이브러리 문서 조회 | "Next.js 15의 App Router 사용법 알려줘" |
| `obsidian-mcp` | 개발 노트 저장 | 대화 기록을 옵시디언에 저장 |
| `Claude_in_Chrome` | 브라우저 자동화 | UI 테스트, 스크린샷 |

#### 활용 팁
- `context7`는 공식 문서를 실시간으로 조회하므로 최신 API 정보 확인에 유용
- MCP 도구는 Claude가 자동으로 적절한 상황에서 사용

---

### 2. Custom Skills (슬래시 명령어)

Skills는 반복적인 작업을 자동화하는 사용자 정의 명령어입니다.

#### 기본 제공 Skills
| Skill | 설명 | 사용법 |
|-------|------|--------|
| `/commit` | 변경사항 분석 후 커밋 메시지 자동 생성 | 코드 수정 후 `/commit` 입력 |
| `/security-audit` | 보안 취약점 검사 | PR 전 `/security-audit` 실행 |

#### 커스텀 Skill 생성
```
위치: .claude/skills/<skill-name>.md
```

```markdown
# Skill: my-skill

## Description
이 스킬이 하는 일 설명

## Instructions
Claude가 따라야 할 지시사항
```

---

### 3. Custom Agents (전문 에이전트)

Agent는 특정 작업에 특화된 자율적 하위 프로세스입니다.

#### 현재 프로젝트의 Agent
- **error-log-analyzer**: 에러 로그 분석 및 디버깅 전문

#### Agent 정의 방법
```
위치: .claude/agents/<agent-name>.md
```

#### Agent 호출 방법
Claude가 Task 도구를 통해 자동으로 적절한 Agent를 호출하거나,
명시적으로 요청 가능: "error-log-analyzer 에이전트로 이 에러 분석해줘"

---

### 4. Hooks (자동화 트리거)

Hooks는 특정 이벤트 발생 시 자동으로 실행되는 스크립트입니다.

#### Hook 유형
| Hook | 트리거 시점 |
|------|------------|
| `PreToolUse` | 도구 실행 전 |
| `PostToolUse` | 도구 실행 후 |
| `Notification` | 알림 발생 시 |

#### 설정 위치
```
.claude/settings.json 또는 ~/.claude/settings.json
```

#### 예시: 파일 수정 후 린트 자동 실행
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npm run lint --fix"
      }
    ]
  }
}
```

---

### 5. Settings 커스터마이징

#### 프로젝트별 설정
```
위치: .claude/settings.json
```

#### 주요 설정 항목
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)"],
    "deny": ["Bash(rm -rf *)"]
  },
  "statusLine": {
    "type": "command",
    "command": "..."
  }
}
```

---

### 6. 유용한 명령어 모음

| 명령어 | 설명 |
|--------|------|
| `/help` | 도움말 보기 |
| `/status` | 현재 설정 상태 확인 |
| `/compact` | 컨텍스트 압축 (토큰 절약) |
| `/clear` | 대화 초기화 |
| `/model` | 모델 변경 |

---

## Documentation

- **프로젝트 계획서**: `docs/PROJECT_PLAN.md`
- **Claude Code 가이드**: `docs/CLAUDE_CODE_GUIDE.md`
- **대화 기록**: `docs/conversation-logs/`

---

*Last updated: 2025-01-20*
