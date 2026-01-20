# GlassCalc Pro - E2E 테스트 플랜

## 개요

Playwright를 사용한 End-to-End 테스트 전략 문서입니다.
12종 계산기의 핵심 기능, UI/UX, 반응형 디자인, 접근성을 검증합니다.

---

## 테스트 환경 설정

### 1. Playwright 설치

```bash
npm install -D @playwright/test
npx playwright install
```

### 2. 설정 파일 생성

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Desktop
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // Mobile
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
    // Tablet
    { name: 'tablet', use: { ...devices['iPad Pro'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. 폴더 구조

```
e2e/
├── fixtures/
│   └── test-base.ts          # 공통 테스트 fixture
├── pages/
│   ├── home.page.ts          # 홈페이지 POM
│   ├── calculator.page.ts    # 계산기 공통 POM
│   └── settings.page.ts      # 설정 POM
├── tests/
│   ├── home.spec.ts          # 홈페이지 테스트
│   ├── engineering.spec.ts   # 공학용 계산기
│   ├── financial.spec.ts     # 금융 계산기
│   ├── graph.spec.ts         # 그래프 계산기
│   ├── unit.spec.ts          # 단위 변환
│   ├── programmer.spec.ts    # 프로그래머
│   ├── statistics.spec.ts    # 통계
│   ├── datetime.spec.ts      # 날짜/시간
│   ├── matrix.spec.ts        # 행렬
│   ├── physics.spec.ts       # 물리
│   ├── chemistry.spec.ts     # 화학
│   ├── health.spec.ts        # 건강
│   ├── color.spec.ts         # 색상
│   ├── theme.spec.ts         # 테마 전환
│   ├── i18n.spec.ts          # 다국어
│   ├── responsive.spec.ts    # 반응형
│   └── a11y.spec.ts          # 접근성
└── utils/
    └── helpers.ts            # 테스트 헬퍼 함수
```

---

## 테스트 카테고리

### 1. 홈페이지 (home.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| HOME-001 | 페이지 로딩 및 타이틀 확인 | P0 |
| HOME-002 | 12개 계산기 카드 렌더링 확인 | P0 |
| HOME-003 | 각 계산기 카드 클릭 시 해당 페이지 이동 | P0 |
| HOME-004 | Bento Grid 레이아웃 정상 표시 | P1 |
| HOME-005 | 3D Tilt 카드 호버 효과 | P2 |
| HOME-006 | Aurora 배경 애니메이션 렌더링 | P2 |
| HOME-007 | 파티클 배경 렌더링 | P2 |
| HOME-008 | 커맨드 팔레트 (Ctrl+K) 열기 | P1 |
| HOME-009 | 커맨드 팔레트 검색 기능 | P1 |
| HOME-010 | 설정 버튼 표시 및 클릭 | P1 |

```typescript
// e2e/tests/home.spec.ts 예시
import { test, expect } from '@playwright/test';

test.describe('홈페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko');
  });

  test('HOME-001: 페이지 로딩 및 타이틀 확인', async ({ page }) => {
    await expect(page).toHaveTitle(/GlassCalc Pro/);
    await expect(page.locator('h1')).toContainText('GlassCalc Pro');
  });

  test('HOME-002: 12개 계산기 카드 렌더링', async ({ page }) => {
    const cards = page.locator('.bento-item');
    await expect(cards).toHaveCount(12);
  });

  test('HOME-003: 계산기 카드 클릭 시 페이지 이동', async ({ page }) => {
    await page.locator('a[href="/ko/engineering"]').click();
    await expect(page).toHaveURL('/ko/engineering');
  });

  test('HOME-008: 커맨드 팔레트 열기', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(page.locator('[cmdk-root]')).toBeVisible();
  });
});
```

---

### 2. 공학용 계산기 (engineering.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| ENG-001 | 기본 사칙연산 (2+3=5) | P0 |
| ENG-002 | 괄호 연산 ((2+3)*4=20) | P0 |
| ENG-003 | 삼각함수 sin(90)=1 (도 모드) | P0 |
| ENG-004 | 삼각함수 sin(π/2)=1 (라디안 모드) | P0 |
| ENG-005 | 로그 계산 log10(100)=2 | P0 |
| ENG-006 | 자연로그 ln(e)=1 | P0 |
| ENG-007 | 제곱근 √16=4 | P0 |
| ENG-008 | 거듭제곱 2^10=1024 | P0 |
| ENG-009 | 팩토리얼 5!=120 | P1 |
| ENG-010 | 절대값 \|-5\|=5 | P1 |
| ENG-011 | 퍼센트 계산 100*50%=50 | P1 |
| ENG-012 | 상수 π, e 입력 | P1 |
| ENG-013 | Clear(AC) 버튼 기능 | P0 |
| ENG-014 | Backspace 버튼 기능 | P0 |
| ENG-015 | 오류 표시 (0으로 나누기) | P0 |
| ENG-016 | 히스토리 저장 | P1 |
| ENG-017 | 히스토리에서 식 복원 | P1 |
| ENG-018 | 결과 복사 버튼 | P2 |
| ENG-019 | 각도 단위 토글 (도/라디안) | P1 |
| ENG-020 | 키보드 입력 지원 | P2 |

```typescript
// e2e/tests/engineering.spec.ts 예시
import { test, expect } from '@playwright/test';

test.describe('공학용 계산기', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/engineering');
  });

  test('ENG-001: 기본 사칙연산', async ({ page }) => {
    await page.click('button:has-text("2")');
    await page.click('button:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button:has-text("=")');

    await expect(page.locator('.calc-display-result')).toContainText('5');
  });

  test('ENG-003: 삼각함수 (도 모드)', async ({ page }) => {
    // 도 모드 확인
    await expect(page.locator('[data-angle-unit="deg"]')).toBeVisible();

    await page.click('button:has-text("sin")');
    await page.click('button:has-text("9")');
    await page.click('button:has-text("0")');
    await page.click('button:has-text(")")');
    await page.click('button:has-text("=")');

    await expect(page.locator('.calc-display-result')).toContainText('1');
  });

  test('ENG-015: 오류 표시', async ({ page }) => {
    await page.click('button:has-text("1")');
    await page.click('button:has-text("÷")');
    await page.click('button:has-text("0")');
    await page.click('button:has-text("=")');

    await expect(page.locator('.calc-display-result')).toContainText('Error');
    await expect(page.locator('.calc-display-result')).toHaveClass(/text-destructive/);
  });
});
```

---

### 3. 금융 계산기 (financial.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| FIN-001 | 대출 계산기 렌더링 | P0 |
| FIN-002 | 월 상환액 계산 | P0 |
| FIN-003 | 복리 계산 | P0 |
| FIN-004 | 투자 수익률 계산 | P1 |
| FIN-005 | 입력값 검증 (음수 방지) | P1 |
| FIN-006 | 결과 포맷팅 (통화) | P1 |

---

### 4. 그래프 계산기 (graph.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| GRA-001 | 그래프 캔버스 렌더링 | P0 |
| GRA-002 | y=x 직선 그리기 | P0 |
| GRA-003 | y=x² 포물선 그리기 | P0 |
| GRA-004 | y=sin(x) 사인파 그리기 | P0 |
| GRA-005 | 줌 인/아웃 기능 | P1 |
| GRA-006 | 팬(드래그) 기능 | P1 |
| GRA-007 | 여러 함수 동시 표시 | P1 |
| GRA-008 | 함수 색상 구분 | P2 |
| GRA-009 | 좌표 툴팁 표시 | P2 |

---

### 5. 단위 변환 (unit.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| UNI-001 | 길이 변환 (m → km) | P0 |
| UNI-002 | 무게 변환 (kg → lb) | P0 |
| UNI-003 | 온도 변환 (°C → °F) | P0 |
| UNI-004 | 데이터 변환 (GB → MB) | P1 |
| UNI-005 | 카테고리 전환 | P0 |
| UNI-006 | 양방향 변환 (swap) | P1 |

---

### 6. 프로그래머 계산기 (programmer.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| PRG-001 | 10진수 → 2진수 변환 | P0 |
| PRG-002 | 10진수 → 16진수 변환 | P0 |
| PRG-003 | 비트 AND 연산 | P0 |
| PRG-004 | 비트 OR 연산 | P0 |
| PRG-005 | 비트 XOR 연산 | P0 |
| PRG-006 | 비트 시프트 연산 | P1 |
| PRG-007 | ASCII 변환 | P2 |

---

### 7. 통계 계산기 (statistics.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| STA-001 | 평균 계산 | P0 |
| STA-002 | 표준편차 계산 | P0 |
| STA-003 | 중앙값 계산 | P0 |
| STA-004 | 최소/최대값 | P0 |
| STA-005 | 데이터 입력 (콤마 구분) | P0 |
| STA-006 | 히스토그램 렌더링 | P1 |
| STA-007 | 회귀분석 | P2 |

---

### 8. 날짜/시간 계산기 (datetime.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| DT-001 | D-Day 계산 | P0 |
| DT-002 | 나이 계산 | P0 |
| DT-003 | 날짜 간 일수 계산 | P0 |
| DT-004 | 타임존 변환 | P1 |
| DT-005 | 근무일 계산 | P2 |

---

### 9. 행렬 계산기 (matrix.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| MAT-001 | 행렬 덧셈 | P0 |
| MAT-002 | 행렬 곱셈 | P0 |
| MAT-003 | 행렬식 계산 | P0 |
| MAT-004 | 역행렬 계산 | P1 |
| MAT-005 | 전치 행렬 | P1 |
| MAT-006 | 행렬 크기 조정 | P0 |

---

### 10. 물리 계산기 (physics.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| PHY-001 | 속도 계산 (v=d/t) | P0 |
| PHY-002 | 힘 계산 (F=ma) | P0 |
| PHY-003 | 에너지 계산 (E=mc²) | P0 |
| PHY-004 | 옴의 법칙 (V=IR) | P1 |
| PHY-005 | 공식 카테고리 선택 | P0 |

---

### 11. 화학 계산기 (chemistry.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| CHE-001 | 분자량 계산 (H2O) | P0 |
| CHE-002 | 몰 계산 | P0 |
| CHE-003 | pH 계산 | P0 |
| CHE-004 | 농도 변환 | P1 |

---

### 12. 건강 계산기 (health.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| HEA-001 | BMI 계산 | P0 |
| HEA-002 | BMI 카테고리 표시 | P0 |
| HEA-003 | 기초대사량(BMR) 계산 | P0 |
| HEA-004 | 심박수 존 계산 | P1 |
| HEA-005 | 입력 검증 (양수만) | P1 |

---

### 13. 색상 계산기 (color.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| COL-001 | HEX → RGB 변환 | P0 |
| COL-002 | RGB → HEX 변환 | P0 |
| COL-003 | RGB → HSL 변환 | P0 |
| COL-004 | 컬러 피커 동작 | P1 |
| COL-005 | 색상 복사 기능 | P1 |
| COL-006 | 팔레트 생성 | P2 |

---

### 14. 테마 전환 (theme.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| THM-001 | Aurora 테마 적용 | P0 |
| THM-002 | Sunset 테마 적용 | P0 |
| THM-003 | Ocean 테마 적용 | P0 |
| THM-004 | Forest 테마 적용 | P1 |
| THM-005 | Midnight 테마 적용 | P1 |
| THM-006 | Cherry 테마 적용 | P1 |
| THM-007 | 테마 LocalStorage 저장 | P0 |
| THM-008 | 페이지 새로고침 후 테마 유지 | P0 |
| THM-009 | 사운드 토글 | P1 |
| THM-010 | 햅틱 토글 | P2 |

```typescript
// e2e/tests/theme.spec.ts 예시
import { test, expect } from '@playwright/test';

test.describe('테마 전환', () => {
  test('THM-001: Aurora 테마 적용', async ({ page }) => {
    await page.goto('/ko');
    await page.click('[data-testid="settings-button"]');
    await page.click('[data-theme-option="aurora"]');

    await expect(page.locator('body')).toHaveAttribute('data-theme', 'aurora');
  });

  test('THM-007: 테마 LocalStorage 저장', async ({ page }) => {
    await page.goto('/ko');
    await page.click('[data-testid="settings-button"]');
    await page.click('[data-theme-option="sunset"]');

    const theme = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('glasscalc-theme') || '{}').state?.theme
    );
    expect(theme).toBe('sunset');
  });
});
```

---

### 15. 다국어 (i18n.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| I18N-001 | 한국어 (ko) 표시 | P0 |
| I18N-002 | 영어 (en) 표시 | P0 |
| I18N-003 | 일본어 (ja) 표시 | P0 |
| I18N-004 | 중국어 간체 (zh-CN) 표시 | P1 |
| I18N-005 | 중국어 번체 (zh-TW) 표시 | P1 |
| I18N-006 | URL 로케일 라우팅 | P0 |
| I18N-007 | 계산기 이름 번역 확인 | P0 |
| I18N-008 | 버튼 레이블 번역 확인 | P1 |

```typescript
// e2e/tests/i18n.spec.ts 예시
import { test, expect } from '@playwright/test';

const locales = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW'];

for (const locale of locales) {
  test(`I18N: ${locale} 로케일 페이지 로딩`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator('h1')).toBeVisible();

    // 해당 로케일 메타 태그 확인
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe(locale);
  });
}
```

---

### 16. 반응형 (responsive.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| RES-001 | 데스크톱 (1920x1080) 레이아웃 | P0 |
| RES-002 | 태블릿 (768x1024) 레이아웃 | P0 |
| RES-003 | 모바일 (375x667) 레이아웃 | P0 |
| RES-004 | Bento Grid 반응형 열 변경 | P1 |
| RES-005 | 키패드 버튼 크기 반응형 | P1 |
| RES-006 | 디스플레이 폰트 크기 반응형 | P1 |
| RES-007 | 사이드 히스토리 패널 숨김 (모바일) | P1 |

```typescript
// e2e/tests/responsive.spec.ts 예시
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

for (const vp of viewports) {
  test(`RES: ${vp.name} 레이아웃`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/ko');

    // 스크린샷 비교
    await expect(page).toHaveScreenshot(`home-${vp.name}.png`);
  });
}
```

---

### 17. 접근성 (a11y.spec.ts)

| 테스트 ID | 테스트 케이스 | 우선순위 |
|-----------|--------------|----------|
| A11Y-001 | 키보드 네비게이션 (Tab) | P0 |
| A11Y-002 | Enter 키로 버튼 활성화 | P0 |
| A11Y-003 | 포커스 표시 (outline) | P0 |
| A11Y-004 | ARIA 레이블 존재 | P1 |
| A11Y-005 | 색상 대비 (contrast ratio) | P1 |
| A11Y-006 | 스크린 리더 호환성 | P2 |
| A11Y-007 | reduced-motion 지원 | P1 |

```typescript
// e2e/tests/a11y.spec.ts 예시
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('접근성', () => {
  test('A11Y: axe 자동 검사', async ({ page }) => {
    await page.goto('/ko');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('A11Y-001: 키보드 네비게이션', async ({ page }) => {
    await page.goto('/ko/engineering');

    // Tab으로 버튼 순회
    await page.keyboard.press('Tab');
    const focused = await page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('A11Y-007: reduced-motion 지원', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/ko');

    // 애니메이션 비활성화 확인
    const animationDuration = await page.evaluate(() => {
      const el = document.querySelector('.bento-item');
      return getComputedStyle(el!).animationDuration;
    });
    expect(animationDuration).toBe('0.01ms');
  });
});
```

---

## 실행 방법

### 모든 테스트 실행
```bash
npx playwright test
```

### 특정 파일만 실행
```bash
npx playwright test engineering.spec.ts
```

### 특정 브라우저만 실행
```bash
npx playwright test --project=chromium
```

### UI 모드 (디버깅)
```bash
npx playwright test --ui
```

### 헤드풀 모드 (브라우저 표시)
```bash
npx playwright test --headed
```

### 리포트 보기
```bash
npx playwright show-report
```

---

## CI/CD 통합

### GitHub Actions 예시

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## 테스트 데이터

### 공학용 계산기 테스트 케이스

```typescript
export const engineeringTestCases = [
  { input: '2+3', expected: '5' },
  { input: '10-4', expected: '6' },
  { input: '6*7', expected: '42' },
  { input: '15/3', expected: '5' },
  { input: '(2+3)*4', expected: '20' },
  { input: 'sqrt(16)', expected: '4' },
  { input: 'sin(90)', expected: '1', mode: 'deg' },
  { input: 'cos(0)', expected: '1' },
  { input: 'log10(100)', expected: '2' },
  { input: 'ln(e)', expected: '1' },
  { input: '2^10', expected: '1024' },
  { input: 'factorial(5)', expected: '120' },
  { input: 'abs(-5)', expected: '5' },
  { input: 'pi', expected: '3.14159' },
];
```

---

## 우선순위 정의

| 우선순위 | 설명 | 실행 빈도 |
|---------|------|----------|
| **P0** | 핵심 기능, 반드시 통과해야 함 | 모든 PR |
| **P1** | 중요 기능, 릴리즈 전 확인 | 매일 |
| **P2** | 부가 기능, 주기적 확인 | 주간 |

---

## 예상 커버리지

| 카테고리 | 테스트 수 | 예상 시간 |
|---------|----------|----------|
| 홈페이지 | 10 | 30초 |
| 12종 계산기 | 약 80 | 5분 |
| 테마/설정 | 10 | 30초 |
| 다국어 | 8 | 1분 |
| 반응형 | 7 | 1분 |
| 접근성 | 7 | 30초 |
| **합계** | **~122** | **~8분** |

---

## 다음 단계

1. [ ] Playwright 설치 및 설정
2. [ ] Page Object Model(POM) 클래스 생성
3. [ ] P0 테스트 케이스 작성
4. [ ] CI/CD 파이프라인 연동
5. [ ] P1 테스트 케이스 작성
6. [ ] 시각적 회귀 테스트 설정
7. [ ] P2 테스트 케이스 작성

---

*문서 생성: 2026-01-20*
*작성자: Claude Code (Opus 4.5)*
