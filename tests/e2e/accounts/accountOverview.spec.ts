import { test, expect } from '@fixtures/pages.fixtures';

test.describe('Accounts overview', () => {
  test.beforeEach(async ({ loginPage, accountOverviewPage, sharedUser }) => {
    await loginPage.open();
    await loginPage.login(sharedUser.username, sharedUser.password);
    await expect(accountOverviewPage.accountsTable).toBeVisible();
  });

  test(
    'lists at least one account with a numeric ID and a balance',
    { tag: ['@smoke', '@regression'] },
    async ({ accountOverviewPage }) => {
      const ids = await accountOverviewPage.getAccountIds();

      expect(ids.length).toBeGreaterThan(0);
      for (const id of ids) {
        expect(id).toMatch(/^\d+$/);
        expect(Number.isFinite(await accountOverviewPage.getBalance(id))).toBe(true);
      }
    },
  );

  test(
    'total balance equals the sum of the listed accounts',
    { tag: '@regression' },
    async ({ accountOverviewPage }) => {
      const ids = await accountOverviewPage.getAccountIds();
      let sum = 0;
      for (const id of ids) {
        sum += await accountOverviewPage.getBalance(id);
      }

      expect(await accountOverviewPage.getTotalBalance()).toBeCloseTo(sum, 2);
    },
  );

  test(
    'account link opens the details for that account',
    { tag: '@regression' },
    async ({ accountOverviewPage, page }) => {
      const [firstId] = await accountOverviewPage.getAccountIds();

      await accountOverviewPage.openAccountDetails(firstId);

      await expect(page).toHaveURL(new RegExp(firstId));
    },
  );
});