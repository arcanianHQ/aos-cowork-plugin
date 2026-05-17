---
scope: int-company
---

# GTM plan — deliverable + emission templates

Companion to `SKILL.md`. The shell for `deliverables/<YYYY-MM>/gtm-plan.md` and
the `REC` artifacts emitted into `ontology/recommendations/`.

## Deliverable — `deliverables/<YYYY-MM>/gtm-plan.md`

```markdown
---
scope: int-confidential
client: <slug>
business_unit: <set for multi-BU clients>
generated_by: aos-plan
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
horizon: <this-month | quarter>
sources_consulted:
  - <path>:L<line>
  - <FND-id> / <REC-id> / <constraint-id>
status: confirmed-by-user
---

# GTM Plan — <Client Display Name>[ — <BU>] — <horizon>

> **What this is.** A prioritised GTM plan — the ranked moves that matter most
> this horizon. A draft prioritisation for you to correct, not a verdict.

## Context used

- Brand files: <…>
- Content-system files: <…>
- Open findings consulted: <FND ids — the feedback edge>
- Prior RECs consulted: <REC ids>
- Sessions: <…>

## The picture

- **Binding constraint:** <from brand/CONSTRAINT_MAP.md> — layer <Ln>
- **Open findings answered:** <FND ids + one line each>
- **Open findings deliberately not answered this horizon:** <FND ids + why>

## Prioritised moves

| # | Move | Layer | Source | Leverage | Confidence | Impact | Effort | Score |
|---|------|-------|--------|----------|------------|--------|--------|-------|
| 1 | … | L2 | FND-007 | high | high | high | med | … |
| 2 | … | L4 | constraint | … | … | … | … | … |

Show the scoring arithmetic for the top move.

## The plan — move by move

For each prioritised move:

- **REC-<id> — <move title>** `layer: <Ln>`
- Responds to: <FND-id / constraint / pillar gap>
- Do: <the move, one paragraph>
- Why now: <the leverage / confidence argument>
- Hand-off: <which skill executes it — aos-draft-content, a diagnostic, etc.>

## Deliberately not this horizon

| Candidate | Score | Why deferred |
|-----------|-------|--------------|
| … | … | low confidence — needs a diagnostic first / wrong horizon |

## What did we get wrong? What's missing?
```

## Emitted REC — `ontology/recommendations/REC-NNN-<slug>.md`

```markdown
---
id: REC-NNN
layer: <Ln>
business_unit: <set for multi-BU clients>
status: open
date: <YYYY-MM-DD>
source: aos-plan
generated_by: aos-plan
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
consumes: [<FND ids and/or prior REC ids this move responds to>]
emits: []
---

# REC-NNN — <move title>

**Do:** <the prioritised move — a direction with a clear owner skill.>
**Because:** <the finding / constraint / gap it answers; cite the source.>
**Layer:** <Ln> — <why this layer is the leverage point.>
**Hand-off:** <which skill executes — aos-draft-content / aos-diagnose-* / etc.>
```

## Emission rules

- **Dedup before emitting.** Scan `ontology/recommendations/` for an existing
  REC on the same move. Reference it, or supersede it (set the old one's
  `status: superseded`, `consumes:` it from the new REC) — never duplicate.
- **Populate `consumes:` accurately.** The `consumes:` edge — pointing at the FND
  this move responds to — is what `aos-index-ontology` walks to place the plan in
  the graph. An empty or wrong `consumes:` breaks the loop's traceability.
- Number REC ids continuing the existing sequence in `ontology/recommendations/`.
- Every REC carries `source: aos-plan` and the standard provenance block.
