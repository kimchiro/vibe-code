import { test, expect } from '@playwright/test';

test.describe('Auth Login Form Hook', () => {
  test.beforeEach(async ({ page }) => {
    // /auth/login 페이지로 이동
    await page.goto('/auth/login');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="auth-login-form"]', { timeout: 5000 });
    
    // 폼이 완전히 렌더링될 때까지 대기
    await page.waitForSelector('[data-testid="login-button"]', { timeout: 2000 });
    await page.waitForSelector('[data-testid="email-input"]', { timeout: 2000 });
    await page.waitForSelector('[data-testid="password-input"]', { timeout: 2000 });
  });

  test.describe('폼 유효성 검증', () => {
    test('모든 인풋이 입력되면 로그인 버튼이 활성화된다', async ({ page }) => {
      // 초기 상태에서 로그인 버튼이 비활성화되어 있는지 확인
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeDisabled();

      // 이메일 입력
      const emailInput = page.locator('[data-testid="email-input"]');
      await emailInput.fill('test@example.com');
      
      // 비밀번호 입력 전에는 여전히 비활성화
      await expect(loginButton).toBeDisabled();

      // 비밀번호 입력
      const passwordInput = page.locator('[data-testid="password-input"]');
      await passwordInput.fill('password123');
      
      // 폼 유효성 검사가 완료될 때까지 잠시 대기
      await page.waitForTimeout(100);
      
      // 모든 필드가 입력되면 버튼 활성화
      await expect(loginButton).toBeEnabled({ timeout: 2000 });
    });

    test('이메일 형식이 잘못되면 에러 메시지가 표시된다', async ({ page }) => {
      // 잘못된 이메일 형식 입력
      await page.fill('[data-testid="email-input"]', 'invalid-email');
      
      // 이메일 필드에서 포커스 이동 (blur 이벤트 발생)
      await page.fill('[data-testid="password-input"]', 'password123');
      
      // 에러 메시지가 나타날 때까지 대기
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible({ timeout: 3000 });
    });

    test('비밀번호가 비어있으면 버튼이 비활성화된다', async ({ page }) => {
      // 이메일만 입력하고 비밀번호는 비워둠
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', '');
      
      // 버튼이 비활성화 상태인지 확인
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeDisabled();
    });
  });

  test.describe('로그인 성공 시나리오', () => {
    test('유효한 계정으로 로그인 성공 시 토큰과 사용자 정보가 저장되고 일기 페이지로 이동한다', async ({ page }) => {
      // 유효한 로그인 정보 입력
      await page.fill('[data-testid="email-input"]', 'a@c.com');
      await page.fill('[data-testid="password-input"]', '1234qwer');
      
      // 버튼이 활성화될 때까지 대기
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeEnabled({ timeout: 3000 });
      
      // 로그인 버튼 클릭
      await loginButton.click();
      
      // 로그인 성공 모달이 나타나는지 확인 (더 긴 타임아웃)
      await expect(page.locator('[data-testid="modal-confirm-button"]')).toBeVisible({ timeout: 5000 });
      
      // 로컬스토리지에 accessToken이 저장되었는지 확인
      const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
      expect(accessToken).toBeTruthy();
      
      // 로컬스토리지에 사용자 정보가 저장되었는지 확인
      const userInfo = await page.evaluate(() => localStorage.getItem('user'));
      expect(userInfo).toBeTruthy();
      
      const parsedUser = JSON.parse(userInfo!);
      expect(parsedUser).toHaveProperty('_id');
      expect(parsedUser).toHaveProperty('name');
      
      // 모달의 확인 버튼 클릭
      await page.click('[data-testid="modal-confirm-button"]');
      
      // 일기 목록 페이지로 이동했는지 확인
      await expect(page).toHaveURL('/diaries', { timeout: 3000 });
      
      // 모든 모달이 닫혔는지 확인
      await expect(page.locator('[data-testid="modal-confirm-button"]')).not.toBeVisible();
    });
  });

  test.describe('로그인 실패 시나리오', () => {
    test('잘못된 계정 정보로 로그인 실패 시 에러 모달이 표시된다', async ({ page }) => {
      // API 모킹 - 로그인 실패 응답
      await page.route('**/graphql', async (route) => {
        const request = route.request();
        const postData = request.postData();
        
        if (postData && postData.includes('loginUser')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [
                {
                  message: '이메일 또는 비밀번호가 올바르지 않습니다.',
                  extensions: {
                    code: 'UNAUTHENTICATED'
                  }
                }
              ]
            })
          });
        } else {
          await route.continue();
        }
      });
      
      // 잘못된 로그인 정보 입력
      await page.fill('[data-testid="email-input"]', 'wrong@email.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      
      // 버튼이 활성화될 때까지 대기
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeEnabled({ timeout: 3000 });
      
      // 로그인 버튼 클릭
      await loginButton.click();
      
      // 로그인 실패 모달이 나타나는지 확인
      await expect(page.locator('[data-testid="modal-confirm-button"]')).toBeVisible({ timeout: 5000 });
      
      // 모달의 확인 버튼 클릭
      await page.click('[data-testid="modal-confirm-button"]');
      
      // 모든 모달이 닫혔는지 확인
      await expect(page.locator('[data-testid="modal-confirm-button"]')).not.toBeVisible();
      
      // 여전히 로그인 페이지에 있는지 확인
      await expect(page).toHaveURL('/auth/login');
    });
  });
});
