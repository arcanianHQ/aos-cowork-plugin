---
scope: int-company
---

# Lifecycle diagnostic — deliverable + emission templates

Companion to `SKILL.md`. The shell for `deliverables/<YYYY-MM>/lifecycle-diagnostic.md`
and the FND/REC artifacts emitted into `ontology/`.

## Deliverable — `deliverables/<YYYY-MM>/lifecycle-diagnostic.md`

```markdown
---
scope: int-company
client: <slug>
generated_by: aos-diagnose-lifecycle v0.1.0
generated_date: <YYYY-MM-DD>
layer: L5
connector_status: <hubspot-connected | degraded-no-hubspot>
sources_consulted:
  - <path>:L<line>
  - hubspot:<report-or-object>           # only when connected
status: confirmed-by-user
---

# Lifecycle Diagnostic (L5) — <Client Display Name>[ — <Domain>]

> **What this is.** A focused L5 diagnostic — the post-acquisition customer
> lifecycle: retention, list health, where the relationship leaks. A diagnosis,
> not an email program. Findings are drafts; correct them.

## Connector status

<HubSpot connected — CRM metrics are [DATA].>
— or —
> **Data gap — HubSpot not connected.** CRM / lifecycle metrics could not be
> pulled. This diagnosis is qualitative: findings rest on local material and
> stated figures, and causal confidence is held low. Connect HubSpot via
> `aos-onboard` for a CRM-grounded re-run.

## Context used

- Files: <…>
- Metrics: <HubSpot reports / objects — or "none, see data gap">
- Sessions: <…>

## Lifecycle map

| Stage | Count / rate | Source | Flow to next | Notes |
|-------|--------------|--------|--------------|-------|
| New | … | … | …% | … |
| Onboarding | … | … | …% | … |
| Active | … | … | …% | … |
| At-risk | … | … | …% | … |
| Dormant | … | … | …% | … |
| Churned | … | … | — | … |

## List health

| Metric | Value | Source | Band | Read |
|--------|-------|--------|------|------|
| Deliverable share | …% | … | … | … |
| Engaged share | …% | … | … | … |
| Dormant share | …% | … | … | … |
| Unsubscribe rate | …% | … | … | … |

Show the retention-curve arithmetic for the worst leak.

## Findings

For each finding:

- **FND-<id> — <title>** `layer: L5`
- Evidence: `[DATA] / [OBSERVED] / …` — `<source file:line or hubspot report>`
- Data confidence: <high/med/low> · Causal confidence: <high/med/low>
- The leak: <stage / list segment>, <rate>, <value lost>
- Likely cause: <from the leak-pattern library>

**Worst leak:** <stage or segment> — <one-line statement of where the lifecycle bleeds most>.

## Cross-layer suspicion

<If retention fails no matter the nurture, or a leak traces deeper: name the
suspected layer (L3 / L6 / L2) as a hypothesis and recommend
`aos-diagnose-7layer`. Do not diagnose it here.>

## Recommended fix directions (RECs)

| REC-<id> | Fix direction | Targets leak | Layer |
|----------|---------------|--------------|-------|
| … | … | <stage/segment> | L5 |

These are directions, not an executed email program. They flow into `TASKS.md`.

## What did we get wrong? What's missing?
```

## Emitted FND — `ontology/findings/FND-NNN-<slug>.md`

```markdown
---
id: FND-NNN
layer: L5
business_unit: <set for multi-BU clients>
status: open
date: <YYYY-MM-DD>
source: aos-diagnose-lifecycle
consumes: [<prior FND ids, if any>]
emits: [REC-NNN]
---

# FND-NNN — <lifecycle finding title>

**What was learned:** <the leak, the stage / segment, the rate, the likely cause.>
**Evidence:** `[DATA]/[OBSERVED]/…` — <source>.
**Confidence:** data <…>, causal <…>.
```

## Emitted REC — `ontology/recommendations/REC-NNN-<slug>.md`

```markdown
---
id: REC-NNN
layer: L5
business_unit: <set for multi-BU clients>
status: open
date: <YYYY-MM-DD>
source: aos-diagnose-lifecycle
consumes: [FND-NNN]
emits: []
---

# REC-NNN — <fix direction title>

**Do:** <the fix direction — a direction, not a full email program plan.>
**Because:** <which finding / leak it addresses.>
**Targets:** <lifecycle stage or list segment.>
```

## Emission rules

- **Dedup before emitting.** Scan `ontology/findings/` and
  `ontology/recommendations/` for an existing artifact on the same leak.
  Supersede (set the old one's `status: superseded`) or reference it — never
  duplicate.
- Number FND/REC ids continuing the existing sequence in each folder.
- Every artifact carries `layer: L5` and `source: aos-diagnose-lifecycle`.
- Aggregate only — never write individual CRM contacts into an artifact.
