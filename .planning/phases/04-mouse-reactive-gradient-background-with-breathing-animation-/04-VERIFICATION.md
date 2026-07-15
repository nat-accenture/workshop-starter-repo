---
phase: 04-mouse-reactive-gradient-background-with-breathing-animation
verified: 2026-07-15T14:30:00Z
status: human_needed
score: 11/11
overrides_applied: 0
human_verification:
  - test: "Gradient drifts toward the pointer with a damped/eased trail"
    expected: "Open / on a mouse device, move pointer; the tint drifts a fraction toward it and eases smoothly, never 1:1. Only a gentle ambient shift, not a spotlight."
    why_human: "Synthetic pointer moves in Playwright do not exercise real parallax perception. Must be verified visually in a real browser."
  - test: "Breathing opacity pulse on touch / no fine pointer"
    expected: "Open in DevTools device mode (coarse pointer) or a real touch device; confirm a slow ~7s opacity fade pulse and NO pointer tracking."
    why_human: "Requires coarse-pointer device or emulation to perceive the cadence. Playwright mobile project confirms the CSS class is applied; the visual feel needs human judgment."
  - test: "Reads correctly in both light and dark mode"
    expected: "Toggle the theme; ambient tint holds in both modes, card text AA contrast is not degraded."
    why_human: "Colour contrast and visual 'barely-there whisper' quality is a judgement call that cannot be asserted programmatically."
  - test: "Static, motionless under OS reduce-motion"
    expected: "Enable OS 'Reduce Motion'; the gradient is centred and completely still — no tracking, no breathing pulse."
    why_human: "OS-level setting interaction and visual stillness must be confirmed by a human (automated test covers DLS reset path, not full OS integration)."
---

# Phase 04: Mouse-Reactive Gradient Background Verification Report

**Phase Goal:** Add an ambient gradient background that shifts toward the pointer on mouse devices, falls back to a gentle breathing animation on touch/no-pointer devices, works in both light and dark mode, respects `prefers-reduced-motion`, and is built from DLS tokens (no raw colour values).
**Verified:** 2026-07-15T14:30:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth (from CONTEXT.md) | Status | Evidence |
|---|-------------------------|--------|----------|
| 1 | D-01/D-02: Gradient colours resolve from existing tokens (`--color-brand`, `--color-surface`) via `color-mix()`, barely-there alpha, no raw hex, no new colour token | VERIFIED | `app.css` lines 163-164, 175-176: `color-mix(in srgb, var(--color-brand) 12%, transparent)` and `color-mix(in srgb, var(--color-surface) 6%, transparent)`. `GradientBackground.tsx` grep for raw hex/rgb returns nothing. |
| 2 | D-03: One fixed full-viewport layer covering the whole viewport | VERIFIED | `.gradient-bg` has `position: fixed; inset: 0`. Playwright test "gradient layer exists and covers the full viewport" passes on mobile, tablet, desktop (18/18 tests). |
| 3 | D-04/D-05: Pointer tracking via rAF lerp writing `--mx`/`--my` directly to element style, no React re-render per frame | VERIFIED | `GradientBackground.tsx` lines 58-59: `el.style.setProperty("--mx", ...)` and `el.style.setProperty("--my", ...)` inside `tick()`. `isFinePointer` is the only `useState`; no `setState` in `tick` or `onPointerMove`. FACTOR = 0.06 (damped). |
| 4 | D-06: Touch/no-fine-pointer fallback is a slow opacity breathing pulse via `.gradient-bg--breathing` class | VERIFIED | `app.css` lines 169-181: `.gradient-bg--breathing` with `@keyframes gradient-breathe { from { opacity: 0.4; } to { opacity: 1; } }`. Playwright breathing-class test passes: mobile project has class, tablet/desktop do not. |
| 5 | D-07: `--dur-breath: 7000ms` added to `dls/tokens.css` (single occurrence, `:root` only, human-confirmed, no dark variant) | VERIFIED | `dls/tokens.css` line 96: `--dur-breath: 7000ms;` with approval comment. `grep -c` returns exactly 1. Dark block (lines 110-142) contains no `--dur*` token. |
| 6 | D-08: `(pointer: fine)` media query decides mode; `matchMedia` change listener handles live switch | VERIFIED | `GradientBackground.tsx` lines 10-11 (lazy init), 19-23 (Effect A change listener). Effect B checks `!isFinePointer` at line 41. `app.css` breathing CSS uses `var(--dur-breath)`. |
| 7 | D-09: Under `prefers-reduced-motion` the gradient is static — no rAF loop or pointer listener attached (JS gate), breathing keyframe killed by DLS reset | VERIFIED | `GradientBackground.tsx` line 40: `if (prefersReducedMotion()) return;` is the first guard in Effect B. `reduceMotion` state (line 13) + Effect A2 (lines 28-34) provide a live matchMedia listener so the OS toggle takes effect without a reload. `app.css` has no `@media (prefers-reduced-motion)` block — the DLS reset in `dls/components.css` line 335 kills the keyframe. Playwright D-09 test: `animationDuration < 1ms` passes on all projects. |
| 8 | D-10: Layer has `pointer-events: none`, `z-index: -1` (below app-bar `z-index: 10`), never intercepts clicks | VERIFIED | `app.css` lines 159-160: `z-index: -1; pointer-events: none;`. Playwright "does not block clicks" (Transfer button) passes. "sits below the app-bar" (`z < 10`) passes with z = -1. |
| 9 | D-11: Layer renders on both `/` and `/kitchen-sink` | VERIFIED | `App.tsx` lines 10-12: `<GradientBackground />` is inside `<ThemeProvider>` and before `<BrowserRouter>`, so it renders for every route. Playwright "renders on both routes" passes. |
| 10 | Orchestrator fix WR-01: z-index changed from 1 to -1 (layer truly behind cards) | VERIFIED | Commit 7a83c64 changed `z-index: 1` to `z-index: -1`. Current `app.css` line 159 confirms `-1`. Test `expect(Number(z)).toBeLessThan(10)` still passes since -1 < 10. |
| 11 | Orchestrator fix WR-02: live reduced-motion gate via `matchMedia` change listener + `reduceMotion` state | VERIFIED | Commit 7a83c64 added Effect A2 (`matchMedia('(prefers-reduced-motion: reduce)')` with `addEventListener('change', ...)`) and `reduceMotion` in Effect B deps `[isFinePointer, reduceMotion]`. Present in current source lines 28-34 and 70. |

