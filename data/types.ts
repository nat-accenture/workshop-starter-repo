// Meridian data: the TypeScript shape of the API contract.
// These mirror data/DATA-CONTRACT.md. The shapes are the contract, so a live
// backend must return exactly these fields.

export type AccountType = "checking" | "savings" | "credit";

export interface SavingsGoal {
  label: string;
  targetMinor: number;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  accountNumberMasked: string;
  /** Money in minor units (cents). 841290 means $8,412.90. */
  balanceMinor: number;
  availableMinor: number;
  changePct7d: number;
  creditLimitMinor?: number;
  goal?: SavingsGoal;
}

export type TransactionStatus = "posted" | "pending";

export interface Transaction {
  id: string;
  accountId: string;
  /** ISO 8601 with the Singapore offset (+08:00). */
  postedAt: string;
  description: string;
  merchant: string;
  categoryId: string;
  /** Signed minor units. Negative is money out, positive is money in. */
  amountMinor: number;
  status: TransactionStatus;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  /** isSpending=false rows (income, transfers) are excluded from spend totals. */
  isSpending: boolean;
}
