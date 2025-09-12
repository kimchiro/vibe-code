import { test, expect } from '@playwright/test';

test.describe('DiariesDetail 데이터 바인딩 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries/1');
    
    // 실제 데이터를 로컬스토리지에 저장
    await page.evaluate(() => {
      const testDiaries = [
        {
          id: 1,
          title: '테스트 일기 제목 1',
          content: '테스트 일기 내용입니다. 이것은 실제 데이터 바인딩을 테스트하기 위한 내용입니다.',
          emotion: 'HAPPY',
          createdAt: '2024.01.15'
        },
        {
          id: 2,
          title: '테스트 일기 제목 2',
          content: '두 번째 테스트 일기 내용입니다.',
          emotion: 'SAD',
          createdAt: '2024.01.14'
        },
        {
          id: 3,
          title: '테스트 일기 제목 3',
          content: '세 번째 테스트 일기 내용입니다.',
          emotion: 'ANGRY',
          createdAt: '2024.01.13'
        }
      ];
      localStorage.setItem('diaries', JSON.stringify(testDiaries));
    });
    
    // 페이지 새로고침하여 로컬스토리지 데이터 적용
    await page.reload();
  });

  test('ID 1번 일기 상세 데이터가 올바르게 바인딩되는지 확인', async ({ page }) => {
    // 페이지 로드 완료 대기 (data-testid 기반)
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toBeVisible();
    
    // 제목 바인딩 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText('테스트 일기 제목 1');
    
    // 감정 텍스트 바인딩 확인 (HAPPY -> 행복해요)
    await expect(page.locator('[data-testid="emotion-text"]')).toHaveText('행복해요');
    
    // 작성일 바인딩 확인
    await expect(page.locator('[data-testid="diary-date"]')).toHaveText('2024.01.15');
    
    // 내용 바인딩 확인
    await expect(page.locator('[data-testid="diary-content"]')).toHaveText('테스트 일기 내용입니다. 이것은 실제 데이터 바인딩을 테스트하기 위한 내용입니다.');
    
    // 감정 아이콘 확인 (HAPPY emotion)
    const emotionIcon = page.locator('[data-testid="emotion-icon"]');
    await expect(emotionIcon).toBeVisible();
    await expect(emotionIcon).toHaveAttribute('alt', '행복해요');
  });

  test('ID 2번 일기 상세 데이터가 올바르게 바인딩되는지 확인', async ({ page }) => {
    // ID 2번 페이지로 이동
    await page.goto('/diaries/2');
    
    // 페이지 로드 완료 대기
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toBeVisible();
    
    // 제목 바인딩 확인
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText('테스트 일기 제목 2');
    
    // 감정 텍스트 바인딩 확인 (SAD -> 슬퍼요)
    await expect(page.locator('[data-testid="emotion-text"]')).toHaveText('슬퍼요');
    
    // 작성일 바인딩 확인
    await expect(page.locator('[data-testid="diary-date"]')).toHaveText('2024.01.14');
    
    // 내용 바인딩 확인
    await expect(page.locator('[data-testid="diary-content"]')).toHaveText('두 번째 테스트 일기 내용입니다.');
    
    // 감정 아이콘 확인 (SAD emotion)
    const emotionIcon = page.locator('[data-testid="emotion-icon"]');
    await expect(emotionIcon).toBeVisible();
    await expect(emotionIcon).toHaveAttribute('alt', '슬퍼요');
  });

  test('존재하지 않는 ID로 접근 시 처리 확인', async ({ page }) => {
    // 존재하지 않는 ID로 접근
    await page.goto('/diaries/999');
    
    // 페이지 로드 완료 대기
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toBeVisible();
    
    // 에러 메시지 표시 확인
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toContainText('ID 999에 해당하는 일기를 찾을 수 없습니다.');
  });

  test('로컬스토리지에 데이터가 없을 때 처리 확인', async ({ page }) => {
    // 로컬스토리지 데이터 삭제
    await page.evaluate(() => {
      localStorage.removeItem('diaries');
    });
    
    await page.goto('/diaries/1');
    
    // 페이지 로드 완료 대기
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toBeVisible();
    
    // 에러 메시지 표시 확인
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toContainText('저장된 일기가 없습니다.');
  });

  test('감정별 색상이 올바르게 적용되는지 확인', async ({ page }) => {
    // HAPPY 감정 테스트 (빨간색)
    await page.goto('/diaries/1');
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toBeVisible();
    
    const emotionText = page.locator('[data-testid="emotion-text"]');
    await expect(emotionText).toHaveCSS('color', 'rgb(220, 38, 38)'); // #dc2626
    
    // SAD 감정 테스트 (파란색)
    await page.goto('/diaries/2');
    await expect(page.locator('[data-testid="diaries-detail-container"]')).toBeVisible();
    
    const emotionTextSad = page.locator('[data-testid="emotion-text"]');
    await expect(emotionTextSad).toHaveCSS('color', 'rgb(2, 132, 199)'); // #0284c7
  });
});
