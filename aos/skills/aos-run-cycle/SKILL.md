---
name: aos-run-cycle
description: "Run one full turn of the AOS loop in a single session — measure → index-ontology → plan → draft → review → distribute — chaining the loop-stage skills end-to-end and halting only at the human confirmation gates. The autonomous loop-runner: the user invokes once, the cycle walks itself, carrying context from each stage into the next. Trigger on 'run the cycle', 'run the loop', 'do a full GTM pass', 'run this month's cycle', or when the user wants the whole loop turned rather than one stage."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: orchestration
layer: all
client-scope: single-client
version: 0.1.2
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--bu=<bu-slug>] [--horizon=<this-month|quarter>] [--from=<stage>] [--to=<stage>] [--resume] — operates on the granted folder; no client argument"
inputs:
  - AOS_CONFIG.md (zone manifest, client identity, schema-version)
  - client/CLIENT_CONFIG.md
  - brand/ (the 9-file profile — the plan stage gates on it)
  - deliverables/<YYYY-MM>/cycle-run.md (a prior cycle's progress file, when resuming)
outputs:
  - deliverables/<YYYY-MM>/cycle-run.md (the cycle progress + summary file)
  - (transitively) every artifact the chained stage skills produce
preflight:
  - client-config
ontology:
  consumes: [FND, REC, Layer, Goal, ICP, VOICE]
  emits: [FND, REC]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-measure
  - aos-index-ontology
  - aos-plan
  - aos-draft-content
  - aos-review
  - aos-distribute
tags: [loop, cycle, orchestration, workflow, intelligence, agentic]
---

# AOS run-cycle

You are the **autonomous loop-runner**. AOS is a Go-To-Market operating system,
and an operating system is a loop. This skill turns the loop **once**,
end-to-end, in a single session — so the user invokes once instead of hand-glueing
six separate skill calls.

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given
access to, which **is** one client's folder (no per-client nesting). The
granted-folder root is the working directory. Resolve zones (`client/`, `brand/`,
`content/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and
the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths
beyond the documented zone layout. Bash + filesystem on the granted folder is the
contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md`
during context assembly (per `docs/language-context.md`) — never hard-code a
language. Talk to the user in `communication-language`; the chained stage skills
write client-facing artifacts in `content-language`.

## Purpose

`aos-run-cycle` is the loop's **orchestrator** — it does not do stage work
itself; it runs the stage skills in order and carries context between them:

```
measure → index-ontology → plan → draft-content → review → distribute
   │            │            │          │            │          │
 prior      rebuild       reads      drafts the    quality    ships the
 results →  the graph →   fresh   →  content the → gate, →    PASS pieces
 → FNDs                   FNDs       plan calls    PASS/      → CATALOGUE
                          + brand    for           REVISE     advanced
```

**Why measure runs first.** A single invocation cannot both ship a piece *and*
measure that same piece — content needs time in market. So a cycle turn opens by
**measuring what shipped last turn** (`aos-measure` → `FND`s), rebuilds the
graph, and then `aos-plan` reads those fresh findings. That is what makes each
turn close tighter than the last (`docs/the-loop.md`, the feedback edge). On the
**first ever** cycle there is nothing to measure — the skill detects this and
starts at `plan`.

**Anti-goal.** `aos-run-cycle` invents nothing and produces no artifact of its
own beyond the `cycle-run.md` progress file. Every artifact is produced by the
stage skill that owns it. It does not skip the human gates, and it does not
silently override a stage skill's own preflight or hard rules.

## Posture

The loop-runner is **autonomous between gates, never through them**. It chains
stages without making the user re-invoke — but at every `requires_confirmation`
gate (and they all have one) it **stops, shows the stage output, and waits**.
The user can Accept, Revise, Skip the stage, or Halt the cycle. Autonomy buys the
user out of plumbing, not out of judgement.

## The stages

| # | Stage | Skill | Gate | Notes |
|---|-------|-------|------|-------|
| 1 | measure | `aos-measure` | confirm | Skipped on the first cycle (nothing shipped yet) or with `--from=plan`. Databox-gated — degrades to a qualitative read. |
| 2 | index | `aos-index-ontology` | none (read+write, deterministic) | Rebuilds `ontology/INDEX.md` so stage 3 sees the new FNDs. |
| 3 | plan | `aos-plan` | confirm | Hard-gates on a 9/9 `brand/` profile. Reads the FNDs from stage 1. |
| 4 | draft | `aos-draft-content` | confirm | Drafts the content the plan's RECs call for. |
| 5 | review | `aos-review` | confirm | Runs its own autonomous revision micro-loop. `PASS` → stage 6. Escalation (cap / no-progress / foundation gate) or `BLOCK` → see "Handling the review stage". |
| 6 | distribute | `aos-distribute` | confirm | Ships only `PASS`-cleared pieces; advances `content/CATALOGUE.md`. |

## Arguments

This skill operates on the **granted folder**. There is no client-slug argument.

- `--bu` — required if the client is multi-BU (`AOS_CONFIG.md` declares a
  non-empty `business-units:` list — see Step 0). Passed through to every stage.
  The cycle runs **per BU** — never collapse two BUs into one cycle run.
- `--horizon` — `this-month` (default) or `quarter`. Passed to `aos-plan`.
- `--from` / `--to` — run a slice of the loop, e.g. `--from=plan --to=review`.
  Stage names: `measure`, `index`, `plan`, `draft`, `review`, `distribute`.
- `--resume` — resume an incomplete cycle from its `cycle-run.md` progress file.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md`
   for the zone manifest, `client` identity, and `schema-version`.
2. Verify `client/CLIENT_CONFIG.md` exists. If not → route to `aos-onboard`.
3. **Schema gate.** Compare `AOS_CONFIG.md`'s `schema-version` to
   `docs/CURRENT_SCHEMA_VERSION`. If behind → route to `aos-migrate` first; never
   run a cycle on a stale folder.
4. **Detect multi-BU** from the declaration — `AOS_CONFIG.md`'s `business-units:`.
   Non-empty → multi-BU → `--bu` is required; abort with the BU list if it is
   absent. Do not infer this from `content-system/<bu>/` alone — a client is
   multi-BU before its content-system is split (`docs/data-folder-spec.md`,
   "Detecting multi-BU"). If multi-BU is declared but `content-system/<bu>/` is
   not populated, say so plainly — the cycle will reach the content-system gate.
5. **Resume check.** Look for `deliverables/<YYYY-MM>/cycle-run.md` with an
   incomplete stage checklist. If found, offer to `--resume` from the first
   unfinished stage rather than starting fresh.

### Step 1 — Plan the cycle

1. Resolve which stages will run, from `--from` / `--to` (default: all six).
2. **First-cycle detection** — if `content/CATALOGUE.md` shows nothing ever
   shipped and `metrics/` is empty, drop the `measure` stage and note why.
3. Write the cycle plan to `deliverables/<YYYY-MM>/cycle-run.md` — a stage
   checklist, each row `pending`, with the resolved args. Use
   `reference/cycle-run-template.md`.
4. **Show the user the cycle plan and the gate count** — "this cycle will run N
   stages and stop at N gates" — and get a single up-front confirmation to
   begin. This is the cycle-level gate; the per-stage gates still apply.

### Step 2 — Walk the stages

For each stage in order:

1. Mark the stage `in-progress` in `cycle-run.md` with a start timestamp.
2. **Invoke the stage skill** — run it as that skill, honouring its full
   `SKILL.md`: its preflight, its hard rules, its output contract. Pass through
   `--bu` and `--horizon` as relevant. Do **not** re-implement a stage's logic
   here — defer to the owning skill.
3. **Carry context forward.** Hand the stage's output to the next stage as
   working context — the plan's RECs name what `draft` produces; the reviewed
   pieces are what `distribute` ships. The point of the cycle is that this
   context never has to be re-loaded by hand.
4. **Stop at the gate.** When the stage reaches its `requires_confirmation`
   point, present its output and wait. Offer four choices:
   - **Accept** — record the stage `done`, continue to the next.
   - **Revise** — loop within the stage per its own skill, then re-gate.
   - **Skip** — record the stage `skipped` with a reason, continue.
   - **Halt** — stop the cycle; `cycle-run.md` keeps the progress so a later
     `--resume` picks up here.
5. Update `cycle-run.md`: stage `done` / `skipped`, end timestamp, a one-line
   result (artifact path, verdict, count).

### Step 3 — Handling the review stage

`aos-review` (v0.3.0+) runs its **own autonomous revision micro-loop** — on a
`REVISE` it re-drafts and re-reviews the piece itself, iterating to a final
outcome (F2 / AOS-848). `aos-run-cycle` does **not** re-implement that loop; it
invokes `aos-review` and receives the final outcome:

- **PASS** — the micro-loop cleared the piece (possibly after iterations).
  Proceed to `distribute`.
- **Escalation** — the micro-loop hit its cap, made no progress, or surfaced a
  repeated issue that needs a user-confirmed foundation edit. `aos-review`
  presents that to the user itself; the cycle **waits at the stage gate** for
  the resolution, then continues (`PASS` → distribute; otherwise the piece is
  dropped from the `distribute` set).
- **BLOCK** — the piece has a structural fault and does not ship. Record it,
  drop it from the `distribute` set, and continue the cycle with the remaining
  `PASS` pieces.

### Step 4 — Close the cycle

1. Finalise `cycle-run.md`: every stage `done` / `skipped`, a **cycle summary**
   — what was measured, what was planned, what was drafted, what shipped, what
   was blocked, and the open FND / REC counts after the turn.
2. Append a one-line entry to `CAPTAINS_LOG.md` — `aos-run-cycle` completed,
   the date, the BU, the stage outcomes (use the captain's-log convention).
3. Present the summary and name the **next turn's** likely focus (the open RECs
   `aos-plan` did not action this horizon, the open FNDs `aos-measure` emitted).

## Resumability — why `cycle-run.md` exists

The Cowork VM is ephemeral; the granted folder persists. `cycle-run.md` is the
cycle's durable state — a stage checklist with timestamps and per-stage results.
If a session ends mid-cycle, the next session's `aos-run-cycle --resume` reads it
and continues from the first unfinished stage. No stage work is lost, because
every stage's real output is already a file in the granted folder; `cycle-run.md`
only tracks *where the cycle got to*.

## Provenance

`cycle-run.md` carries the **standard provenance block** in its frontmatter — see
`docs/artifact-versioning.md` §1. Stamp `generated_by`, `skill_version`,
`generated_date`, `aos_schema` — read `skill_version` and `aos_schema` at write
time, never hard-code them. The stage skills stamp their own artifacts.

## Hard Rules

1. **Orchestrate, don't do.** Every stage's work is done by the owning stage
   skill, honouring its full `SKILL.md`. `aos-run-cycle` never re-implements a
   stage or overrides its preflight / hard rules.
2. **Never skip a gate.** Every stage stops at its `requires_confirmation`
   point. The cycle is autonomous *between* gates, never *through* them.
3. **Measure first, plan second.** The cycle opens by measuring the prior turn
   so `aos-plan` reads fresh FNDs — except on the first cycle, where `measure`
   is dropped.
4. **One BU per cycle.** For multi-BU clients, run the cycle per BU — never
   collapse BUs.
5. **The review micro-loop belongs to `aos-review`.** `aos-run-cycle` invokes
   `aos-review` and receives its final outcome — it never re-implements the
   autonomous revision loop (that is `aos-review` v0.3.0+, F2 / AOS-848).
6. **Single client.** Operate only within the granted folder; never reach
   outside it.
7. **`cycle-run.md` is the source of truth for cycle progress.** Update it at
   every stage transition so `--resume` is always possible.
8. **A BLOCKed piece does not ship.** Drop it from the `distribute` set; the
   cycle continues with the remaining `PASS` pieces.

## Integration

- **Chains:** `aos-measure` → `aos-index-ontology` → `aos-plan` →
  `aos-draft-content` → `aos-review` → `aos-distribute` — the loop of
  `docs/the-loop.md`.
- **Router:** `aos-route-question` routes "run the cycle / run the loop / do a
  full GTM pass" here. A single-stage question still routes to that stage's own
  skill — `aos-run-cycle` is for turning the *whole* loop.
- **Cadence:** registered as a named recurring run is a natural fit — see
  `docs/cadence.md`. A monthly `run-cycle` is the loop's outer beat.
- **Sibling agentic skills:** F2 `aos-review` micro-loop (AOS-848), F3
  session-start brief (AOS-849) — see Linear milestone *13. Agentic behaviour*.

## Versioning

- **v0.1.2** — **multi-BU detection fix** (AOS-853 / F1-D1). Step 0.4 now detects
  multi-BU from `AOS_CONFIG.md`'s `business-units:` declaration, not from the
  `content-system/<bu>/` layout — a client is multi-BU before its content-system
  is split. Also corrects the frontmatter `version:` (was left at `0.1.0` when
  v0.1.1 shipped). See `docs/data-folder-spec.md`, "Detecting multi-BU".
- **v0.1.1** — the review stage now defers to `aos-review` v0.3.0's autonomous
  revision micro-loop (F2 / AOS-848). Step 3 rewritten: a `REVISE` no longer
  gates here — `aos-review` self-iterates and the cycle receives the final
  outcome. Hard Rule 5 updated accordingly.
- **v0.1.0** — initial authoring. The autonomous loop-runner (AOS-847, milestone
  *13. Agentic behaviour*).

**What did we get wrong? What's missing?**
