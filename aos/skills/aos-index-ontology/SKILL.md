---
name: aos-index-ontology
description: "Index the ontology knowledge graph. Sibling of aos-catalogue — scans ontology/findings/ + ontology/recommendations/ (+ gotchas/), walks the consumes/emits edges, and writes ontology/INDEX.md: the graph view that shows what was learned, what to do, what is still unactioned, and how the loop's findings connect. Trigger on 'index the ontology', 'rebuild the ontology graph', 'what have we learned', or after FND/REC artifacts change."
scope: int-company
flavor: [company, advanced, internal]
class: reading
domain: discovery
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit]
args-hint: "(no args — operates on the granted folder's ontology/ zone)"
inputs:
  - ontology/findings/FND-*.md
  - ontology/recommendations/REC-*.md
  - ontology/gotchas/GOT-*.md
  - ontology/README.md (the FND/REC/GOT conventions)
outputs:
  - ontology/INDEX.md (the graph view — built / refreshed by this skill)
preflight: []
ontology:
  consumes: [FND, REC, GOT]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: false
tags: [ontology, reading, index, knowledge-graph, loop]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve the `ontology/` zone per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

`aos-index-ontology` is the **ontology maintenance skill** — the sibling of
`aos-catalogue`. Where `aos-catalogue` indexes the `inbox/` and `content/` working
zones, this skill indexes the `ontology/` knowledge graph: it scans
`ontology/findings/`, `ontology/recommendations/`, and `ontology/gotchas/`, walks
the `consumes` / `emits` edges declared in each artifact's frontmatter, and writes
`ontology/INDEX.md` — the graph view.

This is the mechanism that **operationalises the ontology** (architecture-gaps
§2). Skills declare `ontology: consumes/emits` and emit FND/REC/GOT artifacts —
but nothing *maintains* the graph; the operator world used hooks, which are dead
in Cowork. The graph is therefore maintained **in-skill**: each artifact-producing
skill emits its artifact (pipeline band F), and this skill walks the result into
an index. Re-run it after FND/REC/GOT artifacts change.

**Why it matters to the loop.** `aos-measure` emits findings into
`ontology/findings/`; `aos-plan` reads them as a planning input. `INDEX.md` is
what makes that edge *visible* — it surfaces every **unactioned finding** (an FND
with no REC consuming it) so a measured learning never silently fails to reach
the next plan. The index is how learning is *carried* around the loop. See
`docs/the-loop.md`.

**Anti-goal.** This skill **reads and indexes only**. It never writes, edits,
moves, or deletes an FND / REC / GOT artifact, and it never resolves a
contradiction between artifacts — it *reports* contradictions for a human to
resolve. It is the `class: reading` counterpart to the `class: intelligence`
skills that emit the artifacts.

## Posture

Discovery, not pronouncement. The index is a faithful view of the graph as it
stands — it does not editorialise. Where the graph is incoherent (a dangling
edge, an unactioned finding, a contradiction), the index **flags** it plainly for
a human; it does not silently fix it.

## Arguments

This skill operates on the **granted folder**'s `ontology/` zone — no arguments.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest. Resolve the `ontology/` zone.
2. If the `ontology/` zone is absent, the folder hasn't been onboarded — suggest `aos-onboard`. If `ontology/` exists but `findings/` and `recommendations/` are empty, write an empty-state `INDEX.md` (nothing learned yet) and stop.

### Step 1 — Scan the artifacts

Scan every `FND-*.md`, `REC-*.md`, and `GOT-*.md` under `ontology/findings/`,
`ontology/recommendations/`, and `ontology/gotchas/`. For each artifact, read its
frontmatter: `id`, `layer`, `business_unit`, `status`, `date`, `source`,
`consumes`, `emits`, plus the title. Plain `grep` over the frontmatter is
sufficient — no Node required. The scan + parse rules are in
`reference/graph-method.md`.

### Step 2 — Walk the edges

Build the graph from the `consumes` / `emits` edges — the edge-walk algorithm,
the node states, and the integrity checks are in `reference/graph-method.md`. The
walk produces:

- **Edges** — every `consumes` / `emits` link between artifacts.
- **Unactioned findings** — an open FND that no REC `consumes:` (a learning that
  has not yet reached a plan). This is the loop's key health signal.
- **Actioned findings** — an FND that one or more RECs consume.
- **Dangling edges** — a `consumes` / `emits` reference to an id that does not
  exist on disk. An integrity flag.
- **Superseded chains** — artifacts marked `status: superseded` and what replaced
  them.
- **Contradictions** — two open artifacts making opposing claims (best-effort —
  flagged for a human, never resolved).

### Step 3 — Write the index

Write `ontology/INDEX.md` using `reference/index-template.md`. `INDEX.md`
pre-exists in some folders and not others: **Read it first if it exists, then
rewrite with `Edit`**; only `Write` it if genuinely missing (the
`aos-catalogue` rule — a blind `Write` over an un-Read file is refused by the
harness). The index records: a per-layer summary, the findings→recommendations
edge map, the unactioned-findings list (the loop signal), the integrity flags,
and a footer (`Last indexed: <date> · <N> FND · <N> REC · <N> GOT`).

## Output Sections

User-facing summary at end of run:

- Counts — FND / REC / GOT, by status
- Unactioned findings — the count and the list (the loop's feedback-edge health)
- Integrity flags — dangling edges, contradictions, if any
- Index path
- **What did we get wrong? What's missing?**

## Provenance

`ontology/INDEX.md` is a **rebuilt index**, not a generated client artifact —
like `content/CATALOGUE.md` and `inbox/CATALOGUE.md`, it does not carry the
standard provenance block. It carries only its own footer
(`Last indexed: <date> · counts`). The FND / REC / GOT artifacts it indexes
*do* carry the provenance block — written by the skills that emit them.

## Hard Rules

1. **Read-and-index only.** Never write, edit, move, or delete an FND / REC / GOT artifact. This skill only produces `INDEX.md`.
2. **Never resolve a contradiction.** Two artifacts making opposing claims are *flagged* in the index for a human — never silently reconciled. (Mirrors the AOS rule: never auto-resolve a conflict.)
3. **Faithful view.** The index reflects the graph as it stands — dangling edges and unactioned findings are shown, not hidden.
4. **`INDEX.md` Read-before-rewrite.** If `INDEX.md` exists, Read it before rewriting with `Edit` — a blind `Write` over an un-Read file is refused by the harness.
5. **Single client.** Operate only within the granted folder's `ontology/` zone; never reach outside it.
6. **Idempotent.** Re-running on an unchanged graph produces an identical `INDEX.md` (bar the `Last indexed` date).

## Integration

- **Upstream:** every artifact-emitting skill — `aos-measure` (FND), `aos-plan` (REC), `aos-diagnose-7layer` / `aos-diagnose-funnel` / `aos-diagnose-lifecycle` / `aos-analyze-gtm` (FND + REC), `aos-build-brand-system` (REC). They emit the artifacts; this skill indexes them.
- **Downstream:** `aos-plan` reads open FNDs as a planning input — `INDEX.md`'s unactioned-findings list tells the planner (and the user) exactly which findings are still waiting on a move. `aos-route-question` may surface the index for "what have we learned" questions.
- **Sibling:** `aos-catalogue` — same `class: reading` index-builder pattern, applied to the `inbox/` + `content/` working zones rather than the `ontology/` graph.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring. Operationalises the ontology (architecture-gaps §2). The edge-walk and the contradiction detection are best-effort and likely need refinement after first real runs.

**What did we get wrong? What's missing?**
