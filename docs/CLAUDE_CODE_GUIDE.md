# Claude Code 고급 기능 가이드

이 문서는 Claude Code의 고급 기능들을 팀원에게 공유하기 위해 작성되었습니다.

---

## 목차

1. [MCP (Model Context Protocol)](#1-mcp-model-context-protocol)
2. [Agents](#2-agents)
3. [Skills](#3-skills)
4. [Custom Commands](#4-custom-commands)
5. [유용한 팁](#5-유용한-팁)

---

## 1. MCP (Model Context Protocol)

### 개념
MCP는 Claude Code가 외부 서비스와 통신할 수 있게 해주는 프로토콜입니다.
다양한 MCP 서버를 연결하여 Claude의 기능을 확장할 수 있습니다.

### 설정 방법
```bash
# MCP 서버 추가
claude mcp add <server-name> -- <command>

# 예시: Context7 추가 (라이브러리 문서 조회)
claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp

# MCP 서버 목록 확인
claude mcp list

# MCP 서버 제거
claude mcp remove <server-name>
```

### 주요 MCP 서버

#### Context7 (라이브러리 문서)
```bash
# 설치
claude mcp add context7 -- npx -y @anthropic-ai/context7-mcp
```

**사용 예시**:
```
"Next.js App Router의 최신 문서를 찾아줘"
"Framer Motion의 useScroll 훅 사용법을 알려줘"
```

**내부 동작**:
1. `resolve-library-id`: 라이브러리 ID 조회
2. `query-docs`: 해당 라이브러리 문서에서 검색

#### Obsidian MCP (노트 관리)
```bash
# 설치 (Obsidian 사용 시)
claude mcp add obsidian -- npx -y obsidian-mcp
```

**사용 예시**:
```
"Obsidian에 오늘 개발 노트를 저장해줘"
"프로젝트 관련 노트를 검색해줘"
```

#### Playwright MCP (브라우저 테스트)
```bash
# 설치
claude mcp add playwright -- npx -y @anthropic-ai/playwright-mcp
```

**사용 예시**:
```
"로그인 페이지를 테스트해줘"
"버튼 클릭 후 화면을 스크린샷 찍어줘"
```

#### GitHub MCP (GitHub 연동)
```bash
# 설치
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

**사용 예시**:
```
"이 이슈의 댓글을 확인해줘"
"PR #123의 변경사항을 분석해줘"
```

---

## 2. Agents

### 개념
Agent는 복잡한 멀티스텝 작업을 자율적으로 처리하는 특수 프로세스입니다.
각 Agent는 특정 도구와 기능에 접근할 수 있습니다.

### 기본 제공 Agents

| Agent Type | 용도 | 접근 가능 도구 |
|------------|------|----------------|
| **Explore** | 코드베이스 탐색 | Glob, Grep, Read |
| **Plan** | 구현 계획 설계 | 모든 도구 |
| **Bash** | 명령어 실행 | Bash |
| **general-purpose** | 복잡한 검색/작업 | 모든 도구 |

### 사용 방법

```
# 탐색 요청 시 자동으로 Explore Agent 호출
"이 프로젝트의 인증 로직이 어디에 있어?"

# 계획 수립 시 Plan Agent 호출
"사용자 프로필 기능 구현 계획을 세워줘"
```

### 커스텀 Agent 만들기

`.claude/agents/` 디렉토리에 마크다운 파일로 정의합니다.

**예시: error-log-analyzer.md**
```markdown
# Error Log Analyzer Agent

## 목적
에러 로그를 분석하고 근본 원인을 파악합니다.

## 절차
1. 환경 설정 확인 (package.json, tsconfig.json 등)
2. 에러 메시지 파싱
3. 스택 트레이스 분석
4. 관련 코드 탐색
5. 해결 방안 제시

## 출력 형식
- **에러 유형**: [에러 분류]
- **근본 원인**: [원인 설명]
- **해결 방안**: [단계별 해결책]
- **우선순위**: [High/Medium/Low]
```

---

## 3. Skills

### 개념
Skill은 특정 작업을 위한 사전 정의된 프롬프트/워크플로우입니다.
`/skill-name` 형식으로 호출합니다.

### 기본 제공 Skills

#### /commit
```
# 사용법
/commit

# 기능
- git diff 분석
- Conventional Commits 형식의 메시지 생성
- 변경사항 요약
```

#### /security-audit
```
# 사용법
/security-audit

# 기능
- 코드 보안 취약점 검사
- 의존성 취약점 분석
- OWASP Top 10 체크
```

### 커스텀 Skill 만들기

`.claude/skills/` 디렉토리에 마크다운 파일로 정의합니다.

**예시: calc-test.md**
```markdown
# Calculator Test Skill

## 트리거
`/calc-test` 또는 "계산기 테스트"

## 절차
1. 모든 계산기 컴포넌트 찾기
2. 단위 테스트 실행
3. E2E 테스트 실행
4. 결과 요약 보고

## 테스트 케이스
- 기본 연산: 1+1, 10-5, 3*4, 8/2
- 고급 연산: sin(90), log(10), 2^10
- 엣지 케이스: 0으로 나누기, 음수 제곱근
```

---

## 4. Custom Commands

### 개념
Custom Command는 자주 사용하는 작업을 슬래시 명령어로 정의합니다.
`.claude/commands/` 디렉토리에 저장합니다.

### 만들기

**예시: log-session.md**
```markdown
# Log Session Command

현재 세션의 대화를 문서화합니다.

## 실행 내용
1. 오늘 날짜와 주제로 파일명 생성
2. 세션 목표 정리
3. 사용한 Claude Code 기능 목록화
4. 주요 Q&A 요약
5. 생성된 파일 목록
6. 배운 점 정리

## 저장 위치
`docs/conversation-logs/YYYY-MM-DD_topic.md`
```

### 호출 방법
```
/log-session
```

---

## 5. 유용한 팁

### 5.1 효율적인 검색

```
# 나쁜 예: 직접 검색 (컨텍스트 많이 사용)
"src 폴더에서 useAuth가 있는 파일을 찾아줘"

# 좋은 예: Explore Agent 활용 (컨텍스트 효율적)
"인증 관련 훅이 어디에 정의되어 있어?"
```

### 5.2 TodoWrite 활용

```
# 복잡한 작업 전 계획 수립
"이 기능을 구현하기 전에 할일 목록을 만들어줘"

# 진행 상황 추적
TodoWrite로 작업 상태를 실시간 업데이트
```

### 5.3 Context7 활용

```
# 라이브러리 문서 조회 시
"Context7으로 React Query의 useQuery 옵션을 찾아줘"

# 벤치마크 점수로 라이브러리 비교
"Recharts와 Chart.js 중 어떤 게 더 좋아?"
```

### 5.4 병렬 작업

```
# 여러 파일 동시 읽기
"package.json과 tsconfig.json을 동시에 읽어줘"

# 여러 검색 동시 실행
"인증 코드와 API 코드를 동시에 찾아줘"
```

### 5.5 AskUserQuestion 활용

```
# 선택지 제공 시
- options에 description 추가로 설명 제공
- multiSelect: true로 복수 선택 허용
- header로 짧은 라벨 제공
```

---

## 프로젝트별 설정

### CLAUDE.md 필수 섹션
```markdown
# Project Name

## Commands
빌드, 테스트, 개발 서버 명령어

## Architecture
코드 구조 및 패턴

## Tech Stack
사용 기술 목록

## Active MCP Servers
프로젝트에서 사용하는 MCP

## Custom Agents/Skills
프로젝트 전용 Agent/Skill
```

### 디렉토리 구조
```
.claude/
├── commands/           # 커스텀 명령어
│   └── command-name.md
├── skills/             # 커스텀 스킬
│   └── skill-name.md
├── agents/             # 커스텀 에이전트
│   └── agent-name.md
└── settings.json       # 프로젝트 설정
```

---

## 실전 예제

### 예제 1: 새 기능 개발 플로우

```
1. 계획 수립
   "사용자 프로필 페이지 구현 계획을 세워줘"
   → Plan Agent가 구현 계획 제시

2. 코드 탐색
   "기존 페이지 컴포넌트 구조를 분석해줘"
   → Explore Agent가 코드베이스 탐색

3. 문서 참조
   "shadcn/ui의 Card 컴포넌트 사용법을 알려줘"
   → Context7 MCP로 최신 문서 조회

4. 구현
   "프로필 페이지를 구현해줘"
   → 코드 작성

5. 커밋
   /commit
   → Conventional Commits 형식 메시지 생성
```

### 예제 2: 버그 수정 플로우

```
1. 에러 분석
   "이 에러 로그를 분석해줘: [에러 내용]"
   → error-log-analyzer Agent 활용

2. 코드 탐색
   "관련 코드를 찾아줘"
   → Explore Agent로 관련 파일 탐색

3. 수정
   "이 버그를 수정해줘"
   → 코드 수정

4. 보안 검사
   /security-audit
   → 보안 취약점 확인

5. 커밋
   /commit
```

---

## 추가 학습 자료

- [Claude Code 공식 문서](https://docs.anthropic.com/claude-code)
- [MCP 스펙](https://modelcontextprotocol.io)
- [이 프로젝트의 대화 기록](./conversation-logs/)

---

*Last updated: 2025-01-16*
