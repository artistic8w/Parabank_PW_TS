import { test, expect } from '@fixtures/pages.fixtures';
import { LOAN_SCENARIOS } from '@test-data/static/loanScenarios';

test.describe('Loan approval', () => {
  test.beforeEach(async ({ loginPage, accountOverviewPage, registeredUser }) => {
    await loginPage.open();
    await loginPage.login(registeredUser.username, registeredUser.password);
    await expect(accountOverviewPage.accountsTable).toBeVisible();
  });

  test(
    'approves a loan within the approvable range and lists the new account',
    { tag: ['@smoke', '@regression'] },
    async ({ accountOverviewPage, loanPage }) => {
      const [sourceId] = await accountOverviewPage.getAccountIds();
      const sourceBefore = await accountOverviewPage.getBalance(sourceId);
      const idsBefore = await accountOverviewPage.getAccountIds();

      await loanPage.open();
      await loanPage.apply(
        LOAN_SCENARIOS.approvable.amount,
        LOAN_SCENARIOS.approvable.downPayment,
        sourceId,
      );

      await expect(loanPage.resultHeading).toBeVisible();
      await expect(loanPage.loanStatus).toHaveText('Approved');
      await expect(loanPage.newAccountLink).toBeVisible();
      const newId = (await loanPage.newAccountLink.innerText()).trim();

      await accountOverviewPage.open();
      const idsAfter = await accountOverviewPage.getAccountIds();
      expect(idsAfter).toContain(newId);
      expect(idsAfter).toHaveLength(idsBefore.length + 1);

      const sourceAfter = await accountOverviewPage.getBalance(sourceId);
      test.info().annotations.push({
        type: 'observed',
        description: `source ${sourceId}: ${sourceBefore} -> ${sourceAfter}; new account ${newId} balance: ${await accountOverviewPage.getBalance(newId)}`,
      });
    },
  );
});