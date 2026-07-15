<!-- generated-by: spec-doc-writer -->
# Development

This guide covers the day-to-day development workflow for Meridian: how to run
the app locally, the build and test commands, the conventions every change must
follow, and the recipe for adding a new dashboard widget.

Before you start, read [the golden rule](#the-golden-rule-build-only-from-the-dls)
below. It is the single most important constraint in this project.

## Local setup

Meridian is a React 18 + TypeScript app built with Vite. It is a static front
end backed by local JSON fixtures, so there is no database, backend service, or
environment file to configure before it runs.

1. Clone the repository and change into it:

   ```bash
   git clone https://github.com/kaushikdas0/workshop-starter-repo.git
   cd workshop-starter-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Vite serves the app at `http://localhost:5173` (the port is pinned with
   `strictPort` in `vite.config.ts` so the Playwright behaviour contract always
   points at one stable origin). The dashboard renders at `/` and the live DLS
   gallery at `/kitchen-sink`.

There is nothing to copy or set up beyond this. The data layer reads JSON
fixtures in `data/` behind a small simulated latency, so the app works offline
straight after install. See [CONFIGURATION.md](./CONFIGURATION.md) for the
few build-time settings that do exist.

## Build commands

All scripts live in `package.json` and are run with `npm run <name>`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot module reloading on port 5173. |
| `npm run serve` | Alias for `dev`; starts the same Vite dev server. |
| `npm run build` | Type-check the whole project with `tsc --noEmit`, then produce the production bundle with `vite build`. The type-check runs first, so a type error fails the build. |
| `npm run preview` | Serve the built production bundle locally on port 5173 (run `build` first). |
| `npm run test:responsive` | Run the Playwright behaviour contract. It builds, serves the production bundle, and asserts responsive behaviour at mobile, tablet, and desktop widths. |
| `npm run test:responsive:report` | Open the HTML report from the last Playwright run. |

## Code style

There is no ESLint, Prettier, or Biome configuration in this project. Code style
is governed by two things instead: TypeScript in strict mode, and the DLS.

**TypeScript strictness.** `tsconfig.json` turns on `strict` plus
`noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`. These
are not warnings: `npm run build` runs `tsc --noEmit` before it bundles, so an
unused local, an implicit `any`, or a missing case fails the build. Write code
that type-checks cleanly under these settings. The app is authored in `.tsx` /
`.ts`; the `src` and `data` directories are both included in the type-check.

**The DLS.** Every visual value comes from the design language system, never from
raw literals. See the golden rule below for the full rule.

### The golden rule: build only from the DLS

Meridian's appearance is a contract, held in `dls/`. Every change that touches
the UI must be built from it:

1. **Use tokens, never raw values.** Colour, spacing, radius, type size and
   weight, shadow, and motion all come from the CSS custom properties in
   `dls/tokens.css` (for example `var(--color-primary)`, `var(--space-4)`,
   `var(--dur)`). Do not write a raw hex, `rgb()`, pixel, or rem literal for
   these values in app code, and do not add inline one-off styles.

2. **Compose from `mrdn-` components.** Build UI out of the primitives defined in
   `dls/components.css` (`mrdn-card`, `mrdn-stat`, `mrdn-amount`, `mrdn-btn`,
   `mrdn-pill`, `mrdn-chip`, `mrdn-row`, `mrdn-progress`, `mrdn-avatar`,
   `mrdn-skeleton`, and the layout helpers `mrdn-grid` / `mrdn-stack` /
   `mrdn-cluster`). In React, use the typed wrappers in `src/dls/` (see
   `src/dls/primitives.tsx` and `src/dls/layout.tsx`), which emit exactly this
   markup and add no styling of their own. Do not hand-roll bespoke,
   non-`mrdn-` styled elements.

3. **Changing the DLS itself is a breaking change.** Editing `dls/tokens.css`,
   `dls/components.css`, or `dls/DLS-RULES.md` (adding, removing, renaming, or
   re-valuing any token or component), or bypassing the DLS with raw values or
   one-off styles, all count as breaking. None of these are allowed without
   explicit human sign-off first. If a primitive you need is genuinely missing,
   stop and propose adding it to `dls/components.css` under the `mrdn-` naming,
   and get confirmation before writing it. When in doubt, reuse an existing token
   or component, or ask.

The reference for the DLS lives in `dls/DLS-RULES.md`, the static gallery in
`dls/preview.html`, and the live gallery on the `/kitchen-sink` route.

### Money, theming, and motion

