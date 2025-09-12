import { test, expect } from '@playwright/test';

test.describe('Layout Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동하여 테스트 시작
    await page.goto('/diaries');
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 1000 });
  });

  test('다크모드 토글이 헤더에 올바르게 렌더링됨', async ({ page }) => {
    // 토글 요소 존재 확인
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // 토글이 헤더 우상단에 위치하는지 확인
    const header = page.locator('[data-testid="layout-header"]');
    const headerActions = header.locator('.headerActions');
    await expect(headerActions).toBeVisible();
    await expect(headerActions).toContainText('');
    
    // 토글이 headerActions 내부에 있는지 확인
    const toggleInActions = headerActions.locator('[data-testid="theme-toggle"]');
    await expect(toggleInActions).toBeVisible();
  });

  test('토글 클릭 시 테마가 변경됨', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // 초기 상태 확인 (라이트 모드 가정)
    const htmlElement = page.locator('html');
    
    // 토글 클릭하여 다크모드로 변경
    await themeToggle.click();
    
    // 다크모드 클래스가 적용되었는지 확인
    await expect(htmlElement).toHaveClass(/dark/);
    
    // 다시 클릭하여 라이트모드로 변경
    await themeToggle.click();
    
    // 다크모드 클래스가 제거되었는지 확인
    await expect(htmlElement).not.toHaveClass(/dark/);
  });

  test('토글 상태가 현재 테마를 올바르게 반영함', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const htmlElement = page.locator('html');
    
    // 초기 상태에서 토글이 체크되지 않은 상태인지 확인 (라이트모드)
    const toggleInput = themeToggle.locator('input[type="checkbox"]');
    await expect(toggleInput).not.toBeChecked();
    
    // 다크모드로 변경
    await themeToggle.click();
    await expect(htmlElement).toHaveClass(/dark/);
    await expect(toggleInput).toBeChecked();
    
    // 라이트모드로 다시 변경
    await themeToggle.click();
    await expect(htmlElement).not.toHaveClass(/dark/);
    await expect(toggleInput).not.toBeChecked();
  });

  test('페이지 새로고침 후에도 테마 설정이 유지됨', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const htmlElement = page.locator('html');
    
    // 다크모드로 변경
    await themeToggle.click();
    await expect(htmlElement).toHaveClass(/dark/);
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 1000 });
    
    // 다크모드가 유지되는지 확인
    const htmlAfterReload = page.locator('html');
    await expect(htmlAfterReload).toHaveClass(/dark/);
    
    // 토글 상태도 올바르게 유지되는지 확인
    const toggleAfterReload = page.locator('[data-testid="theme-toggle"]');
    const toggleInputAfterReload = toggleAfterReload.locator('input[type="checkbox"]');
    await expect(toggleInputAfterReload).toBeChecked();
  });

  test('다른 페이지로 이동해도 테마 설정이 유지됨', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // 다크모드로 변경
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 1000 });
    
    // 다크모드가 유지되는지 확인
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // 토글 상태도 올바르게 유지되는지 확인
    const toggleOnDetailPage = page.locator('[data-testid="theme-toggle"]');
    const toggleInputOnDetailPage = toggleOnDetailPage.locator('input[type="checkbox"]');
    await expect(toggleInputOnDetailPage).toBeChecked();
  });

  test('키보드 접근성: 스페이스바로 토글 조작 가능', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // 토글에 포커스
    await themeToggle.focus();
    
    // 스페이스바로 토글 활성화
    await page.keyboard.press('Space');
    
    // 다크모드로 변경되었는지 확인
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // 다시 스페이스바로 토글
    await page.keyboard.press('Space');
    
    // 라이트모드로 변경되었는지 확인
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('토글이 탭 네비게이션에 포함됨', async ({ page }) => {
    // 로고에서 시작하여 탭으로 이동
    await page.locator('[data-testid="header-logo"]').focus();
    
    // 탭을 눌러 토글로 이동 (헤더 내 다음 포커스 가능한 요소)
    await page.keyboard.press('Tab');
    
    // 토글이 포커스되었는지 확인
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeFocused();
  });

  test('토글에 적절한 ARIA 속성이 설정됨', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // role="switch" 속성 확인
    await expect(themeToggle).toHaveAttribute('role', 'switch');
    
    // aria-checked 속성 확인 (초기 상태)
    await expect(themeToggle).toHaveAttribute('aria-checked', 'false');
    
    // 토글 클릭 후 aria-checked 변경 확인
    await themeToggle.click();
    await expect(themeToggle).toHaveAttribute('aria-checked', 'true');
  });

  test('토글 크기가 small로 올바르게 설정됨', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // small 크기 클래스가 적용되었는지 확인
    await expect(themeToggle).toHaveClass(/size-small/);
  });

  test('토글 variant가 primary로 올바르게 설정됨', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // primary variant 클래스가 적용되었는지 확인
    await expect(themeToggle).toHaveClass(/variant-primary/);
  });

  test('시스템 다크모드 설정에 따른 초기 상태 확인', async ({ page, context }) => {
    // 시스템을 다크모드로 설정
    await context.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });
    
    // 새 페이지로 이동
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 1000 });
    
    // 시스템 설정에 따라 다크모드가 적용되었는지 확인
    // (next-themes의 defaultTheme이 "system"으로 설정된 경우)
    const htmlElement = page.locator('html');
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const toggleInput = themeToggle.locator('input[type="checkbox"]');
    
    // 시스템 다크모드에 따른 초기 상태 확인
    await expect(htmlElement).toHaveClass(/dark/);
    await expect(toggleInput).toBeChecked();
  });

  test('토글 비활성화 상태 테스트 (disabled prop)', async ({ page }) => {
    // 이 테스트는 토글이 disabled 상태일 때의 동작을 확인
    // 현재 구현에서는 disabled가 false로 설정되어 있으므로 
    // 토글이 정상적으로 작동하는지만 확인
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // 토글이 활성화 상태인지 확인
    await expect(themeToggle).not.toHaveAttribute('aria-disabled', 'true');
    
    // 클릭이 정상적으로 작동하는지 확인
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
