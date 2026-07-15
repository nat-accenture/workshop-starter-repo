# Phase 2 Summary: Build the widgets

Status: complete (delivered directly, merged to `main`).

## What was delivered
The three dashboard widgets, each rendered from the mock API and composed only from
DLS `mrdn-` components:

- **Recent activity** (`src/features/dashboard/RecentActivity.tsx`) — the latest
  transactions with merchant, category, date, and a signed amount (credits read
  positive/green).
- **Spend by category** (`SpendByCategory.tsx`) — this month's spending grouped by
  category, biggest first, each with a proportional bar; income and transfers
  excluded.
- **Savings goal** (`SavingsGoal.tsx`) — progress toward the Holiday fund target
  with a progress bar and amount remaining.

## Verification
All three satisfy FEAT-01..03, use `formatSGD()` for money, and keep the responsive
behaviour contract green (9/9 Playwright checks across mobile, tablet, desktop).
Stretch items FEAT-04..06 remain candidates.
