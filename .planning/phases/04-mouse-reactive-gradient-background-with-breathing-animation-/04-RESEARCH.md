# Phase 4: Mouse-reactive Gradient Background - Research

**Researched:** 2026-07-15
**Domain:** CSS animation, pointer event tracking, React 18 effects, DLS token compliance
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Gradient composed from existing tokens `--color-surface` and `--color-brand` over `--color-canvas`. No new colour token. Rule 0 clean.
- **D-02:** Intensity is a barely-there whisper (very low alpha), ambient only. Cards stay in front; AA text contrast must hold in both themes.
- **D-03:** Coverage is the whole viewport: one fixed full-page layer behind the app shell and cards.
- **D-04:** Damped / parallax tracking: the gradient centre drifts a fraction of the distance toward the pointer (never reaches cursor), reads as ambient parallax.
- **D-05:** Smooth trailing lag via rAF interpolation. Pointer position drives JS writing CSS custom properties (`--mx` / `--my`) on the fixed layer. Not React state.
- **D-06:** On no-pointer / touch devices: opacity pulse (breathing). Compositor-friendly, no layout movement.
- **D-07:** Breathing cadence ~6-8s. One new motion token `--dur-breath` (~7000ms) added to `dls/tokens.css`. Pre-approved in principle. Executor must surface the exact final value for a human nod before committing. Duration token is theme-agnostic (single `:root` value only).
- **D-08:** "Mouse device" vs "mobile/touch" decided by `(pointer: fine)` media query.
- **D-09:** Under `prefers-reduced-motion`: static centred gradient, no tracking, no breathing. Use DLS global CSS reset (components.css line 335) and `prefersReducedMotion()` (src/lib/motion.ts).
- **D-10:** Single `position: fixed` full-viewport element inside `ThemeProvider`, above `BrowserRouter`, behind the app shell. `pointer-events: none`, `z-index` below `.app-bar` (`z-index: 10`). Must not intercept clicks, must not affect `tests/responsive.spec.js` measurements.
- **D-11:** Shown app-wide on both routes (`/` dashboard and `/kitchen-sink`).

### Claude's Discretion

- Exact gradient geometry (radius/size, colour-stop positions), precise low-alpha value, parallax fraction, rAF interpolation constant.
- Exact detection implementation for D-08 (matchMedia in JS, optional `(hover: hover)` confirmation).
- Precise seam for injecting pointer CSS variables (window listener + rAF throttle writing to layer style), so long as it causes no React re-renders.

### Deferred Ideas (OUT OF SCOPE)

- Recharts charting library (its own "charting foundation" Phase 5). Out of Phase 4 scope.

</user_constraints>

---

## Summary

This phase adds one new React component (e.g., `GradientBackground`) mounted inside `ThemeProvider` in `src/App.tsx`, above `BrowserRouter`. The component renders a `position: fixed` full-viewport `<div>` with `pointer-events: none` and `z-index: 1` (below `.app-bar` z-index 10). Its gradient is expressed entirely via existing DLS colour tokens using `color-mix()` for alpha, so it is theme-aware with zero extra colour tokens.

On devices with `(pointer: fine)`, a `pointermove` listener on `window` stores target coordinates. A `requestAnimationFrame` loop lerp-interpolates `currentX/currentY` toward the target and writes `--mx` and `--my` CSS custom properties to the layer element via `element.style.setProperty()` -- no React state, no re-render. On devices without a fine pointer, a CSS `@keyframes` breathing animation (opacity pulse) runs instead, gated by a `(pointer: fine)` media query in the component's CSS class. Under `prefers-reduced-motion`, the CSS global reset at `dls/components.css` line 335 kills both the rAF loop's animation and the breathing keyframe, and the JS layer never attaches the listener.

The only DLS change is adding `--dur-breath: 7000ms` to `dls/tokens.css` -- a pre-approved, isolated step requiring final human confirmation of the value.

