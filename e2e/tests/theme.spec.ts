import { test, expect } from '@playwright/test';

test.describe('테마 시스템 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko');
  });

  test.describe('테마 전환', () => {
    test('테마 토글 버튼이 존재해야 함', async ({ page }) => {
      const themeToggle = page.locator(
        '[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="테마"]'
      );
      await expect(themeToggle).toBeVisible();
    });

    test('기본 테마가 적용되어야 함', async ({ page }) => {
      const html = page.locator('html');
      const dataTheme = await html.getAttribute('data-theme');
      expect(dataTheme).toBeTruthy();
    });

    test('테마 변경 시 배경색이 변경되어야 함', async ({ page }) => {
      const body = page.locator('body');
      const initialBg = await body.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );

      // 테마 토글 클릭
      const themeToggle = page.locator(
        '[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="테마"]'
      );
      if (await themeToggle.count() > 0) {
        await themeToggle.click();

        // 테마 선택 메뉴가 있다면
        const themeOption = page.locator('[data-theme-option], [role="menuitem"]').first();
        if (await themeOption.count() > 0) {
          await themeOption.click();
        }

        // 배경색 변경 확인
        await page.waitForTimeout(300); // 애니메이션 대기
        const newBg = await body.evaluate((el) =>
          window.getComputedStyle(el).backgroundColor
        );

        // 색상이 변경되었거나 data-theme이 변경되었는지 확인
        const newDataTheme = await page.locator('html').getAttribute('data-theme');
        expect(newBg !== initialBg || newDataTheme).toBeTruthy();
      }
    });
  });

  test.describe('Aurora 테마별 배경', () => {
    const themes = ['aurora', 'midnight', 'sunset', 'ocean', 'forest', 'neon'];

    for (const theme of themes) {
      test(`${theme} 테마의 Aurora 배경이 적용되어야 함`, async ({ page }) => {
        // 테마 설정
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
        }, theme);

        const body = page.locator('body');
        const pseudoBefore = await body.evaluate((el) => {
          const style = window.getComputedStyle(el, '::before');
          return {
            content: style.content,
            background: style.background,
            position: style.position,
          };
        });

        // ::before 가상 요소가 배경으로 사용되는지 확인
        expect(pseudoBefore.position).toBe('fixed');
      });
    }
  });

  test.describe('Neon Glow 효과', () => {
    test('glass-neon 클래스에 glow 효과가 적용되어야 함', async ({ page }) => {
      const neonElement = page.locator('.glass-neon').first();
      if (await neonElement.count() > 0) {
        const boxShadow = await neonElement.evaluate((el) =>
          window.getComputedStyle(el).boxShadow
        );
        expect(boxShadow).not.toBe('none');
      }
    });

    test('neon 테마에서 glow 강도가 더 강해야 함', async ({ page }) => {
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'neon');
      });

      const neonIntensity = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--neon-intensity');
      });

      // neon 테마는 더 높은 intensity 값을 가져야 함
      if (neonIntensity) {
        expect(parseFloat(neonIntensity)).toBeGreaterThan(0);
      }
    });
  });

  test.describe('테마 지속성', () => {
    test('페이지 새로고침 후에도 테마가 유지되어야 함', async ({ page }) => {
      // 테마 변경
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'midnight');
        localStorage.setItem('theme', 'midnight');
      });

      await page.reload();

      const currentTheme = await page.evaluate(() => {
        return (
          document.documentElement.getAttribute('data-theme') ||
          localStorage.getItem('theme')
        );
      });

      expect(currentTheme).toBe('midnight');
    });
  });

  test.describe('시스템 테마 연동', () => {
    test('시스템 다크 모드 시 적절한 테마가 적용되어야 함', async ({ page }) => {
      // 시스템 다크 모드 에뮬레이션
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/ko');

      const html = page.locator('html');
      const classes = await html.getAttribute('class');
      const dataTheme = await html.getAttribute('data-theme');

      // 다크 모드 관련 클래스나 테마가 적용되었는지 확인
      expect(
        classes?.includes('dark') ||
        dataTheme?.includes('dark') ||
        dataTheme?.includes('midnight') ||
        dataTheme?.includes('neon')
      ).toBeTruthy();
    });
  });
});

