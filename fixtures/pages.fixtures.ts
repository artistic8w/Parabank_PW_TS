import { test as base, expect, type Browser } from '@playwright/test';
import type { User } from '@app-types/index';
import { RegistrationPage } from '@pages/registration.page';
import { LoginPage } from '@pages/login.page';
import { AccountOverviewPage } from '@pages/accountOverview.page';
import { NavbarComponent } from '@pages/components/navbar.component';
import { createRandomUser } from '@test-data/generators/userDataFactory';
import { OpenAccountPage } from '@pages/openAccount.page';
import { LoanPage } from '@pages/loan.page';

type PageFixtures = {
  registrationPage: RegistrationPage;
  loginPage: LoginPage;
  accountOverviewPage: AccountOverviewPage;
  navbar: NavbarComponent;
  openAccountPage: OpenAccountPage;
  loanPage: LoanPage;
};



type TestDataFixtures = {
  registeredUser: User;
};

type WorkerFixtures = {
  sharedUser: User;
};

const MAX_REGISTRATION_ATTEMPTS = 3;

async function registerNewUser(browser: Browser, baseURL: string | undefined): Promise<User> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_REGISTRATION_ATTEMPTS; attempt++) {
    // Separate context: ParaBank auto-logs-in after registering, and the test's own page must start logged out.
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    try {
      const user = createRandomUser();
      const registration = new RegistrationPage(page);

      await registration.open();
      await registration.register(user);
      await expect(registration.welcomeHeading).toContainText(user.username, { timeout: 20_000 });

      return user;
    } catch (error) {
      const bodyText = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
      const blockedByChallenge = /security verification/i.test(bodyText);
      const visibleText = bodyText.slice(0, 200);
      lastError = new Error(
        blockedByChallenge
          ? `Blocked by a Cloudflare bot challenge on attempt ${attempt}/${MAX_REGISTRATION_ATTEMPTS} at ${page.url()}. Environment issue, not a product bug.`
          : `Registration attempt ${attempt}/${MAX_REGISTRATION_ATTEMPTS} failed at ${page.url()}. Page text: "${visibleText}"`,
        { cause: error },
      );
    } finally {
      await context.close();
    }
  }

  throw lastError ?? new Error('Registration failed');
}

export const test = base.extend<PageFixtures & TestDataFixtures, WorkerFixtures>({
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountOverviewPage: async ({ page }, use) => {
    await use(new AccountOverviewPage(page));
  },
  navbar: async ({ page }, use) => {
    await use(new NavbarComponent(page));
  },
  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },
  loanPage: async ({ page }, use) => {
    await use(new LoanPage(page));
  },

  // Fresh user for every test that asks for it. Use when the test changes account state.
  registeredUser: [
    async ({ browser, baseURL }, use) => {
      await use(await registerNewUser(browser, baseURL));
    },
    { timeout: 120_000 },
  ],

  // One user per worker, shared by all its tests. Use only for read-only tests.
  sharedUser: [
    async ({ browser }, use, workerInfo) => {
      await use(await registerNewUser(browser, workerInfo.project.use.baseURL));
    },
    { scope: 'worker', timeout: 120_000 },
  ],
});

export { expect };
