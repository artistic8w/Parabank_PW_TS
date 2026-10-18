import { test, expect } from '@fixtures/pages.fixtures';
import { createRandomUser } from '@test-data/generators/userDataFactory';

test.describe('Login', () => {
    test(
    'logs in with valid credentials',
    { tag: ['@smoke', '@regression'] },
    async ({ loginPage, accountOverviewPage, sharedUser, page }) => {
      await loginPage.open();
      await loginPage.login(sharedUser.username, sharedUser.password);

      await expect(page).toHaveURL(/overview\.htm/);
      await expect(accountOverviewPage.heading).toBeVisible();
    },
  );

  test(
    'rejects a valid username with a wrong password',
    { tag: '@regression' },
    async ({ loginPage, sharedUser }) => {
      await loginPage.open();
      await loginPage.login(sharedUser.username, 'WrongPassword!1');

      await expect(loginPage.errorMessage).toContainText('could not be verified');
    },
  );
  
  test(
    'rejects an unknown username',
    { tag: '@regression' },
    async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(createRandomUser().username, 'Passw0rd!123');

      await expect(loginPage.errorMessage).toContainText('could not be verified');
    },
  );

  test(
    'rejects empty username and password',
    { tag: '@regression' },
    async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login('', '');

      await expect(loginPage.errorMessage).toBeVisible();
    },
  );
});