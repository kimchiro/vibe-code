import { test, expect } from '@playwright/test';

test.describe('일기쓰기 폼 등록 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지 초기화
    await page.goto('/diaries');
    await page.evaluate(() => localStorage.clear());
    
    // 페이지 로드 대기 (일기쓰기 버튼이 보일 때까지)
    await page.waitForSelector('button:has-text("일기쓰기")', { timeout: 2000 });
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('button:has-text("일기쓰기")');
    await page.waitForSelector('[data-testid="diary-new-modal"]', { timeout: 2000 });
  });

  test('모든 인풋이 입력되면 등록하기 버튼이 활성화된다', async ({ page }) => {
    // 초기 상태에서 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('button:has-text("등록하기")');
    await expect(submitButton).toBeDisabled();

    // 감정 선택
    await page.click('input[name="emotion"][value="HAPPY"]');
    await expect(submitButton).toBeDisabled();

    // 제목 입력
    await page.fill('input[placeholder="제목을 입력하세요"]', '테스트 일기 제목');
    await expect(submitButton).toBeDisabled();

    // 내용 입력
    await page.fill('textarea[placeholder="내용을 입력하세요"]', '테스트 일기 내용입니다.');
    
    // 모든 필드가 입력되면 등록하기 버튼이 활성화됨
    await expect(submitButton).toBeEnabled();
  });

  test('등록하기 버튼 클릭시 로컬스토리지에 데이터가 저장된다 (신규 등록)', async ({ page }) => {
    // 폼 입력
    await page.click('input[name="emotion"][value="HAPPY"]');
    await page.fill('input[placeholder="제목을 입력하세요"]', '첫 번째 일기');
    await page.fill('textarea[placeholder="내용을 입력하세요"]', '첫 번째 일기 내용입니다.');

    // 등록하기 버튼 클릭
    await page.click('button:has-text("등록하기")');

    // 로컬스토리지에 데이터가 저장되었는지 확인
    const diariesData = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });

    expect(diariesData).toBeTruthy();
    expect(diariesData).toHaveLength(1);
    expect(diariesData[0]).toMatchObject({
      id: 1,
      title: '첫 번째 일기',
      content: '첫 번째 일기 내용입니다.',
      emotion: 'HAPPY'
    });
    expect(diariesData[0].createdAt).toBeTruthy();
  });

  test('등록하기 버튼 클릭시 기존 데이터에 추가로 저장된다', async ({ page }) => {
    // 기존 데이터 설정
    await page.evaluate(() => {
      const existingData = [{
        id: 1,
        title: '기존 일기',
        content: '기존 일기 내용',
        emotion: 'SAD',
        createdAt: '2024-01-01T00:00:00.000Z'
      }];
      localStorage.setItem('diaries', JSON.stringify(existingData));
    });

    // 폼 입력
    await page.click('input[name="emotion"][value="HAPPY"]');
    await page.fill('input[placeholder="제목을 입력하세요"]', '새로운 일기');
    await page.fill('textarea[placeholder="내용을 입력하세요"]', '새로운 일기 내용입니다.');

    // 등록하기 버튼 클릭
    await page.click('button:has-text("등록하기")');

    // 로컬스토리지에 데이터가 추가되었는지 확인
    const diariesData = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });

    expect(diariesData).toHaveLength(2);
    expect(diariesData[1]).toMatchObject({
      id: 2, // 기존 최대 id(1) + 1
      title: '새로운 일기',
      content: '새로운 일기 내용입니다.',
      emotion: 'HAPPY'
    });
  });

  test('등록 완료시 등록완료 모달이 노출된다', async ({ page }) => {
    // 폼 입력
    await page.click('input[name="emotion"][value="HAPPY"]');
    await page.fill('input[placeholder="제목을 입력하세요"]', '테스트 일기');
    await page.fill('textarea[placeholder="내용을 입력하세요"]', '테스트 일기 내용');

    // 등록하기 버튼 클릭
    await page.click('button:has-text("등록하기")');

    // 등록완료 모달이 나타나는지 확인 (aria-labelledby로 구분)
    await page.waitForSelector('[role="dialog"][aria-labelledby="modal-title"]', { timeout: 2000 });
    
    // 등록완료 모달 내용 확인 (첫 번째 일치하는 모달 선택)
    const completionModal = page.locator('[role="dialog"][aria-labelledby="modal-title"]:has-text("등록 완료")').first();
    await expect(completionModal).toContainText('등록 완료');
    await expect(completionModal).toContainText('일기가 성공적으로 등록되었습니다');
    await expect(completionModal.locator('[data-testid="modal-confirm-button"]')).toBeVisible();
  });

  test('등록완료 모달의 확인 버튼 클릭시 상세페이지로 이동하고 모든 모달이 닫힌다', async ({ page }) => {
    // 폼 입력
    await page.click('input[name="emotion"][value="HAPPY"]');
    await page.fill('input[placeholder="제목을 입력하세요"]', '테스트 일기');
    await page.fill('textarea[placeholder="내용을 입력하세요"]', '테스트 일기 내용');

    // 등록하기 버튼 클릭
    await page.click('button:has-text("등록하기")');

    // 등록완료 모달 대기
    await page.waitForSelector('[role="dialog"][aria-labelledby="modal-title"]', { timeout: 2000 });

    // 등록완료 모달에서 확인 버튼 클릭
    const completionModal = page.locator('[role="dialog"][aria-labelledby="modal-title"]:has-text("등록 완료")').first();
    await completionModal.locator('[data-testid="modal-confirm-button"]').click();

    // 상세페이지로 이동했는지 확인 (등록된 id는 1)
    await expect(page).toHaveURL('/diaries/1');

    // 모든 모달이 닫혔는지 확인
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="diary-new-modal"]')).toHaveCount(0);
  });

  test('폼 검증 - 필수 필드가 비어있으면 등록할 수 없다', async ({ page }) => {
    const submitButton = page.locator('button:has-text("등록하기")');

    // 감정만 선택
    await page.click('input[name="emotion"][value="HAPPY"]');
    await expect(submitButton).toBeDisabled();

    // 제목만 추가 입력
    await page.fill('input[placeholder="제목을 입력하세요"]', '제목만');
    await expect(submitButton).toBeDisabled();

    // 내용을 지우고 다시 확인
    await page.fill('input[placeholder="제목을 입력하세요"]', '');
    await page.fill('textarea[placeholder="내용을 입력하세요"]', '내용만');
    await expect(submitButton).toBeDisabled();
  });
});
