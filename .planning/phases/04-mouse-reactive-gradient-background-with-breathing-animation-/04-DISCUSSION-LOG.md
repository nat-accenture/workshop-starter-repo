# Phase 4: Mouse-reactive gradient background - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-15
**Phase:** 04-mouse-reactive-gradient-background-with-breathing-animation
**Areas discussed:** Gradient look + token question, Pointer tracking feel, Mobile breathing fallback, Reduced-motion + layering/safety

---

## Gradient look + token question

### Which DLS tokens compose the gradient?

| Option | Description | Selected |
|--------|-------------|----------|
| Existing tokens only | radial-gradient from `--color-brand` fading to transparent over `--color-canvas`; no new token | |
| Existing surface + brand blend | soft two-stop gradient from `--color-surface` + `--color-brand`; still no new token | ✓ |
| Add a new ambient token | bespoke `--color-ambient` / `--gradient-ambient`; Rule 0 breaking change needing sign-off | |

**User's choice:** Existing surface + brand blend
**Notes:** Keeps the gradient fully within existing colour tokens — Rule 0 clean, theme-aware for free.

### How visible should it be?

| Option | Description | Selected |
|--------|-------------|----------|
| Barely-there whisper | very low alpha, ambient only; card text contrast untouched | ✓ |
| Subtle but noticeable | clearly visible soft glow | |
| Bolder / more colourful | confident wash of colour | |

**User's choice:** Barely-there whisper
**Notes:** Fits the "calm, trustworthy" bank feel; keeps AA contrast safe in both themes.

### Where does the tint apply?

| Option | Description | Selected |
|--------|-------------|----------|
| Whole viewport, behind everything | one fixed full-page layer behind shell + cards | ✓ |
| Canvas gutters only | tint only around/behind cards | |

**User's choice:** Whole viewport, behind everything

---

## Pointer tracking feel

### How much should the gradient centre follow the pointer?

| Option | Description | Selected |
|--------|-------------|----------|
| Damped / parallax | drifts a fraction toward pointer, never reaches cursor | ✓ |
| Full 1:1 tracking | gradient centre sits under the pointer | |
| Fixed centre, intensity shifts | only intensity/spread responds | |

**User's choice:** Damped / parallax

### How should it ease as the pointer moves?

| Option | Description | Selected |
|--------|-------------|----------|
| Smooth trailing lag | eases toward new position (rAF-interpolated) | ✓ |
| Immediate / snappy | position updates directly, no smoothing | |

**User's choice:** Smooth trailing lag

---

## Mobile breathing fallback

### What should the gradient do to "breathe"?

| Option | Description | Selected |
|--------|-------------|----------|
| Opacity pulse | gentle fade in/out; no layout movement | ✓ |
| Slow position drift | gradient centre slowly wanders | |
| Opacity + slight drift | soft fade plus small drift | |

**User's choice:** Opacity pulse

### How slow is the breathing loop? (duration token question)

| Option | Description | Selected |
|--------|-------------|----------|
| Add a breathing-duration token | ~6-8s cycle via new `--dur-breath` (~7000ms); Rule 0 change, sign-off required | ✓ |
| Moderate ~3-4s, still needs a token | quicker cycle; same Rule 0 situation | |
| Stay within existing tokens | reuse `--dur-slower` (560ms); reads as flicker, not breathing | |

**User's choice:** Add a breathing-duration token
**Notes:** User approved adding `--dur-breath` in principle. The token add remains a Rule 0 breaking change to be made as an isolated execution step with a final value confirmation.

### What counts as a "mouse device" vs "mobile/touch"?

| Option | Description | Selected |
|--------|-------------|----------|
| `(pointer: fine)` media query | CSS-native; tracks on hybrid devices with a mouse | ✓ |
| Touch-capable → breathe | any touch capability uses breathing | |
| You decide | Claude picks the most robust signal | |

**User's choice:** `(pointer: fine)` media query

---

## Reduced-motion + layering/safety

### Under prefers-reduced-motion, what should the background do?

| Option | Description | Selected |
|--------|-------------|----------|
| Static centred gradient | frozen, centred, no tracking, no breathing | ✓ |
| Remove gradient entirely | flat `--color-canvas` as today | |
| Freeze at last position | stop animation, keep current position | |

**User's choice:** Static centred gradient

### Where does the background layer live, and how does it stay click-safe?

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed layer behind app, pointer-events:none | `position:fixed` in ThemeProvider, `z-index` below app-bar | ✓ |
| `body::before` pseudo-element | pure CSS, outside the React tree | |
| You decide | pick cleanest seam during planning | |

**User's choice:** Fixed layer behind app, pointer-events:none

### Which routes show the ambient background?

| Option | Description | Selected |
|--------|-------------|----------|
| Both routes, app-wide | `/` and `/kitchen-sink` | ✓ |
| Dashboard only | `/` only | |

**User's choice:** Both routes, app-wide

---

## Claude's Discretion
- Exact gradient geometry, alpha value, parallax fraction, and rAF interpolation constant.
- Exact `(pointer: fine)` detection implementation.
- The precise seam for injecting pointer CSS variables (no React re-renders).

## Deferred Ideas
- Recharts charting library → its own "charting foundation" phase (added to roadmap backlog as Phase 5). Out of Phase 4 scope; a foreign visual system needing DLS-token binding + a new dependency = a Rule 0 decision for its own plan.
