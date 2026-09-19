import { test, expect } from '@playwright/test';

test.describe('RupeeMind Core E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads dashboard and branding correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/RupeeMind/i);
    const brand = page.locator('#navbar-brand-logo');
    await expect(brand).toBeVisible();
  });

  test('navigates through navigation tabs smoothly', async ({ page }) => {
    // Navigate to Transactions tab
    await page.click('#nav-link-transactions');
    await expect(page.locator('text=All Transactions')).toBeVisible();

    // Navigate to Budgets tab
    await page.click('#nav-link-budgets');
    await expect(page.locator('text=Budget Engine & Limits')).toBeVisible();

    // Navigate to Goals tab
    await page.click('#nav-link-goals');
    await expect(page.locator('text=Financial Target Goals')).toBeVisible();

    // Navigate to Savings AI tab
    await page.click('#nav-link-savings');
    await expect(page.locator('text=Savings AI & Intelligence')).toBeVisible();
  });

  test('opens manual transaction modal and allows user input', async ({ page }) => {
    // Click Add Tx button in navbar
    await page.click('#nav-add-tx-btn');
    const modalTitle = page.locator('text=Record Transaction');
    await expect(modalTitle).toBeVisible();

    // Fill form
    await page.fill('#tx-merchant-input', 'Starbucks Coffee');
    await page.fill('#tx-amount-input', '350');

    // Submit
    await page.click('#tx-submit-btn');

    // Verify transaction appears in table
    await page.click('#nav-link-transactions');
    await expect(page.locator('text=Starbucks Coffee')).toBeVisible();
  });

  test('toggles dark and light mode', async ({ page }) => {
    const toggleBtn = page.locator('#theme-toggle-btn');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
  });
});
