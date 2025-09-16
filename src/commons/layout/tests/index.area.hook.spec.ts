import { test, expect } from '@playwright/test';

test.describe('Layout Area Hook', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 로드 대기 (data-testid 기반)
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 500 });
  });

  test('일기목록 페이지에서 모든 UI 영역이 표시되어야 함', async ({ page }) => {
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 500 });

    // header 영역 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // header 내 로고 확인
    const logo = page.locator('[data-testid="header-logo"]');
    await expect(logo).toBeVisible();
    
    // banner 영역 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();
    
    // navigation 영역 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();
    
    // footer 영역 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test('일기상세 페이지에서 header와 footer만 표시되어야 함', async ({ page }) => {
    // 일기 상세 페이지로 이동 (동적 라우팅)
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 500 });

    // header 영역 확인 (표시되어야 함)
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // header 내 로고 확인 (표시되어야 함)
    const logo = page.locator('[data-testid="header-logo"]');
    await expect(logo).toBeVisible();
    
    // banner 영역 확인 (숨겨져야 함)
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeHidden();
    
    // navigation 영역 확인 (숨겨져야 함)
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeHidden();
    
    // footer 영역 확인 (표시되어야 함)
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test.skip('인증 페이지에서 모든 UI 영역이 숨겨져야 함', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForSelector('body', { timeout: 500 });

    // header 영역 확인 (숨겨져야 함)
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeHidden();
    
    // banner 영역 확인 (숨겨져야 함)
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeHidden();
    
    // navigation 영역 확인 (숨겨져야 함)
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeHidden();
    
    // footer 영역 확인 (숨겨져야 함)
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeHidden();
  });

  test.skip('사진보관함 페이지 테스트는 건너뜀', async () => {
    // 요구사항에 따라 /pictures 경로는 테스트 skip
  });

  test('경로 변경 시 UI 영역 노출 상태가 동적으로 변경되어야 함', async ({ page }) => {
    // 일기목록 페이지에서 시작
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 500 });

    // 초기 상태: 모든 영역 표시
    await expect(page.locator('[data-testid="layout-banner"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-navigation"]')).toBeVisible();

    // 일기 상세 페이지로 이동
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 500 });

    // 변경된 상태: banner와 navigation 숨김
    await expect(page.locator('[data-testid="layout-banner"]')).toBeHidden();
    await expect(page.locator('[data-testid="layout-navigation"]')).toBeHidden();
    
    // header와 footer는 여전히 표시
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-footer"]')).toBeVisible();
  });

  test('존재하지 않는 경로에서 기본 UI 설정 적용', async ({ page }) => {
    await page.goto('/nonexistent');
    await page.waitForSelector('body', { timeout: 500 });

    // 기본적으로 모든 영역이 표시되어야 함 (fallback)
    const header = page.locator('[data-testid="layout-header"]');
    const banner = page.locator('[data-testid="layout-banner"]');
    const navigation = page.locator('[data-testid="layout-navigation"]');
    const footer = page.locator('[data-testid="layout-footer"]');

    // 존재하지 않는 페이지의 경우 기본 설정 적용
    await expect(header).toBeVisible();
    await expect(banner).toBeVisible();
    await expect(navigation).toBeVisible();
    await expect(footer).toBeVisible();
  });
});
