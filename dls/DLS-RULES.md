# Meridian DLS: the design contract

This is the design layer of the app. It is one of three contracts the
assistant is held to when it builds anything here:

- **Design contract** (this file + `tokens.css` + `components.css`): output stays on brand.
- **Data contract** (`../data/DATA-CONTRACT.md`): output uses the real API shape.
- **Behaviour contract** (`../tests/responsive.spec.js`): output actually works, responsively.

When you describe a feature, the assistant reads these rules and follows them. You do not have to restate them.

## Rule 0: the DLS is mandatory (breaking changes need a human)
This is the highest-priority rule (see also `../CLAUDE.md`). Every change, and
every SpectrumOS `/spec-*` step, must be **built from this DLS**: tokens from
`tokens.css` and `mrdn-` components from `components.css`, never raw values or
one-off styles.

**Changing the DLS itself is a BREAKING CHANGE.** That means editing
`tokens.css`, `components.css`, or this file (adding, removing, renaming, or
re-valuing a token or component), or deviating from it (raw hex/px, inline
one-off styles, bespoke non-`mrdn-` components). **Stop and get explicit human
confirmation before doing it.**
If a primitive is missing, propose adding it here (same `mrdn-` naming) and get
sign-off first. When in doubt, reuse an existing token or component, or ask.

## The rules

1. **Use tokens, never raw values.** No hard-coded hex colours, pixel spacing, radii, or font sizes in app code. Use the CSS variables in `tokens.css` (for example `var(--color-primary)`, `var(--space-4)`). Change a design decision once, in tokens, and it changes everywhere.

2. **Compose from `mrdn-` components.** Build screens out of the primitives in `components.css` (`mrdn-card`, `mrdn-stat`, `mrdn-amount`, `mrdn-btn`, `mrdn-pill`, `mrdn-chip`, `mrdn-row`, `mrdn-progress`, `mrdn-avatar`, `mrdn-skeleton`, and the layout helpers `mrdn-grid` / `mrdn-stack` / `mrdn-cluster`). If a primitive is missing, do not add it silently: propose it in `components.css` following the same `mrdn-` naming and get explicit human sign-off first (this is a DLS change, see Rule 0). Do not scatter one-off styles through the app.

3. **Money formatting.** All amounts are SGD, formatted with `en-SG` (`$1,240.50`). Use `.mrdn-amount` so figures are tabular and align. Credits (money in) use `.is-credit` (green). Ordinary debits stay neutral ink with a leading minus. Only use `.is-over` (red) for a figure that has breached a limit or budget.

4. **Accessibility is not optional.** Keep visible `:focus-visible` rings, interactive targets at least 44px, semantic HTML (`button`, `nav`, `main`, `section`), text alternatives for icons, and AA text contrast. Honour `prefers-reduced-motion` (see rule 6). Meridian is a bank; this is table stakes.

5. **Mobile first, and it must pass the test.** The dashboard grid collapses to a single column at 640px and below. This is not a preference, it is enforced by the behaviour contract in `../tests/responsive.spec.js`, which runs at mobile, tablet, and desktop widths during verify.

6. **Motion is tokenised, purposeful, and optional.** Animate with the duration and easing tokens (`--dur*`, `--ease*`), never magic timings. Motion should reinforce meaning (a bar filling, a card settling in, a shimmer while loading), not decorate. All of it MUST collapse under `prefers-reduced-motion: reduce` (a global reset lives at the bottom of `components.css`; JS animations check the `prefersReducedMotion()` helper). Keep entrance/transform animation off anything the behaviour contract measures (the account-summary cards fade only).

## The palette
Meridian's palette is deliberately lean: **three hues, not five.** One deep blue
family carries brand, actions, and savings/goals (`--color-brand` /
`--color-primary` / `--color-primary-tint`); the only other hues are the two
money semantics (`--color-positive` green in, `--color-negative` red out); the
rest is a cool neutral ink + surface scale. Fewer colours read as more
trustworthy and keep money meaning unambiguous. The secondary button uses ink
text (brand shows on its border/hover) so it stays AA in both themes. Adding a
new hue is a Rule 0 change, so ask first.

## See the system
Two galleries render the DLS:
- `preview.html`: the static token + component reference (just double-click it).
- the `/kitchen-sink` route (`../src/features/kitchen-sink/KitchenSink.tsx`): the **live** gallery. It reads the computed token values at runtime and updates when you switch theme. Use the moon/sun toggle in the header to check light and dark.

Theming is wired by `../src/theme/ThemeProvider.tsx`, which sets a `[data-theme]` attribute on `<html>`. Light and dark are token overrides only (see `tokens.css`); components follow automatically.
