---
name: aos-plan-databoards
description: Plan a client's Databox databoard suite from their AOS brand intelligence — harvest business needs, design the dashboards, check data-source readiness against the live Databox account, and emit ready-to-paste Databox Genie prompts. Connector-gated on Databox; degrades to an unverified plan with the data gap flagged when Databox is absent, and never asserts a connector is present without checking. Produces metrics/DATABOARD_PLAN.md — the measurement-infrastructure design the aos-measure loop later reads.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L4, L5, L6, L7]
client-scope: single-client
version: 0.2.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--bu=<bu-slug>] — operates on the granted folder; uses the Databox connector when present"
inputs:
  - AOS_CONFIG.md (zone manifest + client identity + business-units)
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (active channels — multi-domain: plan per domain)
  - brand/7LAYER_DIAGNOSTIC.md (layer health + the binding constraint)
  - brand/OFFER.md (what is sold, pricing — implies the revenue KPIs)
  - brand/POSITIONING.md (audience / ICP context)
  - metrics/METRICS.md (what is already tracked)
  - Databox MCP tools (list_data_sources — readiness check, when the connector is present)
outputs:
  - metrics/DATABOARD_PLAN.md (the databoard suite design + Genie prompts)
preflight:
  - client-config
connector:
  name: databox
  required: false
  degrades: true
ontology:
  consumes: [Layer, Goal]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-build-brand-system
  - aos-onboard
tags: [plan, databox, databoard, dashboard, genie, measurement, intelligence]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `metrics/`, `ontology/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders *are* a legitimate layout level for multi-BU clients. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

`aos-plan-databoards` is the **measurement-infrastructure planner**. It sits one
step *before* the measurement stage of the AOS loop: it designs the dashboards
that `aos-measure` will later read.

```
onboard → catalogue → discover → brand → [PLAN DATABOARDS] → … → measure → FND ↺
                                   │                              │
                                   └── business needs ────────────┘ reads the boards
