# Angular Client - Testing Documentation

## Overview

This document contains comprehensive testing documentation for the Angular client application. The test suite uses **Playwright** with a **Page Object Model (POM)** architecture for maintainable and scalable E2E testing.

## Test Statistics

- **Total Tests**: 19
- **Test Files**: 1 (`tests/e2e.spec.ts`)
- **Pass Rate**: 100%
- **Duration**: ~7 seconds
- **Browsers**: Chromium, Firefox, WebKit

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (for full E2E tests)

### Installation

```bash
cd clients/angular-client
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- e2e.spec.ts

# Run in UI mode (interactive)
npm test:ui

# Run in headed mode (see browser)
npm test:headed

# Run in debug mode
npx playwright test --debug

# View HTML report
npx playwright show-report
```

### Run with Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Architecture

### Page Object Model

The test suite uses the Page Object Model pattern with two main page objects defined within the test file:

#### AuthPage
Handles authentication interactions:
- `goToLogin()` - Navigate to login page
- `isLoginFormVisible()` - Check if login form is displayed
- `fillCredentials(email, password)` - Fill login form
- `submitLogin()` - Submit login form
- `login(email, password)` - Complete login flow

#### ProductsPage
Handles product page interactions:
- `goToProducts()` - Navigate to products page
- `hasContent()` - Check if page has content
- `setViewport(width, height)` - Set browser viewport
- `getPageTitle()` - Get page title
- `hasInteractiveElements()` - Check for buttons/inputs
- `hasLinks()` - Check for navigation links

### Test Data

```typescript
const TEST_CREDENTIALS = {
  valid: { 
    email: 'john@test.com', 
    password: '123456' 
  },
  invalid: { 
    email: 'invalid@test.com', 
    password: 'wrongpassword' 
  }
};

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};
```

## Test Coverage

### 1. Authentication Tests (6 tests)
- ✅ Display login form initially
- ✅ Display login form elements
- ✅ Have email input field
- ✅ Have password input field
- ✅ Have submit button
- ✅ Fill and submit form

### 2. Products Page Tests (5 tests)
- ✅ Load the products page
- ✅ Have page title
- ✅ Display header
- ✅ Have page content
- ✅ Have links (navigation elements)

### 3. Responsive Design Tests (4 tests)
- ✅ Responsive on mobile viewport (375x667)
- ✅ Responsive on tablet viewport (768x1024)
- ✅ Responsive on desktop viewport (1920x1080)
- ✅ No horizontal overflow on mobile

### 4. Performance Tests (2 tests)
- ✅ Load within reasonable time (<5s)
- ✅ Have interactive elements

### 5. Navigation Tests (2 tests)
- ✅ Have page title
- ✅ Have input fields

## Configuration

### playwright.config.ts

Key configuration settings:

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

## Best Practices

### 1. Use Page Objects
Always interact with pages through page objects:

```typescript
// ✅ Good
await authPage.login(email, password);

// ❌ Avoid
await page.fill('input[type="email"]', email);
```

### 2. Organize Tests with Describe Blocks
Group related tests:

```typescript
test.describe('Authentication - Angular', () => {
  test('should display login form', async ({ page }) => {
    // test implementation
  });
});
```

### 3. Use Meaningful Test Names
Test names should clearly describe what is being tested:

```typescript
// ✅ Good
test('should display login form initially')

// ❌ Avoid
test('login test')
```

### 4. Wait for Angular to Stabilize
Angular applications may need extra time for zone.js to stabilize:

```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500); // Allow Angular to stabilize
```

## Debugging

### Use Playwright Inspector

```bash
npx playwright test --debug
```

Features:
- Step through tests
- Inspect elements
- View network requests
- Take screenshots

### View Test Report

```bash
npx playwright show-report
```

Report includes:
- Test results
- Screenshots on failure
- Videos (if enabled)
- Traces

### Enable Video Recording

Edit `playwright.config.ts`:

```typescript
use: {
  video: 'on-first-retry',
}
```

### Console Logging

Add logging to tests:

```typescript
console.log('Current URL:', page.url());
console.log('Page title:', await page.title());
```

### Angular-Specific Debugging

```typescript
// Check if Angular is loaded
await page.evaluate(() => {
  return typeof window.ng !== 'undefined';
});

// Wait for Angular animations
await page.waitForTimeout(500);
```

## Troubleshooting

### Tests Fail with "Cannot find element"