**Score:** 11/11 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/GradientBackground.tsx` | Fixed gradient layer with rAF lerp, mode switch, reduced-motion gate, breathing class toggle | VERIFIED | 83 lines. Has `data-testid="gradient-bg"`, `aria-hidden="true"`, `requestAnimationFrame`, `setProperty("--mx"/"--my")`, `prefersReducedMotion()` guard, `matchMedia` listeners, `cancelAnimationFrame` cleanup. |
| `src/styles/app.css` | `.gradient-bg` + `.gradient-bg--breathing` + `@keyframes gradient-breathe`, all values from DLS tokens | VERIFIED | Lines 156-186. `color-mix(in srgb, var(--color-brand|surface) N%, transparent)`, `var(--dur-breath)`, `var(--ease-in-out)`. No raw hex/rgb/px/rem/ms. No `@media (prefers-reduced-motion)` block. |
| `src/App.tsx` | `GradientBackground` mounted inside `ThemeProvider`, before `BrowserRouter` | VERIFIED | Lines 10-12: `<ThemeProvider>` then `<GradientBackground />` then `<BrowserRouter>`. Named import present. |
| `dls/tokens.css` | `--dur-breath: 7000ms` in `:root` motion block, no dark variant, no other DLS change | VERIFIED | Line 96. Single occurrence confirmed. `[data-theme="dark"]` block has no `--dur*` token. Only this one line added versus pre-phase baseline. |
| `tests/gradient.spec.js` | Playwright smoke for D-03, D-10, D-11, D-09, D-06/D-08 breathing; 6 tests total | VERIFIED | 82 lines. 6 tests covering all required decisions. Uses `require("@playwright/test")` (CommonJS). Opens with `// @ts-check`. 18/18 assertions pass (6 tests x 3 projects). No screenshot test. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/App.tsx` | `src/components/GradientBackground` | Named import + JSX inside ThemeProvider before BrowserRouter | VERIFIED | `import { GradientBackground }` at line 4; `<GradientBackground />` at line 11 |
| `src/components/GradientBackground.tsx` | `src/styles/app.css .gradient-bg` | `className="gradient-bg"` (conditionally + `--breathing`) | VERIFIED | Lines 72-73: class join using `["gradient-bg", !isFinePointer && "gradient-bg--breathing"]` |
| `src/styles/app.css .gradient-bg` | `dls/tokens.css --color-brand / --color-surface` | `color-mix(in srgb, var(--color-brand|surface) N%, transparent)` | VERIFIED | Lines 163-164, 175-176 |
| `src/styles/app.css .gradient-bg--breathing` | `dls/tokens.css --dur-breath` | `animation: gradient-breathe var(--dur-breath) var(--ease-in-out) infinite alternate` | VERIFIED | Line 179 |
| `src/components/GradientBackground.tsx` | `src/lib/motion.ts prefersReducedMotion` | Import + call as first guard in Effect B | VERIFIED | Line 2 import, line 40 call |
| `src/components/GradientBackground.tsx rAF tick` | Layer element `--mx` / `--my` CSS custom properties | `el.style.setProperty("--mx"|"--my", ...)` inside `tick()` | VERIFIED | Lines 58-59; no `setState` in tick |

