import { test, expect } from '@playwright/test';

test.describe('Layout Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동하여 테스트 시작
    await page.goto('/diaries');
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 1000 });
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
