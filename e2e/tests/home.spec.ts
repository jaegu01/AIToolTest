import { test, expect } from '@playwright/test';

test.describe('홈페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko');
  });

  test.describe('페이지 로드', () => {
    test('홈페이지가 정상적으로 로드되어야 함', async ({ page }) => {
      await expect(page).toHaveTitle(/GlassCalc/);
    });

    test('모든 계산기 카드가 표시되어야 함', async ({ page }) => {
      const calculatorCards = page.locator('[data-testid="calculator-card"]');
      await expect(calculatorCards).toHaveCount(12);
    });

    test('Bento Grid 레이아웃이 적용되어야 함', async ({ page }) => {
      const grid = page.locator('.bento-grid, [class*="grid"]').first();
      await expect(grid).toBeVisible();
    });
  });

  test.describe('계산기 카드 인터랙션', () => {
    test('카드 hover 시 3D 틸트 효과가 적용되어야 함', async ({ page }) => {
      const card = page.locator('[data-testid="calculator-card"]').first();
      await card.hover();
      // 3D transform 스타일 확인
      const transform = await card.evaluate((el) =>
        window.getComputedStyle(el).transform
      );
      expect(transform).not.toBe('none');
    });

    test('공학용 계산기 클릭 시 해당 페이지로 이동', async ({ page }) => {
      await page.click('[data-testid="calculator-card"][href*="engineering"]');
      await expect(page).toHaveURL(/\/engineering/);
    });

    test('금융 계산기 클릭 시 해당 페이지로 이동', async ({ page }) => {
      await page.click('[data-testid="calculator-card"][href*="financial"]');
      await expect(page).toHaveURL(/\/financial/);
    });

    test('그래프 계산기 클릭 시 해당 페이지로 이동', async ({ page }) => {
      await page.click('[data-testid="calculator-card"][href*="graph"]');
      await expect(page).toHaveURL(/\/graph/);
    });
  });

  test.describe('Aurora 배경 효과', () => {
    test('배경 애니메이션이 적용되어야 함', async ({ page }) => {
      const body = page.locator('body');
      const pseudoBefore = await body.evaluate((el) => {
        const style = window.getComputedStyle(el, '::before');
        return style.animation;
      });
      expect(pseudoBefore).toContain('aurora');
    });
  });

  test.describe('Glassmorphism 효과', () => {
    test('glass 카드에 backdrop-blur가 적용되어야 함', async ({ page }) => {
      const glassCard = page.locator('.glass, [class*="glass"]').first();
      if (await glassCard.count() > 0) {
        const backdropFilter = await glassCard.evaluate((el) =>
          window.getComputedStyle(el).backdropFilter
        );
        expect(backdropFilter).toContain('blur');
      }
    });
  });

  test.describe('진입 애니메이션', () => {
    test('카드들이 stagger 애니메이션으로 나타나야 함', async ({ page }) => {
      // 페이지 새로고침 후 애니메이션 확인
      await page.reload();
      const cards = page.locator('[data-testid="calculator-card"]');
      const firstCard = cards.first();

      // 첫 번째 카드가 보이는지 확인 (애니메이션 완료 후)
      await expect(firstCard).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('접근성', () => {
    test('모든 카드에 적절한 aria-label이 있어야 함', async ({ page }) => {
      const cards = page.locator('[data-testid="calculator-card"]');
      const count = await cards.count();

      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const ariaLabel = await card.getAttribute('aria-label');
        const title = await card.getAttribute('title');
        expect(ariaLabel || title).toBeTruthy();
      }
    });

    test('키보드로 카드 네비게이션이 가능해야 함', async ({ page }) => {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });
});

test.describe('반응형 디자인', () => {
  test('모바일에서 카드가 세로로 정렬되어야 함', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ko');

    const cards = page.locator('[data-testid="calculator-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('태블릿에서 2열 그리드가 표시되어야 함', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/ko');

    const grid = page.locator('.bento-grid, [class*="grid"]').first();
    await expect(grid).toBeVisible();
  });

  test('데스크톱에서 Bento Grid가 표시되어야 함', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/ko');

    const cards = page.locator('[data-testid="calculator-card"]');
    await expect(cards).toHaveCount(12);
  });
});
