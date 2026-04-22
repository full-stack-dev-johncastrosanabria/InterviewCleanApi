import { test, expect } from '@playwright/test';

test.describe('Products Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Login
    await page.getByTestId('email-input').fill('john@test.com');
    await page.getByTestId('password-input').fill('123456');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('product-form')).toBeVisible({ timeout: 10000 });
  });

  test('should display product form after login', async ({ page }) => {
    await expect(page.getByTestId('product-form')).toBeVisible();
    await expect(page.getByTestId('product-name')).toBeVisible();
    await expect(page.getByTestId('product-description')).toBeVisible();
    await expect(page.getByTestId('product-price')).toBeVisible();
    await expect(page.getByTestId('product-stock')).toBeVisible();
    await expect(page.getByTestId('create-button')).toBeVisible();
  });

  test('should display product list', async ({ page }) => {
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should create a new product', async ({ page }) => {
    const productName = `Test Product ${Date.now()}`;

    await page.getByTestId('product-name').fill(productName);
    await page.getByTestId('product-description').fill('Test Description');
    await page.getByTestId('product-price').fill('99.99');
    await page.getByTestId('product-stock').fill('10');
    await page.getByTestId('create-button').click();

    // Wait for success message
    await expect(page.getByTestId('success-message')).toBeVisible({ timeout: 5000 });

    // Verify product appears in list
    await expect(page.getByText(productName)).toBeVisible({ timeout: 5000 });
  });

  test('should clear form after successful creation', async ({ page }) => {
    await page.getByTestId('product-name').fill('Test Product');
    await page.getByTestId('product-description').fill('Test Description');
    await page.getByTestId('product-price').fill('50.00');
    await page.getByTestId('product-stock').fill('5');
    await page.getByTestId('create-button').click();

    await expect(page.getByTestId('success-message')).toBeVisible({ timeout: 5000 });

    // Form should be cleared
    await expect(page.getByTestId('product-name')).toHaveValue('');
    await expect(page.getByTestId('product-description')).toHaveValue('');
    await expect(page.getByTestId('product-price')).toHaveValue('');
    await expect(page.getByTestId('product-stock')).toHaveValue('');
  });

  test('should delete a product', async ({ page }) => {
    const productName = `Delete Test ${Date.now()}`;

    // Create product
    await page.getByTestId('product-name').fill(productName);
    await page.getByTestId('product-price').fill('25.00');
    await page.getByTestId('product-stock').fill('3');
    await page.getByTestId('create-button').click();

    await expect(page.getByText(productName)).toBeVisible({ timeout: 5000 });

    // Delete product
    page.on('dialog', dialog => dialog.accept());
    const productCard = page.locator(`[data-testid^="product-"]`, { hasText: productName });
    await productCard.locator('button', { hasText: 'Eliminar' }).click();

    // Product should be removed
    await expect(page.getByText(productName)).not.toBeVisible({ timeout: 5000 });
  });

  test('should reload products', async ({ page }) => {
    await expect(page.getByTestId('product-list')).toBeVisible();

    await page.getByTestId('reload-button').click();

    // List should still be visible after reload
    await expect(page.getByTestId('product-list')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByTestId('create-button').click();

    // Browser validation should prevent submission
    const nameInput = page.getByTestId('product-name');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should display product details correctly', async ({ page }) => {
    const productName = `Detail Test ${Date.now()}`;
    const price = '149.99';
    const stock = '25';

    await page.getByTestId('product-name').fill(productName);
    await page.getByTestId('product-description').fill('Detailed description');
    await page.getByTestId('product-price').fill(price);
    await page.getByTestId('product-stock').fill(stock);
    await page.getByTestId('create-button').click();

    await expect(page.getByText(productName)).toBeVisible({ timeout: 5000 });

    const productCard = page.locator(`[data-testid^="product-"]`, { hasText: productName });
    await expect(productCard.getByText('Detailed description')).toBeVisible();
    await expect(productCard.getByTestId('product-price')).toContainText(price);
    await expect(productCard.getByTestId('product-stock')).toContainText(stock);
  });
});
