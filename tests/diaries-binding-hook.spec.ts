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

test.describe("Diaries Data Binding Hook", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 실제 데이터를 로컬스토리지에 설정
    const testDiaries: DiaryData[] = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였어요!",
        emotion: Emotion.HAPPY,
        createdAt: "2024-03-12",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "마음이 무거웠던 하루였습니다.",
        emotion: Emotion.SAD,
        createdAt: "2024-03-11",
      },
      {
        id: 3,
        title: "화난 하루",
        content: "오늘은 정말 화가 났어요.",
        emotion: Emotion.ANGRY,
        createdAt: "2024-03-10",
      },
      {
        id: 4,
        title: "놀란 하루",
        content: "예상치 못한 일이 일어났어요!",
        emotion: Emotion.SURPRISE,
        createdAt: "2024-03-09",
      },
      {
        id: 5,
        title: "평범한 하루",
        content: "그냥 평범한 하루였습니다.",
        emotion: Emotion.ETC,
        createdAt: "2024-03-08",
      },
    ];

    // 페이지 방문 전에 로컬스토리지 설정
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 새로고침하여 데이터 로드
    await page.reload();

    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 500,
    });
  });

  test("로컬스토리지에서 일기 데이터를 올바르게 로드해야 함", async ({
    page,
  }) => {
    // 일기 카드들이 렌더링되었는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(5);

    // 첫 번째 일기 카드 확인
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    await expect(firstCard).toBeVisible();
  });

  test("감정에 따른 이미지가 올바르게 표시되어야 함", async ({ page }) => {
    // HAPPY 감정 카드의 이미지 확인 (삭제 버튼이 아닌 감정 이미지)
    const happyCard = page.locator('[data-testid="diary-card-1"]');
    const happyImage = happyCard.locator('[class*="cardImage"] img');
    await expect(happyImage).toHaveAttribute(
      "src",
      "/images/emotion-happy-m.png",
    );

    // SAD 감정 카드의 이미지 확인
    const sadCard = page.locator('[data-testid="diary-card-2"]');
    const sadImage = sadCard.locator('[class*="cardImage"] img');
    await expect(sadImage).toHaveAttribute("src", "/images/emotion-sad-m.png");
  });

  test("감정 텍스트가 올바르게 표시되어야 함", async ({ page }) => {
    // HAPPY 감정 텍스트 확인
    const happyCard = page.locator('[data-testid="diary-card-1"]');
    const happyEmotion = happyCard.locator('[class*="cardEmotion"]');
    await expect(happyEmotion).toHaveText("행복해요");

    // SAD 감정 텍스트 확인
    const sadCard = page.locator('[data-testid="diary-card-2"]');
    const sadEmotion = sadCard.locator('[class*="cardEmotion"]');
    await expect(sadEmotion).toHaveText("슬퍼요");
  });

  test("작성일이 올바르게 표시되어야 함", async ({ page }) => {
    // 첫 번째 카드의 작성일 확인
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    const cardDate = firstCard.locator('[class*="cardDate"]');
    await expect(cardDate).toHaveText("2024-03-12");
  });

  test("제목이 올바르게 표시되어야 함", async ({ page }) => {
    // 첫 번째 카드의 제목 확인
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    const cardText = firstCard.locator('[class*="cardText"]');
    await expect(cardText).toHaveText("행복한 하루");
  });

  test("긴 제목이 말줄임 처리되어야 함", async ({ page }) => {
    // 긴 제목을 가진 테스트 데이터 추가
    const longTitleDiary: DiaryData = {
      id: 6,
      title:
        "이것은 매우 긴 제목으로 일기카드 사이즈를 넘어가는 경우를 테스트하기 위한 제목입니다",
      content: "긴 제목 테스트",
      emotion: Emotion.HAPPY,
      createdAt: "2024-03-07",
    };

    await page.evaluate((diary) => {
      const existingDiaries = JSON.parse(
        localStorage.getItem("diaries") || "[]",
      );
      existingDiaries.push(diary);
      localStorage.setItem("diaries", JSON.stringify(existingDiaries));
    }, longTitleDiary);

    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 500,
    });

    // 긴 제목 카드 확인
    const longTitleCard = page.locator('[data-testid="diary-card-6"]');
    const cardText = longTitleCard.locator('[class*="cardText"]');

    // CSS ellipsis가 적용되었는지 확인
    await expect(cardText).toHaveCSS("text-overflow", "ellipsis");
    await expect(cardText).toHaveCSS("overflow", "hidden");
  });

  test("빈 로컬스토리지일 때 빈 상태를 처리해야 함", async ({ page }) => {
    // 로컬스토리지 비우기
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });

    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 500,
    });

    // 일기 카드가 없어야 함
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test("잘못된 데이터 형식일 때 오류를 처리해야 함", async ({ page }) => {
    // 잘못된 형식의 데이터 설정
    await page.evaluate(() => {
      localStorage.setItem("diaries", "invalid-json");
    });

    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 500,
    });

    // 일기 카드가 없어야 함 (오류 처리로 인해)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0);
  });
});
