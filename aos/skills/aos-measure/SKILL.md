---
name: aos-measure
description: Read results for shipped content and campaigns, and emit FND artifacts into ontology/findings/ — the measurement stage of the AOS loop. Connector-gated on Databox; degrades to a qualitative read with the data gap flagged when Databox is absent, and never fabricates metrics. Produces a results document and the findings that feed the next plan / discover cycle.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: diagnostic
layer: [L4, L5, L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "[--period=<YYYY-MM>] [--bu=<bu-slug>] — operates on the granted folder; uses the Databox connector when present"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (multi-domain — measure per domain)
  - content/CATALOGUE.md (which pieces shipped — status scheduled / published)
  - content/ (the shipped pieces themselves — what was claimed)
  - CAPTAINS_LOG.md (the ship record — what shipped, when, where — written by aos-distribute)
  - deliverables/<YYYY-MM>/gtm-plan.md (the plan whose moves are being measured against)
  - ontology/recommendations/ (open RECs — measure whether they were actioned)
  - ontology/findings/ (prior FNDs — dedup before emitting)
  - inbox/**/*.md (discovery material — analytics exports, screenshots, campaign reports)
  - Databox MCP tools (content / campaign performance metrics — when the connector is present)
outputs:
  - deliverables/<YYYY-MM>/results.md (the measurement read)
  - ontology/findings/FND-NNN-*.md (what was learned from results — feeds the next plan)
preflight:
  - client-config
connector:
  name: databox
  required: false
  degrades: true
ontology:
  consumes: [Content, REC, Layer, Goal]
  emits: [FND]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-distribute
tags: [measure, intelligence, results, analytics, databox, loop]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `content/`, `ontology/`, `deliverables/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content/<bu>/`) *are* a legitimate layout level for multi-BU clients. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

`aos-measure` is the **measurement stage of the AOS loop** — and the stage that
closes it:

```
onboard → catalogue → discover → brand → plan → content → distribute → MEASURE → FND ↺
```

It reads **results** for content and campaigns that have shipped — the pieces
`aos-distribute` marked `scheduled` / `published`, the moves `aos-plan` called for
— and turns those results into **`FND` artifacts** in `ontology/findings/`. A
finding is what the engagement *learned* from a real result. Those findings are a
first-class input to the next `aos-plan` run: **this is the feedback edge that
makes AOS a loop and not a one-way pipeline** (see `docs/the-loop.md`).

It is a **measurement and learning** skill, not an execution skill. It does not
ship content (that is `aos-distribute`), does not plan (that is `aos-plan`), and
does not run a layer diagnostic (that is the `aos-diagnose-*` skills) — though
when results point at a structural problem it names the suspicion and hands off.

**Anti-goal.** `aos-measure` never invents a metric. A result with no data behind
it is not a finding — it is a data gap, and it is reported as one.

## Posture

Discovery, not pronouncement. Present results with the evidence class and the
confidence, not as verdicts. Show the arithmetic. Invite disagreement. End the
deliverable with *"What did we get wrong? What's missing?"*

## The feedback edge — why this skill emits into `ontology/findings/`

`aos-measure`'s output side is the loop's **feedback edge**. Every FND it writes
into `ontology/findings/` is a signal addressed to the *next* cycle:

- `aos-plan` reads open FNDs as a first-class planning input and re-ranks moves
  against them — a measured under-performance becomes a planning priority.
- the `discover` stage (`aos-build-brand-system` harvest, the `aos-diagnose-*`
  skills) consumes open FNDs to focus the next round of diagnosis.

So every FND `aos-measure` emits must be **actionable forward** — it states what
was learned in terms a planner or a diagnostician can act on, and its `emits:`
edge is left open (a leaf) until `aos-plan` picks it up with a `consumes:` edge.
`aos-index-ontology` walks those edges and surfaces unactioned findings in
`ontology/INDEX.md` — so a finding never goes silently unanswered. The closed
loop is documented in `docs/the-loop.md`.

## Connector — Databox (graceful degradation)

This skill is **connector-gated on Databox** — the content / campaign metrics
source. The gating posture mirrors `aos-diagnose-funnel`: a connector counts as
connected **only if its MCP tools are present in the session**.

- **Databox present** → pull content / campaign performance metrics — reach,
  engagement, click-through, conversion, by piece and by channel — through the
  Databox MCP tools. Tag everything sourced this way `[DATA]`.
