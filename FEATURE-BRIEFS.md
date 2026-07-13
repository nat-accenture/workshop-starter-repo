# Feature briefs

Pick ONE. Copy the brief exactly as written into a `/spec-quick` command, then walk the loop: read the plan, approve, watch it build, refresh the browser, then run `/spec-verify-work`.

The briefs are written the way a person describes an experience, not the way an engineer specs it. Your words are the input. You do not have to worry about the details, because the app carries three contracts the assistant follows for you:

- the design system in `dls/` (your widget comes out on brand),
- the mock API in `data/` (your widget shows real-looking data),
- the responsive test in `tests/` (your widget has to work on a phone).

How to run one:
```
/spec-quick "PASTE ONE BRIEF HERE"
```

The three open hooks below are the heart of the dashboard. The room builds #1 together first, then you pick #2 or #3.

---

## 1. Recent activity  (1 star)
> "On my dashboard, show my recent activity: a list of my latest transactions, each with the merchant, the category, the date, and the amount. Money coming in should read as positive, money going out as negative."

- Fills: the "Recent activity" card (`#transactions`)
- Data: `getTransactions()` (use `getCategories()` for the category label)
- Components: `mrdn-list`, `mrdn-row`, `mrdn-amount`
- Done when: the card lists recent transactions with merchant, category, date, and a signed amount, and still reads well on a phone.

## 2. Spend by category  (2 stars)
> "Show me where my money went this month. Group my spending into categories, show the total for each, and give each a little bar so I can see the biggest at a glance. Do not count income or transfers."

- Fills: the "Spend by category" card (`#spend`)
- Data: `getTransactions()` + `getCategories()` where `isSpending` is true
- Components: `mrdn-row`, `mrdn-progress`, `mrdn-amount`
- Done when: each spending category shows its total and a proportional bar, biggest first.

## 3. Savings goal  (2 stars)
> "Show my progress toward my Holiday fund. Tell me how much I have saved of my target and how much is left, with a progress bar so I can feel how close I am."

- Fills: the "Savings goal" card (`#savings`)
- Data: the savings account from `getAccounts()` (it has `goal.targetMinor`)
- Components: `mrdn-stat`, `mrdn-progress`, `mrdn-pill--accent`
- Done when: it shows saved of target and a progress bar toward the goal.

---

## Stretch (for pairs who finish early)
- **Filter recent activity** (FEAT-04): "Add category chips above my recent activity so I can show just Dining, or just Transport, or all of it." Components: `mrdn-chip`.
- **Income vs spend** (FEAT-05): "At the top, show my money in versus money out this month, side by side."
- **Account switcher** (FEAT-06): "Let me tap an account at the top to focus the whole dashboard on just that account."
- Run `/spec-verify-work` and fix anything the responsive test flags.
- Open `.planning/` and trace your FEAT id to your commit with `git log`.

Difficulty is a guide, not a limit. A nervous first-timer should stay on #1. A racing pair should stack a stretch brief.
