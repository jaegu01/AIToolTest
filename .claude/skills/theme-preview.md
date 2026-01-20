# Skill: theme-preview

테마 스크린샷 및 프리뷰 스킬

## Description
각 테마의 스크린샷을 생성하고 비교 프리뷰를 제공합니다.

## Instructions

1. 개발 서버 실행:
   ```bash
   npm run dev
   ```

2. Playwright MCP 사용하여 스크린샷:
   - 홈 페이지 (6개 테마)
   - 공학용 계산기 (6개 테마)
   - 설정 패널

3. 스크린샷 저장:
   ```
   docs/screenshots/
   ├── home-aurora.png
   ├── home-sunset.png
   ├── home-ocean.png
   ├── home-forest.png
   ├── home-midnight.png
   ├── home-cherry.png
   ├── engineering-aurora.png
   └── ...
   ```

4. 테마 비교 문서 생성:
   - 색상 팔레트 비교
   - 가독성 평가
   - 접근성 점수

## Output
- 총 36개 스크린샷 (6 테마 × 6 페이지)
- 테마 비교 문서 (docs/THEME_COMPARISON.md)
- 접근성 색상 대비 리포트
