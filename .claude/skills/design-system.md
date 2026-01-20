# Skill: design-system

디자인 시스템 일관성 검사 스킬

## Description
Glassmorphism 디자인 시스템의 일관성을 검사하고 개선점을 제안합니다.

## Instructions

1. 색상 일관성:
   - CSS 변수 사용 여부
   - 하드코딩된 색상 값 찾기
   - 테마별 색상 적용 확인

2. 간격 및 크기:
   - Tailwind 스케일 사용 여부
   - 일관된 padding/margin 사용
   - 반응형 브레이크포인트 일관성

3. 타이포그래피:
   - 폰트 크기 스케일 준수
   - 폰트 웨이트 일관성
   - 줄 높이 일관성

4. 컴포넌트 스타일:
   - glass 클래스 일관된 사용
   - 버튼 스타일 일관성
   - 애니메이션 타이밍 일관성

5. 아이콘 사용:
   - Lucide 아이콘만 사용 여부
   - 아이콘 크기 일관성
   - 아이콘 색상 일관성

## Patterns to Check
```
// 좋은 패턴
className="glass p-4 rounded-xl"
className="text-muted-foreground"

// 나쁜 패턴 (하드코딩)
style={{ color: '#666' }}
className="bg-[#ffffff15]"
```

## Output Format
```
=== 디자인 시스템 검사 ===

[색상]
✓ CSS 변수 사용: 95%
✗ 하드코딩된 색상: 3개 발견

[간격]
✓ Tailwind 스케일 준수: 98%

[컴포넌트]
✓ glass 클래스 일관성: 100%
✗ 버튼 높이 불일치: 2개 파일

수정 권장:
1. src/components/ui/Button.tsx:23 - 색상 변수 사용
```