- **Databox absent** → **degrade, do not fail.** Measure from local material
  instead: analytics exports and screenshots in `inbox/`, figures stated in
  `client/` or session, and qualitative signal (comments, replies, shares the
  user reports). **Flag the data gap explicitly** in the deliverable (a "Data gap
  — Databox not connected" callout) and hold confidence low on every finding that
  would have rested on metrics. Recommend connecting Databox via `aos-onboard`
  for a metrics-grounded re-run.

**Never invent a number to fill the gap.** A degraded measurement is an honest
qualitative read with the gap named — not a fabricated quantitative one. This
rule is absolute: a finding stamped `[DATA]` must trace to a real metric.

## Arguments

This skill operates on the **granted folder** — which is the client's folder.

- `--period` (optional) — the measurement window, `YYYY-MM`; defaults to the
  current month. Sets which `deliverables/<YYYY-MM>/` the results doc lands in.
- `--bu` (required if the client uses per-BU content) — BU slug. Measure **per
  BU** — never flatten two BUs' results into one read.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Connector check** — determine whether the Databox MCP tools are present in the session. Record the result; it sets the measurement mode (metrics-grounded vs degraded) and is stated in the deliverable.
4. Detect per-BU layout; if multi-BU, `--bu` is required. If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml`.

### Step 1 — Establish what shipped

Read `content/CATALOGUE.md` and `CAPTAINS_LOG.md` for the period — the pieces marked `scheduled` / `published` and the ship log `aos-distribute` wrote. This is the **measurement scope**: you measure what actually shipped, not what was drafted. Read `deliverables/<YYYY-MM>/gtm-plan.md` (when present) so results can be read against the plan's moves, and `ontology/recommendations/` for the open RECs whose action you are checking.

### Step 2 — Pull results

For each shipped piece / campaign, gather results — the measurement method is in `reference/measurement-method.md`.

- **Databox present** — pull per-piece / per-channel metrics; tag `[DATA]`.
- **Databox absent** — gather from `inbox/` exports + stated figures + qualitative signal; tag `[OBSERVED]` / `[STATED]` / `[INFERRED]`; record the data gap.

Tag every result item with its evidence class — `[DATA]`, `[OBSERVED]`, `[STATED]`, `[INFERRED]`. Only `[DATA]` and `[OBSERVED]` carry a causal claim.

### Step 3 — Read the results into findings

Interpret the results — the result→finding lenses (against-plan, against-benchmark, against-prior, channel-comparison) are in `reference/measurement-method.md`. For each substantive result, decide: is this a **finding** — something the engagement learned that should change what it does next? A piece that performed as expected may not be a finding; a piece that beat or missed expectation is. Run the **cross-layer check**: if a result points at a structural problem (a funnel leak, a positioning gap), name the suspicion and recommend the relevant `aos-diagnose-*` skill — do not diagnose it here.

### Step 4 — Synthesise and emit

1. Write the results read to `deliverables/<YYYY-MM>/results.md` using `reference/results-template.md`. Resolve the `deliverables` zone via `AOS_CONFIG.md`.
2. **Emit ontology artifacts.** For each substantive finding, write an `FND` to `ontology/findings/` — frontmatter per `ontology/README.md` (`source: aos-measure`, `consumes:` the REC / Content the result measured, `emits: []` left open as a leaf for the next plan). **Dedup first** — scan existing `ontology/findings/`; supersede or reference rather than duplicate. The FND emission format is in `reference/results-template.md`.
3. Present the results read + the FND shortlist to the user before writing — Accept / Revise / Regenerate.

## Output Sections

Minimum content for the deliverable:

- Context used (catalogue, ship log, plan, Databox metrics or the data-gap note, sessions)
- Connector status — Databox connected / degraded
- What shipped — the pieces / campaigns measured this period
- Results — per piece / channel, with evidence class and confidence; the arithmetic shown
- Findings — each with what was learned and the forward signal (what plan / discover should do with it)
- Cross-layer suspicion — if a result points at a structural problem
- **What did we get wrong? What's missing?**

The deliverable shell and the FND emission format are in `reference/results-template.md`.

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

1. **Measure, don't execute.** Produce a results read + FNDs. Do not ship content or run a CRO / email program.
2. **Degrade, never fail, when Databox is absent.** Measure from local material and flag the data gap. **Never fabricate a metric** — a `[DATA]` tag must trace to a real number.
3. **Measure what shipped.** Scope is the `scheduled` / `published` pieces in the catalogue + ship log — not what was merely drafted.
4. **Every FND is actionable forward.** A finding states what `aos-plan` / `discover` should do with it; `emits:` is left open as a leaf.
5. **Per BU / per domain.** For multi-BU / multi-domain clients, measure per BU / per domain — never flatten results.
6. **Dedup before emitting.** Scan `ontology/findings/` — supersede or reference, never duplicate.
7. **Cross-layer suspicions named, not diagnosed.** If a result points deeper, recommend the relevant `aos-diagnose-*` skill — do not diagnose here.
8. **Single client.** Operate only within the granted folder; never reach outside it.
9. **Write deliverables to `deliverables/<YYYY-MM>/` and FNDs to `ontology/findings/`** — never to `brand/` or `content/`.
10. **Discovery, not pronouncement.** The results read ends with *"What did we get wrong? What's missing?"* before the user accepts.

## Integration

- **Upstream:** `aos-distribute` (ships the pieces this measures, writes the ship log); `aos-plan` (the plan whose moves are measured against); `aos-route-question` routes "how did it do" / "what worked" / "measure the campaign" requests here.
- **Downstream:** the FNDs emitted here feed the **next `aos-plan` run** (the feedback edge) and the `discover` stage; `aos-index-ontology` walks the FND edges into `ontology/INDEX.md`; a cross-layer suspicion hands off to `aos-diagnose-7layer` / `aos-diagnose-funnel` / `aos-diagnose-lifecycle`. This is where the loop closes — see `docs/the-loop.md`.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring. The measurement stage of the AOS loop (architecture-gaps §1). Result→finding lenses and benchmark handling likely need refinement after first real runs.

**What did we get wrong? What's missing?**
