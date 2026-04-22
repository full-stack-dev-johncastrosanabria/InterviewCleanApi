import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display login form when not authenticated', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();

    // Wait for authentication
    await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('product-form')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.getByTestId('email-input').fill('invalid@test.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });

    // Logout
    await page.getByTestId('logout-button').click();

    // Should show login form again
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('should persist authentication after page reload', async ({ page }) => {
    // Login
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });

    // Reload page
    await page.reload();

    // Should still be authenticated
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByTestId('product-form')).toBeVisible();
  });
});
