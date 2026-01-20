# Skill: a11y-check

접근성 검사 스킬

## Description
WCAG 2.1 가이드라인에 따른 접근성 검사를 수행합니다.

## Instructions

1. 키보드 접근성:
   - 모든 버튼에 키보드 접근 가능한지 확인
   - 포커스 순서가 논리적인지 확인
   - 포커스 표시가 명확한지 확인

2. 스크린 리더 호환성:
   - 모든 버튼에 aria-label 있는지 확인
   - 이미지에 alt 텍스트 있는지 확인
   - 동적 콘텐츠에 aria-live 사용 여부

3. 색상 대비:
   - 텍스트와 배경 간 대비율 검사 (최소 4.5:1)
   - 중요한 UI 요소의 대비율 검사

4. 모션 접근성:
   - prefers-reduced-motion 지원 여부
   - 자동 재생 애니메이션 제어 가능 여부

5. 폼 접근성:
   - 입력 필드에 레이블 연결 여부
   - 에러 메시지의 명확성

## Checks
```typescript
// 검사할 패턴들
- button 요소에 aria-label 또는 텍스트 콘텐츠
- img 요소에 alt 속성
- input 요소에 연결된 label
- 색상만으로 정보 전달하지 않음
- 애니메이션에 reduced-motion 대응
```

## Output Format
```
=== 접근성 검사 결과 ===

[PASS] 키보드 접근성: 모든 버튼 접근 가능
[FAIL] aria-label 누락: src/components/calculator/Keypad.tsx:45
[WARN] 색상 대비: 일부 텍스트 대비율 부족 (3.8:1)

총점: 85/100
WCAG 2.1 AA 준수: 부분 충족
```
