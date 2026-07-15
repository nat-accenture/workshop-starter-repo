<!-- generated-by: spec-doc-writer -->
# Configuration

Meridian is a fully self-contained, statically served single-page app (React 18 + TypeScript, built with Vite). It has **no `.env` files, no environment-variable configuration for the application itself, no secrets, and no external services** — all data is mocked in-repo. Its configuration surface is therefore the build/tooling config files that ship with the repo, plus a small amount of runtime user preference (theme) stored in the browser.

## Environment variables

The application code reads **no** environment variables. There is no `.env`, `.env.example`, or per-environment env file in the repository, and application source uses no `import.meta.env` values.

The only environment variable read anywhere in the repo is used by the test tooling:

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `CI` | Optional | unset | Read in `playwright.config.js` (`reuseExistingServer: !process.env.CI`). When set (truthy), Playwright always starts its own server for the responsive test run instead of reusing an already-running server on port 5173. Locally (unset) it reuses an existing server if one is up. |

No variable causes the application to fail on startup, because the app consumes none.

## Config file format

Configuration lives in a small set of files at the project root. All are checked into the repo.

### `vite.config.ts`

Vite build and dev-server configuration.

| Key | Purpose |
| --- | --- |
| `plugins` | Enables `@vitejs/plugin-react` (React Fast Refresh / JSX transform). |
| `server` | Dev server: `port: 5173`, `strictPort: true`. |
| `preview` | Production-preview server: `port: 5173`, `strictPort: true`. |

Both the dev server and the preview server are pinned to port `5173` so the Playwright behaviour contract points at one stable origin.

```ts
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true },
});
```

### `tsconfig.json`

TypeScript compiler configuration. Type-checking only (`noEmit: true`); Vite handles the actual transpilation.

| Key | Value / Purpose |
| --- | --- |
| `target` / `lib` | `ES2020`, with `DOM` and `DOM.Iterable`. |
| `module` / `moduleResolution` | `ESNext` / `bundler`. |
| `jsx` | `react-jsx` (automatic runtime, no `React` import needed). |
| `strict` | `true` — full strict type-checking. |
| `noUnusedLocals` / `noUnusedParameters` | `true` — unused code is a compile error. |
| `noFallthroughCasesInSwitch` | `true`. |
| `resolveJsonModule` / `isolatedModules` / `esModuleInterop` / `skipLibCheck` | Module and interop settings. |
| `include` | `["src", "data", "vite.config.ts"]`. |

### `playwright.config.js`

Configuration for the responsive behaviour test suite.

| Key | Value / Purpose |
| --- | --- |
| `testDir` | `./tests`. |
| `timeout` / `expect.timeout` | `30000` ms per test / `5000` ms per assertion. |
| `reporter` | `list` plus `html` (report written, not auto-opened). |
| `use.baseURL` | `http://localhost:5173`. |
| `use.screenshot` | `only-on-failure`. |
| `projects` | Three Chromium projects: `mobile` (390x844, touch), `tablet` (768x1024), `desktop` (1280x800). |
| `webServer.command` | `npm run build && npm run preview` — builds the app and serves the production bundle before tests run. |
| `webServer.url` | `http://localhost:5173`. |
| `webServer.reuseExistingServer` | `!process.env.CI` (see the `CI` variable above). |
| `webServer.timeout` | `120000` ms to allow the build + preview to come up. |

### `.gitignore`

Excludes generated and local artifacts from version control: `node_modules/`, `dist/`, `test-results/`, `playwright-report/`, `playwright/.cache/`, `.DS_Store`, and `*.log`.

## Required vs optional settings

There are **no required environment variables** — the app starts with none set.

The one genuine hard requirement comes from Vite's `strictPort: true` in `vite.config.ts`:

- Port **5173 must be free** when you run `npm run dev`, `npm run serve`, or `npm run preview`. With `strictPort` enabled, Vite does **not** fall back to another port — if 5173 is already in use, the command exits with an error rather than choosing a different port. Free the port (or stop the other process) and re-run.

Everything else has a working default and is optional.

## Defaults

| Setting | Default | Where it is set |
| --- | --- | --- |
| Dev / preview server port | `5173` | `vite.config.ts` (`server.port`, `preview.port`); also hard-coded in `playwright.config.js` (`PORT`) and `package.json` `preview` script (`--port 5173 --strictPort`). |
| Playwright test-server reuse | Reuse existing server when `CI` is unset | `playwright.config.js` (`reuseExistingServer: !process.env.CI`). |
| Active theme | The OS setting (`prefers-color-scheme`), falling back to **light** when no OS preference and no stored choice exist | `src/theme/ThemeProvider.tsx` (`initialTheme` / `systemPrefersDark`) and the pre-paint script in `index.html`. |

## Theme configuration (runtime user preference)

Theme is the one piece of user-facing configuration, and it is a **runtime** setting stored in the browser — not a build-time or environment setting. Light and dark are both supported.

- **Storage key:** the chosen theme is persisted in `localStorage` under the key `meridian-theme`, with the value `"light"` or `"dark"` (see `src/theme/ThemeProvider.tsx`, `STORAGE_KEY`).
- **Applied via attribute:** the active theme is reflected onto the `<html>` element as `data-theme="light"` or `data-theme="dark"`.
- **Resolution order** (in `ThemeProvider`'s `initialTheme`): the `data-theme` attribute already set on `<html>`, then the stored `meridian-theme` choice, then the OS `prefers-color-scheme` setting, defaulting to light.
- **No-flash init:** a small inline script in `index.html` sets `data-theme` before first paint (reading `meridian-theme` from `localStorage` and the OS preference) so the page does not flash the wrong mode; the React `ThemeProvider` picks that attribute up on mount.
- **Live OS following:** while the user has made no explicit choice, the app follows the OS `prefers-color-scheme` setting live. Once the user toggles the theme, that stored choice takes precedence.

Dark mode itself is not configured through code paths — it is expressed purely as `[data-theme="dark"]` token overrides in `dls/tokens.css`. Changing those token values is a change to the design system, not a per-app configuration knob, and is governed by the project's design-system rules; it should not be treated as a routine configuration change.

## Per-environment overrides

There are **no** `.env.development`, `.env.production`, or `.env.test` files, and no `NODE_ENV`-based configuration branching in the app. Differences between "development" and "production" come entirely from which command you run:

| Mode | Command | Behaviour |
| --- | --- | --- |
| Development | `npm run dev` (alias: `npm run serve`) | Vite dev server on port 5173 with Hot Module Replacement; source served directly. |
| Production build | `npm run build` | `tsc --noEmit` type-check, then `vite build` emits the static bundle to `dist/`. |
| Production preview | `npm run preview` | Serves the built `dist/` bundle on port 5173 (`--port 5173 --strictPort`). |
| Responsive tests | `npm run test:responsive` | Runs Playwright, which itself builds and previews the app (`npm run build && npm run preview`) before testing. The `CI` variable toggles whether it reuses an already-running server. |

Because the app ships as a static bundle with mocked data, deploying to a different environment does not require any additional configuration — the same `dist/` output runs anywhere it is served.
