/**
 * Products E2E Tests
 * Tests product CRUD operations
 */

import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    // Login before each test
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();
    
    // Wait for products to load
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should display product list', async ({ page }) => {
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should create a new product', async ({ page }) => {
    // Fill product form
    await page.getByTestId('product-name-input').fill('Test Product');
    await page.getByTestId('product-description-input').fill('Test Description');
    await page.getByTestId('product-price-input').fill('99.99');
    await page.getByTestId('product-stock-input').fill('10');
    
    // Submit form
    await page.getByTestId('create-product-button').click();
    
    // Wait for success message
    await expect(page.getByTestId('message')).toContainText('creado');
    
    // Verify product appears in list
    await expect(page.getByText('Test Product')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByTestId('create-product-button').click();
    
    // Form should not submit (HTML5 validation)
    await expect(page.getByTestId('product-form')).toBeVisible();
  });

  test('should delete a product', async ({ page }) => {
    // Create a product first
    await page.getByTestId('product-name-input').fill('Product to Delete');
    await page.getByTestId('product-price-input').fill('50');
    await page.getByTestId('product-stock-input').fill('5');
    await page.getByTestId('create-product-button').click();
    
    // Wait for product to appear
    await expect(page.getByText('Product to Delete')).toBeVisible();
    
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button
    const deleteButton = page.getByTestId('delete-button').first();
    await deleteButton.click();
    
    // Wait for success message
    await expect(page.getByTestId('message')).toContainText('eliminado');
  });

  test('should reload products', async ({ page }) => {
    // Click reload button
    await page.getByTestId('reload-button').click();
    
    // Verify products list is still visible
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should display product details correctly', async ({ page }) => {
    // Create a product with specific values
    await page.getByTestId('product-name-input').fill('Detailed Product');
    await page.getByTestId('product-description-input').fill('Detailed Description');
    await page.getByTestId('product-price-input').fill('123.45');
    await page.getByTestId('product-stock-input').fill('25');
    await page.getByTestId('create-product-button').click();
    
    // Wait for product to appear
    await expect(page.getByText('Detailed Product')).toBeVisible();
    
    // Verify all details are displayed
    const productCard = page.getByTestId('product-card').first();
    await expect(productCard.getByTestId('product-name')).toContainText('Detailed Product');
    await expect(productCard.getByTestId('product-description')).toContainText('Detailed Description');
    await expect(productCard.getByTestId('product-price')).toContainText('123.45');
    await expect(productCard.getByTestId('product-stock')).toContainText('25');
  });

  test('should handle empty product list', async ({ page }) => {
    // If there are products, delete them all
    const deleteButtons = page.getByTestId('delete-button');
    const count = await deleteButtons.count();
    
    if (count > 0) {
      page.on('dialog', dialog => dialog.accept());
      
      for (let i = 0; i < count; i++) {
        await page.getByTestId('delete-button').first().click();
        await page.waitForTimeout(500);
      }
    }
    
    // Verify empty state message
    await expect(page.getByText('No hay productos disponibles')).toBeVisible();
  });
});
