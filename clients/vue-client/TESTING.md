# Vue Client - Testing Documentation

## Overview

This document contains comprehensive testing documentation for the Vue client application. The test suite uses **Playwright** with a **Page Object Model (POM)** architecture for maintainable and scalable E2E testing.

## Test Statistics

- **Total Tests**: 19
- **Test Files**: 1 (`tests/e2e.spec.ts`)
- **Pass Rate**: 100% (when dev server is running)
- **Duration**: ~7-8 seconds
- **Browsers**: Chromium, Firefox, WebKit

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (for full E2E tests)

### Installation

```bash
cd clients/vue-client
npm install
```

### Running Tests

**Important:** Vue tests require the dev server to be running.

```bash
# Terminal 1 - Start dev server
npm run dev

# Terminal 2 - Run tests
npm test

# Or run specific test file
npm test -- e2e.spec.ts
```

### Alternative: Run with Web Server Auto-Start

The Playwright config includes a web server that auto-starts:

```bash
# Tests will automatically start dev server
npm test
```

### Other Test Commands

```bash
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
- ✅ Have input fields

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
- ✅ Have links (navigation elements)

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
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Note:** The dev server runs on port **5174** (configured in `vite.config.ts`).

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
test.describe('Authentication - Vue', () => {
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

### 4. Wait for Vue to Render
Vue applications may need time for reactivity to complete:

```typescript
await page.waitForLoadState('networkidle');
await page.waitForSelector('selector', { state: 'visible' });
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

### Vue-Specific Debugging

```typescript
// Check if Vue is loaded
await page.evaluate(() => {
  return typeof window.__VUE__ !== 'undefined';
});

// Check Vue DevTools
await page.evaluate(() => {
  return window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
});
```

## Troubleshooting

### Tests Fail with "Cannot find element"

**Solutions:**
1. Ensure dev server is running (`npm run dev`)
2. Verify selectors match your Vue components
3. Use `--debug` mode to inspect elements
4. Check browser console for errors
5. Wait for Vue to complete rendering

### Tests Timeout

**Solutions:**
1. Increase timeout in `playwright.config.ts`
2. Check network connectivity
3. Verify API is responding
4. Look for infinite loading states
5. Ensure Vite dev server is fully started

### Dev Server Not Starting

**Solutions:**
1. Check if port 5174 is already in use
2. Kill existing processes: `lsof -ti:5174 | xargs kill -9`
3. Clear Vite cache: `rm -rf node_modules/.vite`
4. Restart dev server manually

### Tests Pass Locally but Fail in CI

**Solutions:**
1. Check environment variables
2. Verify base URL configuration
3. Check for timing issues
4. Review CI logs for specific errors
5. Ensure CI has sufficient resources
6. Verify dev server starts in CI

### Flaky Tests

**Solutions:**
1. Use proper waits (avoid `waitForTimeout` when possible)
2. Use `waitForLoadState('networkidle')`
3. Check for race conditions
4. Ensure test data is properly set up
5. Wait for Vue reactivity to complete

### Vue-Specific Issues

**Problem:** Tests fail with "Connection refused"
**Solution:** Ensure dev server is running on port 5174

**Problem:** Elements not found after navigation
**Solution:** Add `await page.waitForLoadState('networkidle')` after navigation

**Problem:** Reactive data not updated
**Solution:** Add small wait for Vue reactivity: `await page.waitForTimeout(100)`

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
        working-directory: clients/vue-client
        run: npm ci
        
      - name: Install Playwright Browsers
        working-directory: clients/vue-client
        run: npx playwright install --with-deps
        
      - name: Run Playwright tests
        working-directory: clients/vue-client
        run: npm test
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: clients/vue-client/playwright-report/
```

### GitLab CI Example

```yaml
test:vue:
  stage: test
  image: mcr.microsoft.com/playwright:v1.49.1-focal
  script:
    - cd clients/vue-client
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - clients/vue-client/playwright-report/
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
# Ensure dev server is running
npm run dev

# In another terminal
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
      clients/vue-client/node_modules/.vite
    key: ${{ runner.os }}-vue-${{ hashFiles('**/package-lock.json') }}
```

### Optimize Vite Build

```typescript
// vite.config.ts - for test environment
export default defineConfig({
  build: {
    sourcemap: true,
    minify: false, // Faster builds for testing
  },
});
```

## Vue-Specific Testing Tips

### 1. Handle Vue Reactivity
Vue's reactivity system may need time to update the DOM:

```typescript
await page.click('button');
await page.waitForTimeout(50); // Let Vue reactivity complete
```

### 2. Test Vue Components
Use data attributes for stable selectors:

```vue
<!-- In your Vue component -->
<template>
  <button data-testid="submit-button">Submit</button>
</template>
```

```typescript
// In your test
await page.locator('[data-testid="submit-button"]').click();
```

### 3. Handle Vue Router
Wait for navigation to complete:

```typescript
await page.click('a[href="/products"]');
await page.waitForURL('**/products');
await page.waitForLoadState('networkidle');
```

### 4. Test Vue Forms
Handle Vue form binding:

```typescript
await page.fill('input[name="email"]', 'test@example.com');
await page.fill('input[name="password"]', 'password123');
await page.click('button[type="submit"]');
await page.waitForLoadState('networkidle');
```

### 5. Test Composables
Test Vue 3 composables through component interactions:

```typescript
// Test a composable's effect on the UI
await page.click('[data-testid="toggle-theme"]');
const isDark = await page.locator('body').evaluate(el => 
  el.classList.contains('dark')
);
expect(isDark).toBeTruthy();
```

## Environment Configuration

### .env Files

Vue client uses environment variables:

```bash
# .env.development
VITE_API_URL=http://localhost:5000

# .env.test
VITE_API_URL=http://localhost:5000
```

### Access in Tests

```typescript
// Tests use the baseURL from playwright.config.ts
// API URL is configured in the Vue app
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Vue Testing Guide](https://vuejs.org/guide/scaling-up/testing.html)
- [Vite Documentation](https://vitejs.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## Support

For issues or questions:

1. Ensure dev server is running
2. Check test output for error messages
3. Use `--debug` mode to inspect
4. Review Playwright documentation
5. Check Vue-specific issues
6. Review the test file implementation

---

**Last Updated:** April 23, 2026
**Playwright Version:** 1.49.1+
**Vue Version:** 3.5.30
**Vite Version:** 8.0.0
**Dev Server Port:** 5174
**Status:** ✅ Production Ready
