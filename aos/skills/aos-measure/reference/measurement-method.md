---
scope: int-company
---

# Measurement method — reading results into findings

Companion to `SKILL.md`. The deterministic scope rules, evidence classes, the
result→finding lenses, and the degraded-mode procedure.

## Where `aos-measure` sits

`aos-measure` is the loop's **measurement stage** and its closing edge. It reads
what actually happened to shipped content / campaigns and converts it into
findings the next cycle acts on.

```
A result is a number. A finding is what the number means for what we do next.
aos-measure turns the first into the second.
```

## Scope — measure what shipped

The measurement scope is **not** everything drafted — it is what *shipped*:

1. `content/CATALOGUE.md` — pieces with status `scheduled` or `published`.
2. `CAPTAINS_LOG.md` — the ship entries `aos-distribute` wrote (piece, channel,
   date, status transition). This tells you *what* shipped, *when*, *where*.
3. `deliverables/<YYYY-MM>/gtm-plan.md` — the plan's moves, so results can be
   read against intent.
4. `ontology/recommendations/` — open RECs, so you can check whether a
   recommended move was actioned at all (an un-actioned REC is itself a finding).

A piece that is still `draft` has no result to measure. Do not measure intent.

## Evidence classes

Tag every result item — the discipline from `aos-diagnose-funnel`:

| Tag | Meaning | Carries a causal claim? |
|-----|---------|-------------------------|
| `[DATA]` | A real metric — from Databox, or a verified analytics export. | yes |
| `[OBSERVED]` | Directly seen — a screenshot, a visible comment count. | yes |
| `[STATED]` | The client / user said so, unverified. | no |
| `[INFERRED]` | A reasoned guess from indirect signal. | no |

Keep **data confidence** (is the number real?) separate from **causal
confidence** (does this result mean what the finding says?). A single channel's
analytics is never enough for a causal claim — triangulate.

## Result→finding lenses

Run all four lenses over the gathered results. Each turns a result into a
candidate finding from a different angle.

1. **Against-plan.** Read the result against the move in `gtm-plan.md` that
   produced the piece. Did the move do what the plan expected? A beat or a miss
   versus the plan's intent is a finding.
2. **Against-benchmark.** Read the result against a sensible benchmark band — or,
   better, against the client's own historical baseline when Databox carries the
   trend. State the band and its source; never present a band as a hard target.
3. **Against-prior.** Read the result against prior FNDs on the same content type
   / channel. A result that confirms a prior finding strengthens it; one that
   contradicts it supersedes it.
4. **Channel-comparison.** Compare the same piece (or content type) across the
   channels it shipped to. A channel that systematically under- or over-performs
   is a finding — and often a `distribution.md` signal.

A result that performed **as expected** is not necessarily a finding. A result
that **beat or missed** expectation, or that **contradicts a prior FND**, is.

## The forward signal — every finding is actionable

Each FND `aos-measure` emits must carry a **forward signal** — a plain statement
of what the next cycle should do with it:

- a planning signal — "the next `aos-plan` should re-rank channel X down" — the
  FND is then `consumes:`-ed by a future `aos-plan` REC.
- a discovery signal — "this points at an L4 funnel problem; `aos-diagnose-funnel`
  should run" — a cross-layer suspicion, named not diagnosed here.

An FND with no forward signal is just a number with a date on it. The loop needs
the signal — that is what `aos-plan` and `discover` consume.

## Cross-layer check

Before finalising, for each significant under-performance ask: *is this a content
problem, or is the content carrying a symptom of a deeper layer?* Flat
engagement everywhere may be a positioning problem (L2) or a wrong-audience
problem (L6), not a content-quality problem. State the suspicion as a hypothesis,
recommend the relevant `aos-diagnose-*` skill, and do **not** diagnose the deeper
layer in this skill.

## Degraded mode (Databox absent)

Without Databox, results rest on whatever local signal exists — analytics
exports in `inbox/`, figures stated in `client/` or session, and qualitative
signal (comments, replies, shares the user reports). When no numbers exist at
all, the measurement becomes **qualitative**: a structured read of the
qualitative response against the plan's intent, every item tagged `[OBSERVED]` /
`[STATED]` / `[INFERRED]`, **causal confidence held low**, and the data-gap
callout in the deliverable.

A degraded FND is still a real finding — "we shipped four pieces and the client
reports no inbound response" is a legitimate, actionable finding. What a degraded
run must never do is *invent* the number that would have made the finding
quantitative. Recommend connecting Databox for a metrics-grounded re-run.
