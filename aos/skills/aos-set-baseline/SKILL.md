---
name: aos-set-baseline
description: "Establish the performance baseline for a metric or channel before a campaign or change — seasonality-aware, so later measurement compares against an honest reference, not a misleading last-month number. Databox-aware; degrades to stated history. Produces a baseline record. Trigger on 'set the baseline', 'what's normal for this metric', 'baseline before the campaign'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: diagnostic
layer: [L4, L5, L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "--metric=\"<metric>\" [--channel=<channel>] [--bu=<bu-slug>] — operates on the granted folder; uses Databox when present"
inputs:
  - client/CLIENT_CONFIG.md
  - Databox MCP tools (metric history — when the connector is present)
  - inbox/**/*.md (analytics exports, stated historical figures)
  - deliverables/ (prior results / baselines, if any)
  - ontology/findings/ (prior FNDs on the same metric)
outputs:
  - deliverables/<YYYY-MM>/baseline-<metric-slug>.md (the baseline record)
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
depends_on: []
tags: [baseline, measurement, seasonality, diagnostic, databox]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language.

## Purpose

`aos-set-baseline` establishes the **honest reference point** for a metric before
a campaign, a change, or a measurement period — so that when `aos-measure` later
asks "did it work?", there is something fair to compare against.

The trap it exists to avoid: **"last month" is not a baseline.** A retailer's
December is not a fair reference for January; a B2B metric in August is not the
year's normal. Comparing a result against a single recent period — when the
metric has a seasonal pattern — produces false wins and false alarms. This skill
sets a baseline that is **seasonality-aware**: it reads enough history to see the
pattern, and states the baseline as a **band**, not a single number.

**Connector — Databox.** With Databox connected, the skill pulls the metric's
real history. Without it, it degrades to stated history and `inbox/` exports —
and **flags the data gap**; it never fabricates a trend.

**Anti-goal.** `aos-set-baseline` does not measure a result (that is `aos-measure`)
and does not diagnose *why* a metric sits where it does (the `aos-diagnose-*`
skills). It establishes the reference; the loop measures against it.

## Posture

Discovery, not pronouncement. A baseline is a **stated band with its evidence and
its confidence** — never a hard number presented as truth. Where the history is
too short to see seasonality, the skill says so and sets a provisional baseline,
labelled provisional.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Connector check** — record whether the Databox MCP tools are present (sets metrics-grounded vs degraded mode).
4. Resolve the `--metric` (and `--channel` / `--bu` if given).

### Step 1 — Gather history

Pull the metric's history — **Databox** (`[DATA]`) when connected, else stated
figures + `inbox/` exports (`[STATED]` / `[OBSERVED]`). Gather **enough span to
see a seasonal cycle** — ideally 13+ months so a year-over-year pattern is
visible; if only a few months exist, note the limit.

### Step 2 — Read seasonality

Inspect the history for a seasonal pattern — a recurring monthly / quarterly
shape, known peaks and troughs (a retail December, a B2B summer dip). State the
pattern found, or state plainly that the history is too short to see one. Never
invent a seasonal adjustment the data does not support.

### Step 3 — Set the baseline band

Set the baseline as a **band** — a typical-range low–high for the metric,
adjusted for where in the seasonal cycle the upcoming measurement window falls.
Show the arithmetic: which periods fed the band, the seasonal adjustment applied,
and the **confidence** (high with 13+ months of `[DATA]`; provisional with thin
or `[STATED]` history).

### Step 4 — Write

Write `deliverables/<YYYY-MM>/baseline-<metric-slug>.md` — the metric, the
baseline band, the seasonality read, the measurement window it is set for, the
evidence class, and the confidence. Present before writing.

## Provenance

The baseline record carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1; never hard-code `skill_version` / `aos_schema`.
Tag every figure with its evidence class — `[DATA]` only when it traces to a real
Databox metric or a verified export.

## Hard Rules

1. **A baseline is a band, not a number.** State a typical range with its
   confidence — never a single figure presented as the truth.
2. **Seasonality-aware.** Read enough history to see the cycle; if the history is
   too short, say so and label the baseline provisional — do not pretend.
3. **Never fabricate history.** Degraded mode (no Databox) uses stated / exported
   figures and flags the data gap — a `[DATA]` tag means a real metric.
4. **Set the reference, don't measure.** Measuring a result against the baseline
   is `aos-measure`'s job; diagnosing the metric is the diagnostics' job.
5. **Single client / per BU.** Operate only within the granted folder; baseline
   per BU where the metric differs.
6. **Discovery, not pronouncement.** Show the arithmetic; state the confidence.

## Output Sections

- Connector status — Databox connected / degraded
- The metric + the history span gathered
- Seasonality read — the pattern, or "history too short"
- The baseline band + confidence + the window it is set for
- Baseline record path
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` (Databox connection); `aos-plan` / `aos-plan-campaign` (a plan move or campaign that needs a baseline before it runs); `aos-route-question` routes "set the baseline" / "what's normal for this metric" here.
- **Downstream:** `aos-measure` reads the baseline record to judge a result against an honest reference (the against-benchmark lens); a result far outside the band is a finding worth a diagnostic.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-790 / F7, Milestone 4 feature wave). Seasonality-aware baseline determination. The seasonality detection is heuristic and likely needs refinement after first real runs; long-history clients give the strongest baselines.

**What did we get wrong? What's missing?**
