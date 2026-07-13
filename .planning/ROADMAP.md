# ROADMAP

## Milestone: Meridian v1 (the workshop)

The foundation and shell are built. The open goal is for participants to build the dashboard widgets through the SpectrumOS loop, verified responsive.

### Phase 1: Foundation and shell  (done)
Goal: a layered, on-brand dashboard that looks real on first open.
Delivered: the DLS (design contract), the mock API (data contract), the Playwright responsive harness (behaviour contract), and the dashboard shell with the balance summary and quick actions built.
Requirements: FOUND-01 to FOUND-05.
Status: complete. This is what you cloned.

### Phase 2: Build the widgets  (this is you)
Goal: fill the three open hooks by describing them, then verify each works and stays responsive.
Requirements: one of FEAT-01 to FEAT-03 per participant (stretch: FEAT-04+).
Success: the widget renders from the mock API using DLS components, the responsive test is green, and there is a clean commit.

Most workshop work runs as `/spec-quick` tasks. The full multi-phase loop is shown in the facilitator demo.

### Phase 3: The readout  (closing demo)
Goal: generate a stakeholder deck from `.planning/`, to show that the same context that built the screen writes the report.
