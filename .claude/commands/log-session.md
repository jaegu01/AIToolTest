# Command: log-session

현재 세션의 대화 기록을 저장하고 자동 커밋하는 명령어

## Description
Claude Code와의 대화 내용을 마크다운 파일로 저장합니다.
팀 학습 자료로 활용할 수 있도록 구조화된 형식으로 기록합니다.
**저장 후 자동으로 커밋합니다.**

## Usage
```
/log-session [topic]
```

## Instructions

### 1. 세션 정보 수집

- 현재 날짜/시간
- 세션 주제 (인자로 전달 또는 대화 내용에서 추론)

### 2. **자동 도구 사용 감지** (중요!)

대화 기록을 분석하여 **실제로 사용된** 모든 도구를 자동으로 감지합니다:

#### 감지 대상
| 카테고리 | 감지 방법 | 예시 |
|----------|----------|------|
| **MCP Servers** | `mcp__` 접두사가 붙은 도구 호출 | `mcp__plugin_context7_context7__query-docs` → context7 |
| **Plugins** | MCP 도구 이름에서 추출 | `mcp__plugin_playwright_playwright__` → playwright |
| **Tools** | 직접 호출된 도구 | `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `Task` |
| **Skills** | `/skill-name` 호출 또는 Skill 도구 | `/commit`, `/log-session` |
| **Agents** | Task 도구로 호출된 에이전트 | `subagent_type=Explore`, `ux-reviewer` |
| **WebSearch/WebFetch** | 웹 검색/페칭 도구 | 검색 쿼리, URL 기록 |

#### 감지 규칙
```
1. 대화 전체를 스캔하여 도구 호출 패턴 찾기
2. 각 도구별 호출 횟수 카운트
3. 도구 사용 목적/컨텍스트 요약
4. 명시적 호출 + 암시적 사용 모두 기록
```

### 3. 파일 생성

```
docs/conversation-logs/YYYY-MM-DD_[topic].md
```

### 4. 파일 형식

```markdown
# 세션 기록: [주제]

- **날짜**: YYYY-MM-DD
- **목표**: [이 세션의 목표]
- **결과**: [달성한 결과]

---

## 사용한 Claude Code 기능 (자동 감지)

### MCP Servers
| 서버 | 호출 횟수 | 용도 |
|------|----------|------|
| context7 | N회 | [용도 요약] |
| playwright | N회 | [용도 요약] |
| sequential-thinking | N회 | [용도 요약] |

### Plugins
| 플러그인 | 사용 여부 | 용도 |
|----------|----------|------|
| frontend-design | ✅/❌ | [용도] |
| playwright | ✅/❌ | [용도] |
| code-review | ✅/❌ | [용도] |

### Tools (Built-in)
| 도구 | 호출 횟수 | 용도 |
|------|----------|------|
| Read | N회 | 파일 읽기 |
| Write | N회 | 파일 생성 |
| Edit | N회 | 파일 수정 |
| Bash | N회 | 명령어 실행 |
| Glob | N회 | 파일 검색 |
| Grep | N회 | 내용 검색 |
| Task | N회 | 에이전트 호출 |
| WebSearch | N회 | 웹 검색 |
| WebFetch | N회 | URL 페칭 |

### Skills
| 스킬 | 호출 횟수 |
|------|----------|
| /commit | N회 |
| /log-session | N회 |
| /security-audit | N회 |

### Agents
| 에이전트 | 호출 여부 | 용도 |
|----------|----------|------|
| Explore | ✅/❌ | 코드베이스 탐색 |
| Plan | ✅/❌ | 구현 계획 |
| ux-reviewer | ✅/❌ | UX 분석 |
| error-log-analyzer | ✅/❌ | 에러 분석 |
| playwright-tester | ✅/❌ | E2E 테스트 |

---

## 주요 대화 내용

### Q1: [질문 요약]
**답변**: [답변 요약]

### Q2: [질문 요약]
**답변**: [답변 요약]

---

## 생성/수정된 파일

### 생성된 파일
- `path/to/file` - [설명]

### 수정된 파일
- `path/to/file` - [변경 내용]

---

## 배운 점 & 팁
1. [학습 포인트 1]
2. [학습 포인트 2]

---

## 다음 단계
- [ ] [후속 작업 1]
- [ ] [후속 작업 2]

---

*기록 생성: YYYY-MM-DD by Claude Code*
```

### 5. **자동 커밋** (필수)

- 생성된 로그 파일을 git add
- 커밋 메시지: `docs: 세션 기록 추가 - [topic]`
- 사용자 확인 없이 바로 커밋 진행

### 6. 완료 메시지 출력

```
✓ docs/conversation-logs/YYYY-MM-DD_[topic].md 생성됨
✓ 사용 감지: MCP(N개), Tools(N개), Skills(N개), Agents(N개)
✓ 커밋 완료: docs: 세션 기록 추가 - [topic]
```

## 도구 감지 예시

### 대화에서 감지되는 패턴

```xml
<!-- MCP 호출 감지 -->
<invoke name="mcp__plugin_context7_context7__resolve-library-id">
→ MCP: context7 사용

<!-- Bash 호출 감지 -->
<invoke name="Bash">
  <parameter name="command">npx playwright test</parameter>
→ Tool: Bash 사용

<!-- Task/Agent 호출 감지 -->
<invoke name="Task">
  <parameter name="subagent_type">Explore</parameter>
→ Agent: Explore 사용

<!-- Skill 호출 감지 -->
<invoke name="Skill">
  <parameter name="skill">commit</parameter>
→ Skill: /commit 사용
```

## Example

```
/log-session glassmorphism-ui-구현

✓ docs/conversation-logs/2024-01-20_glassmorphism-ui-구현.md 생성됨
✓ 사용 감지: MCP(2개), Tools(15개), Skills(1개), Agents(1개)
✓ 커밋 완료: docs: 세션 기록 추가 - glassmorphism-ui-구현
```

## Notes

- 사용되지 않은 도구는 테이블에서 생략하거나 ❌로 표시
- 호출 횟수가 0인 항목은 기록하지 않음
- 대화 컨텍스트가 요약된 경우에도 요약 내용에서 도구 사용 내역 추출
