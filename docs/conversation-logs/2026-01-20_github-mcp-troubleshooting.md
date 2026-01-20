# 세션 기록: GitHub MCP 연결 문제 해결

- **날짜**: 2026-01-20
- **목표**: 프로젝트 상태 확인 및 GitHub MCP 연결 문제 해결
- **결과**: GitHub MCP 연결 실패 원인 파악 (GITHUB_TOKEN 환경 변수 미설정)

---

## 사용한 Claude Code 기능 (자동 감지)

### MCP Servers
| 서버 | 호출 횟수 | 용도 |
|------|----------|------|
| - | 0회 | 이번 세션에서는 MCP 서버 직접 호출 없음 |

### Plugins
| 플러그인 | 사용 여부 | 용도 |
|----------|----------|------|
| github | ❌ (연결 실패) | 연결 문제로 사용 불가 |

### Tools (Built-in)
| 도구 | 호출 횟수 | 용도 |
|------|----------|------|
| Read | 2회 | 설정 파일 확인 (.claude/settings.json) |
| Bash | 2회 | 환경 변수 확인 |
| Glob | 1회 | 기존 로그 파일 검색 |
| Write | 1회 | 세션 기록 생성 |

### Skills
| 스킬 | 호출 횟수 |
|------|----------|
| /log-session | 1회 |

### Agents
| 에이전트 | 호출 여부 | 용도 |
|----------|----------|------|
| - | ❌ | 이번 세션에서는 에이전트 미사용 |

---

## 주요 대화 내용

### Q1: 프로젝트가 잘 돌아가는지 어떻게 확인하나요?
**답변**:
- `npm run dev` - 개발 서버 실행 후 localhost:3000 접속
- `npm run build` - 프로덕션 빌드 테스트
- `npm run lint` / `npm run type-check` - 코드 품질 검사
- `npm test` - 테스트 실행

### Q2: GitHub MCP가 왜 연결되지 않나요?
**답변**:
- **원인**: `GITHUB_TOKEN` 환경 변수가 설정되지 않음
- **해결 방법**:
  1. GitHub Personal Access Token 생성 (Settings → Developer settings → Personal access tokens)
  2. 필요 권한: `repo`, `read:org`
  3. 환경 변수 설정: `[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', '토큰', 'User')`
  4. Claude Code 재시작

---

## 생성/수정된 파일

### 수정된 파일
- `CLAUDE.md` - Workflow Rules 섹션 업데이트 (자동 커밋 규칙 변경)

### 생성된 파일
- `docs/conversation-logs/2026-01-20_github-mcp-troubleshooting.md` - 현재 세션 기록

---

## 배운 점 & 팁

1. **GitHub MCP 필수 설정**: GitHub MCP 플러그인은 `GITHUB_TOKEN` 또는 `GITHUB_PERSONAL_ACCESS_TOKEN` 환경 변수가 반드시 필요
2. **환경 변수 영구 설정**: PowerShell에서 `[System.Environment]::SetEnvironmentVariable()` 사용 시 'User' 스코프로 영구 저장 가능
3. **MCP 연결 문제 디버깅**: `/mcp` 명령으로 MCP 서버 연결 상태 확인 가능

---

## 다음 단계
- [ ] GitHub Personal Access Token 생성
- [ ] GITHUB_TOKEN 환경 변수 설정
- [ ] Claude Code 재시작 후 GitHub MCP 연결 확인
- [ ] 프로젝트 빌드/테스트 실행

---

*기록 생성: 2026-01-20 by Claude Code*