---

### Data-Flow Trace (Level 4)

Not applicable. This phase delivers a pure client-side visual effect. There is no server data source or API; the "data" is pointer coordinates (from `PointerEvent.clientX/clientY`) and OS media query state — both browser-native and always present. The animation reads CSS tokens which resolve at paint time from the DLS.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compiles clean | `npx tsc --noEmit` | No output (zero errors) | PASS |
| Gradient smoke suite — all 3 projects | `npx playwright test tests/gradient.spec.js` | 18/18 passed (1.9s) | PASS |
| Responsive contract regression — all 3 projects | `npx playwright test tests/responsive.spec.js` | 9/9 passed (2.0s) | PASS |
| `--dur-breath` single token in `:root` | `grep -c "dur-breath" dls/tokens.css` | Returns `1` | PASS |
| Token composition — no raw hex in component | `grep -RniE "#[0-9a-f]{3,6}" src/components/GradientBackground.tsx` | No output | PASS |
| No raw `ms` in app.css gradient section | `grep -nE "[0-9]+ms" src/styles/app.css` | No output | PASS |
| No CSS modules created | `find src -name "*.module.css"` | No output | PASS |
| No `@media (prefers-reduced-motion)` in app.css | `grep -c "prefers-reduced-motion" src/styles/app.css` | Returns `1` (comment only, line 171) | PASS |
| z-index: -1 satisfies `z < 10` test | assertion math | -1 < 10 = true | PASS |

---

### Requirements Coverage

Phase 04 uses locked CONTEXT.md decisions (D-01..D-11) rather than formal REQ-IDs. All 11 decisions are covered:

| Decision | Description | Status | Evidence |
|----------|-------------|--------|----------|
| D-01 | Gradient from `--color-brand`/`--color-surface` via `color-mix()`, no new colour token | SATISFIED | `app.css` lines 163-164, 175-176 |
| D-02 | Barely-there whisper alpha (12% brand, 6% surface) behind cards | SATISFIED | `z-index: -1` + `color-mix` alpha values |
| D-03 | Full-viewport fixed layer | SATISFIED | `position: fixed; inset: 0`; Playwright bounding-box test passes |
| D-04 | Damped parallax tracking (never 1:1) | SATISFIED | FACTOR = 0.06 lerp; human visual confirmation needed |
| D-05 | rAF-interpolated, CSS var writes via `setProperty`, no React re-renders | SATISFIED | `el.style.setProperty("--mx"|"--my")` in tick; no setState in hot path |
| D-06 | Breathing opacity pulse on touch/coarse-pointer | SATISFIED | `.gradient-bg--breathing` + `@keyframes gradient-breathe` |
| D-07 | `--dur-breath: 7000ms` (human-confirmed) isolated DLS change | SATISFIED | `dls/tokens.css` line 96; single occurrence; approved 2026-07-15 |
| D-08 | `(pointer: fine)` media query decides mode; live change listener | SATISFIED | `useState` lazy init + Effect A `matchMedia('(pointer: fine)')` |
| D-09 | Static under reduced-motion — JS gate (no loop) + DLS CSS reset (no keyframe) | SATISFIED | `prefersReducedMotion()` early return in Effect B; Effect A2 live listener; DLS reset in `components.css:335` |
| D-10 | `pointer-events: none`, z below app-bar (z-index 10), no click interception | SATISFIED | `z-index: -1; pointer-events: none`; Transfer button click-through passes |
| D-11 | Renders on both `/` and `/kitchen-sink` | SATISFIED | Mounted above `BrowserRouter` in `App.tsx`; Playwright both-routes test passes |

