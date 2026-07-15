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

### Phase 4: Mouse-reactive gradient background with breathing animation on mobile, supporting dark and light mode

**Goal:** Add an ambient gradient background to the web app that shifts toward the
pointer position on devices with a mouse, and falls back to a gentle "breathing"
animation on mobile/touch (no pointer). It must work in both light and dark mode,
respect `prefers-reduced-motion`, and be built from DLS tokens (no raw colour
values). Verify it running in the app before handing back for review.
**Requirements**: D-01 to D-11 (locked CONTEXT.md decisions; no formal REQ-IDs)
**Depends on:** Phase 3
**Plans:** 3/3 plans complete

Plans:
- [x] 04-01-PLAN.md — Wave 0: fixed gradient layer component + base token-composed CSS + mount + Playwright smoke suite (D-01, D-02, D-03, D-10, D-11)
- [x] 04-02-PLAN.md — Wave 1: add the one --dur-breath motion token to dls/tokens.css (RULE 0 gated, human-confirms value) (D-07)
- [x] 04-03-PLAN.md — Wave 2: pointer rAF parallax tracking + mobile breathing fallback + reduced-motion JS gate (D-04, D-05, D-06, D-08, D-09)

### Phase 5: Charting foundation (backlog)

**Goal:** Establish a single, DLS-bound charting approach so future chart work
(e.g. FEAT-05 income-vs-spend) always uses one library instead of hand-rolled or
ad hoc visuals. Introduce Recharts (https://recharts.github.io/) as the standard,
wrapped so every visual value (colour, type, stroke, spacing) resolves to DLS
tokens, likely behind a new `mrdn-chart` primitive.
**Rule 0 note:** adding Recharts is a new runtime dependency AND introduces a
non-`mrdn-` visual system, so it is a DLS breaking change. It must be planned on
its own and get explicit human sign-off before any component or token is added.
**Requirements:** TBD
**Depends on:** none (foundational)
**Status:** backlog (captured from Phase 4 discuss-phase, 2026-07-15)
**Plans:** 0 plans