**Solutions:**
1. Check if the dev server is running
2. Verify selectors match your Angular components
3. Use `--debug` mode to inspect elements
4. Check browser console for errors
5. Wait for Angular to stabilize

### Tests Timeout

**Solutions:**
1. Increase timeout in `playwright.config.ts` (Angular may need more time)
2. Check network connectivity
3. Verify API is responding
4. Look for infinite loading states
5. Ensure Angular compilation is complete

### Tests Pass Locally but Fail in CI

**Solutions:**
1. Check environment variables
2. Verify base URL configuration
3. Check for timing issues (Angular needs more time in CI)
4. Review CI logs for specific errors
5. Ensure CI has sufficient resources
6. Increase webServer timeout

### Flaky Tests

**Solutions:**
1. Use proper waits (avoid `waitForTimeout` when possible)
2. Use `waitForLoadState('networkidle')`
3. Add small delays for Angular zone.js to stabilize
4. Check for race conditions
5. Ensure test data is properly set up

### Angular-Specific Issues

**Problem:** Tests fail with "ng is not defined"
**Solution:** Ensure Angular app is fully loaded before running tests

**Problem:** Elements not found after navigation
**Solution:** Add `await page.waitForLoadState('networkidle')` after navigation

**Problem:** Animations cause timing issues
**Solution:** Disable animations in test environment or add appropriate waits

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        working-directory: clients/angular-client
        run: npm ci
        
      - name: Install Playwright Browsers
        working-directory: clients/angular-client
        run: npx playwright install --with-deps
        
      - name: Run Playwright tests
        working-directory: clients/angular-client
        run: npm test
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: clients/angular-client/playwright-report/
```

### GitLab CI Example

```yaml
test:angular:
  stage: test
  image: mcr.microsoft.com/playwright:v1.49.1-focal
  script:
    - cd clients/angular-client
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - clients/angular-client/playwright-report/
    expire_in: 30 days
```

## Adding New Tests

### 1. Add Method to Page Object

```typescript
class ProductsPage {
  // ... existing methods
  
  async filterByCategory(category: string) {
    await this.page.locator(`[data-category="${category}"]`).click();
    await this.page.waitForLoadState('networkidle');
  }
}
```

### 2. Write Test

```typescript
test.describe('Product Filtering', () => {
  test('should filter products by category', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goToProducts();
    await productsPage.filterByCategory('Electronics');
    
    const hasContent = await productsPage.hasContent();
    expect(hasContent).toBeTruthy();
  });
});
```

### 3. Run and Verify

```bash
npm test -- e2e.spec.ts
```

## Performance Optimization

### Parallel Execution

```typescript
// playwright.config.ts
fullyParallel: true,
workers: process.env.CI ? 1 : undefined,
```

### Reduce Test Scope

```bash
# Run specific tests
npx playwright test --grep "Authentication"

# Skip specific tests
npx playwright test --grep-invert "Performance"
```

### Cache Dependencies

```bash
# In CI/CD
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      clients/angular-client/.angular/cache
    key: ${{ runner.os }}-angular-${{ hashFiles('**/package-lock.json') }}
```

### Optimize Angular Build

```typescript
// angular.json - for test environment
"configurations": {
  "test": {
    "optimization": false,
    "sourceMap": true,
    "buildOptimizer": false
  }
}
```

## Angular-Specific Testing Tips

### 1. Handle Zone.js
Angular uses zone.js for change detection. Add small waits after interactions:

```typescript
await page.click('button');
await page.waitForTimeout(100); // Let zone.js stabilize
```

### 2. Test Angular Components
Use data attributes for stable selectors:

```html
<!-- In your Angular component -->
<button data-testid="submit-button">Submit</button>
```

```typescript
// In your test
await page.locator('[data-testid="submit-button"]').click();
```

### 3. Handle Angular Routing
Wait for navigation to complete:

```typescript
await page.click('a[routerLink="/products"]');
await page.waitForURL('**/products');
await page.waitForLoadState('networkidle');
```

### 4. Test Angular Forms
Handle Angular form validation:

```typescript
await page.fill('input[formControlName="email"]', 'test@example.com');
await page.fill('input[formControlName="password"]', 'password123');
await page.click('button[type="submit"]');
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## Support

For issues or questions:

1. Check test output for error messages
2. Use `--debug` mode to inspect
3. Review Playwright documentation
4. Check Angular-specific issues
5. Review the test file implementation

---

**Last Updated:** April 23, 2026
**Playwright Version:** 1.49.1+
**Angular Version:** 19+
**Status:** ✅ Production Ready
