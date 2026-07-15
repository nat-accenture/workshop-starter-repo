# PROJECT: Meridian dashboard

## What This Is
Meridian is a retail bank's customer dashboard: a production-grade **React 18 + TypeScript** single-page app built with **Vite**. It shows a calm, trustworthy view of "my money today", the balances, recent activity, spending, and savings goals, and is built on three contracts (design, data, behaviour). Everything is mocked; there is no real bank and no backend.

It began as a deliberately layered vanilla-HTML demo and was rebuilt as a React + TypeScript app, then given a lean, on-brand design system.

## Core Value
A clear, safe, quietly premium view of a customer's money. Every screen is composed only from the Meridian Design Language System, reads real-shaped data through one typed seam, and works responsively on mobile, tablet, and desktop. A non-engineer should be able to follow what changed.

## Requirements
The full list lives in `REQUIREMENTS.md`. In brief:
- **FOUND-01..05** (delivered): the layered foundation, the DLS, the mock API, the responsive harness, the dashboard shell with balances and quick actions.
- **FEAT-01..03** (delivered): the dashboard widgets, recent activity, spend by category, and the savings goal, built from the mock API using DLS components.
- **FEAT-04..06** (candidate/stretch): category filter, income-vs-spend, account switcher.

## Stack
- React 18 + TypeScript (strict), built with Vite. Two routes: `/` (dashboard) and `/kitchen-sink` (a live DLS gallery), via react-router.
- **Design contract**: `dls/` (`tokens.css` + `components.css`). React wrappers in `src/dls/` emit the `mrdn-` markup and add no styling of their own.
- **Data contract**: `data/api.ts`, one typed seam over local JSON fixtures (`getAccounts` / `getTransactions` / `getCategories` / `formatSGD`).
- **Behaviour contract**: `tests/responsive.spec.js` (Playwright, Chromium, mobile/tablet/desktop).
- Reference documentation lives in `.planning/references/`. Run with `npm run dev`; verify with `npm run test:responsive`.

## Principles
- **The DLS is mandatory (RULE 0).** Build only from `dls/` tokens and `mrdn-` components. Changing the DLS itself, or deviating from it (raw hex/px, one-off styles), is a breaking change that must stop and get explicit human confirmation. See `CLAUDE.md` and `dls/DLS-RULES.md`.
- **Money** is SGD, `en-SG`, stored in minor units; always format with `formatSGD()` from `data/api.ts`.
- **Accessibility and responsiveness are table stakes**; motion is tokenised and respects `prefers-reduced-motion`.
- **Prototypes and sketches** live in `prototype/` and are built from the DLS (RULE 1).
- Small, atomic changes, each verified against the request.

## Out of scope
- Real backend, auth, payments, deployment.
- Anything not visible on a browser refresh.
