---
phase: 04-mouse-reactive-gradient-background-with-breathing-animation
plan: "02"
subsystem: design-language-system
tags: [dls, tokens, motion, breathing-animation]
dependency_graph:
  requires: []
  provides: ["--dur-breath token in dls/tokens.css"]
  affects: ["src/styles/app.css .gradient-bg--breathing (Plan 03 references var(--dur-breath))"]
tech_stack:
  added: []
  patterns: ["DLS motion token, theme-agnostic duration, pre-approved DLS breaking change"]
key_files:
  created: []
  modified:
    - dls/tokens.css
decisions:
  - "Token value 7000ms (mid-range of D-07 specified 6-8s cadence), confirmed by human 2026-07-15"
  - "No dark-mode variant added; duration tokens are theme-agnostic by DLS convention"
metrics:
  duration: "~3 minutes"
  completed: "2026-07-15"
requirements: [D-07]
---

# Phase 04 Plan 02: Add --dur-breath Motion Token Summary

**One-liner:** Single `--dur-breath: 7000ms` token inserted into the `:root` motion block of `dls/tokens.css`, providing the breathing cadence for the mobile gradient fallback animation (D-07).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Confirm --dur-breath value (RULE 0 gate) | (checkpoint, pre-resolved) | (none) |
| 2 | Add --dur-breath to dls/tokens.css | 092504a | dls/tokens.css |

## What Was Built

Added a single CSS custom property to the `:root` motion block of `dls/tokens.css`, immediately after `--dur-slower: 560ms;`:

```css
--dur-breath: 7000ms;      /* breathing cadence (gradient-bg mobile fallback); pre-approved 2026-07-15 */
```

This is the only DLS change in the entire phase. Its purpose is to give Plan 03's `.gradient-bg--breathing` animation (`animation: gradient-breathe var(--dur-breath) ...`) a token-backed duration rather than a raw ms literal, satisfying CLAUDE.md Rule 0.

## Verification

- `grep -c "--dur-breath" dls/tokens.css` returns `1` (single occurrence, no dark variant)
- Token sits on the line directly after `--dur-slower: 560ms;` in the `:root` block
- `git diff dls/tokens.css` shows exactly one line insertion, no other change
- `dls/components.css` and `dls/DLS-RULES.md` are unchanged

## Deviations from Plan

None. Plan executed exactly as written. Task 1 (checkpoint) was pre-resolved by the orchestrator with the human-approved value of 7000ms (2026-07-15). Task 2 inserted exactly the one specified line.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes introduced. The DLS integrity threat (T-04-03) was mitigated by the pre-approved checkpoint gate and verified by grep + git diff acceptance criteria.

## Known Stubs

None.

## Self-Check: PASSED

- `dls/tokens.css` modified: FOUND
- Commit 092504a: FOUND
- Single line insertion confirmed by `grep -c` returning `1`
- `dls/components.css` not modified: CONFIRMED
- `dls/DLS-RULES.md` not modified: CONFIRMED
