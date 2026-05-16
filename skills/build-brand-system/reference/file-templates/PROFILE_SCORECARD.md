---
scope: int-company
client: <slug>
generated_by: build-brand-system v0.1
generated_date: <YYYY-MM-DD>
status: <complete | partial | blocked>
---

# Profile Scorecard — <Client Display Name>

> **What this is.** End-of-run summary of the brand intelligence profile state after `/build-brand-system` ran. Tells the next practitioner what's done, what's blocked, what to do next.

## Final completeness

| File | Bytes | Headings | Status | Quality (0–5) | Sources used |
|---|---|---|---|---|---|
| 7LAYER_DIAGNOSTIC.md | <n> | <n> | <FILLED / STUB / MISSING> | <0–5> | <count> |
| CONSTRAINT_MAP.md | <n> | <n> | <...> | <0–5> | <count> |
| REPAIR_ROADMAP.md | <n> | <n> | <...> | <0–5> | <count> |
| BELIEF_PROFILE.md | <n> | <n> | <...> | <0–5> | <count> |
| ICP.md | <n> | <n> | <...> | <0–5> | <count> |
| POSITIONING.md | <n> | <n> | <...> | <0–5> | <count> |
| VOICE.md | <n> | <n> | <...> | <0–5> | <count> |
| COMPETITIVE_LANDSCAPE.md | <n> | <n> | <...> | <0–5> | <count> |

**Overall:** <X>/8 FILLED — gate <PASSED / BLOCKED>

## Quality rubric (per-file, 0–5)

- **0** — file is stub or missing
- **1** — minimum substance threshold passed but evidence is thin
- **2** — basic substance, some evidence cited
- **3** — solid evidence, multiple sources, claims defensible
- **4** — rich substance, broad source coverage, surfaces tensions and disagreement
- **5** — exemplary — could be a hub-level reference for this intelligence type

## What ran in this session

- **Local files harvested:** <count> files scanned, <count> matched at least one bucket
- **Website pages scraped:** <count> pages from <count> domains
- **Sub-skills routed to:** <list of sub-skills the user was sent to run — e.g., "/7layer was suggested but not invoked">
- **User decisions:** <count accepted, count revised, count regenerated, count skipped>

## Blocked items (gate fails)

<List each file that's not FILLED, with the reason and the unblock action.>

- **<FILE>** — blocked because <reason>. Unblock by: <action — usually "run /<sub-skill>" or "harvest yielded insufficient signal, gather more material then re-run">.

## What unlocks downstream

- **`/build-content-system`** — <unlocked / still blocked>
- **`/blog-draft` and other content skills** — <unlocked / still blocked>
- **`/craft-offer`** — <unlocked / still blocked> (depends on ICP + POSITIONING)

## Recommended next actions

1. <Highest-leverage next step>
2. <Next step>
3. <Next step>

---

**What did we get wrong? What's missing?**

<Honest assessment from the orchestrator: where the harvest was thin, where claims are inferred, what a smart reviewer would push back on.>
