---
scope: int-company
---

# INDEX.md — the ontology graph-view template

Companion to `SKILL.md`. The shell for `ontology/INDEX.md`. `INDEX.md` is a
**rebuilt index**, not a generated client artifact — it carries no provenance
block, only its own footer.

## `ontology/INDEX.md`

```markdown
# Ontology index — <Client Display Name>

> The graph view of the engagement's knowledge — findings (what was learned),
> recommendations (what to do), gotchas (what to avoid). Built by the
> **`aos-index-ontology`** skill — re-run after FND / REC / GOT artifacts change.
> This is how learning is carried around the AOS loop — see `docs/the-loop.md`.

## Summary

| Artifact | Total | open | actioned | superseded |
|----------|-------|------|----------|------------|
| FND — findings | … | … | … | … |
| REC — recommendations | … | … | … | … |
| GOT — gotchas | … | … | … | … |

By layer: L0 … · L1 … · L2 … · L3 … · L4 … · L5 … · L6 … · L7 …

## Unactioned findings — the loop's feedback edge

> Open findings that **no recommendation consumes yet** — things `aos-measure`
> (or a diagnostic) learned that the next `aos-plan` has not turned into a move.
> An empty list means the loop is closed; a non-empty list is the planner's
> in-tray.

| FND | Title | Layer | Source | Date |
|-----|-------|-------|--------|------|
| FND-… | … | L… | aos-measure | … |

_(or: "None — every open finding has a recommendation consuming it.")_

## Findings → recommendations edge map

One block per open finding, showing what consumes it.

### FND-NNN — <title>  ·  layer L…  ·  status open
- Consumed by: REC-NNN (<title>) · REC-NNN (<title>)   — or "— not yet consumed"
- Builds on: FND-NNN · REC-NNN                          — its own `consumes:`

## Recommendations

| REC | Title | Layer | Status | Consumes | Source |
|-----|-------|-------|--------|----------|--------|
| REC-… | … | L… | open | FND-… | aos-plan |

## Gotchas

| GOT | Title | Layer | Status | From | Source |
|-----|-------|-------|--------|------|--------|
| GOT-… | … | L… | open | FND-… | … |

## Superseded chains

| Superseded | Replaced by | When |
|------------|-------------|------|
| FND-… | FND-… | … |

## Integrity flags

> Reported for a human to resolve — `aos-index-ontology` never fixes the graph.

- **Dangling edges:** <node X `consumes:` FND-NNN — no such artifact on disk> — or "none"
- **Superseded-but-referenced:** <open node X builds on superseded FND-NNN> — or "none"
- **Possible contradictions:** <FND-A and FND-B, same layer, opposing claims — review> — or "none"
- **Un-indexable artifacts:** <files with no parseable id> — or "none"

---
Last indexed: <YYYY-MM-DD>  ·  <N> FND  ·  <N> REC  ·  <N> GOT  ·  <N> unactioned findings
```

## Empty-state index

When `ontology/findings/` and `ontology/recommendations/` are both empty (a fresh
or early-stage engagement), write a minimal `INDEX.md`:

```markdown
# Ontology index — <Client Display Name>

> Built by `aos-index-ontology`. No findings or recommendations have been emitted
> yet — run a diagnostic (`aos-diagnose-*`), `aos-analyze-gtm`, `aos-plan`, or
> `aos-measure` to populate the ontology graph, then re-run this skill.

---
Last indexed: <YYYY-MM-DD>  ·  0 FND  ·  0 REC  ·  0 GOT  ·  0 unactioned findings
```

## Rules

- `INDEX.md` pre-exists in some data folders — **Read it before rewriting with
  `Edit`**; only `Write` it if genuinely missing.
- Sort every table deterministically (by id) so the index does not churn between
  runs over an unchanged graph.
- Counts in the footer must match the Summary table — they are the same numbers.
