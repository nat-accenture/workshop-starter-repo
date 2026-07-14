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

## RULE 1: `/spec-sketch` runs in `prototype/` and is built from the DLS

This rule governs `/spec-sketch` and any throwaway UI mockup or prototype made
in this repo. It **overrides the sketch skill's defaults** and is enforced as
part of Rule 0. It holds in **every** mode: idea, frontier, `--quick`, `--text`,
and `--wrap-up`. Because `--quick` and frontier mode both skip straight to the
skill's `build_sketches` step, anchor this rule there: the `prototype/` location
and the DLS gate below apply at build time no matter how the run got there.

1. **All prototype work lives in a top-level `prototype/` folder.**
   Wherever the sketch skill (in any mode) would create, list, link, read, or
   write under `.planning/sketches/`, use `prototype/` instead. Create
   `prototype/` if it is missing. Concretely:
   - Sketch directories `prototype/NNN-descriptive-name/index.html` (each with
     its `README.md`); the manifest at `prototype/MANIFEST.md`; the wrap-up
     summary at `prototype/WRAP-UP-SUMMARY.md`.
   - Frontier mode and `--wrap-up` **read** from `prototype/`
     (`prototype/MANIFEST.md`, glob `prototype/*/README.md`); their
     "nothing to analyze" / "no sketches found" guards check `prototype/`.
   - Commit `--files` paths point at `prototype/...`.
   - Exception: the `--wrap-up` findings skill stays where the skill puts it
     (`./.claude/skills/sketch-findings-*/`). Only sketch artifacts move to
     `prototype/`.

2. **Every prototype is built from the DLS. No bespoke theme, no theme switcher.**
   - Each prototype's HTML links the real design contract at the correct
     relative depth. A sketch at `prototype/NNN-name/index.html` is two levels
     below the repo root, so link:
     `<link rel="stylesheet" href="../../dls/tokens.css">` then
     `<link rel="stylesheet" href="../../dls/components.css">`. This replaces the
     skill's `../themes/default.css` link. Compose the prototyped UI only from
     the `mrdn-` components (`mrdn-card`, `mrdn-stat`, `mrdn-btn`, `mrdn-row`,
     `mrdn-pill`, `mrdn-chip`, `mrdn-progress`, `mrdn-avatar`, and the layout
     helpers `mrdn-grid` / `mrdn-stack` / `mrdn-cluster`) and DLS tokens; do not
     hand-roll bespoke non-`mrdn-` elements for what the DLS already covers.
   - **Skip the skill's `create_theme` step.** Do not generate
     `prototype/themes/default.css` or any separate palette / type / spacing /
     shape system, and do not turn a "mood" into new design values.
   - **Do not use the skill's file-swapping theme switcher** and do not author
     extra theme files (e.g. `midnight.css`, `brutalist.css`). Light and dark
     are `[data-theme="dark"]` token overrides already defined in
     `dls/tokens.css`; a prototype toggles theme by setting `data-theme` on
     `<html>`, never by swapping stylesheets. Use the DLS token names
     (`--color-brand`, `--color-ink`, `--color-canvas`, `--space-*`, …), never
     the skill template's names (`--color-bg`, `--color-text`).
   - No raw hex / rgb / px / rem literals and no one-off inline styles for
     anything the tokens cover: being throwaway does **not** exempt a prototype
     from Rule 0.
   - Prototypes stay plain HTML linking the raw DLS CSS; they do **not** need the
     React `src/dls/` wrappers. This binds the prototyped UI only: the injected
     sketch harness (toolbar, variant tabs) is exempt.

3. **If the DLS is missing, or a prototype needs something it does not cover,
   STOP and ask.**
   - Before building (in every mode, including `--quick`), verify that
     `dls/tokens.css` and `dls/components.css` exist. If `dls/` cannot be found,
     do not invent one and do not fall back to a generated theme: pause and ask
     the user how to proceed.
   - If a prototype appears to need a token or `mrdn-` component the DLS does not
     have (i.e. it would require creating or changing the DLS), that is a Rule 0
     breaking change: stop, say what is missing, and get explicit human
     confirmation before adding anything. Prefer an existing token or component;
     when none fits, ask.

---

## Other standing rules
- **Money:** SGD, `en-SG`, stored in minor units. Format with `formatSGD()` from
  `data/api.ts`; never divide-and-concatenate by hand. Use `.mrdn-amount`
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
