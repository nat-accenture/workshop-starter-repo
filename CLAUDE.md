# Meridian: project instructions

Project-level rules for this repo. These bind every change made here, whether
made directly or through the SpectrumOS `/spec-*` loop (discuss → plan → execute
→ verify). They override default behaviour.

Meridian is built on three contracts: the **design contract** (`dls/`), the
**data contract** (`data/`), and the **behaviour contract** (`tests/`). The rule
below governs the first and is the highest-priority rule in this project.

---

## RULE 0: The DLS is mandatory (non-negotiable)

**Every change MUST be built from the Design Language System in `dls/`.** This
applies with full force to all SpectrumOS work: any plan or execution step that
touches the UI is held to this rule.

1. **Build only from the DLS.**
   - Use the CSS variables in `dls/tokens.css` for every visual value: colour,
     spacing, radius, type size/weight, shadow, motion. **Never** write a raw hex,
     `rgb()`, pixel, or rem literal for these in app code.
   - Compose UI from the `mrdn-` components in `dls/components.css`
     (`mrdn-card`, `mrdn-stat`, `mrdn-btn`, `mrdn-row`, `mrdn-pill`, `mrdn-chip`,
     `mrdn-progress`, `mrdn-avatar`, and the layout helpers `mrdn-grid` /
     `mrdn-stack` / `mrdn-cluster`). Do not hand-roll one-off styled elements.
   - The DLS is the single source of truth. Change a decision once, in tokens,
     and it changes everywhere.

2. **Changing or deviating from the DLS is a BREAKING CHANGE.**
   The following all count as breaking and are **not allowed without explicit
   human confirmation first**:
   - Editing `dls/tokens.css`, `dls/components.css`, or `dls/DLS-RULES.md`:
     adding, removing, renaming, or re-valuing any token or component.
   - Introducing any styling that bypasses the DLS: raw hex/rgb/px/rem values,
     inline one-off styles, or bespoke non-`mrdn-` components in app code.
   - Overriding a token's effect locally to get a different look.

3. **A breaking change must STOP and ask.**
   When a task appears to require any of the above, do **not** proceed. Pause,
   state plainly that it is a DLS breaking change, explain what would change and
   why, and get explicit human sign-off before writing it. If a needed primitive
   is genuinely missing, propose adding it to `components.css` (following the
   `mrdn-` naming) and get confirmation before adding it; do not scatter a
   one-off style instead.

4. **When in doubt, prefer an existing token or component.** If none fits, ask
   rather than inventing.

### How this applies to SpectrumOS
Treat Rule 0 as a hard gate in the `/spec-*` loop:
- In **discuss/plan**, flag any step that would edit `dls/` or introduce non-DLS
  styling as requiring human confirmation, and surface it in the plan.
- In **execute**, refuse to silently modify the DLS or work around it; stop and
  ask instead.
- In **verify**, a change that added raw values or bespoke styling instead of
  DLS tokens/components fails review.

---

## Other standing rules
- **Money:** SGD, `en-SG`, stored in minor units. Format with `formatSGD()` from
  `data/api.js`; never divide-and-concatenate by hand. Use `.mrdn-amount`
  (`.is-credit` for money in, `.is-over` only for a breached limit). See
  `dls/DLS-RULES.md` rule 3.
- **Accessibility:** visible `:focus-visible` rings, ≥44px hit targets, semantic
  HTML, text alternatives for icons. Meridian is a bank; this is table stakes.
- **Responsive:** the grid collapses to one column at ≤640px and must pass the
  behaviour contract in `tests/responsive.spec.js` (mobile, tablet, desktop).
- **Data shape:** use the API shape in `data/DATA-CONTRACT.md`, not ad hoc data.
- **Theming:** light and dark are supported. Dark mode is expressed **only** as
  `[data-theme="dark"]` token overrides in `dls/tokens.css`; components must stay
  theme-agnostic by reading tokens (and `currentColor`), never hard-coded colours.
  Note: because this edits `dls/tokens.css`, adding or adjusting a theme's tokens
  is still a DLS change under Rule 0 and needs explicit human confirmation first.
  The override shape above is what an approved theming change must look like, not
  an exemption from the gate.
</content>
