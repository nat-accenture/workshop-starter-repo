# Phase 4: Mouse-reactive Gradient Background - Pattern Map

**Mapped:** 2026-07-15
**Files analyzed:** 5 new/modified files
**Analogs found:** 5 / 5

---

## Critical Finding: No CSS Modules Exist in This Project

The research draft assumed `src/styles/GradientBackground.module.css`. **This is wrong for this codebase.**

Search result: `find src -name "*.module.css"` returned zero files.

The project has exactly ONE app-level stylesheet: `src/styles/app.css`. All component-level styles live there as plain BEM-style class names (e.g. `.app-bar`, `.dashboard`, `.account-strip`). There is no Vite CSS Modules setup in use. The `src/dls/primitives.tsx` wrappers add zero CSS of their own; they emit `mrdn-*` class names that resolve in `dls/components.css`.

**Consequence for planning/execution:** The gradient layer's CSS goes in `src/styles/app.css` as a new section, NOT in a `.module.css` file. Class names follow the existing `.app-` BEM prefix already in that file (e.g. `.gradient-bg`, `.gradient-bg--breathing`). This is the real project convention. The research draft's CSS module path is a fabrication and must be discarded.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/GradientBackground.tsx` | component | event-driven (rAF + pointermove) | `src/dls/primitives.tsx` (`Progress` component) | role-match: same pattern of useEffect + rAF + cancelAnimationFrame cleanup |
| `src/styles/app.css` (new section appended) | config/styles | - | `src/styles/app.css` (existing `.app-bar` section) | exact: same file, same BEM conventions |
| `dls/tokens.css` (add `--dur-breath`) | config/DLS | - | `dls/tokens.css` motion block lines 88-98 | exact: same token block, same format |
| `tests/gradient.spec.js` | test | request-response (Playwright) | `tests/responsive.spec.js` | exact: same project, same config, same patterns |
| `src/App.tsx` (mount edit) | component/provider | - | `src/App.tsx` (existing ThemeProvider wrapping pattern) | exact: same file |

---

## Pattern Assignments

### `src/components/GradientBackground.tsx` (component, event-driven)

**Analog:** `src/dls/primitives.tsx` - the `Progress` component (lines 197-233)

**Why:** `Progress` is the only existing component that uses `useEffect` + `requestAnimationFrame` + `cancelAnimationFrame` cleanup + `prefersReducedMotion()` gating. It also shows the project's pattern for direct DOM writes (via `setWidth` state for a CSS variable equivalent). `GradientBackground` follows the same lifecycle shape but uses `element.style.setProperty()` directly instead of state, since it fires on every frame.

**Imports pattern** (analog: `primitives.tsx` lines 1-18, `ThemeProvider.tsx` lines 1-15):
```typescript
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion";
```

The project imports `prefersReducedMotion` from `"../lib/motion"` (relative path, no barrel re-export from `src/dls`). This import path is what `primitives.tsx` uses at line 17.

**matchMedia change listener pattern** (analog: `ThemeProvider.tsx` lines 68-76):
```typescript
// ThemeProvider.tsx lines 68-76 -- exact pattern for attaching/removing a matchMedia listener
useEffect(() => {
  if (!window.matchMedia) return;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (!storedChoice()) setTheme(mq.matches ? "dark" : "light");
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);
```

`GradientBackground` uses exactly this shape for `window.matchMedia("(pointer: fine)")`: create mq, add `"change"` listener, return cleanup removing the listener.

**rAF + cleanup pattern** (analog: `primitives.tsx` lines 209-219):
```typescript
// primitives.tsx Progress component, lines 209-219 -- rAF + cancelAnimationFrame cleanup
useEffect(() => {
  if (prefersReducedMotion()) {
    setWidth(pct);
    return;
  }
  const id = requestAnimationFrame(() => setWidth(pct));
  return () => cancelAnimationFrame(id);
}, [pct]);
```

`GradientBackground`'s rAF loop follows the same structure: `prefersReducedMotion()` guard first, `requestAnimationFrame` call assigned to a variable, cleanup returns `cancelAnimationFrame(id)`. The difference is that `GradientBackground` uses a persistent looping rAF (not one-shot), so `frameId = requestAnimationFrame(tick)` is called at the bottom of `tick` itself, not in the effect body.

**Direct DOM write pattern** (analog: `primitives.tsx` line 231):
```typescript
// primitives.tsx line 231 -- writing layout value directly to element style
<div className="mrdn-progress__fill" style={{ width: `${width}%` }} />
```

`GradientBackground` writes to `el.style.setProperty("--mx", ...)` instead of JSX `style={}` because the writes happen inside a rAF callback, not in render. Using a ref + `style.setProperty` is the correct extension of this pattern when writes happen outside React's render cycle.

**Component shape** (analog: `AppBar.tsx` lines 9-29):
```typescript
// AppBar.tsx lines 9-29 -- presentational component structure: typed props, single JSX element, className
export function AppBar({ nav, user = false }: { nav?: ReactNode; user?: boolean }) {
  return (
    <header className="app-bar">
      ...
    </header>
  );
}
```

`GradientBackground` is a no-prop presentational component (no external API needed). It returns a single `<div>` with a class name from `app.css`. The same zero-prop pattern is implicit in several primitives that take no configuration.

**CSS class application** (analog: `primitives.tsx` `cx` helper, lines 19-21):
```typescript
// primitives.tsx lines 19-21 -- class composition utility
const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");
```

`GradientBackground` applies `.gradient-bg` always, and adds `.gradient-bg--breathing` conditionally based on `isFinePointer` state. Use the same `cx()` pattern (either copy the local helper or inline the join).

**`useState` for mode flag** (analog: `ThemeProvider.tsx` lines 48-49, `primitives.tsx` lines 209-211):

Both existing analogs show that a single boolean `useState` is the right way to track "which mode am I in". `GradientBackground` uses `const [isFinePointer, setIsFinePointer] = useState(() => window.matchMedia?.("(pointer: fine)").matches ?? true)` -- lazy initializer, same shape as `initialTheme()` in `ThemeProvider.tsx` lines 42-46.

**`useRef` for DOM element** (standard React, but no existing component uses `useRef` in this project, so the planner notes this is a first use of `useRef`; it follows React 18 idiom exactly as documented).

---

### `src/styles/app.css` - new gradient section appended (config/styles)

**Analog:** `src/styles/app.css` existing `.app-bar` section (lines 27-41)

**Why this file, not a `.module.css`:** Confirmed by filesystem search - zero `.module.css` files exist anywhere in `src/`. All component-level styles live in `src/styles/app.css` as a single global stylesheet. The gradient styles belong here.

**Section format pattern** (lines 24-41 of `app.css`):
```css
/* ============================================================
   App bar
   ============================================================ */
.app-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  ...
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-line);
  animation: mrdn-fade var(--dur-slow) var(--ease-out) both;
  transition: background-color var(--dur) var(--ease-out),
    border-color var(--dur) var(--ease-out);
}
```

The gradient section must follow the same comment-header format and must use only `var(--token-name)` references. No raw hex, px, or rem values for design decisions. Geometry percentages (e.g. `ellipse 80% 60%`) are not design values and are acceptable as established by `clamp(var(--space-4), 5vw, var(--space-7))` already in this file.

**Gradient class definition** (follows `.app-bar` structural model):
```css
/* ============================================================
   Gradient background
   ============================================================ */
