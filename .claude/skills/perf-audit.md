# Skill: perf-audit

성능 분석 스킬

## Description
GlassCalc Pro 애플리케이션의 성능을 분석하고 최적화 포인트를 제안합니다.

## Instructions

1. 번들 크기 분석:
   ```bash
   npm run build
   ```
   - `.next/` 폴더의 번들 크기 확인
   - 큰 의존성 식별

2. 코드 분석:
   - 불필요한 리렌더링 패턴 찾기
   - 메모이제이션이 필요한 컴포넌트 식별
   - 무거운 계산의 useMemo/useCallback 사용 여부

3. 3D/애니메이션 성능:
   - Three.js 씬의 복잡도 검토
   - 파티클 수 및 FPS 영향
   - Framer Motion 애니메이션 최적화

4. 이미지/에셋:
   - 이미지 최적화 상태
   - 폰트 로딩 전략
   - 사운드 파일 크기

5. 런타임 성능:
   - IndexedDB 쿼리 효율성
   - 상태 관리 최적화
   - 메모리 누수 가능성

## Output Format
```
=== 성능 분석 리포트 ===

## 번들 크기
- Total: 450KB (gzipped)
- Largest: three.js (180KB)

## 최적화 권장사항
1. [HIGH] Three.js 동적 임포트 적용
2. [MEDIUM] 계산 결과 메모이제이션
3. [LOW] 파티클 수 30% 감소

## Lighthouse 예상 점수
- Performance: 85
- Accessibility: 92
```
