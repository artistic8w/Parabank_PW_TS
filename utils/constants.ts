export const ROUTES = {
  LOGIN: 'index.htm',
  REGISTER: 'register.htm',
  OVERVIEW: 'overview.htm',
  OPEN_ACCOUNT: 'openaccount.htm',
  REQUEST_LOAN: 'requestloan.htm',
} as const;

export const ACCOUNT_TYPES = {
  CHECKING: '0',
  SAVINGS: '1',
} as const;

export type AccountType = keyof typeof ACCOUNT_TYPES;

export const TIMEOUTS = {
  SHORT: 5_000,
  DEFAULT: 15_000,
  LONG: 30_000,
} as const;