.gradient-bg {
  position: fixed;
  inset: 0;
  z-index: 1;                  /* must be below .app-bar z-index: 10 */
  pointer-events: none;
  background: radial-gradient(
    ellipse 80% 60% at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--color-brand) 12%, transparent),
    color-mix(in srgb, var(--color-surface) 6%, transparent) 45%,
    transparent 70%
  );
}

.gradient-bg--breathing {
  background: radial-gradient(
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

The DLS global `prefers-reduced-motion` reset in `dls/components.css` lines 335-344 (`animation-duration: 0.001ms !important`) kills `.gradient-bg--breathing`'s keyframe automatically. No additional `@media` block is needed in `app.css`.

The `app.css` header comment at lines 1-6 makes the "no raw values" rule explicit. The new section must abide by it. The `color-mix()` calls satisfy Rule 0 because they use `var(--color-brand)` and `var(--color-surface)` -- both existing `:root` tokens.

---

### `dls/tokens.css` - add `--dur-breath` (DLS config, Rule 0 gated)

**Analog:** `dls/tokens.css` motion block lines 88-98

**Exact insertion point** (lines 92-98 of `tokens.css`):
```css
  /* ---- Motion ----
     Durations, easings and named keyframe presets. Components read
     these so timing stays consistent. All motion collapses to nothing
     under prefers-reduced-motion (see components.css). */
  --dur-fast: 120ms;
  --dur: 200ms;
  --dur-slow: 320ms;
  --dur-slower: 560ms;       /* <-- insert --dur-breath after this line */
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* gentle overshoot */
```

**What to add** (one line, after `--dur-slower`):
```css
  --dur-breath: 7000ms;      /* breathing cadence (gradient-bg mobile fallback); pre-approved 2026-07-15 */
```

This is the ONLY change to `dls/tokens.css`. No dark-mode variant is needed: motion duration tokens are theme-agnostic and the `[data-theme="dark"]` block in `tokens.css` (lines 109+) does not contain any `--dur*` values, confirming the convention.

**Rule 0 gate:** Adding a token is a DLS breaking change. Approved in principle (CONTEXT.md D-07, 2026-07-15). Executor must surface the exact value `7000ms` for final human confirmation before writing this line.

---

### `tests/gradient.spec.js` (test, Playwright)

**Analog:** `tests/responsive.spec.js` (full file)

**File header pattern** (lines 1-6 of `responsive.spec.js`):
```javascript
// @ts-check
const { test, expect } = require("@playwright/test");

// Behaviour contract for the Meridian dashboard.
// Runs at mobile, tablet, and desktop (see playwright.config.js).
// As you build the widget hooks, add checks for them here.
```

New test file opens with `// @ts-check` and a `require("@playwright/test")` destructure - not ESM `import`.

**`page.goto` pattern** (line 9):
```javascript
await page.goto("/");
```

Always relative URL. The `baseURL` (`http://localhost:5173`) is set in `playwright.config.js` `use.baseURL`.

**Locator pattern** (lines 11-19):
```javascript
// Class selector:
await expect(page.locator(".app-wordmark")).toHaveText("Meridian");
// Role + name:
await expect(page.getByRole("button", { name: "Transfer" })).toBeVisible();
// Chained class selector:
await expect(page.locator("#accounts .account-card")).toHaveCount(3);
```

`gradient.spec.js` uses `page.locator('[data-testid="gradient-bg"]')` (attribute selector). This is the only place in the codebase a `data-testid` is used -- all other locators use class or role selectors. Because the gradient layer has no meaningful text or role, `data-testid` is the correct choice.

**`testInfo.project.name` for per-viewport branching** (lines 31-38):
```javascript
if (testInfo.project.name === "mobile") {
  // mobile assertion
} else {
  // desktop/tablet assertion
}
```

`gradient.spec.js` needs project-name branching because on the `mobile` project `isMobile: true, hasTouch: true` causes `(pointer: fine)` to evaluate `false`, meaning `.gradient-bg--breathing` is present. Desktop/tablet projects do not set `isMobile`, so `(pointer: fine)` is `true` and `.gradient-bg--breathing` is absent.

**Viewport reference** (from `playwright.config.js` lines 22-30):
```javascript
// Available project viewport sizes for gradient.spec.js assertions:
// mobile:  { width: 390, height: 844 }
// tablet:  { width: 768, height: 1024 }
// desktop: { width: 1280, height: 800 }
```

Use `page.viewportSize()` inside the test instead of hardcoding these literals.

**`emulateMedia` pattern** (referenced in RESEARCH.md, no existing example in codebase - use Playwright docs idiom):
```javascript
await page.emulateMedia({ reducedMotion: "reduce" });
```

This must be called before `page.goto()` to be effective in the same page load.

**`boundingBox` pattern** (lines 27-29 of `responsive.spec.js`):
```javascript
const first = await cards.nth(0).boundingBox();
if (!first || !second) throw new Error("account cards not found");
```

Always null-check `boundingBox()` result before reading `.x`, `.y`, `.width`, `.height`.

**Screenshot capture** (lines 40-47 of `responsive.spec.js`):
```javascript
test("capture a screenshot for the readout", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByText("$8,412.90").waitFor();
  await page.screenshot({
    path: testInfo.outputPath(`meridian-${testInfo.project.name}.png`),
    fullPage: true,
  });
});
```

`gradient.spec.js` does not need a screenshot test -- the phase verification is manual browser check. Do not add one.

---

### `src/App.tsx` - mount edit (component)

**Analog:** `src/App.tsx` (the file being edited, lines 1-34)

**Current structure** (lines 7-34):
```tsx
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><AppBar nav={<KitchenSinkLink />} user /><Dashboard /></>} />
          <Route path="/kitchen-sink" element={<><AppBar nav={<DashboardLink />} /><KitchenSink /></>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

**After edit** (D-10, D-11: mount `<GradientBackground />` INSIDE `ThemeProvider`, BEFORE `<BrowserRouter>`):
```tsx
import { GradientBackground } from "./components/GradientBackground";

export default function App() {
  return (
    <ThemeProvider>
      <GradientBackground />
      <BrowserRouter>
        <Routes>
          ...
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

The import is a named export `{ GradientBackground }` following the project convention established by `{ AppBar, DashboardLink, KitchenSinkLink }` in `App.tsx` line 3 -- named exports from component files.

---

## Shared Patterns

### prefersReducedMotion() - JS gate for all animation effects

**Source:** `src/lib/motion.ts` (entire file, 6 lines)
```typescript
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

**Apply to:** `GradientBackground.tsx` - call before attaching `pointermove` listener and before starting rAF loop. Returns `true` when reduced-motion is requested; if `true`, skip both the pointer listener and rAF entirely.

**Import path:** `import { prefersReducedMotion } from "../lib/motion";`

### Global reduced-motion CSS reset - kills all keyframe animation

**Source:** `dls/components.css` lines 335-344
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Apply to:** Gradient breathing animation (`.gradient-bg--breathing`) in `src/styles/app.css`. This reset kills it automatically with no extra `@media` block needed in `app.css`. The JS layer (`prefersReducedMotion()`) is a second independent gate for the rAF CPU cost.

### DLS token reference convention

**Source:** `src/styles/app.css` lines 1-6 (header) + lines 13-14:
```css
body {
  background: var(--color-canvas);
  ...
}
```

**Apply to:** All gradient CSS in `app.css`. Every colour value is `var(--color-*)`. Every motion value is `var(--dur-*)` or `var(--ease-*)`. Geometry (ellipse %, inset: 0) is layout scaffolding, not a DLS concern. `color-mix(in srgb, var(--color-brand) 12%, transparent)` satisfies Rule 0 because both stop values are token references.

### Theme-agnostic CSS pattern

**Source:** `src/styles/app.css` line 14, `AppBar.tsx` - all class names use `var(--color-*)` tokens with no `[data-theme]` branches in component CSS.

**Apply to:** Gradient CSS in `app.css`. Because `--color-brand`, `--color-surface`, and `--color-canvas` already flip under `[data-theme="dark"]` in `dls/tokens.css` (lines 113-140+), the gradient is theme-aware with zero extra CSS. No `[data-theme="dark"] .gradient-bg { ... }` block is needed.

### matchMedia addEventListener + cleanup convention

**Source:** `src/theme/ThemeProvider.tsx` lines 68-76 (the OS dark-mode listener)
```typescript
useEffect(() => {
  if (!window.matchMedia) return;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => { ... };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);
```

**Apply to:** `GradientBackground.tsx` pointer-mode listener (`(pointer: fine)` matchMedia). Same `addEventListener/removeEventListener` shape, same empty dependency array for the setup effect, same early-return if `!window.matchMedia`.

### Named export convention

**Source:** `src/components/AppBar.tsx` line 9:
```typescript
export function AppBar(...) { ... }
```

**Apply to:** `GradientBackground.tsx`. Use `export function GradientBackground()` (named export). Import as `{ GradientBackground }` in `App.tsx`.

---

## No Analog Found

None. All five files have clear analogs or are modifications to existing files.

---

## Metadata

**Analog search scope:** `src/components/`, `src/dls/`, `src/theme/`, `src/lib/`, `src/styles/`, `tests/`, `dls/`, `playwright.config.js`
**Files scanned:** 11 (AppBar.tsx, icons.tsx, ThemeToggle.tsx, ThemeProvider.tsx, primitives.tsx, motion.ts, app.css, main.tsx, App.tsx, responsive.spec.js, playwright.config.js) + tokens.css, components.css (targeted reads)
**Pattern extraction date:** 2026-07-15
