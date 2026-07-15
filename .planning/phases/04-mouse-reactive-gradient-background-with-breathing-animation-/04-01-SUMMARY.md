---
phase: 04-mouse-reactive-gradient-background-with-breathing-animation
plan: "01"
subsystem: ui/gradient-layer
tags: [gradient, css, playwright, wave-0, rule-0]
dependency_graph:
  requires: []
  provides:
    - GradientBackground component (data-testid=gradient-bg, layerRef for Plan 03)
    - .gradient-bg CSS section in app.css (token-composed radial gradient)
    - tests/gradient.spec.js smoke suite (D-03, D-10, D-09-scaffold, D-11)
  affects:
    - src/App.tsx (mounts gradient inside ThemeProvider before BrowserRouter)
    - src/styles/app.css (new section appended)
tech_stack:
  added: []
  patterns:
    - "Fixed full-viewport layer with pointer-events:none and z-index below app-bar"
    - "color-mix(in srgb, var(--color-brand) N%, transparent) for Rule-0-clean gradient"
    - "useRef<HTMLDivElement> attached at Wave 0 for Plan 03 CSS variable writes"
key_files:
  created:
    - src/components/GradientBackground.tsx
    - tests/gradient.spec.js
  modified:
    - src/styles/app.css
    - src/App.tsx
decisions:
  - "Wave 0 skeleton: no rAF/listeners in this plan; layerRef pre-attached for Plan 03"
  - "All gradient colour stops use color-mix() with existing DLS tokens (Rule 0)"
  - "No .module.css file: all styles live in src/styles/app.css per project convention"
  - "GradientBackground mounted inside ThemeProvider before BrowserRouter so it renders on both routes and after [data-theme] is set"
metrics:
  duration: "156s"
  completed_date: "2026-07-15"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 04 Plan 01: GradientBackground Wave-0 foundation Summary

**One-liner:** Fixed full-viewport ambient gradient layer composed from `--color-brand`/`--color-surface` via `color-mix()`, with Playwright smoke suite covering D-03/D-10/D-11/D-09.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Component skeleton + base gradient CSS + App.tsx mount | 276d371 | GradientBackground.tsx, app.css, App.tsx |
| 2 | Playwright smoke suite tests/gradient.spec.js | 69f0a1e | tests/gradient.spec.js |

## What Was Built

**Task 1:** Created `src/components/GradientBackground.tsx` as a Wave-0 skeleton. It renders a single fixed `<div>` with `className="gradient-bg"`, `data-testid="gradient-bg"`, and `aria-hidden="true"`. A `useRef<HTMLDivElement>(null)` is attached now so Plan 03 can write `--mx`/`--my` CSS variables without touching the JSX. No rAF or event listeners yet.

Appended a `.gradient-bg` section to `src/styles/app.css` following the existing `.app-bar` comment-header format. The gradient is composed exclusively from existing DLS tokens via `color-mix()`:

```
color-mix(in srgb, var(--color-brand) 12%, transparent)
color-mix(in srgb, var(--color-surface) 6%, transparent) 45%
transparent 70%
```

`position: fixed; inset: 0; z-index: 1; pointer-events: none;` ensures the layer covers the full viewport, sits below the app-bar (z-index 10), and never intercepts clicks.

Edited `src/App.tsx` to import and mount `<GradientBackground />` inside `<ThemeProvider>` immediately before `<BrowserRouter>` so it renders on both routes and inherits `[data-theme]` automatically.

**Task 2:** Created `tests/gradient.spec.js` following `tests/responsive.spec.js` conventions (CJS `require`, relative `page.goto()`, `page.viewportSize()` for dimensions, `boundingBox` null-check). Five smoke tests covering:
- D-03: layer exists, `x=0 y=0`, width/height match viewport
- D-10a: Transfer button click resolves (pointer-events:none pass-through)
- D-10b: computed z-index is less than 10
- D-11: layer visible on both `/` and `/kitchen-sink`
- D-09 scaffold: `parseFloat(animationDuration) < 1` under `reducedMotion: "reduce"`

All 15 tests pass (5 per project x 3 projects). Existing `tests/responsive.spec.js` unaffected (3/3 desktop).

## Test Results

```
gradient.spec.js: 15/15 passed (mobile + tablet + desktop)
responsive.spec.js: 3/3 passed (desktop regression check)
```

## Verification Gate Results

| Gate | Command | Result |
|------|---------|--------|
| D-01/D-02 token composition | `grep -nE "color-mix\(in srgb, var\(--color-(brand\|surface)\)"` | 2 matches in app.css |
| No raw design values | `grep -RniE "#[0-9a-f]{3,6}\|rgb\(\|..px\|..rem" GradientBackground.tsx` | 0 matches (PASS) |
| No CSS modules | `find src -name "*.module.css"` | 0 files (PASS) |
| D-10 z-index | `grep -n "z-index: 1;" app.css` | line 159 |
| D-10 pointer-events | `grep -n "pointer-events: none" app.css` | line 160 |
| Smoke suite desktop | `npx playwright test tests/gradient.spec.js --project=desktop` | 5/5 PASS |
| Smoke suite all | `npx playwright test tests/gradient.spec.js` | 15/15 PASS |
| Responsive regression | `npx playwright test tests/responsive.spec.js --project=desktop` | 3/3 PASS |

## Deviations from Plan

None. Plan executed exactly as written.

## Known Stubs

None. The Wave-0 skeleton is intentionally minimal: the `layerRef` ref is attached but unused until Plan 03. This is documented by design, not a stub.

## Threat Flags

None. No new network endpoints, auth paths, or trust boundaries introduced. The `pointer-events: none` + `z-index: 1` mitigations for T-04-01 are in place and verified by the smoke suite.

## Self-Check: PASSED

Files created/verified:
- FOUND: src/components/GradientBackground.tsx
- FOUND: tests/gradient.spec.js
- FOUND (modified): src/styles/app.css (.gradient-bg section at line 152+)
- FOUND (modified): src/App.tsx (<GradientBackground /> at line 11)

Commits verified:
- 276d371: feat(04-01): GradientBackground component, base CSS, and App.tsx mount
- 69f0a1e: test(04-01): Playwright smoke suite tests/gradient.spec.js
