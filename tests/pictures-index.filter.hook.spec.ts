import { test, expect } from '@playwright/test';

test.describe('Pictures Filter Hook Tests', () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto('/pictures');
    
    // 페이지 로드 완료 대기 (고정식별자 data-testid 사용)
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
  });

  test('필터 선택박스가 올바르게 렌더링되는지 확인', async ({ page }) => {
    // 필터 선택박스가 존재하는지 확인
    const selectBox = page.locator('[data-testid="filter-select"]');
    await expect(selectBox).toBeVisible();
    
    // 기본값이 '기본형'으로 설정되어 있는지 확인 (표시된 텍스트로 확인)
    await expect(selectBox).toContainText('기본형');
  });

  test('필터 옵션들이 올바르게 표시되는지 확인', async ({ page }) => {
    // 필터 선택박스 클릭
    await page.click('[data-testid="filter-select"]');
    
    // 옵션들이 표시되는지 확인 (role="option"을 가진 요소들)
    await expect(page.locator('[role="option"]:has-text("기본형")')).toBeVisible();
    await expect(page.locator('[role="option"]:has-text("가로형")')).toBeVisible();
    await expect(page.locator('[role="option"]:has-text("세로형")')).toBeVisible();
  });

  test('기본형 필터 선택 시 이미지 크기가 640x640으로 설정되는지 확인', async ({ page }) => {
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 기본형 선택 (이미 기본값이지만 명시적으로 선택)
    await page.click('[data-testid="filter-select"]');
    await page.click('[role="option"]:has-text("기본형")');
    
    // 첫 번째 이미지 컨테이너의 크기 확인
    const photoItem = page.locator('[data-testid="photo-item"]').first();
    await expect(photoItem).toHaveCSS('width', '640px');
    await expect(photoItem).toHaveCSS('height', '640px');
  });

  test('가로형 필터 선택 시 이미지 크기가 640x480으로 변경되는지 확인', async ({ page }) => {
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 가로형 선택
    await page.click('[data-testid="filter-select"]');
    await page.click('[role="option"]:has-text("가로형")');
    
    // 첫 번째 이미지 컨테이너의 크기 확인
    const photoItem = page.locator('[data-testid="photo-item"]').first();
    await expect(photoItem).toHaveCSS('width', '640px');
    await expect(photoItem).toHaveCSS('height', '480px');
  });

  test('세로형 필터 선택 시 이미지 크기가 480x640으로 변경되는지 확인', async ({ page }) => {
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 세로형 선택
    await page.click('[data-testid="filter-select"]');
    await page.click('[role="option"]:has-text("세로형")');
    
    // 첫 번째 이미지 컨테이너의 크기 확인
    const photoItem = page.locator('[data-testid="photo-item"]').first();
    await expect(photoItem).toHaveCSS('width', '480px');
    await expect(photoItem).toHaveCSS('height', '640px');
  });

  test('필터 변경 시 모든 이미지에 새로운 크기가 적용되는지 확인', async ({ page }) => {
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 가로형으로 변경
    await page.click('[data-testid="filter-select"]');
    await page.click('[role="option"]:has-text("가로형")');
    
    // 모든 이미지 컨테이너의 크기 확인
    const photoItems = page.locator('[data-testid="photo-item"]');
    const count = await photoItems.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) { // 처음 3개만 확인
      const item = photoItems.nth(i);
      await expect(item).toHaveCSS('width', '640px');
      await expect(item).toHaveCSS('height', '480px');
    }
  });

  test('필터 변경이 실시간으로 반영되는지 확인', async ({ page }) => {
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    const photoItem = page.locator('[data-testid="photo-item"]').first();
    
    // 기본형에서 세로형으로 변경
    await page.click('[data-testid="filter-select"]');
    await page.click('[role="option"]:has-text("세로형")');
    await expect(photoItem).toHaveCSS('width', '480px');
    await expect(photoItem).toHaveCSS('height', '640px');
    
    // 세로형에서 가로형으로 변경
    await page.click('[data-testid="filter-select"]');
    await page.click('[role="option"]:has-text("가로형")');
    await expect(photoItem).toHaveCSS('width', '640px');
    await expect(photoItem).toHaveCSS('height', '480px');
    
    // 가로형에서 기본형으로 변경
    await page.click('[data-testid="filter-select"]');
    await page.click('[role="option"]:has-text("기본형")');
    await expect(photoItem).toHaveCSS('width', '640px');
    await expect(photoItem).toHaveCSS('height', '640px');
  });
});
