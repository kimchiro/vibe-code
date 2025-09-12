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

  test('사진보관함 탭 클릭 시 사진목록 페이지로 이동 및 액티브 상태 변경', async ({ page }) => {
    // 사진보관함 탭 클릭
    await page.click('[data-testid="nav-pictures"]');
    
    // URL 확인
    await expect(page).toHaveURL('/pictures');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 500 });
    
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

  test('탭 간 전환 시 액티브 상태가 올바르게 변경됨', async ({ page }) => {
    // 초기 상태: 일기보관함 활성화
    const diariesNav = page.locator('[data-testid="nav-diaries"]');
    const picturesNav = page.locator('[data-testid="nav-pictures"]');
    
    await expect(diariesNav).toHaveClass(/navTextActive/);
    await expect(picturesNav).not.toHaveClass(/navTextActive/);
    
    // 사진보관함으로 전환
    await page.click('[data-testid="nav-pictures"]');
    await page.waitForURL('/pictures');
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 500 });
    
    await expect(picturesNav).toHaveClass(/navTextActive/);
    await expect(diariesNav).not.toHaveClass(/navTextActive/);
    
    // 다시 일기보관함으로 전환
    await page.click('[data-testid="nav-diaries"]');
    await page.waitForURL('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    await expect(diariesNav).toHaveClass(/navTextActive/);
    await expect(picturesNav).not.toHaveClass(/navㄷTextActive/);
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

  test('일기 카드 클릭 시 상세 페이지로 이동', async ({ page }) => {
    // 테스트용 데이터를 로컬스토리지에 설정
    await page.evaluate(() => {
      const testDiaries = [
        {
          id: 1,
          title: '테스트 일기',
          content: '테스트 내용',
          emotion: 'HAPPY',
          createdAt: '2024-03-12'
        }
      ];
      localStorage.setItem('diaries', JSON.stringify(testDiaries));
    });
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기 목록 페이지에서 첫 번째 일기 카드 클릭
    const firstDiaryCard = page.locator('[data-testid="diary-card-1"]');
    await expect(firstDiaryCard).toBeVisible();
    await expect(firstDiaryCard).toHaveCSS('cursor', 'pointer');
    
    // 일기 카드 클릭
    await firstDiaryCard.click();
    
    // 일기 상세 페이지로 이동했는지 확인
    await expect(page).toHaveURL('/diaries/1');
  });
});
