import { test, expect } from '@playwright/test';

test.describe('RupeeMind E2E Enterprise Suite', () => {
  test('Complete user journey: Landing -> Preloader -> Auth -> Dashboard', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');

    // Check Landing Hero Title
    await expect(page.locator('text=RupeeMind').first()).toBeVisible();

    // 2. Click "Get Started Free" button
    const getStartedBtn = page.locator('#landing-get-started-btn');
    if (await getStartedBtn.isVisible()) {
      await getStartedBtn.click();
    }

    // Wait for auth screen or direct dashboard transition
    await page.waitForTimeout(3600); // allow preloader sequence

    // 3. If Auth screen is visible, click Instant Demo Access
    const demoBtn = page.locator('#instant-demo-access-btn');
    if (await demoBtn.isVisible()) {
      await demoBtn.click();
    }

    // 4. Onboarding or Dashboard check
    const finishOnboardingBtn = page.locator('#onboarding-finish-btn');
    if (await finishOnboardingBtn.isVisible()) {
      await finishOnboardingBtn.click();
    }

    // 5. Verify Dashboard elements
    await expect(page.locator('text=NET SAVINGS').first()).toBeVisible();
    await expect(page.locator('text=DAILY SAFE-TO-SPEND').first()).toBeVisible();
    await expect(page.locator('text=MONTHLY SAVINGS PREDICTION').first()).toBeVisible();

    // 6. Test Quick Action: Open Bank SMS modal
    const smsBtn = page.locator('#quick-sms-btn');
    if (await smsBtn.isVisible()) {
      await smsBtn.click();
      await expect(page.locator('text=Parse Bank SMS / UPI Alert')).toBeVisible();
      // Click a bank sample chip
      await page.locator('text=HDFC').first().click();
      // Extract
      await page.locator('#extract-sms-btn').click();
      await expect(page.locator('#confirm-save-sms-btn')).toBeVisible();
      await page.locator('#confirm-save-sms-btn').click();
    }
  });
});
