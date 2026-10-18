import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '@utils/constants';

export class LoanPage extends BasePage {
  readonly amountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly applyButton: Locator;
  readonly resultHeading: Locator;
  readonly loanStatus: Locator;
  readonly newAccountLink: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('#amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.applyButton = page.getByRole('button', { name: 'Apply Now' });
    this.resultHeading = page.getByRole('heading', { name: 'Loan Request Processed' });
    this.loanStatus = page.locator('#loanStatus');
    this.newAccountLink = page.locator('#newAccountId');
  }

  async open(): Promise<void> {
    await this.goto(ROUTES.REQUEST_LOAN);
  }

  async apply(amount: string, downPayment: string, fromAccountId: string): Promise<void> {
    await this.amountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);
    await this.fromAccountSelect.selectOption(fromAccountId);
    await this.applyButton.click();
  }
}
