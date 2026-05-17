---
scope: int-company
---

# Team JTBD map — deliverable + FND emission templates

Companion to `aos-map-jtbd/SKILL.md`. The shell for
`deliverables/<YYYY-MM>/team-jtbd-map.md` and the process-gap `FND` format.

## Deliverable — `deliverables/<YYYY-MM>/team-jtbd-map.md`

```markdown
---
scope: int-confidential
client: <slug>
business_unit: <set for multi-BU clients — or blank>
generated_by: aos-map-jtbd
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
status: confirmed-by-user
---

# Team JTBD map — <Client Display Name>[ — <BU>]

> **What this is.** How the GTM team actually works — each role's job, what it
> takes in, what it puts out — and where the process between roles breaks. A
> survey-based draft for the team to correct.

## Roles surveyed

| Role | The job (one line) | Cadence | Tools / surfaces |
|------|--------------------|---------|------------------|
| … | … | … | … |

## The input → output chain

For each role:

### <Role>
- **Job:** <one line>
- **Inputs:** <input> ← <supplying role> · <input> ← <supplying role>
- **Outputs:** <output> → <consuming role> · <output> → <consuming role>
- **Hand-off health (own view):** "<verbatim>"

## Process gaps

| # | Gap type | Between | Observation | Severity | Known/managed? |
|---|----------|---------|-------------|----------|----------------|
| 1 | orphan output / missing input / unowned job / bottleneck / broken hand-off / cadence mismatch | <role> → <role> | <what is observed> | high / med / low | yes (managed) / no (→ FND) |

## What did we get wrong? What's missing?

<Which roles were not surveyed? Which inputs/outputs are still "not yet
surveyed"? Where do two roles' accounts still disagree?>
```

## Emitted FND — `ontology/findings/FND-NNN-<slug>.md`

One per **unaddressed** process gap. A known, managed gap stays in the map only.

```markdown
---
id: FND-NNN
layer: <the layer the gap most affects — or "all" if cross-layer>
business_unit: <set for multi-BU clients>
status: open
date: <YYYY-MM-DD>
source: aos-map-jtbd
generated_by: aos-map-jtbd
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
consumes: []
emits: []
---

# FND-NNN — <process gap title>

**What was learned:** <the gap — its type, the two roles it sits between, and
what it blocks or delays.>
**Evidence:** the team JTBD survey — <which roles' answers>.
**Severity:** <high / medium / low> — <why>.
**Forward signal:** <what the next `aos-plan` cycle should do — close the gap by
assigning the unowned job, supplying the missing input, etc. A process gap is a
planning input, often the highest-leverage one.>
```

## Emission rules

- **One FND per unaddressed gap.** A managed gap is not emitted.
- **`emits:` is left open** — an `aos-map-jtbd` FND is a leaf until `aos-plan`
  picks it up; `aos-index-ontology` surfaces it as an unactioned finding.
- **Dedup** — scan `ontology/findings/` before emitting; a gap already on file
  is referenced or strengthened, not duplicated.
- Number FND ids continuing the existing sequence in `ontology/findings/`.
