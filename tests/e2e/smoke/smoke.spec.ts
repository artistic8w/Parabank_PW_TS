import { test, expect } from '@playwright/test';

test('login page loads', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('index.htm');
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});