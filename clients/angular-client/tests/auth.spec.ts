/**
 * Authentication E2E Tests - Angular
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
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
    
    await expect(page.getByTestId('message')).toContainText('Bienvenido');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByTestId('product-form')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.getByTestId('logout-button').click();
    
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('message')).toContainText('cerrada');
  });

  test('should persist authentication on page reload', async ({ page }) => {
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.reload();
    
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByTestId('product-form')).toBeVisible();
  });
});
