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

1. 세션 정보 수집:
   - 현재 날짜/시간
   - 세션 주제 (인자로 전달 또는 추론)
   - 사용된 Claude Code 기능

2. 파일 생성:
   ```
   docs/conversation-logs/YYYY-MM-DD_[topic].md
   ```

3. 파일 형식:
   ```markdown
   # 세션 기록: [주제]

   - **날짜**: YYYY-MM-DD
   - **목표**: [이 세션의 목표]
   - **결과**: [달성한 결과]

   ## 사용한 Claude Code 기능

   ### MCP Servers
   - context7: [사용 여부 및 용도]
   - playwright: [사용 여부 및 용도]

   ### Skills
   - /commit: [사용 횟수]
   - /security-audit: [사용 여부]

   ### Agents
   - error-log-analyzer: [사용 여부]

   ## 주요 대화 내용

   ### Q1: [질문 요약]
   **답변**: [답변 요약]

   ### Q2: [질문 요약]
   **답변**: [답변 요약]

   ## 생성/수정된 파일
   - `src/components/...` - 새로 생성
   - `src/lib/...` - 수정

   ## 배운 점 & 팁
   1. [학습 포인트 1]
   2. [학습 포인트 2]

   ## 다음 단계
   - [ ] [후속 작업 1]
   - [ ] [후속 작업 2]
   ```

4. **자동 커밋** (필수):
   - 생성된 로그 파일을 git add
   - 커밋 메시지: `docs: 세션 기록 추가 - [topic]`
   - 사용자 확인 없이 바로 커밋 진행

5. 완료 메시지 출력:
   ```
   ✓ docs/conversation-logs/YYYY-MM-DD_[topic].md 생성됨
   ✓ 커밋 완료: docs: 세션 기록 추가 - [topic]
   ```

## Example
```
/log-session glassmorphism-ui-구현

→ docs/conversation-logs/2024-01-20_glassmorphism-ui-구현.md 생성됨
→ 커밋 완료: docs: 세션 기록 추가 - glassmorphism-ui-구현
```
