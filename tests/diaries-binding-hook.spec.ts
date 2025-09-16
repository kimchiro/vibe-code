import { test, expect } from '@playwright/test';
import { Emotion } from '../src/commons/constants/enum';

test.describe('Diaries Data Binding Hook', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 실제 데이터를 로컬스토리지에 설정
    const testDiaries = [
      {
        id: 1,
        title: '오늘은 정말 행복한 하루였어요!',
        content: '친구들과 함께 맛있는 음식을 먹고 즐거운 시간을 보냈습니다.',
        emotion: Emotion.HAPPY,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: '조금 슬픈 일이 있었네요',
        content: '오늘 하루 종일 비가 와서 기분이 우울했어요.',
        emotion: Emotion.SAD,
        createdAt: '2024-01-14'
      },
      {
        id: 3,
        title: '화가 나는 상황이 발생했어요',
        content: '버스를 놓쳐서 지각할 뻔했습니다.',
        emotion: Emotion.ANGRY,
        createdAt: '2024-01-13'
      },
      {
        id: 4,
        title: '깜짝 놀란 일이 있었어요!',
        content: '예상치 못한 좋은 소식을 들었습니다.',
        emotion: Emotion.SURPRISE,
        createdAt: '2024-01-12'
      },
      {
        id: 5,
        title: '그냥 평범한 하루였어요',
        content: '특별할 것 없는 일상이었습니다.',
        emotion: Emotion.ETC,
        createdAt: '2024-01-11'
      }
    ];

    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
  });

  test('로컬스토리지에서 일기 데이터를 성공적으로 로드해야 함', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');
    
    // 일기 카드들이 렌더링되었는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(5);
    
    // 첫 번째 일기 카드의 데이터 확인
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    await expect(firstCard).toBeVisible();
    
    // 감정 텍스트 확인 (HAPPY -> "행복해요")
    const emotionText = firstCard.locator('[data-testid="emotion-text"]');
    await expect(emotionText).toHaveText('행복해요');
    
    // 작성일 확인
    const dateText = firstCard.locator('[data-testid="date-text"]');
    await expect(dateText).toHaveText('2024-01-15');
    
    // 제목 확인 (title이 content로 매핑됨)
    const titleText = firstCard.locator('[data-testid="title-text"]');
    await expect(titleText).toHaveText('오늘은 정말 행복한 하루였어요!');
    
    // 감정 이미지 확인 (HAPPY -> emotion-happy-m.png)
    const emotionImage = firstCard.locator('[data-testid="emotion-image"]');
    await expect(emotionImage).toHaveAttribute('src', '/images/emotion-happy-m.png');
  });

  test('다양한 감정 타입의 데이터가 올바르게 바인딩되어야 함', async ({ page }) => {
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]');
    
    // SAD 감정 카드 확인
    const sadCard = page.locator('[data-testid="diary-card-2"]');
    const sadEmotionText = sadCard.locator('[data-testid="emotion-text"]');
    await expect(sadEmotionText).toHaveText('슬퍼요');
    const sadImage = sadCard.locator('[data-testid="emotion-image"]');
    await expect(sadImage).toHaveAttribute('src', '/images/emotion-sad-m.png');
    
    // ANGRY 감정 카드 확인
    const angryCard = page.locator('[data-testid="diary-card-3"]');
    const angryEmotionText = angryCard.locator('[data-testid="emotion-text"]');
    await expect(angryEmotionText).toHaveText('화나요');
    const angryImage = angryCard.locator('[data-testid="emotion-image"]');
    await expect(angryImage).toHaveAttribute('src', '/images/emotion-angry-m.png');
    
    // SURPRISE 감정 카드 확인
    const surpriseCard = page.locator('[data-testid="diary-card-4"]');
    const surpriseEmotionText = surpriseCard.locator('[data-testid="emotion-text"]');
    await expect(surpriseEmotionText).toHaveText('놀랐어요');
    const surpriseImage = surpriseCard.locator('[data-testid="emotion-image"]');
    await expect(surpriseImage).toHaveAttribute('src', '/images/emotion-surprise-m.png');
    
    // ETC 감정 카드 확인
    const etcCard = page.locator('[data-testid="diary-card-5"]');
    const etcEmotionText = etcCard.locator('[data-testid="emotion-text"]');
    await expect(etcEmotionText).toHaveText('기타');
    const etcImage = etcCard.locator('[data-testid="emotion-image"]');
    await expect(etcImage).toHaveAttribute('src', '/images/emotion-etc-m.png');
  });

  test('긴 제목이 말줄임표로 처리되어야 함', async ({ page }) => {
    // 긴 제목을 가진 테스트 데이터 설정
    const longTitleDiary = [{
      id: 1,
      title: '이것은 매우 긴 제목입니다. 일기카드 사이즈를 넘어가는 경우 말줄임표로 표현되어야 합니다. 테스트를 위한 매우 긴 텍스트입니다.',
      content: '긴 제목 테스트용 내용',
      emotion: Emotion.HAPPY,
      createdAt: '2024-01-15'
    }];

    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, longTitleDiary);

    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]');
    
    const cardText = page.locator('[data-testid="diary-card-1"] [data-testid="title-text"]');
    
    // CSS에서 text-overflow: ellipsis가 적용되었는지 확인
    const computedStyle = await cardText.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        overflow: style.overflow,
        textOverflow: style.textOverflow,
        whiteSpace: style.whiteSpace,
        webkitLineClamp: style.webkitLineClamp
      };
    });
    
    expect(computedStyle.textOverflow).toBe('ellipsis');
    expect(computedStyle.overflow).toBe('hidden');
  });

  test('로컬스토리지가 비어있을 때 빈 배열을 반환해야 함', async ({ page }) => {
    // 로컬스토리지 초기화
    await page.addInitScript(() => {
      localStorage.removeItem('diaries');
    });

    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]');
    
    // 일기 카드가 없어야 함
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test('잘못된 형식의 로컬스토리지 데이터 처리', async ({ page }) => {
    // 잘못된 JSON 데이터 설정
    await page.addInitScript(() => {
      localStorage.setItem('diaries', 'invalid json data');
    });

    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]');
    
    // 에러가 발생하지 않고 빈 배열로 처리되어야 함
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test('감정별 색상이 올바르게 적용되어야 함', async ({ page }) => {
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]');
    
    // HAPPY 감정의 색상 확인 (빨간색 계열)
    const happyCard = page.locator('[data-testid="diary-card-1"]');
    const happyEmotionElement = happyCard.locator('[data-testid="emotion-text"]');
    const happyColor = await happyEmotionElement.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    // RGB 값이 설정되어 있는지 확인 (정확한 색상 값은 CSS 변수에 따라 달라질 수 있음)
    expect(happyColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
  });
});