---

### Anti-Patterns Found

No blockers or warnings. Scanned `src/components/GradientBackground.tsx`, `src/styles/app.css`, `dls/tokens.css`, `tests/gradient.spec.js`, `src/App.tsx`.

| File | Pattern Checked | Finding |
|------|----------------|---------|
| `GradientBackground.tsx` | Raw hex/rgb/px/rem | None found |
| `GradientBackground.tsx` | `setState` inside `tick`/`onPointerMove` | None found — only `isFinePointer` and `reduceMotion` state, never in hot path |
| `GradientBackground.tsx` | Missing cleanup (rAF, event listeners) | All cleaned up: `cancelAnimationFrame`, `removeEventListener` on pointermove + both matchMedia listeners |
| `app.css` (gradient section) | Raw `ms` values | None found — `var(--dur-breath)`, `var(--ease-in-out)` |
| `app.css` | `@media (prefers-reduced-motion)` block | Not present (comment only) — correct; DLS handles it |
| `dls/tokens.css` | More than one DLS change | Only `--dur-breath` added; no colour, spacing, or other token touched |
| `dls/tokens.css` | `--dur-breath` in dark block | Not present — correct; duration is theme-agnostic |

---

### Human Verification Required

The automated suite proves all structural, DOM, and CSS properties. The following four checks require a human to confirm the perceived quality matches the phase goal ("calm, trustworthy, quietly premium ambient effect").

#### 1. Pointer parallax feel

**Test:** Run `npm run dev`, open `/` in a browser on a device with a mouse. Move the pointer across the screen.
**Expected:** A faint gradient tint drifts a fraction toward the pointer position and eases smoothly. It should feel like ambient parallax, not a cursor spotlight — the gradient centre never reaches the cursor.
**Why human:** The damped lerp factor (0.06) and perceived smoothness are subjective; Playwright synthetic mouse moves do not exercise real rAF animation frames in a meaningful visual way.

#### 2. Breathing cadence on touch / coarse-pointer

**Test:** Open the app in DevTools device mode set to a touch device (isMobile, coarse pointer), or on a real touch device. Watch the gradient background.
**Expected:** A slow, gentle opacity pulse (~7s cycle, 0.4 to 1 opacity). No pointer tracking motion. The effect should feel like slow breathing.
**Why human:** Requires a coarse-pointer environment. The Playwright mobile project confirms the CSS class is applied; the visual pacing and feel require human perception.

#### 3. Light and dark mode appearance

**Test:** Toggle the theme button. Observe the gradient in both light and dark mode.
**Expected:** The ambient gradient is visible (barely) in both themes. Card text remains fully legible with unaffected AA contrast. The gradient tint should shift automatically (blue-navy in light mode, lighter blue in dark mode) because the tokens flip.
**Why human:** Colour contrast and the "whisper" quality are judgement calls; automated tools cannot assess whether the visual meets the design intent of D-02.

#### 4. OS reduce-motion integration (end-to-end)

**Test:** Enable "Reduce Motion" in the OS accessibility settings (macOS: System Settings > Accessibility > Display > Reduce Motion). Reload the app and observe.
**Expected:** A static, centred gradient with no movement of any kind — no drift, no breathing pulse. The tint is visible but completely still.
**Why human:** The Playwright emulateMedia test covers the CSS animation-duration path. Full OS-level reduce-motion including JS gate (`matchMedia` live listener) needs a real OS setting change to confirm the end-to-end behaviour.

---

### Gaps Summary

No gaps. All 11 must-have truths are VERIFIED by codebase evidence and automated tests.

The only open items are the four manual checks above, which were explicitly listed in `04-VALIDATION.md` as "Manual-Only Verifications" from the start of this phase. They require human visual judgement on ambient quality that cannot be automated.

---

_Verified: 2026-07-15T14:30:00Z_
_Verifier: Claude (spec-verifier)_
