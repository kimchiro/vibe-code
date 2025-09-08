import { test, expect } from '@playwright/test';

test.describe('Layout Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동하여 테스트 시작
    await page.goto('/diaries');
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 500 });
  });

  test('로고 클릭 시 일기목록 페이지로 이동', async ({ page }) => {
    // 다른 페이지로 먼저 이동
    await page.goto('/temp');
    await page.waitForSelector('[data-testid="header-logo"]', { timeout: 500 });
    
    // 로고 클릭
    await page.click('[data-testid="header-logo"]');
    
    // URL 확인
    await expect(page).toHaveURL('/diaries');
    
    // 일기보관함 탭이 활성화되었는지 확인
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).toHaveClass(/navTextActive/);
  });

  test('일기보관함 탭 클릭 시 일기목록 페이지로 이동 및 액티브 상태 변경', async ({ page }) => {
    // 일기보관함 탭 클릭
    await page.click('[data-testid="nav-diaries"]');
    
    // URL 확인
    await expect(page).toHaveURL('/diaries');
    
    // 일기보관함 탭이 활성화되었는지 확인
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).toHaveClass(/navTextActive/);
    
    // 사진보관함 탭이 비활성화되었는지 확인
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesNav).not.toHaveClass(/navTextActive/);
  });

  test.skip('사진보관함 탭 클릭 시 사진목록 페이지로 이동 및 액티브 상태 변경 - /pictures 경로 테스트 제외', async ({ page }) => {
    // /pictures 경로 테스트는 요구사항에 따라 제외
    // 사진보관함 탭 클릭
    await page.click('[data-testid="nav-pictures"]');
    
    // URL 확인
    await expect(page).toHaveURL('/pictures');
    
    // 사진보관함 탭이 활성화되었는지 확인
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesNav).toHaveClass(/navTextActive/);
    
    // 일기보관함 탭이 비활성화되었는지 확인
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).not.toHaveClass(/navTextActive/);
  });

  test('페이지 직접 접근 시 올바른 탭이 활성화됨', async ({ page }) => {
    // 일기목록 페이지 직접 접근
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="nav-diaries"]', { timeout: 500 });
    
    // 일기보관함 탭이 활성화되었는지 확인
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).toHaveClass(/navTextActive/);
    
    // 사진보관함 탭이 비활성화되었는지 확인
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesNav).not.toHaveClass(/navTextActive/);
  });

  test.skip('탭 간 전환 시 액티브 상태가 올바르게 변경됨 - /pictures 경로 포함으로 테스트 제외', async ({ page }) => {
    // /pictures 경로가 포함된 테스트는 요구사항에 따라 제외
    // 초기 상태: 일기보관함 활성화
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    
    await expect(diariesNav).toHaveClass(/navTextActive/);
    await expect(picturesNav).not.toHaveClass(/navTextActive/);
    
    // 사진보관함으로 전환
    await page.click('[data-testid="nav-pictures"]');
    await page.waitForURL('/pictures');
    
    await expect(picturesNav).toHaveClass(/navTextActive/);
    await expect(diariesNav).not.toHaveClass(/navTextActive/);
    
    // 다시 일기보관함으로 전환
    await page.click('[data-testid="nav-diaries"]');
    await page.waitForURL('/diaries');
    
    await expect(diariesNav).toHaveClass(/navTextActive/);
    await expect(picturesNav).not.toHaveClass(/navTextActive/);
  });

  test('네비게이션 요소들이 클릭 가능한 상태인지 확인', async ({ page }) => {
    // 로고가 클릭 가능한지 확인
    const logo = page.locator('[data-testid="header-logo"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveCSS('cursor', 'pointer');
    
    // 일기보관함 탭이 클릭 가능한지 확인
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesNav).toBeVisible();
    await expect(diariesNav).toHaveCSS('cursor', 'pointer');
    
    // 사진보관함 탭 존재 확인만 (클릭 테스트는 제외)
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesNav).toBeVisible();
    await expect(picturesNav).toHaveCSS('cursor', 'pointer');
  });
});