**Primary recommendation:** Build `GradientBackground` as a self-contained component with its own CSS module; track pointer position in a `useRef` + `useEffect` pattern writing directly to the DOM element; use `color-mix(in srgb, var(--color-brand) 12%, transparent)` for the gradient colour stops.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Fixed background layer render | Browser / Client | Frontend Server (SSR, none here) | Purely visual, DOM-side component mounted once |
| Pointer tracking (rAF + lerp) | Browser / Client | - | JS side-effect, no server involvement |
| Device capability detection | Browser / Client | - | `matchMedia` is a browser API |
| Theme awareness (dark/light) | Browser / Client (via CSS tokens) | - | Tokens flip via `[data-theme]` on `<html>`; no JS needed |
| Reduced-motion enforcement | Browser / Client | - | CSS global reset + JS `prefersReducedMotion()` check |
| Breathing keyframe animation | Browser / Client (CSS) | - | Compositor-only opacity pulse |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | ^18.3.1 [VERIFIED: npm registry] | Component lifecycle, `useEffect`, `useRef` | Already installed |
| CSS Modules (Vite) | built-in to Vite ^5.4.9 [VERIFIED: npm registry] | Scoped CSS for the gradient component | Already in project build |

### Supporting

No new runtime packages are required. All capabilities are native browser APIs and existing project infrastructure.

**No new npm packages need to be installed for this phase.**

---

## Package Legitimacy Audit

No external packages are added in this phase. The gradient component relies entirely on:
- Native browser APIs (`window.matchMedia`, `requestAnimationFrame`, `element.style.setProperty`, `window.addEventListener`)
- React 18 (already installed)
- Vite CSS Modules (already in build)

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
index.html  (pre-paint theme script sets [data-theme] on <html>)
    |
    v
ThemeProvider  (sets [data-theme] on <html>, provides toggle context)
    |
    +-- GradientBackground  <-- NEW: fixed, pointer-events:none, z-index:1
    |       |
    |       +-- useEffect: attach window pointermove (if fine pointer AND !reducedMotion)
    |       |     rAF loop: lerp(currentX -> targetX) -> el.style.setProperty(--mx/--my)
    |       |
    |       +-- useEffect: matchMedia (pointer:fine) change listener -> swap mode
    |       |
    |       +-- CSS: radial-gradient via --mx/--my (pointer mode)
    |               OR breathing @keyframes using --dur-breath (touch mode)
    |               OR static centred gradient (reduced-motion)
    |
    +-- BrowserRouter
            +-- Route /            -> AppBar + Dashboard
            +-- Route /kitchen-sink -> AppBar + KitchenSink
```

### Recommended Project Structure

```
src/
├── components/
│   ├── AppBar.tsx            (existing)
│   └── GradientBackground.tsx  (NEW)
├── styles/
│   ├── app.css               (existing)
│   └── GradientBackground.module.css  (NEW)
├── lib/
│   └── motion.ts             (existing -- prefersReducedMotion())
dls/
├── tokens.css                (add --dur-breath token -- isolated DLS step)
└── components.css            (reduced-motion reset at line 335, unchanged)
```

### Pattern 1: rAF Lerp with CSS Custom Property (no React state)

**What:** `pointermove` stores target coords in a `useRef`. A `requestAnimationFrame` loop reads the ref, lerps current toward target, and writes `--mx`/`--my` to the element via `el.style.setProperty()`. No React state is touched -- zero re-renders.

**When to use:** Any "follow the cursor" effect where 60fps updates would cause thousands of React re-renders if driven by `setState`.

```typescript
// Source: https://github.com/reactjs/react.dev/blob/main/src/content/learn/reusing-logic-with-custom-hooks.md
// Adapted pattern for no-state DOM direct write

