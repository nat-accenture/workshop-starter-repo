---
phase: 04-mouse-reactive-gradient-background-with-breathing-animation
plan: "03"
subsystem: ui/animation
tags: [gradient, animation, pointer-tracking, rAF, breathing, matchMedia, reduced-motion]
dependency_graph:
  requires: [04-01, 04-02]
  provides: [full-reactive-gradient-layer]
  affects: [src/components/GradientBackground.tsx, src/styles/app.css, tests/gradient.spec.js]
tech_stack:
  added: []
  patterns:
    - rAF lerp loop writing CSS custom properties via el.style.setProperty (no React re-render per frame)
    - matchMedia change listener for live mode switching (pointer: fine)
    - prefersReducedMotion() JS gate as first guard in rAF effect
    - TDD: RED commit (test) -> GREEN commit (implementation)
key_files:
  created: []
  modified:
    - src/components/GradientBackground.tsx
    - src/styles/app.css
    - tests/gradient.spec.js
decisions:
  - "Task 1 and Task 2 combined into single implementation commit: the breathing class test (Task 1 acceptance criteria) required the component to emit gradient-bg--breathing, which meant the full isFinePointer state + class toggle + rAF loop all landed together in the GREEN phase commit"
  - "No @media prefers-reduced-motion block added to app.css: DLS components.css global reset (~line 335) handles it automatically"
  - "prefersReducedMotion() is the FIRST guard in the rAF effect (early return), so no pointermove listener or rAF loop is ever attached under reduced motion"
  - "FACTOR=0.06 chosen for damped parallax; numeric behavior constant, not a DLS design value"
  - "will-change: opacity added to .gradient-bg--breathing (compositor-only, safe)"
metrics:
  duration: "3 minutes"
  completed: "2026-07-15"
  tasks_completed: 2
  files_modified: 3
---

# Phase 04 Plan 03: Breathing CSS + Pointer rAF Tracking Summary

rAF lerp pointer tracking writing --mx/--my via setProperty (zero re-renders), breathing CSS pulse using var(--dur-breath)/var(--ease-in-out), live mode switch on matchMedia('(pointer: fine)') change, prefersReducedMotion() JS gate as first guard.

## What Was Built

Two tasks delivered the full reactive gradient effect on top of the Plan 01 static layer:

**Task 1 [T-04-04]: Breathing CSS modifier + project-branched test**

Added to `src/styles/app.css` (same gradient section from Plan 01):
- `.gradient-bg--breathing`: centred radial gradient + `animation: gradient-breathe var(--dur-breath) var(--ease-in-out) infinite alternate` + `will-change: opacity`
- `@keyframes gradient-breathe`: opacity 0.4 to 1 slow pulse
- No `@media (prefers-reduced-motion)` block: the DLS global reset in `components.css` kills the keyframe automatically (D-09)
- No raw `ms` values; all motion references tokenised (Rule 0)

Added to `tests/gradient.spec.js`:
- Branched breathing-class test: mobile (coarse pointer) expects `gradient-bg--breathing` present; desktop/tablet (fine pointer) expect it absent

**Task 2 [T-04-05]: Pointer rAF tracking + mode switch + reduced-motion JS gate**

Updated `src/components/GradientBackground.tsx`:
- `isFinePointer` state with lazy init from `window.matchMedia?.("(pointer: fine)").matches`
- Effect A: matchMedia `(pointer: fine)` change listener to flip `isFinePointer` live (device plug/unplug)
- Effect B: rAF lerp loop: `prefersReducedMotion()` first guard (early return, D-09), then `!isFinePointer` guard, then pointermove listener + persistent `tick()` loop lerping `current` toward `target` with factor 0.06, writing `--mx`/`--my` via `el.style.setProperty()` (no setState per frame)
- Cleanup: `removeEventListener("pointermove")` + `cancelAnimationFrame(frameId)` always returned (StrictMode-safe)
- Class toggle: `gradient-bg--breathing` applied when `!isFinePointer`

## Verification Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | PASS |
| `npx playwright test tests/gradient.spec.js` (all 3 projects) | 18/18 PASS |
| `npx playwright test tests/gradient.spec.js --project=desktop` | 6/6 PASS |
| `npx playwright test tests/responsive.spec.js` | 9/9 PASS |
| `grep -nE "animation: gradient-breathe var(--dur-breath) var(--ease-in-out)"` | MATCH |
| `grep -n "@keyframes gradient-breathe"` | MATCH |
| `grep -n "prefers-reduced-motion" src/styles/app.css` (non-comment) | NONE |
| `grep -RniE "[0-9]+ms" src/styles/app.css` | NONE |
| `grep -nE 'setProperty("--m[xy]"'` | 2 matches (--mx and --my) |
| `grep -n "prefersReducedMotion()"` | MATCH (first guard in rAF effect) |
| `grep -n "cancelAnimationFrame"` + `grep -n 'removeEventListener("pointermove"'` | MATCH |
| `grep -RniE "#[0-9a-f]{3,6}|rgb\(|[0-9]+px|[0-9]+rem"` component | NONE |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| edb94fb | test(04-03) | add failing breathing-class test (RED - T-04-04) |
| be96b78 | feat(04-03) | breathing CSS modifier + keyframe + isFinePointer class toggle + full rAF implementation (T-04-04 GREEN + T-04-05) |

## Deviations from Plan

### Implementation Combination

**1. [Rule 2 - Missing critical functionality] Task 1 and Task 2 implemented together**
- **Found during:** Task 1 GREEN phase
- **Issue:** Task 1's acceptance criteria requires the breathing test to pass on ALL three projects, including mobile. The mobile project test checks that `gradient-bg--breathing` class is present on the element. The CSS alone in `src/styles/app.css` cannot make the class appear; the component must apply it. Task 1's `<files>` listed only `src/styles/app.css, tests/gradient.spec.js`, but achieving the done criteria required the component to emit the class.
- **Fix:** Implemented the full `GradientBackground.tsx` component (isFinePointer state, matchMedia listener, rAF loop, class toggle) in the same GREEN commit as the CSS, since all these pieces are coupled and needed for the tests to pass.
- **Files modified:** src/components/GradientBackground.tsx (in Task 1 GREEN commit)
- **Commits:** be96b78

None - all plan requirements (D-04, D-05, D-06, D-08, D-09) satisfied as designed. Rule 0 clean throughout: no DLS edits, no raw hex/rgb/px/rem, motion fully tokenised.

## Known Stubs

None. The component is fully wired: pointer tracking writes CSS vars live via rAF, breathing class is applied conditionally via React state, reduced-motion gate prevents all JS work.

## Threat Flags

None. The pointermove listener is passive (cannot call `preventDefault`), the layer retains `pointer-events: none` (inherited from `.gradient-bg`), and the rAF loop is cancelled on unmount. No new network, auth, file, or schema surface introduced.

## Self-Check: PASSED

- [x] `src/styles/app.css` modified and contains `.gradient-bg--breathing` and `@keyframes gradient-breathe`
- [x] `src/components/GradientBackground.tsx` modified with full rAF implementation
- [x] `tests/gradient.spec.js` modified with branched breathing test
- [x] Commits edb94fb and be96b78 exist in git log
- [x] All 18 gradient tests pass; all 9 responsive tests pass; tsc clean
