# prototype/

Throwaway UI prototypes and `/spec-sketch` mockups live here (not in
`.planning/sketches/`). This is the home for design exploration before it
becomes real UI.

The rules for this folder are **RULE 1** in [`../CLAUDE.md`](../CLAUDE.md):

- `/spec-sketch` builds everything under `prototype/` in every mode.
- Every prototype is built from the DLS: from each sketch
  (`prototype/NNN-name/index.html`) link `../../dls/tokens.css` and
  `../../dls/components.css`, and compose from `mrdn-` components and tokens. No
  bespoke theme, no raw hex/px, no theme switcher. Light/dark is `[data-theme]`
  on `<html>`.
- If the DLS is missing, or a prototype needs a token/component the DLS does not
  have, the assistant **stops and asks** before inventing anything (Rule 0).

Prototypes are disposable. Real UI is built per the three contracts in `dls/`,
`data/`, and `tests/`.
