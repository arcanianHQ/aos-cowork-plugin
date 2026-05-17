---
scope: int-company
---

# Planning method — turning the picture into a prioritised plan

Companion to `SKILL.md`. The deterministic lenses, the prioritisation rubric, and
the candidate→REC mapping used to build a GTM plan. Grounded in the AOS loop
(`docs/the-loop.md`) and the 7+1 Layer Framework.

## Where `aos-plan` sits

`aos-plan` is the loop's **synthesis stage** — the only stage that holds the
*whole* picture at once: the diagnosed brand profile, the operational
content-system, and everything the ontology graph has learned. Diagnostics see
one layer; content sees one piece; planning sees the engagement.

```
The plan answers one question: given everything we know, what are the
2–7 moves that matter most this horizon, and in what order?
```

## Step 1 — Assemble the picture (the four reads)

| Read | Zone | What it contributes to the plan |
|------|------|--------------------------------|
| Brand profile | `brand/` | the diagnosed **constraints** (`CONSTRAINT_MAP`, `REPAIR_ROADMAP`), the layer findings (`7LAYER_DIAGNOSTIC`), the strategic frame (`POSITIONING`, `ICP`, `OFFER`) |
| Content-system | `content-system/[<bu>/]` | what the client can **credibly produce** — pillars owned, messaging poles, product catalog, distribution channels |
| Ontology graph | `ontology/findings/` + `ontology/recommendations/` + `INDEX.md` | what has been **learned** — open FNDs (the feedback edge), prior RECs (dedup + supersede) |
| Engagement state | `TASKS.md` | what is **already live** — never re-plan work in flight |

## Step 2 — Candidate generation (four lenses)

Run all four lenses; each surfaces candidate moves from a different angle. A
candidate that no lens surfaces is not a candidate.

1. **Constraint-first.** Read `brand/CONSTRAINT_MAP.md` + `REPAIR_ROADMAP.md`.
   The binding constraint is the highest-leverage target — every repair-roadmap
   step is a candidate move. The constraint's layer is the move's layer.
2. **Finding-first (the feedback edge).** Read every **open** FND in
   `ontology/findings/`. Each open, unactioned finding is a candidate move — the
   move is "respond to what was measured". A high-confidence FND with no
   responding move is a planning gap; flag it.
3. **Pillar-coverage.** Read `content-system/[<bu>/]pillars.md` against
   `content/CATALOGUE.md`. A pillar the client owns but has produced little
   against is a candidate content move.
4. **Layer-balance.** Map existing RECs + tasks onto the 7+1 layers. A layer the
   diagnostic flagged but nothing addresses is a candidate move.

Every candidate is tagged with: its **layer**, its **source** (constraint id /
FND id / pillar / layer), and a one-line statement of the move.

## Step 3 — Prioritisation rubric

Score each candidate on four axes. The score is directional — it ranks, it does
not decide; the user confirms the final order.

| Axis | Question | Weight |
|------|----------|--------|
| **Leverage** | Is this move at the binding constraint's layer, or downstream of it? A move at the constraint outranks a downstream tweak. | ×3 |
| **Confidence** | Is the move backed by a `[DATA]`/`[OBSERVED]` FND, or only inferred? FND-backed beats inferred. | ×2 |
| **Impact** | If it works, how much does it move the diagnosed constraint? | ×2 |
| **Effort** | How much production / connector / approval cost? Lower effort breaks ties. | ×1 (inverse) |

```
priority score = 3·leverage + 2·confidence + 2·impact − 1·effort
```

Rank by score. Size the shortlist to the horizon:

- `--horizon=this-month` → top **2–4** moves. A month executes a few things well.
- `--horizon=quarter` → top **5–7** moves, sequenced into a rough order.

**Show the scoring** in the deliverable — the rubric is a draft for the user to
argue with, not a black box.

## Step 4 — Candidate → REC mapping

Each prioritised move becomes exactly one `REC` artifact:

- `id` — next in the `ontology/recommendations/` sequence.
- `layer` — the move's layer (from its candidate tag).
- `source: aos-plan`.
- `consumes:` — the FND id(s) and/or prior REC id(s) the move responds to. A
  finding-first move `consumes:` its FND; a constraint-first move references the
  constraint. **This `consumes:` edge is what `aos-index-ontology` walks** to show
  the plan as a node in the graph — so populate it accurately.
- `emits: []` — a REC is a leaf until a task or measurement picks it up.

**Dedup before emitting.** Scan `ontology/recommendations/`:

- An open REC already covering this move → reference it, do not duplicate.
- A prior REC this plan **replaces** (a sharper version of the same move) → set
  the old one's `status: superseded` and `consumes:` it from the new REC.

## The deliberate-omissions section

A good plan is as much what it *won't* do. The deliverable names the candidates
that scored below the cut and **why** — usually low confidence (no FND yet —
needs a diagnostic first) or wrong horizon. This is honest prioritisation and it
tells the next `aos-plan` run what was deferred.

## Multi-BU

For a multi-BU client, run the whole method **per BU** — one `--bu` per run, one
plan per BU. Never average two BUs' constraints into a single plan: it hides a
BU-specific binding constraint. The brand profile is shared (one founder, one
identity); the content-system, the pillars, and therefore the plan are per BU.
