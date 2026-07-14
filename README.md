# Meridian | SpectrumOS workshop starter

Welcome. This is Meridian, a small, safe demo banking dashboard. During the workshop you will add real widgets to it, not by writing code yourself, but by describing what you want to SpectrumOS and driving the loop.

## What you need (should already be done before today)
- Claude Code installed (`claude --version` returns a version).
- SpectrumOS installed (`/spec-progress` responds inside Claude Code).
- This repo cloned.
- Node.js installed (`node -v` returns a version), used to run the tooling and preview the app.

If any of those do not work, tell a facilitator now. Do not spend the session fighting setup.

## Install SpectrumOS (bundled)
SpectrumOS ships with this repo, in `vendor/`. From this folder, install it once:
```
npm install -g ./vendor/spectrum-os-2.0.3.tgz
spectrum-os
```
The second command wires the `/spec-*` commands into Claude Code. Confirm with `/spec-progress`.

## Run the app locally
Meridian is a React + TypeScript app built with Vite. From the `starter-repo` folder, install once, then start the dev server:
```
npm install
npm run dev
```
Open the address it prints (for example http://localhost:5173). You will see the Meridian dashboard: balances, recent activity, spend by category, savings goal, and quick actions. Vite hot-reloads, so the tab updates as the code changes.

To preview the production build instead:
```
npm run build
npm run preview   # also on http://localhost:5173
```

## How the app is built (three contracts)
The app is a thin React shell over three contracts, and the assistant follows all three:
- `dls/` the design system (tokens + components). React components are thin wrappers that emit the `mrdn-` markup, so widgets come out on brand.
- `data/` a mock API in `data/api.ts` (typed, JSON shaped like a real bank). Widgets show real-looking data; swap the seam for a live backend later.
- `tests/` a responsive test (Playwright). Widgets must work on mobile, tablet, and desktop.

### See the design system and switch themes
- Open the **Kitchen sink** link in the header (the `/kitchen-sink` route) for a live gallery of every token and component. The colour swatches show the real token values and update when you change theme.
- Use the **moon/sun toggle** in the header to switch light and dark. Dark mode is only token overrides, so every widget follows automatically.
- The DLS is mandatory (see `CLAUDE.md` Rule 0 and `dls/DLS-RULES.md`): the assistant builds only from DLS tokens and `mrdn-` components, and stops to ask before changing the design system itself.

## The loop you will run
1. discuss  (say what you want)
2. plan     (it proposes an approach, you approve)
3. execute  (it builds and commits)
4. verify   (it checks the work, including the responsive test)

## Your mission today
The three core widgets (recent activity, spend by category, savings goal) now ship **built** in `src/features/dashboard/`, as a working reference. To practise the SpectrumOS loop, extend the app with a stretch brief:
1. Open `FEATURE-BRIEFS.md` and pick a **Stretch** brief (filter, income vs spend, account switcher).
2. Start Claude Code: `claude`.
3. `/spec-progress` to see where the project is.
4. `/spec-quick "the brief you picked"`.
5. Read the plan. Approve it.
6. The dev server hot-reloads. See your change live.
7. `/spec-verify-work` and answer its questions.
8. `git log --oneline` to see the clean commit and the trail in `.planning/`.

You just shipped software by describing an experience.

## Run the responsive test (optional)
The repo ships a Playwright responsive test, the behaviour contract. You do not need it for the workshop; the facilitator runs it in the demo. If you want to try it:
```
npm install
npx playwright install chromium
npm run test:responsive
```
It builds the app, serves it at phone, tablet, and desktop sizes, and checks each. (Stop the dev server first, since the test binds the same port 5173.)

## Start over any time
Everything is version controlled. To return to the clean starting point:
```
git reset --hard baseline
```
(Ask a facilitator first if you are not sure.)
