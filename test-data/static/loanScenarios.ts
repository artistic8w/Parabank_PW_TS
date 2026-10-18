// UNVERIFIED: confirm these against the live app (see manual probe) before trusting them.
export const LOAN_SCENARIOS = {
  approvable: { amount: '100', downPayment: '10' },
  deniable: { amount: '1000000', downPayment: '10' },
} as const;
