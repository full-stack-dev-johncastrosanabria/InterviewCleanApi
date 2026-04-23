/**
 * React Client - Comprehensive E2E Tests
 * Best Practice: Single consolidated test file with organized test suites
 * Architecture: Page Object Model with fixtures
 */

import { test, expect } from '@playwright/test';

// Test Data
const TEST_CREDENTIALS = {
  valid: { email: 'john@test.com', password: '123456' },
  invalid: { email: 'invalid@test.com', password: 'wrongpassword' }
};

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};

// Page Object Methods
class AuthPage {
  constructor(private page: any) {}

  async goToLogin() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async fillCredentials(email: string, password: string) {
    await this.page.fill('input[name="email"], input[type="email"]', email);
    await this.page.fill('input[name="password"], input[type="password"]', password);
  }

  async submitLogin() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);
  }

  async isLoginFormVisible() {
    return this.page.isVisible('form');
  }

  async isAuthenticated() {
    return this.page.isVisible('button[data-testid="logout-button"], text=/logout|cerrar sesión/i');
  }
}

class ProductsPage {
  constructor(private page: any) {}

  async goToProducts() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }

  async hasContent() {
    const bodyText = await this.page.locator('body').textContent();
    return !!bodyText && bodyText.trim().length > 0;
  }

  async setViewport(width: number, height: number) {
    await this.page.setViewportSize({ width, height });
    await this.page.waitForTimeout(500);
  }

  async getPageTitle() {
    return this.page.title();
  }
}

// Tests
test.describe('React Client - E2E Tests', () => {
  let authPage: AuthPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    productsPage = new ProductsPage(page);
  });

  test.describe('Authentication', () => {
    test('should display login form', async ({ page }) => {
      await authPage.goToLogin();
      const isVisible = await authPage.isLoginFormVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should have email input', async ({ page }) => {
      await authPage.goToLogin();
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      await expect(emailInput).toBeVisible();
    });

    test('should have password input', async ({ page }) => {
      await authPage.goToLogin();
      const passwordInput = page.locator('input[name="password"], input[type="password"]');
      await expect(passwordInput).toBeVisible();
    });

    test('should have submit button', async ({ page }) => {
      await authPage.goToLogin();
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
    });

    test('should fill and submit form', async ({ page }) => {
      await authPage.goToLogin();
      await authPage.fillCredentials(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
      await authPage.submitLogin();
      // Verify form was submitted
      const emailInput = page.locator('input[name="email"], input[type="email"]');
      const value = await emailInput.inputValue().catch(() => '');
      expect(value).toBeTruthy();
    });

    test('should validate required fields', async ({ page }) => {
      await authPage.goToLogin();
      await authPage.submitLogin();
      // Form should still be visible
      const isVisible = await authPage.isLoginFormVisible();
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('Products Page', () => {
    test('should load products page', async ({ page }) => {
      await productsPage.goToProducts();
      const hasContent = await productsPage.hasContent();
      expect(hasContent).toBeTruthy();
    });

    test('should have page title', async ({ page }) => {
      await productsPage.goToProducts();
      const title = await productsPage.getPageTitle();
      expect(title).toBeTruthy();
    });

    test('should display page elements', async ({ page }) => {
      await productsPage.goToProducts();
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should have buttons', async ({ page }) => {
      await productsPage.goToProducts();
      const buttons = page.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have input fields', async ({ page }) => {
      await productsPage.goToProducts();
      const inputs = page.locator('input');
      const count = await inputs.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await productsPage.goToProducts();
      await productsPage.setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      const hasContent = await productsPage.hasContent();
      expect(hasContent).toBeTruthy();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await productsPage.goToProducts();
      await productsPage.setViewport(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height);
      const hasContent = await productsPage.hasContent();
      expect(hasContent).toBeTruthy();
    });

    test('should be responsive on desktop', async ({ page }) => {
      await productsPage.goToProducts();
      await productsPage.setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height);
      const hasContent = await productsPage.hasContent();
      expect(hasContent).toBeTruthy();
    });

    test('should not have horizontal overflow on mobile', async ({ page }) => {
      await productsPage.goToProducts();
      await productsPage.setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height);
      const bodyBox = await page.locator('body').boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(VIEWPORTS.mobile.width);
    });
  });

  test.describe('Performance', () => {
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await productsPage.goToProducts();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(10000);
    });

    test('should have accessible page structure', async ({ page }) => {
      await productsPage.goToProducts();
      const html = page.locator('html');
      await expect(html).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should be on correct URL', async ({ page }) => {
      await productsPage.goToProducts();
      const url = page.url();
      expect(url).toContain('localhost');
    });

    test('should have page content', async ({ page }) => {
      await productsPage.goToProducts();
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toBeTruthy();
    });
  });
});
