# Meridian data: the API contract

This folder stands in for the bank's API. For the workshop it is plain JSON, but the shapes are exactly what real endpoints would return, so swapping the mock for a live service later is a one-line change in `api.js`.

This is the data layer, one of the three contracts the assistant is held to:

- Design contract: `../dls/DLS-RULES.md`
- **Data contract: this file**
- Behaviour contract: `../tests/responsive.spec.js`

## The endpoints

| File | Stands in for | Returns |
|---|---|---|
| `accounts.json` | `GET /v1/accounts` | the customer's accounts |
| `transactions.json` | `GET /v1/transactions` | recent transactions across accounts |
| `categories.json` | `GET /v1/categories` | spend categories (some excluded from spend totals) |

Every response is an envelope: `{ "data": [...], "meta": {...} }`. `api.js` returns the `data` array; `meta` carries context (customer name, currency, timestamps).

## Conventions (follow these)

- **Money is stored in minor units** (cents) as whole integers: `841290` means `$8,412.90`. This is standard banking practice and avoids floating-point errors. Format for display with `formatSGD()` from `api.js`, never by dividing and concatenating by hand.
- **Amounts are signed.** Negative is money out (a debit), positive is money in (a credit).
- **Currency is SGD**, formatted `en-SG`.
- **Dates are ISO 8601 with the Singapore offset** (`+08:00`).
- **Ids are opaque strings** (`acc_everyday`, `txn_0001`, `cat_dining`). Join transactions to accounts by `accountId` and to categories by `categoryId`.
- **`isSpending: false`** categories (income, transfers) are excluded from spend-by-category totals.

## Using it

```js
import { getAccounts, getTransactions, getCategories, formatSGD } from "./data/api.js";

const accounts = await getAccounts();
formatSGD(841290);            // "$8,412.90"
formatSGD(480000, { signed: true }); // "+$4,800.00"
formatSGD(-620);              // "-$6.20"
```
