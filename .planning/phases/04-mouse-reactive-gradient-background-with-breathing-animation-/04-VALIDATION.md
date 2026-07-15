---
phase: 04
slug: mouse-reactive-gradient-background-with-breathing-animation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-15
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Phase 4 has no formal REQ-IDs; the CONTEXT.md decisions (D-01..D-11) are the
> requirements. Task IDs below are assigned by the planner and bound back here.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (Chromium), installed |
| **Config file** | `playwright.config.js` |
| **Quick run command** | `npx playwright test tests/responsive.spec.js --project=desktop` |
| **Full suite command** | `npm run test:responsive` (mobile, tablet, desktop) |
| **Estimated runtime** | ~10-25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test tests/responsive.spec.js --project=desktop` (proves the background never breaks the existing responsive contract)
- **After every plan wave:** Run `npm run test:responsive` (full mobile/tablet/desktop)
- **Before `/spec-verify-work`:** Full suite green **and** the manual browser check below completed
- **Max feedback latency:** ~25 seconds

---

## Per-Task Verification Map

Requirements are the locked CONTEXT.md decisions. Task IDs are TBD until the
planner assigns them; the planner MUST cite the matching test command in each
task's `<acceptance_criteria>`.

| Requirement | Behavior | Threat Ref | Test Type | Automated Command | File Exists | Status |
|-------------|----------|------------|-----------|-------------------|-------------|--------|
| D-03 | Fixed gradient layer exists and covers full viewport | — | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | ❌ W0 | ⬜ pending |
| D-10 | Layer has `pointer-events: none`; does not block clicks | — | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | ❌ W0 | ⬜ pending |
| D-10 | Layer `z-index` is below `.app-bar` (z-index 10) | — | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | ❌ W0 | ⬜ pending |
| D-09 | No animation under `prefers-reduced-motion` (DLS reset forces ~0ms) | — | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | ❌ W0 | ⬜ pending |
| D-11 | Layer renders on both `/` and `/kitchen-sink` | — | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | ❌ W0 | ⬜ pending |
| D-01/D-02 | Gradient colours resolve from existing tokens via `color-mix()` (no raw hex, no new colour token) | — | grep/static | `grep -RnE "color-mix\\(|var\\(--color-(surface\|brand\|canvas)\\)" src/ && ! grep -RniE "#[0-9a-f]{3,6}" src/components/GradientBackground*` | ❌ W0 | ⬜ pending |
| D-07 | `--dur-breath` added to `dls/tokens.css` (isolated, human-confirmed) | — | grep/static | `grep -n "\\-\\-dur-breath" dls/tokens.css` | ❌ W0 | ⬜ pending |
| (existing) | Shell + responsive layout unchanged at mobile/tablet/desktop | — | Playwright full | `npm run test:responsive` | ✅ `tests/responsive.spec.js` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/gradient.spec.js` — smoke tests covering D-03, D-10, D-09, D-11 (layer exists/fixed/full-viewport, `pointer-events:none` click pass-through, `z-index` below app-bar, no animation under reduced-motion, present on both routes)
- [ ] `src/components/GradientBackground.tsx` — the component (must expose `data-testid="gradient-bg"` for the smoke tests)
- [ ] `src/components/GradientBackground.module.css` (or the project's chosen style seam) — the layer's styles, all values from DLS tokens
- [ ] `dls/tokens.css` — add `--dur-breath` (isolated task, gated by human confirm of the exact value)

*Existing `tests/responsive.spec.js` covers the regression side; the file above is the new coverage.*

---

## Manual-Only Verifications

The phase goal explicitly requires "verify it running in the app before handing
back for review." These behaviors are visual/ambient and not usefully asserted
in Playwright (synthetic pointer moves don't exercise real tracking).

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Gradient drifts toward the pointer with a damped/eased trail | D-04, D-05 | Ambient visual; synthetic `mouse.move()` doesn't meaningfully exercise it | `npm run dev`, open `/` on a mouse device, move the pointer; confirm the tint drifts a fraction toward it and eases smoothly, not 1:1 |
| Breathing opacity pulse on touch / no fine pointer | D-06, D-07, D-08 | Requires a coarse-pointer device / emulation | Open in a touch device or DevTools device mode (coarse pointer); confirm a slow (~6-8s) fade pulse and NO pointer tracking |
| Reads correctly in light and dark | D-01, D-02 | Visual contrast judgement | Toggle theme; confirm ambient look holds and text AA contrast is unaffected in both |
| Static, motionless under reduced motion | D-09 | Cross-checks the automated smoke visually | Enable OS "reduce motion"; confirm a static centred gradient, no tracking, no breathing |

---

## Validation Sign-Off

- [ ] All tasks have an `<automated>` verify command or a Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (gradient.spec.js, component, token)
- [ ] No watch-mode flags in any command
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter (after planner binds task IDs)

**Approval:** pending
