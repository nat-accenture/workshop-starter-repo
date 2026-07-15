# ROADMAP

## Milestone: Meridian v1 (delivered)

Meridian's foundation, widgets, and design system are built and merged to `main`
as a React + TypeScript app. The dashboard reads real-shaped data through the mock
API, is composed entirely from the DLS, and passes the responsive behaviour
contract at mobile, tablet, and desktop.

### Phase 1: Foundation and shell
Goal: a layered, on-brand dashboard that looks real on first open.
Delivered: the DLS (design contract), the mock API (data contract), the Playwright
responsive harness (behaviour contract), and the dashboard shell (balance summary
and quick actions). Rebuilt from the original vanilla HTML into React 18 +
TypeScript + Vite, with a lean, on-brand design system and tokenised motion.
Requirements: FOUND-01 to FOUND-05.
Status: complete.

### Phase 2: Build the widgets
Goal: fill the three dashboard widgets from the mock API using DLS components.
Delivered: Recent activity (`src/features/dashboard/RecentActivity.tsx`), Spend by
category (`SpendByCategory.tsx`), and Savings goal (`SavingsGoal.tsx`). Each renders
from the mock API, composes from `mrdn-` components, and stays responsive.
Requirements: FEAT-01 to FEAT-03 (stretch FEAT-04 to FEAT-06 remain candidates).
Status: complete.

### Phase 3: The readout (closing demo)
Goal: generate a stakeholder readout from `.planning/`, showing that the same
context that built the screen writes the report.
Status: planned.
