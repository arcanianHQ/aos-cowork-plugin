---
name: aos-plan
description: Turn the brand profile + content-system into a prioritised GTM plan. Reads the 9-file brand/ profile, the per-BU content-system, and the open ontology graph; produces a prioritised plan document and emits REC artifacts into ontology/recommendations/. The planning stage of the AOS loop — sits between brand and content.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L2, L3, L4]
client-scope: single-client
version: 0.1.1
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "[--bu=<bu-slug>] [--horizon=<this-month|quarter>] — operates on the granted folder; no client argument"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (multi-domain / multi-BU — plan per BU)
  - brand/ (the 9-file Client Intelligence Profile — POSITIONING, ICP, OFFER, CONSTRAINT_MAP, REPAIR_ROADMAP, 7LAYER_DIAGNOSTIC, BELIEF_PROFILE, VOICE, COMPETITIVE_LANDSCAPE)
  - content-system/[<bu>/]pillars.md · messaging.md · products.md · distribution.md
  - ontology/findings/ (open FNDs — what was learned; the feedback edge into planning)
  - ontology/recommendations/ (prior RECs — dedup before emitting)
  - ontology/INDEX.md (the FND/REC graph view, when present — built by aos-index-ontology)
  - TASKS.md (existing engagement tasks — dedup against)
outputs:
  - deliverables/<YYYY-MM>/gtm-plan.md (the prioritised GTM plan)
  - ontology/recommendations/REC-NNN-*.md (what to do — one per prioritised move)
preflight:
  - client-config
ontology:
  consumes: [FND, REC, Layer, Goal, ICP, VOICE]
  emits: [REC]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-build-brand-system
tags: [plan, intelligence, strategy, gtm, prioritisation, loop]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `content-system/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content-system/<bu>/`) *are* a legitimate layout level for multi-BU clients. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

`aos-plan` is the **planning stage of the AOS loop** — it sits between the brand profile and content production:

```
onboard → catalogue → discover → brand → PLAN → content → distribute → measure → FND ↺
```

It does one job: take a *complete* picture of where the client is — the 9-file brand profile, the content-system, and **what the ontology graph has learned so far** (open FNDs, prior RECs) — and turn it into a **prioritised GTM plan**: a ranked, layer-tagged shortlist of the moves that matter most this horizon, each emitted as a `REC` artifact so it carries into `TASKS.md` and the next cycle.

It is a **synthesiser**, not a thinker about a single layer. The deep layer diagnosis belongs to `aos-diagnose-7layer` / `aos-diagnose-funnel` / `aos-diagnose-lifecycle`; the brand intelligence belongs to `aos-build-brand-system`. `aos-plan` reads what they produced and decides **what to do next, in what order**.

**Anti-goal.** `aos-plan` does not draft content (that is `aos-draft-content`), does not run diagnostics (that is the `aos-diagnose-*` skills), and does not invent intelligence the brand profile / ontology does not support. A plan move with no FND or brand-file basis is not written.

## Posture

Discovery, not pronouncement. The plan is a **draft prioritisation** for the user to correct, never a verdict. Present the ranked shortlist with the *why* and the evidence for each move, and end the deliverable with *"What did we get wrong? What's missing?"* before writing.

## The feedback edge — why this skill reads `ontology/findings/`

`aos-plan` is one end of the AOS loop's **feedback edge**. `aos-measure` writes
`FND` artifacts into `ontology/findings/` from real campaign / content results;
`aos-plan` **reads those open FNDs as a first-class planning input**. A measured
finding ("the linkbait series under-converted at the click→engage stage") is
exactly the signal that should re-rank the next plan. This is the mechanism that
turns AOS from a one-way pipeline into a loop — see `docs/the-loop.md`.

On every run, `aos-plan` explicitly inventories open FNDs and states, per plan
move, which finding(s) it responds to. A plan that ignores a high-confidence open
finding must say why.

## Arguments

This skill operates on the **granted folder** — which is the client's folder. There is no client-slug argument.

