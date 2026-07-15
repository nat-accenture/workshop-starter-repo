---
phase: 04-mouse-reactive-gradient-background-with-breathing-animation
reviewed: 2026-07-15T06:47:50Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - dls/tokens.css
  - src/App.tsx
  - src/components/GradientBackground.tsx
  - src/styles/app.css
  - tests/gradient.spec.js
findings:
  critical: 0
  warning: 4
  info: 3
  total: 7
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-07-15T06:47:50Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

Reviewed the mouse-reactive ambient gradient background: a fixed full-viewport
layer with rAF pointer parallax on fine-pointer devices, a CSS breathing pulse
on coarse-pointer devices, and a reduced-motion gate. The rAF loop itself is
well built: StrictMode-safe cleanup (both `removeEventListener` and
`cancelAnimationFrame` are paired), no per-frame `setState` (it writes CSS
custom properties directly), a passive listener, and correct effect scoping.
The `matchMedia('(pointer: fine)')` change listener in Effect A is also cleaned
up correctly. Colours resolve through DLS tokens via `color-mix()`, and the one
`tokens.css` edit is a single motion-token addition.

No BLOCKER-severity defects were found. The main concerns are: (1) the layer's
`z-index: 1` paints the gradient tint over dashboard content, not just behind it,
contradicting the stated "renders behind every route" intent; (2) the
reduced-motion gate is evaluated once and never re-checked at runtime, unlike the
sibling theme/pointer listeners; (3) the `--dur-breath` token was added to the
design contract, which Rule 0 treats as a breaking change; and (4) a test relies
on implicit Chromium pointer emulation rather than an explicit media assertion.

## Warnings

### WR-01: Gradient layer paints over page content, not only behind it

**File:** `src/styles/app.css:156-167`
**Issue:** `.gradient-bg` is `position: fixed; z-index: 1`. The dashboard `<main>`
(`src/features/dashboard/Dashboard.tsx:13`) is non-positioned (static), and the
`.mrdn-card` primitives are either static or `position: relative` with
`z-index: auto` (`dls/components.css:18`, `223-224`). By CSS painting order, a
positioned element with a positive `z-index` (step 7) paints above all
non-positioned content and above `z-index: auto` positioned content (steps 3-6).
The gradient therefore renders its tint *on top of* the dashboard cards and their
text, below the app-bar only. This contradicts the component's own comment
("Fixed full-viewport ambient gradient layer. Renders behind every route",
`GradientBackground.tsx:4`) and the CSS comment whose reasoning only protects the
header ("below .app-bar ... never covers the header", `app.css:159`). It is not a
crash because the tint is highly transparent (`color-mix(... 12%, transparent)`)
and `pointer-events: none` prevents input blocking, but it is a real visual
regression: content sits under a moving colour wash. The existing test only
asserts `z < 10` (`tests/gradient.spec.js:44`), so it does not catch this.
**Fix:** Move the layer behind content instead of relying on a low positive
z-index. Prefer `z-index: -1` on the fixed layer, or give it `z-index: 0` and
establish an isolation/stacking baseline on the content root. Example:
```css
.gradient-bg {
  position: fixed;
  inset: 0;
  z-index: -1;            /* behind all in-flow content, still above body bg */
  pointer-events: none;
  /* ...gradient... */
}
```
If a negative z-index is undesirable (it can slip under the body background in
some stacking setups), instead keep `z-index: 0` here and add
`position: relative; z-index: 1;` (or `isolation: isolate`) to `.dashboard` /
`.ks-wrap` so page content forms a layer above the gradient. Also add a test that
asserts a dashboard card is not visually occluded by the layer.

### WR-02: Reduced-motion preference is read once and never re-evaluated at runtime

**File:** `src/components/GradientBackground.tsx:28-57`
**Issue:** Effect B gates on `prefersReducedMotion()` at mount, but its
dependency array is `[isFinePointer]` only. If the user toggles the OS
"reduce motion" setting while the app is open, there is no
`matchMedia('(prefers-reduced-motion: reduce)')` change listener to stop the rAF
parallax loop, so a user who just asked for reduced motion keeps receiving
pointer-tracked animation until the pointer type happens to change or the page
reloads. This is inconsistent with the same file's Effect A, which *does* listen
for `(pointer: fine)` changes (line 21), and with `ThemeProvider.tsx:68-76`,
which listens for `(prefers-color-scheme: dark)` changes. The CSS breathing path
is safe (the DLS `@media (prefers-reduced-motion: reduce)` reset at
`dls/components.css:335` reacts live), but the JS parallax path does not.
**Fix:** Add a reduced-motion change listener that forces a re-run of the gate,
mirroring Effect A. For example, track it in state:
```tsx
const [reduce, setReduce] = useState(prefersReducedMotion);
useEffect(() => {
  if (!window.matchMedia) return;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => setReduce(mq.matches);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}, []);
```
then gate Effect B on `reduce` and add it to the dependency array so the loop
tears down/re-attaches when the preference flips.

