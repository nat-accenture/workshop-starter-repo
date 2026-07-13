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
From the `starter-repo` folder, start a static server. Either:
```
# Node (no install):
npx serve . -l 5173

# or Python 3:
python3 -m http.server 5173
```
Open the address it prints (for example http://localhost:5173). You will see the Meridian dashboard: your balances and quick actions are already there. Keep the tab open and refresh after each change.

## How the app is built (three contracts)
You never fight the details, because the app carries its own rules and the assistant follows them:
- `dls/` the design system (tokens + components). Your widgets come out on brand.
- `data/` a mock API (JSON shaped like a real bank). Your widgets show real-looking data.
- `tests/` a responsive test (Playwright). Your widgets must work on mobile, tablet, and desktop.

## The loop you will run
1. discuss  (say what you want)
2. plan     (it proposes an approach, you approve)
3. execute  (it builds and commits)
4. verify   (it checks the work, including the responsive test)

## Your mission today
1. Open `FEATURE-BRIEFS.md` and pick ONE brief (start with #1, recent activity).
2. Start Claude Code: `claude`.
3. `/spec-progress` to see where the project is.
4. `/spec-quick "the brief you picked"`.
5. Read the plan. Approve it.
6. Refresh the browser. See your widget live.
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
It opens the dashboard at phone, tablet, and desktop sizes and checks each.

## Start over any time
Everything is version controlled. To return to the clean starting point:
```
git reset --hard baseline
```
(Ask a facilitator first if you are not sure.)
