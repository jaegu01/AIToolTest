# Command: review-code

코드 리뷰 요청 명령어

## Description
지정한 파일이나 디렉토리의 코드를 리뷰하고 피드백을 제공합니다.

## Usage
```
/review-code [path] [--focus=security|performance|style|all]
```

## Instructions

1. 대상 파일 분석:
   - 단일 파일: 해당 파일 리뷰
   - 디렉토리: 모든 .ts/.tsx 파일 리뷰
   - 미지정: 최근 변경된 파일들 리뷰

2. 리뷰 관점:
   - **security**: 보안 취약점
   - **performance**: 성능 이슈
   - **style**: 코드 스타일, 가독성
   - **all**: 모든 관점 (기본값)

3. 리뷰 항목:

   ### 보안 (Security)
   - XSS 취약점
   - 인젝션 취약점
   - 민감 정보 노출
   - 안전하지 않은 의존성

   ### 성능 (Performance)
   - 불필요한 리렌더링
   - 메모이제이션 누락
   - 무거운 연산
   - 메모리 누수 가능성

   ### 스타일 (Style)
   - TypeScript 타입 사용
   - 네이밍 컨벤션
   - 함수 길이
   - 복잡도

   ### 기타
   - 에러 처리
   - 테스트 가능성
   - 문서화

4. 출력 형식:
   ```markdown
   ## 코드 리뷰: [파일명]

   ### 요약
   - 리뷰 파일 수: 5
   - 발견된 이슈: 12
   - 심각도별: Critical(1), High(3), Medium(5), Low(3)

   ### Critical Issues
   #### [파일:줄번호] 이슈 제목
   ```typescript
   // 문제 코드
   ```
   **문제**: 설명
   **해결**: 제안

   ### High Issues
   ...
   ```

## Example
```
/review-code src/lib/calculator --focus=security

→ src/lib/calculator/ 디렉토리의 보안 관점 리뷰 실행
```