### WR-03: `dls/tokens.css` was modified (Rule 0 breaking change) on the strength of an inline "pre-approved" comment

**File:** `dls/tokens.css:96`
**Issue:** CLAUDE.md Rule 0 states that adding a token to `dls/tokens.css` is a
breaking change that is "not allowed without explicit human confirmation first"
and that such a change "must STOP and ask." This diff adds
`--dur-breath: 7000ms;` with an inline comment
`/* ...; pre-approved 2026-07-15 */`. The token itself is correct and used
(`app.css:179`), but an inline self-asserted "pre-approved" note is not
verifiable evidence of the human sign-off Rule 0 requires, and it is dated the
same day as the review. A reviewer cannot confirm the gate was satisfied from the
code alone.
**Fix:** Confirm the approval exists in the phase's discuss/plan artifacts (e.g.
a recorded human sign-off in the DISCUSSION or PLAN for phase 04) and reference
it, rather than relying on an inline claim. If no such recorded approval exists,
this token addition must be paused and confirmed per Rule 0 before shipping. No
code change to the value is needed if approval is genuine.

### WR-04: Breathing-mode test depends on implicit Chromium pointer emulation, not an explicit media assertion

**File:** `tests/gradient.spec.js:71-82` (with `playwright.config.js` `mobile` project)
**Issue:** The test branches on `testInfo.project.name === "mobile"` to assert the
`gradient-bg--breathing` class is present. Whether that class is applied depends
entirely on the component's `window.matchMedia("(pointer: fine)").matches` check
(`GradientBackground.tsx:11`) returning `false` under the `mobile` project. That
project sets `isMobile: true, hasTouch: true` but never explicitly forces
`(pointer: fine)` to false, so the test's correctness rides on an undocumented
Chromium emulation detail (touch + isMobile implying a coarse primary pointer).
If that emulation behaviour shifts, the test asserts the wrong branch by project
name while the code is actually correct, producing a confusing failure. The
in-file comment even flags the ambiguity ("On the `mobile` project (pointer: fine)
=== false", lines 9-10) but does not assert it.
**Fix:** Assert the media condition the code actually reads, so the test verifies
the true precondition rather than a proxy:
```js
const finePointer = await page.evaluate(
  () => window.matchMedia("(pointer: fine)").matches,
);
if (finePointer) {
  await expect(layer).not.toHaveClass(/gradient-bg--breathing/);
} else {
  await expect(layer).toHaveClass(/gradient-bg--breathing/);
}
```
This keeps the test correct regardless of how each Playwright project maps to
pointer type.

## Info

### IN-01: Initial `isFinePointer` state can cause a first-render flash of the wrong mode

**File:** `src/components/GradientBackground.tsx:10-12`
**Issue:** The lazy initializer defaults to `true` when `window.matchMedia` is
absent (`?? true`). On a genuine coarse-pointer device where `matchMedia` exists,
the value is correct; but the fallback biases toward fine-pointer (parallax) mode,
so an environment without `matchMedia` would briefly attach the pointer loop and
omit the breathing class. Low impact in practice (all target browsers have
`matchMedia`), but the default silently favours one mode.
**Fix:** Consider defaulting the no-`matchMedia` fallback to the more conservative
coarse/breathing mode, or document why fine-pointer is the safe default.

### IN-02: `pointermove` coordinates are not clamped to [0,1]

**File:** `src/components/GradientBackground.tsx:41-42`
**Issue:** `target.x/y` are computed as `clientX/innerWidth` and
`clientY/innerHeight`. Pointer events with `clientX`/`clientY` outside the
viewport (possible with some capture/drag scenarios or subpixel rounding) yield
values slightly below 0 or above 1, which then drive the gradient position past
the 0-100% range. Harmless visually (the radial gradient just recentres), but the
value is unbounded by intent.
**Fix:** Optional clamp for defensiveness:
`target.x = Math.min(1, Math.max(0, e.clientX / window.innerWidth));` (same for y).

### IN-03: Two nearly identical gradient definitions duplicated between base and breathing

**File:** `src/styles/app.css:161-166` and `173-178`
**Issue:** The `radial-gradient(...)` colour stops are duplicated verbatim in
`.gradient-bg` and `.gradient-bg--breathing`; only the position (`var(--mx,50%)`
vs `50% 50%`) differs. A future change to the tint must be made in both places or
they drift.
**Fix:** Factor the shared colour stops into a CSS custom property or have the
breathing rule only override the gradient position, not restate the whole
background. This is a maintainability nit, not a bug.

---

_Reviewed: 2026-07-15T06:47:50Z_
_Reviewer: Claude (spec-code-reviewer)_
_Depth: standard_
