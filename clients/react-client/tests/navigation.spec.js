/**
 * Navigation E2E Tests
 * Tests overall app navigation and flow
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display app title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /React Client/i })).toBeVisible();
  });

  test('should show correct UI based on authentication state', async ({ page }) => {
    // Not authenticated - should show login
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('product-form')).not.toBeVisible();
    
    // Login
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    
    // Authenticated - should show products
    await expect(page.getByTestId('login-form')).not.toBeVisible();
    await expect(page.getByTestId('product-form')).toBeVisible();
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should handle full user flow', async ({ page }) => {
    // 1. Login
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('logout-button')).toBeVisible();
    
    // 2. Create product
    await page.getByTestId('product-name-input').fill('Flow Test Product');
    await page.getByTestId('product-price-input').fill('100');
    await page.getByTestId('product-stock-input').fill('10');
    await page.getByTestId('create-product-button').click();
    await expect(page.getByText('Flow Test Product')).toBeVisible();
    
    // 3. Reload products
    await page.getByTestId('reload-button').click();
    await expect(page.getByText('Flow Test Product')).toBeVisible();
    
    // 4. Delete product
    page.on('dialog', dialog => dialog.accept());
    await page.getByTestId('delete-button').first().click();
    await expect(page.getByTestId('message')).toContainText('eliminado');
    
    // 5. Logout
    await page.getByTestId('logout-button').click();
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /React Client/i })).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /React Client/i })).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: /React Client/i })).toBeVisible();
  });
});
