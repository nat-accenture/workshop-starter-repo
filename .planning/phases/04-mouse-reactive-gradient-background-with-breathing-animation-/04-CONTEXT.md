# Phase 4: Mouse-reactive gradient background - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a single, app-wide ambient gradient background layer behind the whole
Meridian app. On devices with a fine pointer it drifts toward the pointer
position; on touch / no-pointer devices it falls back to a gentle "breathing"
animation. It works in both light and dark mode, respects
`prefers-reduced-motion`, and is built from the DLS (no raw colour values).
The change is verified running in the app before hand-off.

**In scope:** one fixed background layer, pointer-reactive drift, mobile
breathing fallback, dark/light support, reduced-motion fallback, and (with
explicit sign-off) one new motion duration token.

**Out of scope:** any charting library work (see Deferred Ideas), changes to
widgets or data, and any colour-token changes (the gradient is composed from
existing colour tokens).

</domain>

<decisions>
## Implementation Decisions

### Gradient composition (Rule 0 crux)
- **D-01:** The gradient is a radial-gradient composed from the **existing**
  tokens `--color-surface` and `--color-brand`, layered over `--color-canvas`
  (a soft two-stop blend). **No new colour token is added — Rule 0 clean.** It
  is theme-aware automatically because those tokens already flip under
  `[data-theme="dark"]`.
- **D-02:** Intensity is a **barely-there whisper** (very low alpha), ambient
  only. It sits behind the white/`--color-surface` cards, so card text contrast
  is untouched; AA text contrast must hold in both themes.
- **D-03:** Coverage is the **whole viewport** — one fixed full-page layer behind
  the app shell and cards (not just the canvas gutters).

### Pointer reactivity
- **D-04:** **Damped / parallax** tracking — the gradient centre drifts a
  fraction of the distance toward the pointer (never reaches the cursor), so it
  reads as ambient parallax, not a spotlight chasing the mouse.
- **D-05:** **Smooth trailing lag** — position eases toward the target
  (rAF-interpolated). Pointer position is driven by JS writing CSS custom
  properties (e.g. `--mx` / `--my`) on the fixed layer, **not** React state, to
  avoid re-renders.

### Mobile "breathing" fallback
- **D-06:** On no-pointer / touch devices the gradient does an **opacity pulse**
  (gentle fade in and out) — calmest, compositor-friendly, and moves no layout.
- **D-07:** Breathing cadence is **very slow (~6-8s cycle)**. This needs a
  duration longer than any existing DLS motion token (slowest is `--dur-slower`,
  560ms). **Decision: add ONE new motion token** (e.g. `--dur-breath`, ~7000ms)
  to `dls/tokens.css` so the value stays tokenised.
  **⚠ RULE 0:** adding a token is a DLS breaking change. The user **approved
  this in principle during discuss-phase (2026-07-15)**. The executor MUST make
  the token addition an isolated, explicit step and surface the exact final
  value for a final human nod before committing it. A duration token is
  theme-agnostic (single value in `:root`), so no dark-mode variant is needed.
- **D-08:** "Mouse device" vs "mobile/touch" is decided by the
  **`(pointer: fine)`** media query: pointer tracking runs where a fine pointer
  exists, breathing runs elsewhere. Hybrid laptops with a mouse get tracking.

### Reduced-motion, layering & scope
- **D-09:** Under `prefers-reduced-motion` the gradient is **static and centred**
  — no pointer tracking, no breathing. Use the DLS global reduced-motion reset
  (`dls/components.css` ~line 335) and `prefersReducedMotion()`
  (`src/lib/motion.ts`).
- **D-10:** The background is a single `position: fixed` full-viewport element
  rendered **inside `ThemeProvider`, above the router**, behind the app shell,
  with `pointer-events: none` and a `z-index` **below** the sticky app-bar
  (`z-index: 10`). It must never intercept clicks and must not affect anything
  `tests/responsive.spec.js` measures.
- **D-11:** Shown **app-wide on both routes** — `/` (dashboard) and
  `/kitchen-sink`.

### Claude's Discretion
- Exact gradient geometry (radius/size, colour-stop positions and angle), the
  precise low-alpha value, the parallax fraction, and the rAF interpolation
  constant — tune during planning/execution within D-01..D-05.