```

AOS already **connects** Databox (`aos-onboard`), **reads** results
(`aos-measure`), and **diagnoses funnels** (`aos-diagnose-funnel`). The gap this
skill fills: nothing **designs** the databoards. A client connected to Databox
with no deliberate dashboard plan gets either a blank account or a generic
vendor template — neither of which makes *their* binding constraint visible.

This skill closes that gap. It:

1. **Harvests business needs** from the client's AOS brand intelligence.
2. **Designs a databoard suite** — a small set of dashboards matched to those
   needs, drawn from a curated archetype library.
3. **Maps every metric to its data source** and **checks readiness** against the
   live Databox account — what is connected, what is missing.
4. **Emits ready-to-paste Databox Genie prompts** — one per databoard — so the
   user can build each board in Databox by handing the prompt to Genie.

It is a **planning** skill, not an execution skill. It does not connect data
sources (that is `aos-onboard`), does not read results (that is `aos-measure`),
and **does not build the databoard itself** — see the Hard Rules.

**Anti-goal.** `aos-plan-databoards` never produces a generic dashboard dump.
Every databoard in the suite traces to a real goal or KPI in the client's
`brand/` intelligence. If there is no business need behind a board, it does not
belong in the suite.

## Posture

Discovery, not pronouncement. The databoard suite is a **draft for the user to
correct**, not a verdict. Show why each board exists — which goal, which KPI,
which layer. Invite disagreement. End the deliverable with *"What did we get
wrong? What's missing?"*

## Connector — Databox (graceful degradation)

This skill is **connector-gated on Databox**. The gating posture mirrors
`aos-measure` and `aos-diagnose-funnel`: a connector counts as connected **only
if its MCP tools are present in the session**.

- **Databox present** → run the **data-source readiness check** (Step 4): call
  the Databox MCP `list_data_sources` read-only, and diff the connected sources
  against the suite's required-connector list. The gap check is **empirical** —
  a source is reported `✓ connected` only because `list_data_sources` returned
  it.
- **Databox absent** → **degrade, do not fail.** Still harvest needs, design the
  suite, and emit the Genie prompts — none of that needs the connector. But mark
  the readiness check **unverified**: emit the required-connector list as a
  *requirement*, not a status, with a "Data gap — Databox not connected"
  callout, and recommend connecting Databox via `aos-onboard` for a verified
  re-run.

**Never assert a connector is present without checking.** A `✓ connected` line
must trace to a real `list_data_sources` result — never to an assumption.

This skill is **read-only against Databox.** It uses the MCP solely to *list*
data sources. It never creates data sources, never ingests data, and **never
builds a databoard** — the Databox MCP has no create-databoard tool, so the
deliverable is a *prompt* the user runs in Databox Genie. See Hard Rule 1.

**Two Genie surfaces — do not confuse.** The MCP `ask_genie` tool analyses a
*dataset* only; it does not build Databoards. Board-building Genie is the
Databox **app** Genie (the nav-bar chat) or the higher-level Databox API the
app Genie wraps. The skill emits instructions for the board-building Genie.
Empirical limits the plan must respect (Wellis Export build, 6 iterations,
2026-05-20/21 — `reference/genie-build-recipe.md`): Genie *does* metrics,
breakdowns, filters, viz types, date ranges and comparisons; it does **not** do
layout, sizing, custom colours, or calculated metrics. See
`reference/genie-prompt-template.md` for the full matrix.

## Arguments

This skill operates on the **granted folder** — which is the client's folder.

- `--bu` (required if the client is multi-BU) — BU slug. The client is multi-BU
  when `AOS_CONFIG.md` declares a non-empty `business-units:` list (see Step 0).
  Plan **per BU** — a databoard suite is never flattened across two BUs.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Connector check** — determine whether the Databox MCP tools are present in the session. Record the result; it sets the readiness-check mode (verified vs degraded) and is stated in the deliverable.
4. **Brand-intelligence gate** — check that `brand/7LAYER_DIAGNOSTIC.md` and `brand/OFFER.md` exist. They are the source of the business needs the suite is designed around. If they are absent or thin, say so: the plan can still be drawn from `client/` + the channel map, but it will be coarse — recommend running `aos-build-brand-system` first for a needs-grounded plan.
5. **Detect multi-BU** from `AOS_CONFIG.md`'s `business-units:` declaration — non-empty → multi-BU → `--bu` is required. If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` and plan per domain.

### Step 1 — Harvest business needs

Read the client's AOS brand intelligence and extract what the databoard suite
must make visible:

- `brand/OFFER.md` — what is sold and how it is priced → the **revenue / pipeline KPIs**.
- `brand/7LAYER_DIAGNOSTIC.md` — layer health and, critically, **the binding constraint** (the one layer the engagement is most blocked on).
- `client/DOMAIN_CHANNEL_MAP.yaml` — the **active channels** → which platforms feed data.
- `brand/POSITIONING.md` — audience / ICP, for the customer-side metrics.
- `metrics/METRICS.md` — what the client **already tracks** (so the suite extends, not duplicates).

Produce a harvested-needs summary: business goals, the target KPIs each goal
implies, active channels, funnel stages, and **the binding constraint named
explicitly** — the suite must make that constraint measurable.

### Step 2 — Design the databoard suite

Match the harvested needs to the archetype library in
`reference/databoard-archetypes.md`. Propose a **suite** — typically 2–4
databoards, not one, and not a board per metric.

For each databoard, specify: title · purpose · audience (exec / operator /
client) · 7+1 layer coverage · metric set · recommended visualisations · refresh
cadence. Selection guidance:

- An **Executive GTM Overview** is almost always board #1.
- Add a **channel-specific board** for each materially-active channel.
- Add a **Funnel Health** board when the binding constraint is conversion / leak.
- Match board count to channel count and team capacity — do not over-build.

### Step 3 — Map metrics → data sources

For every metric in the proposed suite, resolve which Databox connector supplies
it, using `reference/metric-source-map.md`. Consolidate into the suite's
**required-connector list** — the distinct set of data sources the whole suite
depends on.

### Step 4 — Data-source readiness check

