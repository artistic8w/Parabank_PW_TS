import { test, expect } from '@fixtures/pages.fixtures';
import { LOAN_SCENARIOS } from '@test-data/static/loanScenarios';

test.describe('Loan denial', () => {
  test.beforeEach(async ({ loginPage, accountOverviewPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.username, registeredUser.password);
    await expect(accountOverviewPage.accountsTable).toBeVisible();
  });

  test(
    'denies an oversized loan and leaves accounts and balances untouched',
    { tag: '@regression' },
    async ({ accountOverviewPage, loanPage }) => {
      const idsBefore = await accountOverviewPage.getAccountIds();
      const [sourceId] = idsBefore;
      const sourceBefore = await accountOverviewPage.getBalance(sourceId);

      await loanPage.open();
      await loanPage.apply(
        LOAN_SCENARIOS.deniable.amount,
        LOAN_SCENARIOS.deniable.downPayment,
        sourceId,
      );

      await expect(loanPage.resultHeading).toBeVisible();
      await expect(loanPage.loanStatus).toHaveText('Denied');
      await expect(loanPage.newAccountLink).toBeHidden();

      await accountOverviewPage.open();
      expect(await accountOverviewPage.getAccountIds()).toEqual(idsBefore);
      expect(await accountOverviewPage.getBalance(sourceId)).toBeCloseTo(sourceBefore, 2);
    },
  );
});