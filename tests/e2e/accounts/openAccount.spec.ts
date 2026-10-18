import { test, expect } from '@fixtures/pages.fixtures';
import type { AccountType } from '@utils/constants';

test.describe('Open account', () => {
  test.beforeEach(async ({ loginPage, accountOverviewPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.username, registeredUser.password);
    await expect(accountOverviewPage.accountsTable).toBeVisible();
  });

  const accountTypes: AccountType[] = ['CHECKING', 'SAVINGS'];
  for (const type of accountTypes) {
    test(
      `opens a ${type} account and lists it in the overview`,
      { tag: ['@smoke', '@regression'] },
      async ({ accountOverviewPage, openAccountPage }) => {
        const [sourceId] = await accountOverviewPage.getAccountIds();

        await openAccountPage.open();
        const newId = await openAccountPage.openAccount(type, sourceId);

        await accountOverviewPage.open();
        expect(await accountOverviewPage.getAccountIds()).toContain(newId);
      },
    );
  }

  test(
    'funds the new account from the source account without losing money',
    { tag: '@regression' },
    async ({ accountOverviewPage, openAccountPage }) => {
      const [sourceId] = await accountOverviewPage.getAccountIds();
      const sourceBefore = await accountOverviewPage.getBalance(sourceId);
      const totalBefore = await accountOverviewPage.getTotalBalance();

      await openAccountPage.open();
      const newId = await openAccountPage.openAccount('SAVINGS', sourceId);

      await accountOverviewPage.open();
      const sourceAfter = await accountOverviewPage.getBalance(sourceId);
      const newBalance = await accountOverviewPage.getBalance(newId);
      const funded = sourceBefore - sourceAfter;

      expect(funded).toBeGreaterThan(0);
      expect(newBalance).toBeCloseTo(funded, 2);
      expect(await accountOverviewPage.getTotalBalance()).toBeCloseTo(totalBefore, 2);
    },
  );
});