- **Databox present** — call the Databox MCP `list_data_sources` (read-only).
  Normalise connector names and diff against the required-connector list:
  `✓ connected` / `✗ missing` / `⚠ partial`. For each `✗`, emit an action item —
  connect it via `aos-onboard` or in the Databox UI. (Note: Google Ads and GA4
  have no vendor MCP, but Databox aggregates both — `docs/connectors.md`.)
- **Databox absent** — degrade: emit the required-connector list as an unverified
  *requirement* with the "Data gap" callout, and recommend `aos-onboard`.

### Step 5 — Craft Genie prompts and write the plan

1. For each databoard, build **Databox Genie instructions** using
   `reference/genie-prompt-template.md` (prompt format) and
   `reference/genie-build-recipe.md` (the operational recipe). Three parts per
   board: (a) a **primary prompt** following the canonical 2-widget pattern
   when possible — Genie's default layout is reliable at 2 widgets and ugly
   above; (b) **follow-up prompts** for refinements, paste-one-at-a-time after
   the board exists; (c) a **manual-setup list** for calculated metrics,
   Designer-polish notes, and the verification checklist (Hard Rule 15).
   Currency + timezone inherit from the data source — record them in the plan
   frontmatter, not in the prompt.
2. Write the full plan to `metrics/DATABOARD_PLAN.md` using
   `reference/plan-template.md`. Resolve the `metrics` zone via `AOS_CONFIG.md`.
3. Present the suite + the readiness check + the Genie prompts to the user
   before writing — Accept / Revise / Regenerate.
4. **Proactive nudge.** If the readiness check found missing sources, do not stop
   silently: surface a one-line nudge (`docs/proactive-nudges.md`) — the missing
   connectors named, and the next step (`aos-onboard` to connect them, then
   re-run for a verified plan). Surfaced, never auto-actioned.

## Output Sections

Minimum content for `metrics/DATABOARD_PLAN.md`:

- Context used (brand intelligence, channel map, existing metrics, Databox status)
- Connector status — Databox connected / degraded
- Business needs harvested — goals, target KPIs, active channels, **the binding constraint**
- The databoard suite — each board's full spec (purpose, audience, layers, metrics, visuals, cadence)
- Data-source readiness — the `✓ / ✗ / ⚠` table + action items (or the unverified requirement list when degraded)
- Genie instructions — per databoard: a primary 2-widget prompt + follow-ups (direct metrics), a manual-setup list (calculated metrics + Designer polish), and a verification checklist
- **What did we get wrong? What's missing?**

The deliverable shell, the archetype library, the metric→source map, and the
Genie-prompt template live in `reference/` (see Versioning — built across the
AOS-912..915 phases).

## Provenance

Every artifact this skill writes carries the **standard provenance block** in
its frontmatter — see `docs/artifact-versioning.md` §1. Stamp all four fields:

```yaml
generated_by: aos-plan-databoards
skill_version: <this skill's version>  # the version: frontmatter value
generated_date: <YYYY-MM-DD>           # the date written
aos_schema: <schema-version>           # read from AOS_CONFIG.md
```

Never hard-code `skill_version` or `aos_schema` — read them at write time.

## Hard Rules

