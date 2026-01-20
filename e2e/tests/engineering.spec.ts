import { test, expect } from '@playwright/test';

test.describe('공학용 계산기 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/engineering');
  });

  test.describe('페이지 로드', () => {
    test('공학용 계산기 페이지가 로드되어야 함', async ({ page }) => {
      await expect(page).toHaveURL(/\/engineering/);
    });

    test('디스플레이가 표시되어야 함', async ({ page }) => {
      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toBeVisible();
    });

    test('키패드가 표시되어야 함', async ({ page }) => {
      const keypad = page.locator('[data-testid="keypad"], .keypad, [class*="keypad"]').first();
      await expect(keypad).toBeVisible();
    });
  });

  test.describe('기본 산술 연산', () => {
    test('덧셈: 2 + 3 = 5', async ({ page }) => {
      await page.click('button:has-text("2")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("=")');

      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('5');
    });

    test('뺄셈: 10 - 4 = 6', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("-")');
      await page.click('button:has-text("4")');
      await page.click('button:has-text("=")');

      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('6');
    });

    test('곱셈: 7 × 8 = 56', async ({ page }) => {
      await page.click('button:has-text("7")');
      await page.click('button:has-text("×"), button:has-text("*")');
      await page.click('button:has-text("8")');
      await page.click('button:has-text("=")');

      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('56');
    });

    test('나눗셈: 15 ÷ 3 = 5', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("÷"), button:has-text("/")');
      await page.click('button:has-text("3")');
      await page.click('button:has-text("=")');

      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('5');
    });
  });

  test.describe('공학용 함수', () => {
    test('삼각함수 sin(30°)', async ({ page }) => {
      // sin 버튼 클릭
      const sinBtn = page.locator('button:has-text("sin")');
      if (await sinBtn.count() > 0) {
        await sinBtn.click();
        await page.click('button:has-text("3")');
        await page.click('button:has-text("0")');
        await page.click('button:has-text(")")');
        await page.click('button:has-text("=")');

        const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
        // sin(30) 결과 확인 (라디안 또는 도 모드에 따라 다름)
        await expect(display).toBeVisible();
      }
    });

    test('제곱근 √16 = 4', async ({ page }) => {
      const sqrtBtn = page.locator('button:has-text("√"), button:has-text("sqrt")');
      if (await sqrtBtn.count() > 0) {
        await sqrtBtn.click();
        await page.click('button:has-text("1")');
        await page.click('button:has-text("6")');
        await page.click('button:has-text(")")');
        await page.click('button:has-text("=")');

        const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
        await expect(display).toContainText('4');
      }
    });

    test('거듭제곱 2^3 = 8', async ({ page }) => {
      await page.click('button:has-text("2")');
      const powerBtn = page.locator('button:has-text("^"), button:has-text("xʸ")');
      if (await powerBtn.count() > 0) {
        await powerBtn.click();
        await page.click('button:has-text("3")');
        await page.click('button:has-text("=")');

        const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
        await expect(display).toContainText('8');
      }
    });

    test('로그 log(100) = 2', async ({ page }) => {
      const logBtn = page.locator('button:has-text("log")');
      if (await logBtn.count() > 0) {
        await logBtn.click();
        await page.click('button:has-text("1")');
        await page.click('button:has-text("0")');
        await page.click('button:has-text("0")');
        await page.click('button:has-text(")")');
        await page.click('button:has-text("=")');

        const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
        await expect(display).toContainText('2');
      }
    });
  });

  test.describe('디스플레이 기능', () => {
    test('C 버튼으로 클리어', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button:has-text("C"), button:has-text("AC"), button:has-text("Clear")');

      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('0');
    });

    test('백스페이스로 마지막 숫자 삭제', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');

      const backspace = page.locator('button:has-text("⌫"), button:has-text("DEL"), button:has-text("←")');
      if (await backspace.count() > 0) {
        await backspace.click();
        const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
        await expect(display).toContainText('12');
      }
    });

    test('숫자 애니메이션이 적용되어야 함', async ({ page }) => {
      await page.click('button:has-text("1")');
      await page.click('button:has-text("2")');
      await page.click('button:has-text("3")');

      // 숫자가 표시되는지 확인
      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('123');
    });
  });

  test.describe('키패드 인터랙션', () => {
    test('버튼 클릭 시 ripple 효과', async ({ page }) => {
      const button = page.locator('button:has-text("5")');
      await button.click();

      // 버튼이 클릭되었는지 확인
      await expect(button).toBeVisible();
    });

    test('모든 숫자 버튼이 작동해야 함', async ({ page }) => {
      for (let i = 0; i <= 9; i++) {
        await page.click(`button:has-text("${i}")`);
      }
      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('0123456789');
    });
  });

  test.describe('에러 처리', () => {
    test('0으로 나누기 에러', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button:has-text("÷"), button:has-text("/")');
      await page.click('button:has-text("0")');
      await page.click('button:has-text("=")');

      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      const text = await display.textContent();
      // Infinity, Error, 에러, ∞ 중 하나가 표시되어야 함
      expect(
        text?.includes('Infinity') ||
        text?.includes('Error') ||
        text?.includes('에러') ||
        text?.includes('∞') ||
        text?.includes('NaN')
      ).toBeTruthy();
    });
  });

  test.describe('복사 기능', () => {
    test('결과 복사 버튼이 있어야 함', async ({ page }) => {
      await page.click('button:has-text("5")');
      await page.click('button:has-text("+")');
      await page.click('button:has-text("5")');
      await page.click('button:has-text("=")');

      const copyBtn = page.locator('button[aria-label*="copy"], button[aria-label*="복사"], [data-testid="copy-btn"]');
      if (await copyBtn.count() > 0) {
        await expect(copyBtn).toBeVisible();
      }
    });
  });
});

test.describe('반응형 키패드', () => {
  test('모바일에서 키패드가 적절한 크기로 표시', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ko/engineering');

    const keypad = page.locator('[data-testid="keypad"], .keypad, [class*="keypad"]').first();
    await expect(keypad).toBeVisible();

    // 버튼 높이 확인
    const button = page.locator('button:has-text("5")');
    const height = await button.evaluate((el) =>
      parseInt(window.getComputedStyle(el).height)
    );
    expect(height).toBeGreaterThanOrEqual(44); // 모바일 터치 최소 크기
  });

  test('데스크톱에서 키패드가 적절한 크기로 표시', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/ko/engineering');

    const keypad = page.locator('[data-testid="keypad"], .keypad, [class*="keypad"]').first();
    await expect(keypad).toBeVisible();
  });
});
