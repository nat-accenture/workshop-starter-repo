<!-- generated-by: spec-doc-writer -->
# Meridian Dashboard

Meridian Bank customer dashboard: a React + TypeScript single-page app built on the Meridian Design Language System (DLS).

## Installation

Requires [Node.js](https://nodejs.org) (used to run Vite and the tooling) and npm. Install dependencies from the project root:

```bash
npm install
```

## Quick start

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open the address Vite prints (for example http://localhost:5173).

You will see the Meridian dashboard: account balances, recent activity, spend by category, a savings goal, and quick actions. Vite hot-reloads, so the tab updates as the code changes.

To preview a production build instead:

```bash
npm run build
npm run preview   # serves the built app on http://localhost:5173
```

## Usage

The app is a thin React shell over three contracts, and every widget is built from them:

- **`dls/`** the design system (`tokens.css` + `components.css`). React components in `src/dls/` are thin wrappers (`Card`, `Stat`, `Amount`, `Button`, `Grid`, `Stack`, and more) that emit the `mrdn-` markup, so widgets come out on brand. The DLS is the single source of truth for every colour, spacing, radius, type, and motion value. See `dls/DLS-RULES.md`.
- **`data/`** a mock API in `data/api.ts` (typed, JSON shaped like a real bank). It exposes `getAccounts()`, `getTransactions()`, `getCategories()`, and the money helper `formatSGD()`. Each call returns a local JSON fixture behind a small fake latency, so it behaves like a real network request. See `data/DATA-CONTRACT.md`.
- **`tests/`** a Playwright responsive behaviour contract. The dashboard must work at mobile, tablet, and desktop sizes.

### Routes

The app has two routes, both served by the single-page shell:

- `/` the dashboard.
- `/kitchen-sink` a live gallery of every DLS token and component. The colour swatches show the real token values.

### Switch themes

Use the moon/sun toggle in the header to switch between light and dark. Dark mode is expressed only as token overrides in `dls/tokens.css`, so every widget follows automatically. The chosen theme is remembered in `localStorage` and applied before first paint to avoid a flash of the wrong mode.

### Format money

Money is SGD, `en-SG`, stored in minor units (cents). Format it with `formatSGD()` from `data/api.ts` rather than dividing and concatenating by hand:

```ts
import { formatSGD } from "./data/api";

formatSGD(125000);                 // "$1,250.00"
formatSGD(-4200);                  // "-$42.00"
formatSGD(4200, { signed: true }); // "+$42.00"
```

### Run the responsive test

The Playwright suite builds the app, serves the production bundle, and checks it at phone (390x844), tablet (768x1024), and desktop (1280x800) widths in Chromium.

```bash
npx playwright install chromium
npm run test:responsive
```

The test binds port 5173, so stop the dev server first. View the last report with `npm run test:responsive:report`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 5173 with hot reload. |
| `npm run build` | Type-check with `tsc --noEmit`, then build the production bundle with Vite. |
| `npm run preview` | Serve the production build on port 5173. |
| `npm run test:responsive` | Run the Playwright responsive behaviour contract. |
| `npm run test:responsive:report` | Open the last Playwright HTML report. |

## Project structure

```
src/                 React app
  App.tsx            Route definitions (/ and /kitchen-sink)
  main.tsx           Entry point; loads DLS CSS, then mounts App
  dls/               Thin React wrappers that emit mrdn- markup
  components/        App chrome (AppBar, ThemeToggle, icons)
  features/          Dashboard and kitchen-sink screens
  hooks/             Data-loading hooks (useDashboardData)
  theme/             ThemeProvider (light/dark)
dls/                 Design contract: tokens.css, components.css, DLS-RULES.md
data/                Data contract: api.ts, JSON fixtures, DATA-CONTRACT.md
tests/               Behaviour contract: responsive.spec.js (Playwright)
```

## License

No license file is present, and the package is marked `private` in `package.json`. This project is not distributed under an open-source license.