1. **Plan, don't build.** The deliverable is a plan + ready-to-paste Genie prompts. The Databox MCP has no create-databoard tool — **never claim to have created a databoard**; the user runs the prompt in Databox Genie.
2. **Empirical readiness check.** A `✓ connected` line must trace to a real `list_data_sources` result. Never assert a connector is present without checking.
3. **Degrade, never fail, when Databox is absent.** Still design the suite and emit the prompts; mark the readiness check unverified with the data-gap callout.
4. **Plan from real business needs.** Every databoard traces to a goal / KPI in `brand/`. No generic dashboard dump. If brand intelligence is thin, say so and recommend `aos-build-brand-system`.
5. **Make the constraint visible.** The binding constraint from `brand/7LAYER_DIAGNOSTIC.md` must be measurable somewhere in the suite.
6. **Per BU / per domain.** Multi-BU / multi-domain clients get a per-BU / per-domain plan — never one flattened suite.
7. **Currency + timezone live in the data source, not the prompt.** Genie inherits them from the data-source / account settings — it has no prompt slot for them. Record the intended currency + timezone in the plan frontmatter (the AOS currency-guard rule) and flag any source whose setting is wrong; never claim a Genie prompt sets them.
8. **Single client.** Operate only within the granted folder; never reach outside it.
9. **Write to `metrics/DATABOARD_PLAN.md`** — never to `brand/` or `content/`.
10. **Discovery, not pronouncement.** The plan ends with *"What did we get wrong? What's missing?"* before the user accepts.
11. **Nudge, don't act.** The missing-connector nudge (Step 5.4) names the gap and the next skill — it never runs `aos-onboard` itself. One nudge, not a nag.
12. **Calculated metrics are not for Genie.** Databox marks Genie-creates-calculated-metrics as "coming soon" and the empirical build did not exercise it — treat as unsupported until proven. Every calculated / derived metric (rates, ratios, share-of-X, cross-source gaps) goes in the plan's manual-setup list as a Databox custom-metric step. A connector that *reports a ratio natively* (Google Ads' own ROAS) is a direct metric — fine.
13. **Default to 2-widget boards.** Genie's auto-layout is reliable at 2 widgets and ugly above. Prefer multiple 2-widget boards over one many-widget board; a board that genuinely needs more than 2 widgets must call out the Designer-polish step in its manual-setup list (`genie-build-recipe.md`).
14. **Always include the exclude flag + dedup.** Every Genie prompt names the dataset's exclude column (e.g. `test_mode != TRUE`) and the dedup / aggregation (e.g. `distinct count of lead_email`). Missing these is a silent data-quality bug.
15. **Verify after build — Genie's confirmations are unreliable.** Genie sometimes claims "✅ Filter applied" / "✅ Inherits board date range" when the underlying call did not propagate. The plan's manual-setup list ends in a verification checklist: date-range badge matches the board, filter actually applied (sanity-check the numbers), visualisation type matches what was asked for.

## Integration

- **Upstream:** `aos-build-brand-system` (the `brand/` intelligence this plan reads); `aos-onboard` (connects Databox and the data sources the suite needs); `aos-route-question` routes "set up a dashboard" / "what should we track" / "build a databoard" / "plan our Databox" requests here.
- **Downstream:** the Genie prompts are run by the user in Databox to build the boards; once the boards exist, `aos-measure` reads results from them and `aos-diagnose-funnel` uses the same metrics; the missing-connector gaps hand off to `aos-onboard`.

## Versioning

- **v0.2.0** — **Empirical Genie calibration** (AOS-916). Recalibrated against a real 6-iteration Databox Genie dashboard build (Wellis Export Lead Routing, 2026-05-20/21). The shifts: (1) the **canonical 2-widget pattern** + explicit visualisation-type rule — Genie's auto-layout is reliable at 2 widgets, ugly above, and BAR can default to time-series (Hard Rule 13). (2) **Always include the dataset's exclude flag + dedup** in every Genie prompt — missing them is a silent data-quality bug (Hard Rule 14). (3) **Verify-after-build** discipline — Genie's "✅ confirmed" claims are unreliable (Hard Rule 15). (4) The **manual-setup list** is now where calculated metrics, Designer polish, and verification live, separate from Genie prompts (Hard Rule 12). (5) **Currency + timezone inherit from the data source**, not the prompt (Hard Rule 7 corrected). New `reference/genie-build-recipe.md` — the 8-step build playbook + pitfalls + Layout Designer notes + alternative-tool recommendations (Looker Studio for layout precision; Google Sheets pivot for ad-hoc).
- **v0.1.0** — initial Cowork-plugin authoring (AOS-910 epic). The skill scaffold + process spec (AOS-911) and the full `reference/` method library: `databoard-archetypes.md` — the 8-archetype board library (AOS-912); `metric-source-map.md` + `layer-kpi-map.md` — the metric→source and layer→KPI maps (AOS-913); `readiness-check.md` — the data-source readiness method (AOS-914); `genie-prompt-template.md` + `plan-template.md` — the Genie-prompt and deliverable templates (AOS-915). Calibration on a real client follows in AOS-916 — archetypes, mappings, and the prompt format will need refinement after the first real runs.

**What did we get wrong? What's missing?**
