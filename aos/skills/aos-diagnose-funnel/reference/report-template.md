---
scope: int-company
---

# Funnel diagnostic — deliverable + emission templates

Companion to `SKILL.md`. The shell for `deliverables/<YYYY-MM>/funnel-diagnostic.md`
and the FND/REC artifacts emitted into `ontology/`.

## Deliverable — `deliverables/<YYYY-MM>/funnel-diagnostic.md`

```markdown
---
scope: int-company
client: <slug>
generated_by: aos-diagnose-funnel v0.1.0
generated_date: <YYYY-MM-DD>
layer: L4
connector_status: <databox-connected | degraded-no-databox>
sources_consulted:
  - <path>:L<line>
  - databox:<metric-or-dashboard>        # only when connected
status: confirmed-by-user
---

# Funnel Diagnostic (L4) — <Client Display Name>[ — <Domain>]

> **What this is.** A focused L4 diagnostic — the conversion funnel: where it
> leaks and why. A diagnosis, not a CRO program. Findings are drafts; correct them.

## Connector status

<Databox connected — metrics are [DATA].>
— or —
> **Data gap — Databox not connected.** Funnel metrics could not be pulled.
> This diagnosis is qualitative: findings rest on local material and stated
> figures, and causal confidence is held low. Connect Databox via `aos-onboard`
> for a metrics-grounded re-run.

## Context used

- Files: <…>
- Metrics: <Databox dashboards / metrics — or "none, see data gap">
- Sessions: <…>

## Funnel map

| Stage | Value | Source | Stage-to-stage rate | Drop-off |
|-------|-------|--------|---------------------|----------|
| Reach | … | … | — | — |
| Click | … | … | …% | …% |
| Engage | … | … | …% | …% |
| Intent | … | … | …% | …% |
| Convert | … | … | …% | …% |

Show the arithmetic for the worst leak.

## Findings

For each finding:

- **FND-<id> — <title>** `layer: L4`
- Evidence: `[DATA] / [OBSERVED] / …` — `<source file:line or databox metric>`
- Data confidence: <high/med/low> · Causal confidence: <high/med/low>
- The leak: <stage>, <drop-off>, <value lost>
- Likely cause: <from the leak-pattern library>

**Worst leak:** <stage> — <one-line statement of where the funnel bleeds most>.

## Cross-layer suspicion

<If the funnel is mechanically fine but the business still does not convert,
or a leak traces deeper: name the suspected layer (L2 / L6 / L0) as a
hypothesis and recommend `aos-diagnose-7layer`. Do not diagnose it here.>

## Recommended fix directions (RECs)

| REC-<id> | Fix direction | Targets leak | Layer |
|----------|---------------|--------------|-------|
| … | … | <stage> | L4 |

These are directions, not an executed CRO program. They flow into `TASKS.md`.

## What did we get wrong? What's missing?
```

## Emitted FND — `ontology/findings/FND-NNN-<slug>.md`

```markdown
---
id: FND-NNN
layer: L4
business_unit: <set for multi-BU clients>
status: open
date: <YYYY-MM-DD>
source: aos-diagnose-funnel
consumes: [<prior FND ids, if any>]
emits: [REC-NNN]
---

# FND-NNN — <funnel finding title>

**What was learned:** <the leak, the stage, the drop-off, the likely cause.>
**Evidence:** `[DATA]/[OBSERVED]/…` — <source>.
**Confidence:** data <…>, causal <…>.
```

## Emitted REC — `ontology/recommendations/REC-NNN-<slug>.md`

```markdown
---
id: REC-NNN
layer: L4
business_unit: <set for multi-BU clients>
status: open
date: <YYYY-MM-DD>
source: aos-diagnose-funnel
consumes: [FND-NNN]
emits: []
---

# REC-NNN — <fix direction title>

**Do:** <the fix direction — a direction, not a full CRO test plan.>
**Because:** <which finding / leak it addresses.>
**Targets:** <funnel stage.>
```

## Emission rules

- **Dedup before emitting.** Scan `ontology/findings/` and
  `ontology/recommendations/` for an existing artifact on the same leak.
  Supersede (set the old one's `status: superseded`) or reference it — never
  duplicate.
- Number FND/REC ids continuing the existing sequence in each folder.
- Every artifact carries `layer: L4` and `source: aos-diagnose-funnel`.
