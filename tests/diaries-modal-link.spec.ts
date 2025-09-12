import { test, expect } from '@playwright/test';
import { Emotion } from '../src/commons/constants/enum';

// 테스트용 일기 데이터 타입
interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

test.describe('Diaries Modal Link Hook', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 실제 데이터를 로컬스토리지에 설정
    const testDiaries: DiaryData[] = [
      {
        id: 1,
        title: '행복한 하루',
        content: '오늘은 정말 행복한 하루였어요!',
        emotion: Emotion.HAPPY,
        createdAt: '2024-03-12'
      },
      {
        id: 2,
        title: '슬픈 하루',
        content: '마음이 무거웠던 하루였습니다.',
        emotion: Emotion.SAD,
        createdAt: '2024-03-11'
      }
    ];

    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 로컬스토리지에 테스트 데이터 설정
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    await page.waitForSelector('[data-testid="diary-card-1"]', { timeout: 500 });
  });

  test('일기쓰기 버튼 클릭 시 모달이 열려야 함', async ({ page }) => {
    // 일기쓰기 버튼 클릭
    const writeButton = page.locator('button:has-text("일기쓰기")');
    await expect(writeButton).toBeVisible();
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // 모달 내용 확인
    await expect(page.locator('h1:has-text("일기쓰기")')).toBeVisible();
    await expect(page.locator('text=오늘 기분은 어땠나요?')).toBeVisible();
  });

  test('모달 백드롭 클릭 시 모달이 닫혀야 함', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // 백드롭 클릭 (모달 외부 영역) - 백드롭이 존재하는지 먼저 확인
    const backdrop = page.locator('[style*="z-index"]').first();
    await backdrop.click({ position: { x: 10, y: 10 } });

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible();
  });

  test('모달 닫기 버튼 클릭 시 등록취소 확인 후 모달이 닫혀야 함', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // 등록취소 확인 모달이 나타나는지 확인
    const confirmModal = page.locator('[data-testid="cancel-confirmation-modal"]');
    await expect(confirmModal).toBeVisible();

    // 등록취소 버튼 클릭
    const confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await confirmButton.click();

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible();
    await expect(confirmModal).not.toBeVisible();
  });

  test('ESC 키 누를 시 모달이 닫혀야 함', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // ESC 키 누르기
    await page.keyboard.press('Escape');

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible();
  });

  test('모달이 열린 상태에서 body 스크롤이 비활성화되어야 함', async ({ page }) => {
    // 초기 body overflow 상태 확인
    const initialOverflow = await page.evaluate(() => document.body.style.overflow);
    
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // body overflow가 hidden으로 설정되었는지 확인
    const modalOpenOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(modalOpenOverflow).toBe('hidden');

    // 모달 닫기
    await page.keyboard.press('Escape');

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible();

    // body overflow가 원래 상태로 복원되었는지 확인
    const modalClosedOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(modalClosedOverflow).toBe('unset');
  });

  test('모달 내부 클릭 시 모달이 닫히지 않아야 함', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // 모달 내부 요소 클릭 (제목 입력 필드)
    const titleInput = page.locator('input[placeholder="제목을 입력하세요"]');
    await titleInput.click();

    // 모달이 여전히 열려있는지 확인
    await expect(modal).toBeVisible();
  });
});
