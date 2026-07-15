<!-- generated-by: spec-doc-writer -->
# Getting started

This guide takes you from a fresh clone to a running Meridian dashboard, a first look at what the app shows, and your first code change. Meridian is a React 18 + TypeScript single-page app built with Vite and styled entirely from the Meridian Design Language System (DLS).

## Prerequisites

You need two things installed before you start:

- **Node.js** (with npm, which ships with it). Vite 5 requires Node 18 or newer, so use Node 18+. There is no pinned version file in the repo, so any current LTS release of Node works.
- **npm.** The repo ships a `package-lock.json`, so npm is the expected package manager. Commands below use npm.

To check what you have installed:

```bash
node --version
npm --version
```

## Installation

1. Clone the repository and change into it:

   ```bash
   git clone https://github.com/kaushikdas0/workshop-starter-repo.git
   cd workshop-starter-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

That installs React, React Router, and the Vite / TypeScript / Playwright tooling. No environment variables, `.env` file, or external services are needed: all data is mocked in-repo.

## First run

Start the Vite dev server:

```bash
npm run dev
```

Vite serves the app on **http://localhost:5173** with hot reload, so the browser updates as you edit. Open that URL. (The port is fixed: `vite.config.ts` sets `strictPort`, so if 5173 is taken, Vite exits instead of picking another port. See Common setup issues below.)

### What you see on first load

The app opens on the dashboard route (`/`). At the top is a greeting, "Good morning, Alex", and the line "Here is your money at a glance." Below that is a responsive grid of widgets, each one built from DLS components:

- **Balances** (full width) across the top: your account balances.
- **Recent activity**: the latest transactions.
- **Quick actions**: shortcut buttons.
- **Spend by category**: where the money went.
- **Savings goal**: progress toward a target, with a progress bar.

Each widget loads its data from the mock API and shows a loading skeleton first, so a brief placeholder state before the numbers appear is expected. The grid collapses to a single column on narrow screens.

### The two routes

Meridian has two routes, both served by the single-page shell:

- **`/`** the dashboard (above).
- **`/kitchen-sink`** a live DLS gallery showing every design token and component. The colour swatches render the real token values, so it is the fastest way to see what the design system offers. Reach it from the "Kitchen sink" link in the header.

### Switching theme

Use the **moon / sun toggle** in the header to switch between light and dark mode. Your choice is remembered across visits (stored in the browser under `meridian-theme`) and applied before the page paints, so there is no flash of the wrong mode. Before you have chosen, the app follows your operating system's light / dark setting. For the full mechanism, see [docs/CONFIGURATION.md](CONFIGURATION.md).

## Make your first change

Every widget lives in `src/features/dashboard/` and is styled only through the DLS: DLS token variables and `mrdn-` components, never raw colours or pixel values. A good, self-contained first edit is `src/features/dashboard/SavingsGoal.tsx`.

1. With `npm run dev` still running, open `src/features/dashboard/SavingsGoal.tsx`.
2. Find the caption near the bottom of the card:

   ```tsx
   <span className="app-caption">{formatSGD(remaining)} to go</span>
   ```

3. Change the copy, for example to `{formatSGD(remaining)} left to save`, and save the file. The browser hot-reloads and the Savings goal card updates immediately.

That is the whole loop: edit a widget, save, see it live. Because the card is composed from DLS pieces (`Card`, `Progress`, `Pill`, `Stack`) and money is formatted with `formatSGD()`, your change stays on brand automatically.

If you want to adjust the look rather than the copy, reach for an existing token or `mrdn-` component instead of writing a literal value. The tokens are defined in `dls/tokens.css` (spacing such as `--space-4`, radii such as `--radius-md`, colours such as `--color-primary`), and the component classes in `dls/components.css`. Note that editing files under `dls/` changes the design system itself and is a gated change under this project's rules, so prefer composing from what already exists.

## Building and previewing a production bundle

To produce and inspect the built app rather than the dev server:

```bash
npm run build     # type-checks with tsc, then builds the static bundle into dist/
npm run preview   # serves the built bundle on http://localhost:5173
```

## Running the responsive test

Meridian ships a Playwright behaviour contract that checks the dashboard at phone (390x844), tablet (768x1024), and desktop (1280x800) widths in Chromium. The first time you run it, install the browser:

```bash
npx playwright install chromium
```

Then run the suite:

```bash
npm run test:responsive
```

The test builds the app and serves it on port 5173, so **stop the dev server first** (the test shares that port). After a run, open the HTML report with `npm run test:responsive:report`.

## Common setup issues

- **Port 5173 already in use.** Vite is configured with `strictPort`, so `npm run dev` and `npm run preview` will not fall back to another port. If something is already on 5173, the command exits with an error. Stop the other process (or the running dev server) and try again.
- **`npm run test:responsive` fails to launch a browser.** Playwright needs its Chromium binary installed once: run `npx playwright install chromium`, then re-run the test.
- **The responsive test cannot bind the port.** The test starts its own server on 5173. If your dev server is still running, they collide. Stop `npm run dev` before running the test.
- **`node`/`npm` not found, or an old Node version.** Install a current LTS Node (18+) so Vite and the TypeScript tooling run cleanly, then re-run `npm install`.

## Next steps

- **[README.md](../../README.md)** project overview, scripts, and the three-contract model (design, data, behaviour).
- **[docs/ARCHITECTURE.md](ARCHITECTURE.md)** how the app is structured and how the pieces fit together.
- **[docs/CONFIGURATION.md](CONFIGURATION.md)** build/tooling config and the theme mechanism in detail.
