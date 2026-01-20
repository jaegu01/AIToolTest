# Command: deploy-preview

프리뷰 배포 명령어

## Description
현재 브랜치를 프리뷰 환경에 배포합니다.

## Usage
```
/deploy-preview [--skip-tests] [--skip-lint]
```

## Instructions

1. 배포 전 검사:
   ```bash
   # 린트 검사 (--skip-lint 없으면)
   npm run lint

   # 타입 검사
   npm run type-check

   # 테스트 (--skip-tests 없으면)
   npm test
   ```

2. 빌드:
   ```bash
   npm run build
   ```

3. 빌드 결과 확인:
   - 빌드 성공 여부
   - 번들 크기
   - 경고 메시지

4. 배포:
   ```bash
   # Vercel 프리뷰 배포
   vercel --yes
   ```

5. 배포 결과:
   ```
   ✓ 배포 완료
   - URL: https://glasscalc-xxx.vercel.app
   - 빌드 시간: 45s
   - 번들 크기: 450KB
   ```

## Pre-deployment Checklist
- [ ] 모든 테스트 통과
- [ ] 린트 에러 없음
- [ ] 타입 에러 없음
- [ ] .env 파일 커밋되지 않음
- [ ] 불필요한 console.log 제거

## Post-deployment
- Lighthouse 자동 실행
- 스크린샷 캡처
- Slack 알림 (설정 시)

## Example
```
/deploy-preview

→ 검사 → 빌드 → 배포 → URL 반환
```
