---
scope: int-company
---

# Graph method — scanning the ontology and walking its edges

Companion to `SKILL.md`. The deterministic scan, parse, edge-walk, and integrity
rules used to build `ontology/INDEX.md`. Grounded in `ontology/README.md` (the
FND/REC/GOT conventions).

## The graph model

The `ontology/` zone is a knowledge graph. Its **nodes** are FND / REC / GOT
artifacts; its **edges** are the `consumes` / `emits` frontmatter fields.

| Node | Lives in | Is | Typical edges |
|------|----------|----|---------------|
| `FND-NNN` | `ontology/findings/` | what was *learned* | `consumes:` prior FNDs / RECs / Content; `emits:` left open until a plan picks it up |
| `REC-NNN` | `ontology/recommendations/` | what to *do* | `consumes:` the FND(s) it answers; `emits:` usually `[]` |
| `GOT-NNN` | `ontology/gotchas/` | a *trap* to avoid | `consumes:` the FND(s) that revealed it |

An edge `A consumes: [B]` means A was built on B. The reverse — `B emits: [A]` —
is the same edge from B's side. The two should agree; where they don't, that is
an integrity flag (see below).

## Step 1 — Scan + parse

Glob `ontology/findings/FND-*.md`, `ontology/recommendations/REC-*.md`,
`ontology/gotchas/GOT-*.md`. For each file, parse the YAML frontmatter — plain
`grep` over the `--- … ---` block is sufficient; no Node, no YAML library
required. Extract:

- `id` · `layer` · `business_unit` · `status` · `date` · `source`
- `consumes` (a list) · `emits` (a list)
- the H1 title (the line after the frontmatter starting `# `)

Tolerate a missing optional field (`business_unit`, empty `consumes`/`emits`) —
record it as empty, do not crash. A file with no parseable `id` is itself an
integrity flag ("un-indexable artifact") — list it, skip it from the graph.

## Step 2 — Node states

Classify each node:

| State | Rule |
|-------|------|
| `open` | `status: open` — live, in play |
| `actioned` | `status: actioned` — a follow-up has been taken |
| `superseded` | `status: superseded` — replaced by a newer artifact |

And, for **findings specifically**, the loop-critical derived state:

| Finding state | Rule |
|---------------|------|
| **unactioned** | an `open` FND that **no** REC `consumes:` — a learning not yet turned into a move |
| **actioned** | an FND that one or more RECs `consumes:` |

The unactioned-findings list is the **loop's feedback-edge health signal** — it
is the set of things `aos-measure` learned that `aos-plan` has not yet acted on.
Surface it prominently in `INDEX.md`.

## Step 3 — Edge walk

Build the edge set:

1. For every node, for every id in its `consumes:` list → record edge
   `(this node) ← consumes ← (that id)`.
2. For every node, for every id in its `emits:` list → record edge
   `(this node) → emits → (that id)`.
3. **Resolve** each edge id against the scanned nodes.

## Integrity checks

The walk runs these checks; each result is a flag in `INDEX.md` — **reported,
never fixed**:

- **Dangling edge** — a `consumes` / `emits` id with no node on disk. Either the
  artifact was deleted, or the id is a typo. Flag it; name the referring node.
- **Asymmetric edge** — `A consumes: [B]` but `B`'s `emits:` does not list `A`
  (or vice versa). Not fatal — `aos-measure` deliberately leaves FND `emits:`
  open — so treat an open FND leaf as *expected*, not asymmetric. Flag only a
  genuine mismatch between two artifacts that both declare the edge differently.
- **Superseded-but-referenced** — a `superseded` node still `consumes:`-ed by an
  `open` node. The open node may be building on stale knowledge. Flag it.
- **Contradiction (best-effort)** — two `open` artifacts on the same `layer` +
  `business_unit` making opposing claims (e.g. two FNDs with directly opposite
  readings of the same channel). Detection is heuristic — flag the *pair* for a
  human to resolve. **Never reconcile a contradiction** (the AOS rule: never
  auto-resolve a conflict).
- **Un-indexable artifact** — a file in an `ontology/` subfolder with no
  parseable `id`. List it.

## Counting

`INDEX.md`'s footer and summary count:

- total FND / REC / GOT, and a breakdown by `status`
- unactioned findings (the count is the headline loop-health number)
- per-layer node counts (L0–L7) — so the index doubles as a layer-coverage view
- integrity flags, by type

## Idempotency

Two runs over an unchanged `ontology/` zone produce an identical `INDEX.md`
except the `Last indexed:` date. Sort everything deterministically — nodes by id,
edges by source-id then target-id, lists by id — so the index does not churn.
