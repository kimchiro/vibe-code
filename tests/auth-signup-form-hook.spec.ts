import { test, expect } from '@playwright/test';

test.describe('Auth Signup Form Hook', () => {
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto('/auth/signup');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="signup-form"]', { timeout: 3000 });
  });

  test.describe('폼 유효성 검증', () => {
    test('초기 상태에서 회원가입 버튼이 비활성화되어 있다', async ({ page }) => {
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test('모든 필드가 입력되면 회원가입 버튼이 활성화된다', async ({ page }) => {
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      
      // 모든 필드 순차적으로 입력
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.waitForTimeout(100); // 폼 검증 대기
      
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.waitForTimeout(100);
      
      await page.fill('[data-testid="password-confirm-input"]', 'password123');
      await page.waitForTimeout(100);
      
      await page.fill('[data-testid="name-input"]', '테스트사용자');
      await page.waitForTimeout(300); // 최종 검증 대기
      
      // 버튼이 활성화되는지 확인
      await expect(submitButton).toBeEnabled();
    });

    test('이메일 형식이 잘못되면 에러 메시지가 표시된다', async ({ page }) => {
      // 잘못된 이메일 입력
      await page.fill('[data-testid="email-input"]', 'invalid-email');
      
      // 다른 필드로 포커스 이동하여 검증 트리거
      await page.fill('[data-testid="password-input"]', 'test');
      await page.waitForTimeout(200);
      
      // 에러 메시지 확인
      const errorMessage = page.locator('[data-testid="email-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('올바른 이메일 형식이 아닙니다');
    });

    test('비밀번호가 8자 미만이면 에러 메시지가 표시된다', async ({ page }) => {
      await page.fill('[data-testid="password-input"]', '123');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.waitForTimeout(200);
      
      const errorMessage = page.locator('[data-testid="password-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('비밀번호는 8자리 이상이어야 합니다');
    });

    test('비밀번호에 영문과 숫자가 포함되지 않으면 에러 메시지가 표시된다', async ({ page }) => {
      await page.fill('[data-testid="password-input"]', 'onlyletters');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.waitForTimeout(200);
      
      const errorMessage = page.locator('[data-testid="password-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('비밀번호는 영문과 숫자를 포함해야 합니다');
    });

    test('비밀번호 확인이 일치하지 않으면 에러 메시지가 표시된다', async ({ page }) => {
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="password-confirm-input"]', 'different123');
      await page.fill('[data-testid="name-input"]', '테스트');
      await page.waitForTimeout(200);
      
      const errorMessage = page.locator('[data-testid="password-confirm-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('비밀번호가 일치하지 않습니다');
    });

    test('이름이 비어있으면 에러 메시지가 표시된다', async ({ page }) => {
      // 먼저 이름을 입력한 후 지워서 에러를 트리거
      await page.fill('[data-testid="name-input"]', '테스트');
      await page.fill('[data-testid="name-input"]', '');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.waitForTimeout(200);
      
      const errorMessage = page.locator('[data-testid="name-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('이름을 입력해주세요');
    });
  });

  test.describe('회원가입 API 호출', () => {
    test('유효한 데이터로 회원가입 성공 시 성공 모달이 표시된다', async ({ page }) => {
      // 실제 API 사용 (Mock 없음)
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;
      
      // 유효한 폼 데이터 입력
      await page.fill('[data-testid="email-input"]', email);
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="password-confirm-input"]', 'password123');
      await page.fill('[data-testid="name-input"]', '테스트사용자');
      
      // 폼 검증 완료 대기
      await page.waitForTimeout(500);
      
      // 버튼이 활성화될 때까지 대기
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();

      // 회원가입 버튼 클릭
      await submitButton.click();

      // 성공 모달 대기 (API 응답 시간 고려)
      const successModal = page.locator('[data-testid="success-modal"]').first();
      await expect(successModal).toBeVisible({ timeout: 5000 });
      
      // 모달 내용 확인
      await expect(successModal.locator('h2')).toContainText('가입완료');
    });

    test('회원가입 실패 시 실패 모달이 표시된다', async ({ page }) => {
      // API 모킹 - 실패 시나리오
      await page.route('https://main-practice.codebootcamp.co.kr/graphql', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: '이미 존재하는 이메일입니다.' }]
          })
        });
      });

      // 폼 입력
      await page.fill('[data-testid="email-input"]', 'existing@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="password-confirm-input"]', 'password123');
      await page.fill('[data-testid="name-input"]', '테스트사용자');
      
      await page.waitForTimeout(500);
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();

      // 회원가입 버튼 클릭
      await submitButton.click();

      // 실패 모달 대기
      const errorModal = page.locator('[data-testid="error-modal"]').first();
      await expect(errorModal).toBeVisible({ timeout: 3000 });
      
      // 모달 내용 확인
      await expect(errorModal.locator('h2')).toContainText('가입실패');
    });
  });

  test.describe('모달 상호작용', () => {
    test('성공 모달에서 확인 버튼 클릭 시 로그인 페이지로 이동한다', async ({ page }) => {
      // 회원가입 성공 시나리오 실행
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;
      
      await page.fill('[data-testid="email-input"]', email);
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="password-confirm-input"]', 'password123');
      await page.fill('[data-testid="name-input"]', '테스트사용자');
      
      await page.waitForTimeout(500);
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await submitButton.click();
      
      // 성공 모달 대기
      const successModal = page.locator('[data-testid="success-modal"]').first();
      await expect(successModal).toBeVisible({ timeout: 5000 });

      // 확인 버튼 클릭
      const confirmButton = successModal.locator('[data-testid="modal-confirm-button"]');
      await confirmButton.click();

      // 로그인 페이지로 이동 확인
      await expect(page).toHaveURL('/auth/login', { timeout: 2000 });
    });

    test('실패 모달에서 확인 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
      // API 모킹 - 실패 시나리오
      await page.route('https://main-practice.codebootcamp.co.kr/graphql', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: '회원가입에 실패했습니다.' }]
          })
        });
      });

      // 폼 입력 및 제출
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="password-confirm-input"]', 'password123');
      await page.fill('[data-testid="name-input"]', '테스트사용자');
      
      await page.waitForTimeout(500);
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await submitButton.click();
      
      // 실패 모달 대기
      const errorModal = page.locator('[data-testid="error-modal"]').first();
      await expect(errorModal).toBeVisible({ timeout: 3000 });

      // 확인 버튼 클릭
      const confirmButton = errorModal.locator('[data-testid="modal-confirm-button"]');
      await confirmButton.click();

      // 모달이 닫혔는지 확인
      await expect(errorModal).not.toBeVisible({ timeout: 1000 });
      
      // 여전히 회원가입 페이지에 있는지 확인
      await expect(page).toHaveURL('/auth/signup');
    });
  });

  test.describe('로딩 상태', () => {
    test('회원가입 요청 중에는 버튼이 비활성화되고 로딩 텍스트가 표시된다', async ({ page }) => {
      // API 응답 지연 모킹
      await page.route('https://main-practice.codebootcamp.co.kr/graphql', async (route) => {
        // 1초 지연 후 성공 응답
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              createUser: { _id: 'test-id' }
            }
          })
        });
      });

      // 폼 입력
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="password-confirm-input"]', 'password123');
      await page.fill('[data-testid="name-input"]', '테스트사용자');
      
      await page.waitForTimeout(500);

      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      
      // 회원가입 버튼 클릭
      await submitButton.click();

      // 로딩 중 버튼 비활성화 및 텍스트 변경 확인
      await expect(submitButton).toBeDisabled();
      await expect(submitButton).toContainText('가입 중...');
      
      // 로딩 완료 후 모달 표시 확인
      const successModal = page.locator('[data-testid="success-modal"]').first();
      await expect(successModal).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('접근성 및 사용성', () => {
    test('Enter 키로 폼 제출이 가능하다', async ({ page }) => {
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;
      
      // 폼 입력
      await page.fill('[data-testid="email-input"]', email);
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="password-confirm-input"]', 'password123');
      await page.fill('[data-testid="name-input"]', '테스트사용자');
      
      await page.waitForTimeout(500);
      
      // Enter 키로 폼 제출
      await page.press('[data-testid="name-input"]', 'Enter');
      
      // 성공 모달 확인
      const successModal = page.locator('[data-testid="success-modal"]').first();
      await expect(successModal).toBeVisible({ timeout: 5000 });
    });

  });
});