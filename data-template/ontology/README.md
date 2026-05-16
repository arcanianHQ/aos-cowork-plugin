# ontology/ — the FND / REC / GOT knowledge graph

AOS's findings, recommendations, and gotchas, stored as the engagement's knowledge graph.
This is what carries learning around the AOS loop (discover → … → measure → learn).

## Structure

- `findings/` — `FND-NNN-<slug>.md` — what a skill *learned*: a diagnosis, a
  measurement result, an observed pattern.
- `recommendations/` — `REC-NNN-<slug>.md` — what to *do* about a finding.
  Recommendations flow into `TASKS.md` as tasks.
- `gotchas/` — `GOT-NNN-<slug>.md` — **anti-patterns and known traps**: a
  recurring failure mode, what triggers it, how to avoid it. The "don't" —
  alongside FND's "learned" and REC's "do".
- `INDEX.md` — the graph view, built by the `ontology` maintenance skill.

## Artifact frontmatter

Every FND / REC / GOT carries:

```yaml
id: FND-007                    # or REC-007, GOT-007
layer: L2                      # the 7+1 layer it sits in
business_unit:                 # set for multi-BU clients
status: open                   # open · actioned · superseded
date: 2026-05-16
source: <skill name or FND/REC id>   # what emitted it
consumes: [FND-003]            # ontology edges — what it builds on
emits: [REC-009]               # what it produced
```

## How the graph stays current (operational ontology)

Cowork has no hooks, so the graph is maintained **in-skill**, not by automation:

1. **Emission** — any skill whose frontmatter `emits` an FND/REC writes the
   artifact as an explicit step (pipeline band F — deliverable + emit).
2. **Index** — the `ontology` maintenance skill (sibling of `catalogue`; to be
   built — see `docs/architecture-gaps.md` §2) scans `findings/` +
   `recommendations/`, walks the `consumes`/`emits` edges, and writes `INDEX.md`.