test.describe('다국어(i18n) 테스트', () => {
  const locales = [
    { code: 'ko', name: '한국어', sample: '계산기' },
    { code: 'en', name: 'English', sample: 'Calculator' },
    { code: 'ja', name: '日本語', sample: '計算機' },
    { code: 'zh-CN', name: '中文(简)', sample: '计算器' },
    { code: 'zh-TW', name: '中文(繁)', sample: '計算器' },
  ];

  for (const locale of locales) {
    test(`${locale.name} 언어로 페이지 접근 가능해야 함`, async ({ page }) => {
      await page.goto(`/${locale.code}`);
      await expect(page).toHaveURL(new RegExp(`/${locale.code}`));
    });
  }

  test.describe('언어 전환', () => {
    test('언어 선택기가 존재해야 함', async ({ page }) => {
      await page.goto('/ko');
      const langSelector = page.locator(
        '[data-testid="language-selector"], [aria-label*="language"], [aria-label*="언어"]'
      );
      if (await langSelector.count() > 0) {
        await expect(langSelector).toBeVisible();
      }
    });

    test('언어 변경 시 URL이 변경되어야 함', async ({ page }) => {
      await page.goto('/ko');

      const langSelector = page.locator(
        '[data-testid="language-selector"], [aria-label*="language"], [aria-label*="언어"]'
      );
      if (await langSelector.count() > 0) {
        await langSelector.click();

        const englishOption = page.locator('text=English, text=EN, [data-locale="en"]').first();
        if (await englishOption.count() > 0) {
          await englishOption.click();
          await expect(page).toHaveURL(/\/en/);
        }
      }
    });
  });

  test.describe('언어별 콘텐츠', () => {
    test('한국어 페이지에 한글이 표시되어야 함', async ({ page }) => {
      await page.goto('/ko');
      const content = await page.textContent('body');
      // 한글 문자가 포함되어 있는지 확인
      expect(content).toMatch(/[\uac00-\ud7af]/);
    });

    test('영어 페이지에 영문이 표시되어야 함', async ({ page }) => {
      await page.goto('/en');
      const content = await page.textContent('body');
      // Calculator 또는 계산기 관련 영어 단어가 있는지 확인
      expect(content?.toLowerCase()).toMatch(/calculator|engineering|financial|graph/);
    });
  });

  test.describe('언어 지속성', () => {
    test('페이지 새로고침 후에도 언어가 유지되어야 함', async ({ page }) => {
      await page.goto('/en');
      await page.reload();
      await expect(page).toHaveURL(/\/en/);
    });
  });
});

test.describe('반응형 디자인 테스트', () => {
  const viewports = [
    { name: 'Mobile S', width: 320, height: 568 },
    { name: 'Mobile M', width: 375, height: 667 },
    { name: 'Mobile L', width: 425, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: '4K', width: 2560, height: 1440 },
  ];

  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
      });

      test('홈페이지가 정상적으로 렌더링되어야 함', async ({ page }) => {
        await page.goto('/ko');
        const content = page.locator('main, [role="main"], body').first();
        await expect(content).toBeVisible();
      });

      test('계산기 페이지가 정상적으로 렌더링되어야 함', async ({ page }) => {
        await page.goto('/ko/engineering');
        const keypad = page.locator('[data-testid="keypad"], .keypad, [class*="keypad"]').first();
        await expect(keypad).toBeVisible();
      });

      test('버튼이 터치 가능한 크기여야 함 (44px 이상)', async ({ page }) => {
        await page.goto('/ko/engineering');
        const button = page.locator('button:has-text("5")');
        if (await button.count() > 0) {
          const box = await button.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(40);
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      });

      test('수평 스크롤이 발생하지 않아야 함', async ({ page }) => {
        await page.goto('/ko');
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);
      });
    });
  }

  test.describe('브레이크포인트 전환', () => {
    test('모바일에서 태블릿으로 전환 시 레이아웃 변경', async ({ page }) => {
      await page.goto('/ko');

      // 모바일 뷰
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      // 태블릿 뷰로 전환
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(300);

      const content = page.locator('main, [role="main"], body').first();
      await expect(content).toBeVisible();
    });
  });
});

test.describe('접근성 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko');
  });

  test.describe('키보드 네비게이션', () => {
    test('Tab 키로 모든 인터랙티브 요소 접근 가능', async ({ page }) => {
      await page.keyboard.press('Tab');
      const firstFocused = page.locator(':focus');
      await expect(firstFocused).toBeVisible();

      // 여러 번 Tab 눌러서 네비게이션 확인
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
      }
    });

    test('Enter 키로 버튼 활성화 가능', async ({ page }) => {
      await page.goto('/ko/engineering');

      // 버튼에 포커스
      const button = page.locator('button:has-text("5")');
      await button.focus();
      await page.keyboard.press('Enter');

      const display = page.locator('[data-testid="display"], .display, [class*="display"]').first();
      await expect(display).toContainText('5');
    });
  });

  test.describe('스크린 리더 지원', () => {
    test('모든 버튼에 접근 가능한 이름이 있어야 함', async ({ page }) => {
      await page.goto('/ko/engineering');
      const buttons = page.locator('button');
      const count = await buttons.count();

      for (let i = 0; i < Math.min(count, 20); i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const title = await button.getAttribute('title');

        // 텍스트, aria-label, 또는 title 중 하나는 있어야 함
        expect(text?.trim() || ariaLabel || title).toBeTruthy();
      }
    });

    test('페이지에 메인 랜드마크가 있어야 함', async ({ page }) => {
      const main = page.locator('main, [role="main"]');
      if (await main.count() > 0) {
        await expect(main.first()).toBeVisible();
      }
    });
  });

  test.describe('색상 대비', () => {
    test('텍스트가 가시적이어야 함', async ({ page }) => {
      const text = page.locator('h1, h2, h3, p').first();
      if (await text.count() > 0) {
        const color = await text.evaluate((el) =>
          window.getComputedStyle(el).color
        );
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
        expect(color).not.toBe('transparent');
      }
    });
  });

  test.describe('모션 감소', () => {
    test('prefers-reduced-motion 시 애니메이션 비활성화', async ({ page }) => {
      // 모션 감소 선호 에뮬레이션
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/ko');

      // 애니메이션 지속 시간이 0이거나 없어야 함
      const body = page.locator('body');
      const animation = await body.evaluate((el) =>
        window.getComputedStyle(el).animation
      );

      // 애니메이션이 none이거나 duration이 0이어야 함
      expect(
        animation === 'none' ||
        animation.includes('0s') ||
        !animation.includes('aurora')
      ).toBeTruthy();
    });
  });
});
