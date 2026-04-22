/**
 * Products E2E Tests - Angular
 */

import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should display product list', async ({ page }) => {
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should create a new product', async ({ page }) => {
    await page.getByTestId('product-name-input').fill('Angular Test Product');
    await page.getByTestId('product-description-input').fill('Test Description');
    await page.getByTestId('product-price-input').fill('99.99');
    await page.getByTestId('product-stock-input').fill('10');
    
    await page.getByTestId('create-product-button').click();
    
    await expect(page.getByTestId('message')).toContainText('creado');
    await expect(page.getByText('Angular Test Product')).toBeVisible();
  });

  test('should delete a product', async ({ page }) => {
    await page.getByTestId('product-name-input').fill('Product to Delete');
    await page.getByTestId('product-price-input').fill('50');
    await page.getByTestId('product-stock-input').fill('5');
    await page.getByTestId('create-product-button').click();
    
    await expect(page.getByText('Product to Delete')).toBeVisible();
    
    page.on('dialog', dialog => dialog.accept());
    const deleteButton = page.getByTestId('delete-button').first();
    await deleteButton.click();
    
    await expect(page.getByTestId('message')).toContainText('eliminado');
  });

  test('should reload products', async ({ page }) => {
    await page.getByTestId('reload-button').click();
    await expect(page.getByTestId('product-list')).toBeVisible();
  });
});