useEffect(() => {
  if (prefersReducedMotion()) return;
  const mq = window.matchMedia('(pointer: fine)');
  if (!mq.matches) return; // breathing mode handled by CSS, not JS

  const el = layerRef.current;
  if (!el) return;

  // Captured target -- updated by pointermove, read by rAF. No state.
  const target = { x: 0.5, y: 0.5 }; // normalised 0..1, default centre
  let current = { x: 0.5, y: 0.5 };
  let frameId: number;

  const onPointerMove = (e: PointerEvent) => {
    target.x = e.clientX / window.innerWidth;
    target.y = e.clientY / window.innerHeight;
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const FACTOR = 0.06; // fraction of remaining distance per frame (damped parallax)

  const tick = () => {
    current.x = lerp(current.x, target.x, FACTOR);
    current.y = lerp(current.y, target.y, FACTOR);
    el.style.setProperty('--mx', `${(current.x * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${(current.y * 100).toFixed(2)}%`);
    frameId = requestAnimationFrame(tick);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  frameId = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('pointermove', onPointerMove);
    cancelAnimationFrame(frameId);
  };
}, []); // empty deps -- effect is pure side-effect reading no React state
```

**StrictMode double-invoke:** React 18 StrictMode mounts, unmounts, then remounts effects in development. The cleanup (`cancelAnimationFrame` + `removeEventListener`) makes this safe: the second mount starts a fresh rAF loop and fresh listener, the first loop is cancelled in cleanup. No leaked frames or duplicate listeners. [VERIFIED: Context7 / react.dev StrictMode docs]

### Pattern 2: matchMedia change listener for mode switching

**What:** Attach a `change` listener to `window.matchMedia('(pointer: fine)')` so a user who plugs in a mouse (hybrid device) switches from breathing to pointer-tracking live, without a page reload.

```typescript
useEffect(() => {
  const mq = window.matchMedia('(pointer: fine)');
  const onChange = () => {
    // Setting a state flag (boolean) here is fine -- it's a rare,
    // user-initiated event, not per-frame. Triggers one re-render
    // which mounts/unmounts the rAF effect.
    setIsFinePointer(mq.matches);
  };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}, []);
```

Alternatively, drive the two modes (pointer vs breathing) from the same effect using `isFinePointer` as a dep. The breathing CSS class is toggled by applying/removing a data attribute or className; the rAF listener starts/stops based on `isFinePointer && !prefersReducedMotion()`.

### Pattern 3: Gradient colour from tokens using color-mix()

**What:** Apply alpha transparency to an existing token colour without introducing a raw hex value or a new colour token.

```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix */

/* In GradientBackground.module.css */
.layer {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  /* Pointer mode: radial gradient centred on --mx/--my */
  background:
    radial-gradient(
      ellipse 80% 60% at var(--mx, 50%) var(--my, 50%),
      color-mix(in srgb, var(--color-brand) 12%, transparent),
      color-mix(in srgb, var(--color-surface) 6%, transparent) 45%,
      transparent 70%
    );
}

.layer.is-breathing {
  /* Touch mode: static centred gradient + opacity breathing keyframe */
  background:
    radial-gradient(
      ellipse 80% 60% at 50% 50%,
      color-mix(in srgb, var(--color-brand) 12%, transparent),
      color-mix(in srgb, var(--color-surface) 6%, transparent) 45%,
      transparent 70%
    );
  animation: gradient-breathe var(--dur-breath) var(--ease-in-out) infinite alternate;
}

@keyframes gradient-breathe {
  from { opacity: 0.4; }
  to   { opacity: 1; }
}
```

**Rule 0 compliance check:**
- `color-mix(in srgb, var(--color-brand) 12%, transparent)` uses the existing `--color-brand` token at 12% opacity. No raw hex. [VERIFIED: MDN color-mix docs confirm this exact pattern]
- `var(--dur-breath)` references the new token (not a raw ms value). Token addition is the pre-approved isolated DLS step.
- `var(--ease-in-out)` uses existing easing token. [VERIFIED: dls/tokens.css line 97]
- No raw px, rem, hex, or rgb anywhere. Ellipse size expressed in `%` which is geometry, not a design value the DLS covers (same as the `clamp()` uses in app.css).

### Pattern 4: CSS-only reduced-motion static fallback

The DLS global reset in `dls/components.css` line 335-344 sets:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

This kills the breathing keyframe automatically. The JS side must also check `prefersReducedMotion()` and skip attaching the `pointermove` listener and the rAF loop. This gives two independent gates -- CSS handles the visual stop; JS prevents CPU waste. [VERIFIED: dls/components.css line 335, src/lib/motion.ts]

### Anti-Patterns to Avoid

- **React state for per-frame coordinates:** Calling `setState` on every `pointermove` event fires at 60+ Hz, causes a component re-render every frame, and defeats the whole purpose. Use a plain JS object ref and `el.style.setProperty()` directly.
- **Setting `will-change: opacity` or `will-change: background`:** `background` is not a compositor-only property. Setting `will-change` on it causes a layer promotion without compositor benefit and wastes GPU memory. Use `will-change: opacity` only if you are animating opacity -- which the breathing mode does. For the pointer mode, the radial-gradient is repainted on CPU each frame; this is acceptable for a low-frequency ambient effect but means you should NOT set an aggressive lerp factor (keep FACTOR <= 0.08 to reduce CPU paint frequency).
- **Continuous rAF loop on reduced-motion devices:** The rAF loop must be completely skipped (not just visually invisible) when `prefersReducedMotion()` returns true. Keeping a loop running wastes battery.
- **Mounting above ThemeProvider:** The layer must be INSIDE `ThemeProvider` so that `[data-theme]` is already set on `<html>` before the gradient renders. Mounting outside would cause the wrong theme tokens on first paint. [VERIFIED: src/App.tsx -- ThemeProvider is the outermost wrapper]
- **z-index >= 10:** The `.app-bar` uses `z-index: 10` (app.css line 30). The gradient layer must use a z-index of 1 or less to stay behind the sticky header.
- **Intercepting pointer events:** `pointer-events: none` is mandatory. Any omission will block clicks on interactive elements anywhere on the page.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Alpha on a token colour | Custom rgba() combining a token's raw hex | `color-mix(in srgb, var(--token) N%, transparent)` | Stays Rule 0 compliant; works even when the token is a computed value not a static hex |
| Animation reduced-motion gate | Custom media query wrapper | DLS global reset (components.css line 335) + `prefersReducedMotion()` | Already exists, handles all cases, is the project contract |
| Device capability detection | User-agent sniffing | `window.matchMedia('(pointer: fine)')` | Standards-based, handles hybrid devices, survives UA spoofing |
| Cross-frame smoothing | Custom easing queue | Lerp `a + (b - a) * t` in rAF loop | Single line, well-understood, no dependency |

**Key insight:** All the hard parts (theme switching, reduced-motion enforcement, pointer detection, colour token alpha) are already solved by the browser or the DLS -- the component just wires them together.

---

## Common Pitfalls

### Pitfall 1: Background repaint on every pointer event

**What goes wrong:** Calling `setProperty` every `pointermove` event (without rAF) fires potentially 200+ times/second and triggers a background repaint each time. On mid-range hardware this causes jank.

**Why it happens:** `pointermove` fires at the display refresh rate or faster; CSS `background` changes trigger paint (not just compositing).

**How to avoid:** Only call `setProperty` inside the rAF callback, not inside the `pointermove` handler. The handler only updates `target.x/y` in a plain object. The rAF loop is the single place that writes to the DOM.

**Warning signs:** Chrome DevTools Performance panel shows repeated "Paint" entries in the main thread coinciding with mouse movement.

### Pitfall 2: StrictMode double-listener

**What goes wrong:** In React 18 StrictMode (development), `useEffect` fires twice (mount, cleanup, remount). Without proper cleanup, you get two `pointermove` listeners and two concurrent rAF loops.

**Why it happens:** StrictMode double-invokes effects to surface missing cleanups.

**How to avoid:** Always return a cleanup function that calls `removeEventListener` and `cancelAnimationFrame(frameId)`. Both calls are idempotent if already cleaned up. [VERIFIED: react.dev StrictMode docs via Context7]

**Warning signs:** Two gradient centres visible / erratic movement in dev mode but not production.

### Pitfall 3: matchMedia 'change' fires on every pointer move (NOT)

**What goes wrong (misconception):** Developers sometimes think matchMedia fires on each input event. It does not -- it fires only when the query result changes (e.g., mouse plugged in/out). Using `addEventListener` on matchMedia is therefore safe and low-cost.

**How to avoid:** Use `mq.addEventListener('change', fn)` for the `(pointer: fine)` media query (not `pointermove`). Remember to remove the listener in cleanup.

### Pitfall 4: color-mix() with hex token values

**What goes wrong:** `color-mix(in srgb, #06356E 12%, transparent)` works but defeats the token system. If `--color-brand` changes in tokens.css, the gradient does not update.

**Why it happens:** Developer forgets the syntax requires `var()`.

**How to avoid:** Always write `color-mix(in srgb, var(--color-brand) 12%, transparent)`. [VERIFIED: MDN color-mix docs confirm var() usage is supported]

### Pitfall 5: Forgetting isMobile: true in Playwright emulates fine pointer as coarse

**What goes wrong:** Playwright's mobile project sets `isMobile: true` and `hasTouch: true`, which makes `(pointer: fine)` evaluate to `false` in the test browser. This means the breathing mode CSS class is applied in the mobile test. If the test asserts on the gradient layer's class or background, it must account for this.

**Why it happens:** Playwright's `isMobile` emulation sets the pointer media feature to `coarse`. [VERIFIED: playwright.config.js -- mobile project: `isMobile: true, hasTouch: true`]

**Warning signs:** A Playwright assertion that `layer.is-breathing` does NOT exist fails on the mobile project.

### Pitfall 6: Fixed layer affects bounding box measurements

**What goes wrong:** A `position: fixed; inset: 0` element is stacked on top of the page, so `locator.boundingBox()` in Playwright can return the fixed element's box instead of the target element's box if the selector is ambiguous.

**How to avoid:** The Playwright responsive tests (`tests/responsive.spec.js`) use specific selectors like `#accounts .account-card`. The fixed layer has no ID or `account-card` class, so there is zero selector collision. `pointer-events: none` also means it is not "clickable" and does not interfere with Playwright's click-based assertions. **No changes to `tests/responsive.spec.js` are required** -- the existing tests pass through the fixed layer transparently.

### Pitfall 7: Raw ellipse percentages are NOT a DLS violation

**What goes wrong:** Planner or verifier flags `80% 60%` in `ellipse 80% 60%` as a raw value violating Rule 0.

**Why it is not a violation:** Rule 0 forbids raw *design values* (colour, spacing, radius, type, shadow, motion). Gradient geometry percentages are layout geometry intrinsic to the gradient, equivalent to the `clamp()` values in `app.css` (which the project already accepts as "layout scaffolding"). There is no DLS token for gradient geometry, and Rule 0 does not require one. This should be noted in the plan to pre-empt any Rule 0 challenge.

---

## Code Examples

### Token alpha via color-mix (verified)

```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix */
background: radial-gradient(
  ellipse 80% 60% at var(--mx, 50%) var(--my, 50%),
  color-mix(in srgb, var(--color-brand) 12%, transparent),
  color-mix(in srgb, var(--color-surface) 6%, transparent) 45%,
  transparent 70%
);
```

### useEffect: pointermove + rAF, no React state (verified pattern)

```typescript
// Source: https://github.com/reactjs/react.dev/blob/main/src/content/reference/react/useEffect.md
// and https://github.com/reactjs/react.dev/blob/main/src/content/learn/reusing-logic-with-custom-hooks.md

useEffect(() => {
  if (prefersReducedMotion()) return; // JS gate (CSS gate also active)
  const mq = window.matchMedia('(pointer: fine)');
  if (!mq.matches) return; // CSS breathing handles touch mode

  const el = layerRef.current;
  if (!el) return;

  const target = { x: 0.5, y: 0.5 };
  let current = { x: 0.5, y: 0.5 };
  let frameId: number;

  const onPointerMove = (e: PointerEvent) => {
    target.x = e.clientX / window.innerWidth;
    target.y = e.clientY / window.innerHeight;
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = () => {
    current.x = lerp(current.x, target.x, 0.06);
    current.y = lerp(current.y, target.y, 0.06);
    el.style.setProperty('--mx', `${(current.x * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${(current.y * 100).toFixed(2)}%`);
    frameId = requestAnimationFrame(tick);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  frameId = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('pointermove', onPointerMove);
    cancelAnimationFrame(frameId);
  };
}, [isFinePointer]); // re-run when pointer mode changes (hybrid device)
```

### DLS token addition (pre-approved Rule 0 step)

```css
/* dls/tokens.css -- add after --dur-slower: 560ms (line 95) */
/* ⚠ RULE 0 BREAKING CHANGE -- pre-approved 2026-07-15, value needs final human nod */
--dur-breath: 7000ms;
```

### Mount point in App.tsx (D-10, D-11)

```tsx
export default function App() {
  return (
    <ThemeProvider>
      <GradientBackground />   {/* NEW: renders once, covers both routes */}
      <BrowserRouter>
        ...
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

### Breathing CSS (touch / no-fine-pointer mode)

```css
/* Only activates when .is-breathing class is present.
   The DLS prefers-reduced-motion reset (components.css line 335) kills
   this automatically -- no extra @media block needed here. */
.layer.is-breathing {
  animation: gradient-breathe var(--dur-breath) var(--ease-in-out) infinite alternate;
}

@keyframes gradient-breathe {
  from { opacity: 0.4; }
  to   { opacity: 1; }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `mousemove` event | `pointermove` event | 2019 (Pointer Events Level 2) | Unified mouse/touch/pen; passive by default |
| `document.documentElement.style.setProperty` (global) | `el.style.setProperty` (scoped to layer) | Always available | Scoped to the element, no global CSS variable collision |
| `rgba(hex, alpha)` for token alpha | `color-mix(in srgb, var(--token) N%, transparent)` | Baseline widely available May 2023 | Stays Rule 0 compliant; token-driven |
| Separate mouse / touch listeners | `matchMedia('(pointer: fine)')` + change listener | CSS Interaction Media Queries Level 4 | Standards-based, handles hybrids |

**Deprecated / outdated:**
- `rgba()` with hardcoded hex to add transparency to a token: replaced by `color-mix()`. Using `rgba()` in this context would be a Rule 0 violation (raw colour value).
- User-agent sniffing for touch detection: replaced by `(pointer: coarse)` / `(hover: none)` media queries.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Lerp factor of 0.06 gives the "barely-there parallax" feel described in D-04 | Code Examples | Factor may need tuning during execution; value is Claude's discretion per CONTEXT.md |
| A2 | `opacity: 0.4` to `1.0` for the breathing range gives the "very low alpha, barely-there whisper" feel of D-02 | Code Examples | May need adjustment; exact range is Claude's discretion |
| A3 | `ellipse 80% 60%` for gradient size gives whole-viewport ambient coverage (D-03) without being too prominent | Code Examples | Geometry is Claude's discretion; may need tuning |
| A4 | `color-mix(in srgb, var(--color-brand) 12%, transparent)` gives sufficiently low alpha for D-02 while remaining visible | Code Examples | 12% is an estimate; exact value is Claude's discretion |

**All structural claims (React effect patterns, CSS APIs, DLS constraints, browser support) are VERIFIED or CITED from authoritative sources. Only the numeric tuning constants are ASSUMED.**

---

## Open Questions

1. **Exact value for `--dur-breath`**
   - What we know: D-07 approves ~7000ms "in principle"; final value needs human confirmation.
   - What's unclear: Whether 6000ms or 8000ms feels better; depends on visual testing.
   - Recommendation: Planner must include an isolated task for the token addition that surfaces "the proposed value is 7000ms -- confirm before committing" as a `checkpoint:human-verify`.

2. **Should the rAF loop pause when the document is hidden?**
   - What we know: `document.visibilityState` can be checked; pausing the loop when the tab is hidden saves CPU.
   - What's unclear: Whether the project cares enough to add this.
   - Recommendation: Add `document.addEventListener('visibilitychange', ...)` to pause/resume the rAF loop inside the same effect. Low cost, good practice. Flag in plan as optional but recommended.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build tooling | Yes | v25.5.0 | - |
| Vite | Build / dev server | Yes | ^5.4.9 | - |
| React | Component runtime | Yes | ^18.3.1 | - |
| Playwright | Behaviour contract tests | Yes | 1.61.1 | - |
| `color-mix()` CSS | Alpha on token colours | Yes (Baseline May 2023, Chrome 111+, Firefox 113+, Safari 16.2+) | - | `opacity` on wrapper element (fallback less precise) |
| `matchMedia('(pointer: fine)')` | Device detection | Yes (all modern browsers) | - | Assume fine pointer (degrades gracefully) |
| `requestAnimationFrame` | rAF lerp loop | Yes (all modern browsers) | - | - |
| `pointermove` event | Pointer tracking | Yes (Pointer Events Level 2, all modern browsers) | - | `mousemove` (less unified) |

**Missing dependencies with no fallback:** none

**Missing dependencies with fallback:** none

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.61.1 |
| Config file | `playwright.config.js` |
| Quick run command | `npx playwright test --project=desktop` |
| Full suite command | `npm run test:responsive` (runs mobile, tablet, desktop) |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| D-03 | Fixed gradient layer exists and covers full viewport | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | No -- Wave 0 |
| D-10 | Layer has `pointer-events: none`; does not block clicks | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | No -- Wave 0 |
| D-10 | Layer `z-index` is below `.app-bar` (z-index 10) | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | No -- Wave 0 |
| D-09 | Layer has no animation when `prefers-reduced-motion` is set | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | No -- Wave 0 |
| D-11 | Layer renders on both `/` and `/kitchen-sink` | Playwright smoke | `npx playwright test tests/gradient.spec.js --project=desktop` | No -- Wave 0 |
| (existing) | Shell renders: brand, greeting, balances, quick actions | Playwright full | `npm run test:responsive` | Yes (`tests/responsive.spec.js`) |
| (existing) | Layout is responsive at mobile/tablet/desktop | Playwright full | `npm run test:responsive` | Yes (`tests/responsive.spec.js`) |

**Key assertion patterns for `tests/gradient.spec.js`:**

```javascript
// Layer exists, is fixed, covers the viewport
const layer = page.locator('[data-testid="gradient-bg"]');
await expect(layer).toBeVisible();
const box = await layer.boundingBox();
expect(box.x).toBe(0);
expect(box.y).toBe(0);
expect(box.width).toBe(viewport.width);
expect(box.height).toBe(viewport.height);

// Layer does not block clicks (pointer-events: none)
const btn = page.getByRole('button', { name: 'Transfer' });
await btn.click(); // should not throw / timeout

// Under reduced-motion: no animation running
await page.emulateMedia({ reducedMotion: 'reduce' });
const animDuration = await layer.evaluate(el =>
  getComputedStyle(el).animationDuration
);
// DLS reset forces 0.001ms
expect(parseFloat(animDuration)).toBeLessThan(1);
```

**Why NOT add mouse-tracking assertions:** The pointer-reactive gradient position (`--mx`/`--my`) is not usefully testable in Playwright because synthetic `mouse.move()` events do not trigger real pointer tracking in a meaningful way for a visual ambient effect. The verification goal stated in the phase is "verified running in the app before hand-off" -- this means a developer manually opening the browser and moving the mouse, not an automated assertion on CSS property values.

### Sampling Rate

- **Per task commit:** `npx playwright test tests/responsive.spec.js --project=desktop` (verifies background does not break existing contract)
- **Per wave merge:** `npm run test:responsive` (full mobile/tablet/desktop)
- **Phase gate:** Full suite green + manual browser check (mouse tracking, dark mode, touch mode) before `/spec-verify-work`

### Wave 0 Gaps

- [ ] `tests/gradient.spec.js` -- covers D-03, D-10, D-09, D-11
- [ ] `src/components/GradientBackground.tsx` -- the component itself (needs `data-testid="gradient-bg"`)
- [ ] `src/styles/GradientBackground.module.css` -- the component's styles
- [ ] `dls/tokens.css` addition of `--dur-breath` (isolated, gated by human confirm)

---

## Security Domain

This phase involves no authentication, session management, user input, cryptography, or data persistence. It is a pure CSS/animation visual layer with no external requests, no user data, and no API calls.

**ASVS categories applicable:** None. The only potential concern is `pointer-events: none` correctly isolating the layer so it does not intercept form input or interactive elements -- this is enforced by the CSS property and verified by the Playwright click test above.

---

## Sources

### Primary (HIGH confidence)

- `/reactjs/react.dev` (Context7) -- `useEffect` cleanup pattern, `pointermove` global listener, StrictMode double-invoke, `useFadeIn` rAF pattern
- `dls/tokens.css` (codebase, line 88-98) -- all existing motion tokens; confirmed `--dur-slower: 560ms` is the current maximum, confirming `--dur-breath` is genuinely new
- `dls/components.css` (codebase, line 335-344) -- `prefers-reduced-motion` global reset; `animation-duration: 0.001ms !important` and `animation-iteration-count: 1 !important`
- `src/lib/motion.ts` (codebase) -- `prefersReducedMotion()` implementation
- `src/styles/app.css` (codebase, line 30) -- `.app-bar { z-index: 10 }`
- `src/App.tsx` (codebase) -- confirmed mount structure: `ThemeProvider > BrowserRouter > Routes`
- `playwright.config.js` (codebase) -- confirmed mobile project uses `isMobile: true, hasTouch: true`
- [MDN color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) -- confirmed `color-mix(in srgb, var(--token) N%, transparent)` syntax; Baseline widely available May 2023

### Secondary (MEDIUM confidence)

- [web.dev: Stick to compositor-only properties](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count) -- only `transform` and `opacity` are compositor-only; `background` triggers paint; `will-change` guidance
- [Smashing Magazine: Guide to hover and pointer media queries](https://www.smashingmagazine.com/2022/03/guide-hover-pointer-media-queries/) -- `(pointer: fine)` / `(pointer: coarse)` semantics; `any-pointer` for hybrid devices
- [MDN pointer media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer) -- confirmed values: `fine`, `coarse`, `none`

### Tertiary (LOW confidence)

- [DEV.to: cursor-reactive gradients](https://dev.to/sammiihk/cursor-reactive-gradients-making-css-respond-to-mouse-position-5ga3) -- lerp loop pattern; cross-verified against react.dev rAF pattern

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new packages; all APIs are native browser or existing project deps
- Architecture: HIGH -- confirmed from direct codebase reads; integration points verified
- DLS compliance: HIGH -- tokens.css and components.css read directly; color-mix() MDN verified
- Browser API patterns: HIGH -- Context7 (react.dev) for React + MDN for CSS
- Pitfalls: HIGH -- derived from direct codebase constraints (z-index, StrictMode, Playwright config)
- Tuning constants (lerp factor, alpha %): LOW -- aesthetic values requiring execution-time tuning; correctly tagged ASSUMED

**Research date:** 2026-07-15
**Valid until:** 2026-08-15 (stable APIs; React, browser Pointer Events, color-mix() are well-established)
