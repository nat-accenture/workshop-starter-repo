# REQUIREMENTS

Baseline requirements the starter already satisfies, plus the workshop candidates. Each has an ID so work traces from request to commit.

## Delivered (baseline)
- FOUND-01: A design language system in code (tokens, components, rules) that the app is built from.
- FOUND-02: A mock API shaped like real bank endpoints (accounts, transactions, categories) with a documented contract.
- FOUND-03: A responsive test harness (Playwright, Chromium) checking mobile, tablet, and desktop.
- FOUND-04: A dashboard shell with an account balance summary that reads from the API.
- FOUND-05: A quick actions panel.

## Delivered (widgets)
Built in React from the mock API using DLS components; each keeps the responsive test green.

- FEAT-01: Recent activity, a list of recent transactions with merchant, category, date, and a signed amount.
- FEAT-02: Spend by category this month, each spending category with a total and a proportional bar.
- FEAT-03: Savings goal, progress toward the Holiday fund target with a bar.

## Candidate (stretch)
Each maps to a brief in `FEATURE-BRIEFS.md`.

- FEAT-04: Filter recent activity by category.
- FEAT-05: A month-to-date income versus spend summary.
- FEAT-06: An account switcher that scopes the dashboard to one account.
