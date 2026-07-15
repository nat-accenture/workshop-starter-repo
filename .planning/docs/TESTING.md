<!-- generated-by: spec-doc-writer -->
# Testing

Meridian's tests are its **behaviour contract**: a set of Playwright checks that
assert the dashboard renders and reflows correctly at mobile, tablet, and desktop
widths. There is one spec file today, `tests/responsive.spec.js`, driven by
`playwright.config.js`. There is no unit-test runner in this project (no Jest or
Vitest); everything runs through Playwright against the built application.

## Test framework and setup

The suite uses [Playwright Test](https://playwright.dev/) (`@playwright/test`,
`^1.48.0`, listed in `package.json` `devDependencies`). It runs Chromium only, to
keep the browser download small and fast on locked-down laptops.

Before the tests can run, install the project dependencies and the Chromium
browser Playwright drives:

```bash
npm install
npx playwright install chromium
```

`npm install` is only needed once (or after dependency changes).
`npx playwright install chromium` downloads the browser binary and is a one-time
first-run step per machine.

You do not need to start the app yourself. `playwright.config.js` defines a
`webServer` that builds the production bundle and serves it before the tests run:

```
npm run build && npm run preview
```

`npm run build` runs `tsc --noEmit` (a type check) followed by `vite build`, and
`npm run preview` serves the built bundle with `vite preview --port 5173
--strictPort`. Playwright waits for `http://localhost:5173` to come up, then runs
the specs against it. Because `--strictPort` is set, a port conflict fails hard
rather than falling back to another port, so **stop any running dev server on port
5173 before running the suite** (see the note under Running tests).

## Running tests

Run the full suite (all three viewports) from the project root:

```bash
npm run test:responsive
```

That is an alias for `playwright test`. It builds the app, starts the preview
server, and runs every test at mobile, tablet, and desktop.

Playwright's own CLI covers the finer-grained runs. Two npm scripts are defined
in `package.json` (`test:responsive` and `test:responsive:report`); everything
below uses `npx playwright test` directly:

```bash
# Run one viewport only (project names: mobile, tablet, desktop)
npx playwright test --project=mobile

# Run a single test by title
npx playwright test -g "shell renders"

# Run a single file
npx playwright test tests/responsive.spec.js

# Open the interactive UI runner
npx playwright test --ui
```

There is no watch-mode script; use `--ui` for an interactive, re-runnable session.

After a run, open the HTML report:

```bash
npm run test:responsive:report
```

That is an alias for `playwright show-report`.

**Port note.** Locally, `reuseExistingServer` is enabled (it is disabled only when
the `CI` environment variable is set), so if something is already serving
`http://localhost:5173`, Playwright reuses it instead of starting its own. Combined
with `--strictPort`, this means a dev server left running on 5173 will either be
reused (serving an unbuilt or stale view) or cause a port conflict. Stop the dev
server before running the suite so the tests run against a fresh production build.

## Writing new tests

Today all checks live in `tests/responsive.spec.js`. The three tests are:

1. **Shell renders** · asserts the wordmark reads `Meridian`, a "Good morning"
   heading is visible, there are exactly three `#accounts .account-card`
   elements, the balance `$8,412.90` is shown, and a `Transfer` button is present.
2. **Responsive layout** · compares the bounding boxes of the first two account
   cards. On the `mobile` project the second card sits below the first (single
   column); on `tablet` and `desktop` it sits to the right (multi-column).
3. **Screenshot capture** · saves a full-page screenshot named
   `meridian-<project>.png` per viewport for a visual readout.

Conventions to follow when adding tests:

- **File naming and language.** Specs live in `tests/` and match `*.spec.js`
  (JavaScript, CommonJS `require`, with a `// @ts-check` pragma at the top for
  type checking). Do not add TypeScript `.spec.ts` files; match the existing
  style. Extend `tests/responsive.spec.js` or add a sibling `tests/*.spec.js`
  file.
- **Use the project name to branch on viewport.** Read
  `testInfo.project.name` (`mobile`, `tablet`, or `desktop`) when a check depends
  on layout width, as the responsive-layout test does.
- **Keep the DOM anchors stable.** The suite asserts on a small set of stable
  hooks in the app. Preserve them when you change UI: the wordmark
  `.app-wordmark` (`src/components/AppBar.tsx`), the `#accounts` container and its
  `.account-card` children (`src/features/dashboard/Balances.tsx`), and the DLS
  `mrdn-` component classes. Prefer role-based locators (`getByRole`) and these
  anchors over brittle text or nth-child selectors.
- **Assert real formatted values.** Money is rendered through `formatSGD()` from
  `data/api.ts` (SGD, `en-SG`, minor units), which is why the tests assert
  `$8,412.90` rather than a raw number. Assert on the formatted output the user
  actually sees.

## Coverage requirements

No coverage threshold configured. Playwright is used here for behaviour and
layout assertions, not statement or branch coverage, and no coverage tool
(`nyc`/`c8`, Jest, Vitest) is set up in this project.

## CI integration

No CI/CD pipeline detected. There is no `.github/workflows/` directory, so the
behaviour contract runs locally rather than in an automated pipeline.

The Playwright config is nonetheless CI-aware: `reuseExistingServer` is set to
`!process.env.CI`, so if a `CI` environment variable is present, Playwright always
starts its own preview server (build then preview) rather than reusing one already
listening on port 5173. If a pipeline is added later, the entry point is
`npm run test:responsive`, preceded by `npm install` and
`npx playwright install chromium`.
