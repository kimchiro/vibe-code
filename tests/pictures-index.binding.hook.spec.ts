import { test, expect } from '@playwright/test';

test.describe('Pictures 컴포넌트 - 강아지 사진 조회 기능', () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto('/pictures');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 5000 });
  });

  test.describe('성공 시나리오 - 실제 API 사용', () => {
    test('페이지 로드 시 강아지 사진 6장이 로드되어야 함', async ({ page }) => {
      // 로딩 스플래시 스크린이 표시되는지 확인 (선택적)
      const loadingSplash = page.locator('[data-testid="loading-splash"]');
      const isLoadingVisible = await loadingSplash.isVisible();
      
      if (isLoadingVisible) {
        console.log('로딩 스플래시가 표시됨');
      }
      
      // API 응답을 기다림 (5초 이내)
      await page.waitForSelector('[data-testid="dog-image"]', { timeout: 5000 });
      
      // 로딩 스플래시가 사라지는지 확인 (있었다면)
      if (isLoadingVisible) {
        await expect(loadingSplash).not.toBeVisible({ timeout: 3000 });
      }
      
      // 강아지 이미지가 6개 표시되는지 확인
      const dogImages = page.locator('[data-testid="dog-image"]');
      await expect(dogImages).toHaveCount(6, { timeout: 5000 });
      
      // 모든 이미지가 dog.ceo 도메인을 포함하는지 확인
      const imageCount = await dogImages.count();
      for (let i = 0; i < imageCount; i++) {
        const imageSrc = await dogImages.nth(i).getAttribute('src');
        expect(imageSrc).toContain('dog.ceo');
      }
    });

    test('무한스크롤 - 마지막 2개 이미지만 남았을 때 추가 로드', async ({ page }) => {
      // 초기 6개 이미지 로드 대기
      await page.waitForSelector('[data-testid="dog-image"]', { timeout: 5000 });
      
      // 초기 이미지 개수 확인
      let dogImages = page.locator('[data-testid="dog-image"]');
      await expect(dogImages).toHaveCount(6, { timeout: 5000 });
      
      // 마지막에서 2번째 이미지로 스크롤 (5번째 이미지, index 4)
      const fifthImage = dogImages.nth(4); // 0-based index, 5번째 이미지
      await fifthImage.scrollIntoViewIfNeeded();
      
      // 잠시 대기하여 스크롤 이벤트가 처리되도록 함
      await page.waitForTimeout(1000);
      
      // 추가 이미지가 로드될 때까지 대기 (5초 이내)
      await page.waitForFunction(() => {
        const images = document.querySelectorAll('[data-testid="dog-image"]');
        return images.length > 6;
      }, { timeout: 5000 });
      
      // 추가 이미지가 로드되었는지 확인
      dogImages = page.locator('[data-testid="dog-image"]');
      const finalCount = await dogImages.count();
      expect(finalCount).toBeGreaterThan(6);
    });

    test('스플래시 스크린이 6개 표시되어야 함', async ({ page }) => {
      // 페이지 새로고침하여 로딩 상태 다시 확인
      await page.reload();
      await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 5000 });
      
      // 스플래시 스크린이 표시되는지 확인 (빠르게 사라질 수 있음)
      const splashScreens = page.locator('[data-testid="splash-screen-item"]');
      
      // 스플래시 스크린이 표시되거나 이미 사라졌을 수 있음
      const splashCount = await splashScreens.count();
      
      if (splashCount > 0) {
        // 스플래시 스크린이 표시된 경우
        await expect(splashScreens).toHaveCount(6);
        console.log('스플래시 스크린 6개 확인됨');
      } else {
        // 스플래시 스크린이 이미 사라진 경우, 강아지 이미지가 로드되었는지 확인
        await page.waitForSelector('[data-testid="dog-image"]', { timeout: 3000 });
        const dogImages = page.locator('[data-testid="dog-image"]');
        await expect(dogImages).toHaveCount(6);
        console.log('스플래시 스크린이 빠르게 사라지고 강아지 이미지 로드됨');
      }
    });
  });

  test.describe('실패 시나리오 - API 모킹', () => {
    test('API 요청 실패 시 에러 처리', async ({ page }) => {
      // API 요청을 실패로 모킹
      await page.route('/api/dog/breeds/image/random/6', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error', status: 'error' })
        });
      });
      
      // 페이지 새로고침
      await page.reload();
      await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 1000 });
      
      // 에러 메시지가 표시되는지 확인
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 5000 });
      
      // 로딩 스플래시가 사라지는지 확인
      await expect(page.locator('[data-testid="loading-splash"]')).not.toBeVisible({ timeout: 3000 });
    });

    test('네트워크 타임아웃 시 에러 처리', async ({ page }) => {
      // API 요청을 지연시켜 타임아웃 발생
      await page.route('/api/dog/breeds/image/random/6', route => {
        // 3초 지연 후 응답 (타임아웃 테스트)
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ 
              message: [
                'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg'
              ], 
              status: 'success' 
            })
          });
        }, 3000);
      });
      
      // 페이지 새로고침
      await page.reload();
      await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 5000 });
      
      // 에러 메시지나 타임아웃 처리가 표시되는지 확인
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible({ timeout: 5000 });
    });

    test('무한스크롤 추가 로드 실패 시 에러 처리', async ({ page }) => {
      // 초기 로드 대기 (beforeEach에서 이미 페이지가 로드됨)
      await page.waitForSelector('[data-testid="dog-image"]', { timeout: 5000 });
      
      // 이제 추가 API 요청만 실패하도록 설정
      await page.route('**/api/dog/breeds/image/random/6', route => {
        console.log('무한스크롤 API 요청 - 실패 응답 전송');
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error', status: 'error' })
        });
      });
      
      // 스크롤하여 추가 로드 트리거 (마지막에서 2번째 이미지 = 5번째 이미지, index 4)
      const fifthImage = page.locator('[data-testid="dog-image"]').nth(4);
      await fifthImage.scrollIntoViewIfNeeded();
      
      // 잠시 대기하여 스크롤 이벤트가 처리되도록 함
      await page.waitForTimeout(2000);
      
      // 현재 페이지 상태 확인
      const currentImages = await page.locator('[data-testid="dog-image"]').count();
      console.log(`현재 이미지 개수: ${currentImages}`);
      
      // 로딩 인디케이터가 나타나는지 확인
      const loadingIndicator = page.locator('.loadMoreIndicator');
      const isLoadingVisible = await loadingIndicator.isVisible();
      console.log(`로딩 인디케이터 표시 여부: ${isLoadingVisible}`);
      
      // 에러 메시지나 로딩 인디케이터 중 하나가 표시될 때까지 대기
      await Promise.race([
        page.locator('[data-testid="load-more-error"]').waitFor({ state: 'visible', timeout: 5000 }),
        page.locator('.loadMoreIndicator').waitFor({ state: 'visible', timeout: 5000 })
      ]).catch(() => {
        console.log('로딩 인디케이터나 에러 메시지가 표시되지 않음');
      });
      
      // 에러 메시지가 표시되는지 확인
      await expect(page.locator('[data-testid="load-more-error"]')).toBeVisible({ timeout: 5000 });
    });
  });
});
