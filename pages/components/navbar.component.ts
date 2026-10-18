import type { Locator, Page } from '@playwright/test';

export class NavbarComponent {
  readonly logOutLink: Locator;
  readonly transferFundsLink: Locator;

  constructor(page: Page) {
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
  }

  async logout(): Promise<void> {
    await this.logOutLink.click();
  }
}