- `--bu` (required if the client is multi-BU) — BU slug, e.g. `kocsibeallo`. The client is multi-BU when `AOS_CONFIG.md` declares a non-empty `business-units:` list (see Step 0); the skill refuses to run without this flag. Plan **per BU** — never collapse two BUs into one plan.
- `--horizon` (optional) — `this-month` (default) or `quarter`. Sets how far the plan reaches and how many moves it shortlists.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, the folder hasn't been onboarded — suggest `aos-onboard`.
3. **Brand gate.** Verify the `brand/` profile is complete (9/9 — check `brand/PROFILE_SCORECARD.md`, or survey the 9 files for substance). If the profile is incomplete, refuse and route to `aos-build-brand-system` — planning on a thin profile produces a thin plan.
4. **Detect multi-BU** from the declaration — `AOS_CONFIG.md`'s `business-units:`. Non-empty → multi-BU → `--bu` is required; abort with the BU list if missing. Do not infer this from `content-system/<bu>/` alone — a client is multi-BU before its content-system is split (`docs/data-folder-spec.md`, "Detecting multi-BU"). If multi-BU is declared but `content-system/<bu>/` is not populated, say so plainly rather than planning single-BU.
5. If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml`.

### Step 1 — Assemble the picture

Load, in this order (priority order — the planning method is in `reference/planning-method.md`):

1. **Brand profile** (`brand/`) — the WHO + the diagnosed constraints: `CONSTRAINT_MAP.md` and `REPAIR_ROADMAP.md` carry the named constraints; `7LAYER_DIAGNOSTIC.md` the layer findings; `POSITIONING` / `ICP` / `OFFER` the strategic frame.
2. **Content-system** (`content-system/[<bu>/]`) — `pillars.md`, `messaging.md`, `products.md`, `distribution.md`: what the client can credibly produce and where it ships.
3. **Ontology graph** — open FNDs in `ontology/findings/` (the feedback edge — see above), prior RECs in `ontology/recommendations/`, and `ontology/INDEX.md` if present. Note every open, unactioned, high-confidence finding.
4. **TASKS.md** — what is already planned, so the plan does not duplicate live work.

### Step 2 — Identify candidate moves

From the assembled picture, surface candidate GTM moves. Each candidate must trace to a **named source** — a brand-file constraint, an open FND, or a content-system gap. The candidate-generation lenses (constraint-first, finding-first, pillar-coverage, layer-balance) are in `reference/planning-method.md`.

### Step 3 — Prioritise

Rank the candidates with the **prioritisation rubric** in `reference/planning-method.md` — impact against the diagnosed constraint, effort, confidence (FND-backed beats inferred), and layer leverage (a move at the binding constraint's layer outranks a downstream tweak). Produce a ranked shortlist sized to the `--horizon`. Show the ranking arithmetic / scoring.

### Step 4 — Synthesise and emit

1. Write the plan to `deliverables/<YYYY-MM>/gtm-plan.md` using `reference/plan-template.md`. Resolve the `deliverables` zone via `AOS_CONFIG.md`.
2. **Emit ontology artifacts.** For each prioritised move, write a `REC` to `ontology/recommendations/` — frontmatter per `ontology/README.md` (`source: aos-plan`, `consumes:` the FND(s) / REC(s) the move responds to, the `layer:` it sits in). **Dedup first** — scan existing `ontology/recommendations/`; supersede (`status: superseded` on the old one) or reference rather than duplicate. The REC emission format is in `reference/plan-template.md`.
3. Present the ranked plan + the REC shortlist to the user before writing — Accept / Revise / Regenerate.

## Output Sections

Minimum content for the deliverable:

- Context used (brand files, content-system files, open FNDs consulted, sessions)
- The picture — diagnosed constraints + open findings the plan answers to
- The prioritised move list — ranked, each with layer, source (FND/constraint), impact, effort, confidence
- The REC shortlist — one REC per move, with its `consumes:` edges
- What this plan deliberately does **not** do this horizon, and why
- **What did we get wrong? What's missing?**

The deliverable shell and the REC emission format are in `reference/plan-template.md`.

## Provenance

Every artifact this skill writes carries the **standard provenance block** in
its frontmatter — see `docs/artifact-versioning.md` §1. Stamp all four fields:

```yaml
generated_by: <this skill's name>      # the name: frontmatter value
skill_version: <this skill's version>  # the version: frontmatter value
generated_date: <YYYY-MM-DD>           # the date written
aos_schema: <schema-version>           # read from AOS_CONFIG.md
```

Add it to whatever domain frontmatter the artifact already carries; never
hard-code `skill_version` or `aos_schema` — read them at write time.

## Hard Rules

1. **Plan, don't produce.** Emit a prioritised plan + RECs. Do not draft content or run diagnostics here.
2. **Every move traces to a source.** A plan move with no brand-file constraint, open FND, or content-system gap behind it is not written. No invented priorities.
3. **Read the feedback edge.** Open FNDs in `ontology/findings/` are a first-class input — a plan that ignores a high-confidence open finding states why.
4. **Brand gate.** Refuse to plan on an incomplete `brand/` profile — route to `aos-build-brand-system`.
5. **Per BU.** For multi-BU clients, plan per BU — never collapse BUs into one plan.
6. **Dedup before emitting.** Scan `ontology/recommendations/` — supersede or reference, never duplicate a REC.
7. **Single client.** Operate only within the granted folder; never reach outside it.
8. **Write deliverables to `deliverables/<YYYY-MM>/` and RECs to `ontology/recommendations/`** — never to `brand/` or `content/`.
9. **Discovery, not pronouncement.** The plan ends with *"What did we get wrong? What's missing?"* before the user accepts.

## Integration

- **Upstream:** `aos-build-brand-system` (the 9-file profile this plans from); `aos-diagnose-7layer` / `aos-diagnose-funnel` / `aos-diagnose-lifecycle` and `aos-measure` (the FNDs this plans against); `aos-route-question` routes strategy / "what should we do next" questions here.
- **Downstream:** the RECs emitted here flow into `TASKS.md`; `aos-draft-content` produces the content the plan calls for; `aos-distribute` ships it; `aos-measure` measures it and writes FNDs that feed the *next* `aos-plan` run — closing the loop. See `docs/the-loop.md`.

## Versioning

- **v0.1.1** — **multi-BU detection fix** (AOS-853 / F1-D1). Step 0.4 now detects multi-BU from `AOS_CONFIG.md`'s `business-units:` declaration, not from the `content-system/<bu>/` layout — a client is multi-BU before its content-system is split. See `docs/data-folder-spec.md`, "Detecting multi-BU".
- **v0.1.0** — initial Cowork-plugin authoring. The planning stage of the AOS loop (architecture-gaps §1). Prioritisation rubric and candidate-generation lenses likely need refinement after first real runs.

**What did we get wrong? What's missing?**
