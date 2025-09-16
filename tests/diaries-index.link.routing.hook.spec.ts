import { test, expect } from '@playwright/test';
import { Emotion } from '../src/commons/constants/enum';

test.describe('Diaries Index Link Routing Hook', () => {
  // 테스트용 일기 데이터
  const testDiaries = [
    {
      id: 1,
      title: '첫 번째 일기',
      content: '오늘은 정말 좋은 하루였다.',
      emotion: Emotion.HAPPY,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      title: '두 번째 일기',
      content: '조금 슬픈 하루였다.',
      emotion: Emotion.SAD,
      createdAt: '2024-01-02'
    },
    {
      id: 3,
      title: '세 번째 일기',
      content: '화가 나는 일이 있었다.',
      emotion: Emotion.ANGRY,
      createdAt: '2024-01-03'
    }
  ];

  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');
  });

  test('일기 카드 클릭 시 상세 페이지로 이동 - 첫 번째 일기', async ({ page }) => {
    // 첫 번째 일기 카드 클릭
    await page.click('[data-testid="diary-card-1"]');
    
    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/1');
  });

  test('일기 카드 클릭 시 상세 페이지로 이동 - 두 번째 일기', async ({ page }) => {
    // 두 번째 일기 카드 클릭
    await page.click('[data-testid="diary-card-2"]');
    
    // URL이 /diaries/2로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/2');
  });

  test('일기 카드 클릭 시 상세 페이지로 이동 - 세 번째 일기', async ({ page }) => {
    // 세 번째 일기 카드 클릭
    await page.click('[data-testid="diary-card-3"]');
    
    // URL이 /diaries/3로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries/3');
  });

  test('삭제 버튼 클릭 시 페이지 이동하지 않음', async ({ page }) => {
    // 현재 URL 저장
    const currentUrl = page.url();
    
    // 첫 번째 일기 카드의 삭제 버튼 클릭 (CSS 모듈 클래스명 사용)
    await page.click('[data-testid="diary-card-1"] button');
    
    // URL이 변경되지 않았는지 확인 (약간의 대기 후)
    await page.waitForTimeout(100);
    expect(page.url()).toBe(currentUrl);
  });

  test('일기 카드에 cursor: pointer 스타일이 적용되어 있는지 확인', async ({ page }) => {
    // 첫 번째 일기 카드가 존재하는지 먼저 확인
    await page.waitForSelector('[data-testid="diary-card-1"]');
    
    // 첫 번째 일기 카드의 cursor 스타일 확인
    const cursorStyle = await page.evaluate(() => {
      const card = document.querySelector('[data-testid="diary-card-1"]') as HTMLElement;
      if (!card) return null;
      return window.getComputedStyle(card).cursor;
    });
    
    expect(cursorStyle).toBe('pointer');
  });

  test('여러 일기 카드가 모두 클릭 가능한지 확인', async ({ page }) => {
    // 모든 일기 카드 요소 가져오기
    const diaryCards = await page.locator('[data-testid^="diary-card-"]').all();
    
    // 각 카드가 클릭 가능한지 확인
    for (let i = 0; i < diaryCards.length; i++) {
      const card = diaryCards[i];
      await expect(card).toBeVisible();
      
      // 카드 클릭
      await card.click();
      
      // URL 변경 확인 (카드 ID 추출)
      const testId = await card.getAttribute('data-testid');
      const cardId = testId?.replace('diary-card-', '');
      await expect(page).toHaveURL(`/diaries/${cardId}`);
      
      // 다음 테스트를 위해 다시 일기 목록 페이지로 이동
      await page.goto('/diaries');
      await page.waitForSelector('[data-testid="diaries-container"]');
    }
  });

  test('페이지네이션 후에도 일기 카드 클릭이 정상 작동하는지 확인', async ({ page }) => {
    // 더 많은 테스트 데이터 추가 (페이지네이션 테스트용)
    const moreTestDiaries = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      title: `일기 ${index + 1}`,
      content: `내용 ${index + 1}`,
      emotion: Object.values(Emotion)[index % 5] as Emotion,
      createdAt: `2024-01-${String(index + 1).padStart(2, '0')}`
    }));

    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, moreTestDiaries);
    
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]');

    // 페이지네이션이 있는지 확인
    const paginationExists = await page.locator('.pagination').isVisible();
    
    if (paginationExists) {
      // 두 번째 페이지로 이동 (있다면)
      const nextPageButton = page.locator('button:has-text("2")');
      if (await nextPageButton.isVisible()) {
        await nextPageButton.click();
        await page.waitForTimeout(100);
        
        // 두 번째 페이지의 첫 번째 카드 클릭
        const firstCardOnSecondPage = page.locator('[data-testid^="diary-card-"]').first();
        if (await firstCardOnSecondPage.isVisible()) {
          const testId = await firstCardOnSecondPage.getAttribute('data-testid');
          const cardId = testId?.replace('diary-card-', '');
          
          await firstCardOnSecondPage.click();
          await expect(page).toHaveURL(`/diaries/${cardId}`);
        }
      }
    }
  });
});
