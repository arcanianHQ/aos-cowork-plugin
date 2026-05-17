---
scope: int-company
---

# Results read — deliverable + emission templates

Companion to `SKILL.md`. The shell for `deliverables/<YYYY-MM>/results.md` and the
`FND` artifacts emitted into `ontology/findings/`.

## Deliverable — `deliverables/<YYYY-MM>/results.md`

```markdown
---
scope: int-confidential
client: <slug>
business_unit: <set for multi-BU clients>
generated_by: aos-measure
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
period: <YYYY-MM>
connector_status: <databox-connected | degraded-no-databox>
sources_consulted:
  - <path>:L<line>
  - databox:<metric-or-dashboard>        # only when connected
status: confirmed-by-user
---

# Results — <Client Display Name>[ — <BU>] — <period>

> **What this is.** A measurement read of what shipped this period — the results,
> and what the engagement learned from them. A draft read for you to correct.

## Connector status

<Databox connected — metrics are [DATA].>
— or —
> **Data gap — Databox not connected.** Performance metrics could not be pulled.
> This read is qualitative: findings rest on local material and stated figures,
> and causal confidence is held low. Connect Databox via `aos-onboard` for a
> metrics-grounded re-run.

## Context used

- Catalogue + ship log: <…>
- Plan measured against: deliverables/<YYYY-MM>/gtm-plan.md
- Metrics: <Databox dashboards / metrics — or "none, see data gap">
- Sessions: <…>

## What shipped

| Piece | Channel | Shipped | Status |
|-------|---------|---------|--------|
| … | … | <date> | published |

## Results

| Piece / channel | Result | Source | Evidence | Confidence |
|-----------------|--------|--------|----------|------------|
| … | reach / engagement / CTR / conv. | databox:<…> | [DATA] | data high / causal med |

Show the arithmetic for the headline result.

## Findings

For each finding:

- **FND-<id> — <title>** `layer: <Ln>`
- What was learned: <the result and what it means>
- Evidence: `[DATA]/[OBSERVED]/…` — `<source>`
- Confidence: data <…>, causal <…>
- **Forward signal:** <what the next aos-plan / discover should do with this>

## Cross-layer suspicion

<If a result points at a structural problem (L2 positioning, L4 funnel, L6
audience): name the suspected layer as a hypothesis and recommend the relevant
`aos-diagnose-*` skill. Do not diagnose it here.>

## What did we get wrong? What's missing?
```

## Emitted FND — `ontology/findings/FND-NNN-<slug>.md`

```markdown
---
id: FND-NNN
layer: <Ln>
business_unit: <set for multi-BU clients>
status: open
date: <YYYY-MM-DD>
source: aos-measure
generated_by: aos-measure
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
consumes: [<the REC id and/or Content piece the result measured>]
emits: []
---

# FND-NNN — <results finding title>

**What was learned:** <the result, and what it means for the engagement.>
**Evidence:** `[DATA]/[OBSERVED]/…` — <source>.
**Confidence:** data <…>, causal <…>.
**Forward signal:** <what the next `aos-plan` / `discover` cycle should do with
this finding — the loop's feedback edge.>
```

## Emission rules

- **`emits:` is left open.** An `aos-measure` FND is a **leaf** — its `emits:` is
  `[]` until a future `aos-plan` run picks it up with a `consumes:` edge. This
  open leaf is exactly what `aos-index-ontology` surfaces as an *unactioned
  finding* — the loop's reminder that a finding is waiting on the next plan.
- **`consumes:` points back.** The FND `consumes:` the REC and/or the Content
  piece whose result it measured — so the graph traces result → plan move.
- **Dedup before emitting.** Scan `ontology/findings/` for an existing finding on
  the same piece / result. A result that confirms a prior FND strengthens it
  (reference it); a result that contradicts one supersedes it (set the old one's
  `status: superseded`). Never duplicate.
- Number FND ids continuing the existing sequence in `ontology/findings/`.
- Every FND carries `source: aos-measure` and the standard provenance block.
