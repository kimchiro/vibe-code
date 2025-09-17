import { test, expect } from '@playwright/test';

test.describe('Layout Auth Hook Tests', () => {
  test.describe('비로그인 유저 테스트', () => {
    test('비회원으로 /diaries 접속 후 로그인 버튼 확인 및 클릭', async ({ page }) => {
      // 1. 비회원으로 /diaries에 접속하여 페이지 로드 확인
      await page.goto('/diaries');
      await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
      
      // 2. layout의 로그인버튼 노출여부 확인
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toContainText('로그인');
      
      // 3. 로그인버튼 클릭하여 /auth/login 페이지로 이동
      await loginButton.click();
      await expect(page).toHaveURL('/auth/login');
      await expect(page.locator('[data-testid="auth-login-form"]')).toBeVisible();
    });
  });

  test.describe('로그인 유저 테스트', () => {
    test('로그인 후 유저 정보 표시 및 로그아웃 기능 테스트', async ({ page }) => {
      // 1. 비회원으로 /auth/login에 접속하여 페이지 로드 확인
      await page.goto('/auth/login');
      await expect(page.locator('[data-testid="auth-login-form"]')).toBeVisible();
      
      // 2. 로그인시도
      await page.fill('[data-testid="email-input"]', 'a@c.com');
      await page.fill('[data-testid="password-input"]', '1234qwer');
      await page.click('[data-testid="login-button"]');
      
      // 3. 로그인 성공 후, 완료 모달 클릭하여 /diaries 페이지 로드 확인
      const successModal = page.getByRole('dialog', { name: '로그인 성공' });
      await expect(successModal).toBeVisible();
      await page.click('[data-testid="modal-confirm-button"]');
      await expect(page).toHaveURL('/diaries');
      await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
      
      // 4. layout에서 유저이름, 로그아웃버튼 노출여부 확인
      const userName = page.locator('[data-testid="user-name"]');
      const logoutButton = page.locator('[data-testid="logout-button"]');
      
      await expect(userName).toBeVisible();
      await expect(userName).not.toBeEmpty(); // 실제 유저 이름이 표시되는지 확인
      await expect(logoutButton).toBeVisible();
      await expect(logoutButton).toContainText('로그아웃');
      
      // 로그인 버튼이 숨겨져 있는지 확인
      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).not.toBeVisible();
      
      // 6. 로그아웃버튼 클릭하여 /auth/login 페이지 로드 확인
      await logoutButton.click();
      await expect(page).toHaveURL('/auth/login');
      await expect(page.locator('[data-testid="auth-login-form"]')).toBeVisible();
      
      // 8. /diaries에 접속하여 페이지 로드 확인
      await page.goto('/diaries');
      await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
      
      // 9. layout에 로그인버튼 노출여부 확인
      const loginButtonAfterLogout = page.locator('[data-testid="login-button"]');
      await expect(loginButtonAfterLogout).toBeVisible();
      await expect(loginButtonAfterLogout).toContainText('로그인');
      
      // 유저 정보가 숨겨져 있는지 확인
      const userNameAfterLogout = page.locator('[data-testid="user-name"]');
      const logoutButtonAfterLogout = page.locator('[data-testid="logout-button"]');
      await expect(userNameAfterLogout).not.toBeVisible();
      await expect(logoutButtonAfterLogout).not.toBeVisible();
    });
  });
});
