import { test, expect } from '@fixtures/pages.fixtures';

test.describe('Logout and session', () => {
  test.beforeEach(async ({ loginPage, accountOverviewPage, sharedUser }) => {
    await loginPage.open();
    await loginPage.login(sharedUser.username, sharedUser.password);
    // Positive control: proves the table locator is correct while logged in.
    await expect(accountOverviewPage.accountsTable).toBeVisible();
  });

  test(
    'logout returns to the login page',
    { tag: ['@smoke', '@regression'] },
    async ({ navbar, loginPage }) => {
      await navbar.logout();
      await expect(loginPage.loginButton).toBeVisible();
    },
  );

  test(
    'protected page is not accessible by direct URL after logout',
    { tag: ['@regression', '@security'] },
    async ({ navbar, loginPage, accountOverviewPage, page }) => {
      await navbar.logout();
      await expect(loginPage.loginButton).toBeVisible();
      await page.goto('overview.htm');
      await expect(accountOverviewPage.accountsTable).toBeHidden();
    },
  );

    test(
    'back button after logout does not reveal account data',
    { tag: ['@regression', '@security'] },
    async ({ navbar, loginPage, accountOverviewPage, page }) => {
      await navbar.logout();
      await expect(loginPage.loginButton).toBeVisible();

      await page.goBack();

      await expect(accountOverviewPage.accountsTable).toBeHidden();
    },
  );

  test(
    'server rejects actions from the cached page after logout',
    { tag: ['@regression', '@security'] },
    async ({ navbar, loginPage, page }) => {
      await navbar.logout();
      await expect(loginPage.loginButton).toBeVisible();

      await page.goBack();
      await navbar.transferFundsLink.click();

      await expect(loginPage.loginButton).toBeVisible();
    },
  );

    test(
    'authenticated pages send Cache-Control: no-store',
    { tag: ['@regression', '@security'] },
    async ({ page }) => {
      test.fail(
        true,
        'Known issue: no Cache-Control header on authenticated pages. See docs/findings/back-button-cached-balances.md',
      );
      const response = await page.goto('overview.htm');
      expect(response?.headers()['cache-control'] ?? '').toContain('no-store');
    },
  );
});