Three narrower rules follow from the DLS and apply to every widget:

- **Money.** Amounts are SGD, formatted `en-SG`, and stored in minor units
  (cents). Always format with `formatSGD()` from `data/api.ts`; never divide and
  concatenate by hand. Render figures with the `.mrdn-amount` class (via the
  `Amount` primitive in `src/dls/primitives.tsx`), using the `credit` tone for
  money in and the `over` tone only for a figure that has breached a limit.

- **Theming.** Light and dark are both supported. Dark mode is expressed only as
  `[data-theme="dark"]` token overrides in `dls/tokens.css`; components stay
  theme-agnostic by reading tokens (and `currentColor`), never hard-coded
  colours. `src/theme/ThemeProvider.tsx` decides which theme is active and
  reflects it onto `<html>`; it applies no styling itself. Because a theme change
  edits `dls/tokens.css`, it is a DLS breaking change and needs sign-off first.

- **Motion.** Animate with the duration and easing tokens (`--dur*`, `--ease*`),
  never magic timings, and keep motion purposeful. All animation must collapse
  under `prefers-reduced-motion: reduce`. CSS handles this with a global reset;
  any JavaScript animation must check the `prefersReducedMotion()` helper in
  `src/lib/motion.ts` (as `Progress` in `src/dls/primitives.tsx` does).

## How to add a dashboard widget

The dashboard is a 12-column DLS grid assembled in
`src/features/dashboard/Dashboard.tsx`. Each widget is a self-contained component
in `src/features/dashboard/` that derives its own view from the fetched data and
renders using DLS primitives. `src/features/dashboard/SavingsGoal.tsx` is a good
worked example. To add a new widget:

1. **Create the component** under `src/features/dashboard/`, for example
   `src/features/dashboard/MyWidget.tsx`. Export a function component that takes
   the data it needs as props (for example `accounts: Account[]`).

2. **Compose from DLS primitives.** Import from `../../dls`
   (`Card`, `CardHeader`, `CardTitle`, `Stack`, `Progress`, `Pill`, and the rest)
   and build the widget out of those. Do not add raw styles; if you need a value,
   reach for a token.

3. **Read data through the seam.** The dashboard loads all data once via the
   `useDashboardData` hook in `src/hooks/useDashboardData.ts`, which calls
   `getAccounts`, `getTransactions`, and `getCategories` from `data/api.ts` in
   parallel. Do not fetch data inside the widget; take it as props from
   `Dashboard.tsx`, which already exposes `accounts`, `transactions`,
   `categories`, `loading`, and `error`. Data shapes are typed in `data/types.ts`.

4. **Format with the helpers.** Format money with `formatSGD()` from
   `data/api.ts`. For dates and monograms, use the helpers in `src/lib/format.ts`
   (`formatShortDate`, `initials`, `yearMonth`).

5. **Place it in the grid.** Add the widget to `Dashboard.tsx` inside a
   `<Col span={...}>` (valid spans are `4`, `6`, `8`, `12`), and provide a
   loading state for it while `loading` is true, following the pattern the
   existing widgets use.

6. **Type-check.** Run `npm run build` to confirm the widget passes the strict
   type-check, and `npm run test:responsive` to confirm the dashboard still
   reflows correctly at every width.

## Branch conventions

The default branch is `main`. There is no branch-naming convention formally
documented in the repository. In practice, feature work is done on branches
prefixed with `feat/` (for example `feat/react-app`), so prefer that pattern:
`feat/<short-description>` for new work. Confirm with the team before adopting a
different scheme.

## PR process

There is no pull request template, `CONTRIBUTING.md`, or CI configuration in the
repository, so no formal PR checklist is enforced automatically. Until one is
documented, follow these guidelines when opening a pull request:

- Branch off `main` and target `main`.
- Run `npm run build` so the strict type-check passes, and `npm run test:responsive`
  so the behaviour contract passes, before requesting review.
- If your change touches the UI, confirm it is built entirely from DLS tokens and
  `mrdn-` components. A change that introduces raw values or bespoke styling, or
  that edits the DLS without prior sign-off, should be flagged for human review
  and is not acceptable without it.
- Verify the app in both light and dark themes using the header toggle.
- Keep the change scoped and describe what it does and why.

## Next steps

- [README.md](../../README.md) for the project overview and quick start.
- [ARCHITECTURE.md](./ARCHITECTURE.md) for how the pieces fit together.
- [CONFIGURATION.md](./CONFIGURATION.md) for build-time settings.
- `dls/DLS-RULES.md` for the full design contract.
