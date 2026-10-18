import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '@utils/constants';
import { parseCurrency } from '@utils/helpers';

export class AccountOverviewPage extends BasePage {
  readonly heading: Locator;
  readonly accountsTable: Locator;
  readonly accountRows: Locator;
  readonly totalRow: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountsTable = page.locator('#accountTable');
    // Only rows that contain an account link; excludes any Total row.
    this.accountRows = this.accountsTable.locator('tbody tr').filter({ has: page.getByRole('link') });
    this.totalRow = this.accountsTable.locator('tr').filter({ hasText: 'Total' });
  }

  async open(): Promise<void> {
    await this.goto(ROUTES.OVERVIEW);
  }

  async getAccountIds(): Promise<string[]> {
    await this.accountRows.first().waitFor();
    const ids = await this.accountRows.getByRole('link').allInnerTexts();
    return ids.map((id) => id.trim());
  }

  private rowFor(accountId: string): Locator {
    return this.accountRows.filter({ has: this.page.getByRole('link', { name: accountId, exact: true }) });
  }

  async getBalance(accountId: string): Promise<number> {
    const text = await this.rowFor(accountId).locator('td').nth(1).innerText();
    return parseCurrency(text);
  }

  async getTotalBalance(): Promise<number> {
    const text = await this.totalRow.locator('td').nth(1).innerText();
    return parseCurrency(text);
  }

  async openAccountDetails(accountId: string): Promise<void> {
    await this.page.getByRole('link', { name: accountId, exact: true }).click();
  }
}