- The exact detection implementation for D-08 (media query, optionally confirmed
  in JS with `(pointer: fine)` / `(hover: hover)`).
- The precise seam for injecting the pointer CSS variables (window listener +
  rAF throttle writing to the layer's style), so long as it causes no React
  re-renders (D-05).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract & Rule 0 (highest priority)
- `CLAUDE.md` — RULE 0 (the DLS is mandatory; token/component changes are
  breaking and need explicit human sign-off) and the standing motion /
  accessibility / responsive / theming rules.
- `dls/DLS-RULES.md` — DLS usage rules; rule 6 (motion: animate only with
  `--dur*` / `--ease*`, collapse under `prefers-reduced-motion`).
- `dls/tokens.css` — colour tokens (`--color-surface`, `--color-brand`,
  `--color-canvas`) and motion tokens (`--dur*`, `--ease*`); the file where the
  new `--dur-breath` token (D-07) would be added, for both `:root` and (if ever
  needed) `[data-theme="dark"]`.
- `dls/components.css` — the global `@media (prefers-reduced-motion: reduce)`
  reset (~line 335) that D-09 relies on.

### Motion
- `src/lib/motion.ts` — `prefersReducedMotion()` helper for the JS side of D-09.

### App shell / integration
- `src/App.tsx` — `ThemeProvider > BrowserRouter > Routes`; where the fixed
  background layer mounts (D-10, D-11).
- `src/main.tsx` — CSS load order (tokens → components → `app.css`).
- `src/styles/app.css` — `body { background: var(--color-canvas) }` (line 14),
  `.app-bar` `z-index: 10` (line 30) that the layer must sit below (D-10).
- `index.html` — the pre-paint theme script that sets `data-theme` before first
  paint (relevant to first-paint gradient theme correctness).

### Behaviour contract
- `tests/responsive.spec.js` — the Playwright responsive harness (mobile /
  tablet / desktop) the background must not break (D-10).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `prefersReducedMotion()` (`src/lib/motion.ts`): the JS gate for D-09.
- The `[data-theme]` token system: gives the gradient dark/light support for
  free once it reads `--color-*` tokens.
- Existing motion tokens (`--dur*`, `--ease*`) for the pointer easing feel.

### Established Patterns
- Every visual value resolves to a DLS token; no raw hex/rgb/px/rem in app code.
- Motion is tokenised and collapses under `prefers-reduced-motion` (global CSS
  reset + `prefersReducedMotion()` in JS).
- Theme is expressed only via `[data-theme]` token overrides; components stay
  theme-agnostic.
- The page background is currently flat (`body { background: var(--color-canvas) }`);
  this phase adds an ambient layer above it without changing that base.

### Integration Points
- Mount the fixed background element in `src/App.tsx` inside `ThemeProvider`,
  above `BrowserRouter`, so it renders once for both routes (D-10, D-11).
- Add `--dur-breath` to `dls/tokens.css` as an isolated, pre-approved Rule 0
  step (D-07).
- Attach the pointer listener at the window level, rAF-throttled, writing
  `--mx` / `--my` (or equivalent) onto the layer (D-05).

</code_context>

<specifics>
## Specific Ideas

- The feel is "calm, trustworthy, quietly premium" — a **barely-there whisper**,
  not a bold wash. Damped parallax, not a cursor spotlight.
- The breathing fallback should read as genuine slow breathing (multi-second),
  which is why a dedicated long-duration token was accepted over reusing the
  sub-second motion tokens.

</specifics>

<deferred>
## Deferred Ideas

- **Recharts charting library → its own "charting foundation" phase** (added to
  the roadmap backlog as Phase 5). It is out of Phase 4 scope and is a
  significant, separate decision: Recharts is a foreign visual system that must
  be bound to DLS tokens (likely a new `mrdn-chart` primitive) plus a new
  runtime dependency — a Rule 0 decision that needs its own plan and explicit
  sign-off. It would serve richer charts (e.g. the FEAT-05 income-vs-spend
  idea, a line/area chart) that the current `mrdn-progress` bars cannot express.
  Today's "charts" (`SpendByCategory`, `SavingsGoal`) stay as DLS bars until
  that phase is planned.

</deferred>

---

*Phase: 04-mouse-reactive-gradient-background-with-breathing-animation*
*Context gathered: 2026-07-15*
