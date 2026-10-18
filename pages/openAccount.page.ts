import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ACCOUNT_TYPES, ROUTES, type AccountType } from '@utils/constants';

export class OpenAccountPage extends BasePage {
  readonly accountTypeSelect: Locator;
  readonly fromAccountSelect: Locator;
  readonly openButton: Locator;
  readonly successHeading: Locator;
  readonly newAccountId: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelect = page.locator('#type');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.openButton = page.getByRole('button', { name: 'Open New Account' });
    this.successHeading = page.getByRole('heading', { name: 'Account Opened!' });
    this.newAccountId = page.locator('#newAccountId');
  }

  async open(): Promise<void> {
    await this.goto(ROUTES.OPEN_ACCOUNT);
  }

  /** Opens an account funded from `fromAccountId` and returns the new account's ID. */
  async openAccount(type: AccountType, fromAccountId: string): Promise<string> {
    await this.accountTypeSelect.selectOption(ACCOUNT_TYPES[type]);
    await this.fromAccountSelect.selectOption(fromAccountId);
    await this.openButton.click();
    await this.newAccountId.waitFor();
    return (await this.newAccountId.innerText()).trim();
  }
}