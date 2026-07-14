// ============================================================
// Meridian Bank - mock API (data layer)
//
// This file is the ONE seam between the app and its data.
// Today each call returns a local JSON fixture behind a little
// fake latency, so it behaves like a real network request. To go
// live, swap the JSON imports for `fetch(`${API_BASE}/v1/${endpoint}`)`
// + auth headers. Nothing else in the app changes, because the SHAPE
// of the response is the contract. See DATA-CONTRACT.md.
// ============================================================

import accountsJson from "./accounts.json";
import transactionsJson from "./transactions.json";
import categoriesJson from "./categories.json";
import type { Account, Transaction, Category } from "./types";

const LATENCY_MS = 220;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Each fixture is an envelope: { data: [...], meta: {...} }. We return `data`,
// typed to the contract. The `unknown` hop keeps TypeScript from arguing about
// the JSON's inferred literal types.
async function read<T>(rows: T): Promise<T> {
  await sleep(LATENCY_MS); // pretend it is a network round-trip
  return rows;
}

export const getAccounts = (): Promise<Account[]> =>
  read(accountsJson.data as unknown as Account[]);

export const getTransactions = (): Promise<Transaction[]> =>
  read(transactionsJson.data as unknown as Transaction[]);

export const getCategories = (): Promise<Category[]> =>
  read(categoriesJson.data as unknown as Category[]);

// Money helper implementing the DLS money rule: SGD, en-SG,
// amounts stored in minor units (cents). See dls/DLS-RULES.md.
export function formatSGD(
  amountMinor: number,
  { signed = false }: { signed?: boolean } = {},
): string {
  const value = amountMinor / 100;
  const formatted = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(Math.abs(value));
  if (value < 0) return `-${formatted}`;
  if (signed && value > 0) return `+${formatted}`;
  return formatted;
}
