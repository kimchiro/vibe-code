import { test, expect } from '@playwright/test';

test.describe('DiariesNew 모달 닫기 기능', () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-card-1"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")');
    await writeButton.click();
    
    // 일기쓰기 모달이 열렸는지 확인
    await page.waitForSelector('[data-testid="diary-new-modal"]', { timeout: 500 });
  });

  test('닫기 버튼 클릭 시 등록취소 모달이 2중 모달로 표시되어야 함', async ({ page }) => {
    // 닫기 버튼 클릭
    const closeButton = page.locator('[data-testid="diary-close-button"]');
    await closeButton.click();
    
    // 등록취소 모달이 표시되는지 확인
    await page.waitForSelector('[data-testid="cancel-confirmation-modal"]', { timeout: 500 });
    
    // 2중 모달인지 확인 (부모 모달과 자식 모달 모두 존재)
    const parentModal = page.locator('[data-testid="diary-new-modal"]').first();
    const childModal = page.locator('[data-testid="cancel-confirmation-modal"]');
    
    await expect(parentModal).toBeVisible();
    await expect(childModal).toBeVisible();
    
    // 등록취소 모달의 내용 확인
    await expect(childModal.locator('h2')).toContainText('등록을 취소하시겠습니까?');
    await expect(childModal.locator('[data-testid="modal-confirm-button"]')).toContainText('등록 취소');
    await expect(childModal.locator('button').filter({ hasText: '계속 작성' })).toBeVisible();
  });

  test('등록취소 모달의 계속작성 버튼 클릭 시 등록취소 모달만 닫혀야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    const closeButton = page.locator('[data-testid="diary-close-button"]');
    await closeButton.click();
    await page.waitForSelector('[data-testid="cancel-confirmation-modal"]', { timeout: 500 });
    
    // 계속작성 버튼 클릭
    const continueButton = page.locator('button:has-text("계속 작성")');
    await continueButton.click();
    
    // 등록취소 모달은 닫히고, 일기쓰기 모달은 여전히 열려있어야 함
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diary-new-modal"]').first()).toBeVisible();
  });

  test('등록취소 모달의 등록취소 버튼 클릭 시 모든 모달이 닫혀야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    const closeButton = page.locator('[data-testid="diary-close-button"]');
    await closeButton.click();
    await page.waitForSelector('[data-testid="cancel-confirmation-modal"]', { timeout: 500 });
    
    // 등록취소 버튼 클릭
    const confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await confirmButton.click();
    
    // 모든 모달이 닫혀야 함
    await expect(page.locator('[data-testid="cancel-confirmation-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diary-new-modal"]')).not.toBeVisible();
    
    // /diaries 페이지로 돌아갔는지 확인 (diary-card-1이 다시 보이는지 확인)
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
  });

  test('등록취소 모달이 부모 모달 위 중앙에 overlay되어야 함', async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    const closeButton = page.locator('[data-testid="diary-close-button"]');
    await closeButton.click();
    await page.waitForSelector('[data-testid="cancel-confirmation-modal"]', { timeout: 500 });
    
    // z-index 확인 (자식 모달이 부모 모달보다 높아야 함)
    const parentModal = page.locator('[data-testid="diary-new-modal"]').first();
    const childModal = page.locator('[data-testid="cancel-confirmation-modal"]');
    
    const parentZIndex = await parentModal.evaluate(el => window.getComputedStyle(el.closest('[style*="z-index"]') || el).zIndex);
    const childZIndex = await childModal.evaluate(el => window.getComputedStyle(el.closest('[style*="z-index"]') || el).zIndex);
    
    expect(parseInt(childZIndex)).toBeGreaterThan(parseInt(parentZIndex));
    
    // 중앙 정렬 확인
    const childBox = await childModal.boundingBox();
    const parentBox = await parentModal.boundingBox();
    
    if (childBox && parentBox) {
      const childCenterX = childBox.x + childBox.width / 2;
      const parentCenterX = parentBox.x + parentBox.width / 2;
      
      // 중앙 정렬 허용 오차 (10px)
      expect(Math.abs(childCenterX - parentCenterX)).toBeLessThan(10);
    }
  });
});
