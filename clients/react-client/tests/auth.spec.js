/**
 * Authentication E2E Tests
 * Tests login, logout, and authentication flow
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login form when not authenticated', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill login form
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    
    // Click login button
    await page.getByTestId('login-button').click();
    
    // Wait for success message
    await expect(page.getByTestId('message')).toContainText('Bienvenido');
    
    // Verify logout button appears
    await expect(page.getByTestId('logout-button')).toBeVisible();
    
    // Verify product form appears
    await expect(page.getByTestId('product-form')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill with invalid credentials
    await page.getByTestId('email-input').fill('invalid@test.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    
    // Click login button
    await page.getByTestId('login-button').click();
    
    // Wait for error message
    await expect(page.getByTestId('message')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    
    // Wait for login to complete
    await expect(page.getByTestId('logout-button')).toBeVisible();
    
    // Click logout
    await page.getByTestId('logout-button').click();
    
    // Verify login form appears again
    await expect(page.getByTestId('login-form')).toBeVisible();
    
    // Verify success message
    await expect(page.getByTestId('message')).toContainText('cerrada');
  });

  test('should persist authentication on page reload', async ({ page }) => {
    // Login
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('logout-button')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Verify still authenticated
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByTestId('product-form')).toBeVisible();
  });
});
