# PROJECT: Meridian dashboard

## Core value
Meridian is a retail bank. This is the customer dashboard, a calm, trustworthy view of "my money today": balances, recent activity, spending, and savings goals. It should feel clear, safe, and quietly premium.

## What this project is (for the workshop)
The app layer of a deliberately layered demo, built with SpectrumOS. Participants add real dashboard widgets by describing them, and see the full discuss to plan to execute to verify loop. Everything is mocked. No real bank, no real backend.

## The layers (context for every change)
- Design contract: `dls/` (tokens, components, DLS-RULES.md). Output stays on brand.
- Data contract: `data/` (JSON shaped like a real API, DATA-CONTRACT.md). Output uses the real shape.
- Behaviour contract: `tests/` (Playwright responsive suite). Output works at mobile, tablet, and desktop.
- App: `index.html`, `styles.css`, `app.js` compose the three.

## Stack
- Plain HTML, CSS, and ES module JavaScript. No framework, no build step.
- Mock API is local JSON read through `data/api.js` (the one seam to a real backend).
- Playwright for responsive verification (Chromium).
- Preview with any static server (`npx serve` or `python3 -m http.server`).

## Principles
- Readable. A non-engineer should be able to follow what changed.
- Use the contracts: tokens not raw values, the API shape not ad hoc data, and it must pass the responsive test.
- Small, atomic changes, each verified against the request.
- **DLS is mandatory (Rule 0).** Every change is built from `dls/` tokens and `mrdn-` components. Changing the DLS itself, or deviating from it (raw values, one-off styles), is a breaking change that must stop and get explicit human confirmation. See `CLAUDE.md` and `dls/DLS-RULES.md`.

## Out of scope for the workshop
- Real backend, auth, payments, deployment.
- New pages or routing.
- Anything not visible on a browser refresh.
