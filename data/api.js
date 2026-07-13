// ============================================================
// Meridian Bank - mock API (data layer)
//
// This file is the ONE seam between the app and its data.
// Today each call reads a local JSON file with a little fake
// latency, so it behaves like a real network request. To go
// live, swap the fetch target for your real API base URL and
// add auth. Nothing else in the app changes, because the SHAPE
// of the response is the contract. See DATA-CONTRACT.md.
// ============================================================

const LATENCY_MS = 220;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function read(endpoint) {
  await sleep(LATENCY_MS); // pretend it is a network round-trip
  // TODO (production): replace with `${API_BASE}/v1/${endpoint}` + auth headers.
  const res = await fetch(new URL(`./${endpoint}.json`, import.meta.url));
  if (!res.ok) throw new Error(`Meridian API: failed to load ${endpoint}`);
  const body = await res.json();
  return body.data;
}

export const getAccounts = () => read("accounts");
export const getTransactions = () => read("transactions");
export const getCategories = () => read("categories");

// Money helper implementing the DLS money rule: SGD, en-SG,
// amounts stored in minor units (cents). See dls/DLS-RULES.md.
export function formatSGD(amountMinor, { signed = false } = {}) {
  const value = amountMinor / 100;
  const formatted = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(Math.abs(value));
  if (value < 0) return `-${formatted}`;
  if (signed && value > 0) return `+${formatted}`;
  return formatted;
}
