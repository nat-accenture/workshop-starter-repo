---
status: partial
phase: 04-mouse-reactive-gradient-background-with-breathing-animation
source: [04-VERIFICATION.md, 04-VALIDATION.md]
started: 2026-07-15
updated: 2026-07-15
---

## Current Test

[awaiting human testing in a real browser]

## Tests

These four items are perceptual / quality checks that were pre-identified in
`04-VALIDATION.md` as "Manual-Only Verifications". All automated structural
checks (11/11 must-haves, tsc, 18/18 gradient + 9/9 responsive tests, RULE 0)
already pass. Item 3 was additionally sanity-checked in-app via light/dark
screenshots during execution; a human should still confirm the feel.

### 1. Pointer parallax feel (D-04, D-05)
expected: On `/` with a mouse, the gradient centre drifts a *fraction* toward the
pointer (never 1:1) with a smooth, eased trail. Reads as ambient parallax, not a
spotlight chasing the cursor.
result: [pending]

### 2. Breathing cadence (D-06, D-07, D-08)
expected: In DevTools touch emulation or on a real touch device, the gradient runs
a slow (~7s) opacity pulse and does NOT track the pointer.
result: [pending]

### 3. Light and dark mode appearance (D-01, D-02)
expected: Toggle the theme. The ambient tint is barely-there in both modes and card
text keeps AA contrast (not degraded by the layer). Verified via screenshots during
execution; confirm live.
result: [pending]

### 4. OS reduce-motion end-to-end (D-09)
expected: Enable the OS "Reduce Motion" setting. The gradient is completely static
and centred: no pointer drift, no breathing. (Also toggle it at runtime: the loop
should stop/start live without a page reload.)
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
</content>
