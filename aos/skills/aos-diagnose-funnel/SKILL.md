---
name: aos-diagnose-funnel
description: Focused L4 funnel / conversion diagnostic — conversion paths, landing pages, funnel drop-off, the CRO question. Finds where and why the funnel leaks and produces a findings document; it does not run a full CRO program.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: diagnostic
layer: [L4]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder; uses the Databox connector when present)"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (multi-domain — diagnose the funnel per domain)
  - brand/ (POSITIONING, ICP, OFFER, 7LAYER_DIAGNOSTIC — context for the conversion read)
  - ontology/findings/ (prior FNDs — dedup before emitting)
  - ontology/recommendations/ (prior RECs — dedup before emitting)
  - inbox/**/*.md (discovery material — funnel screenshots, analytics exports, landing-page copy)
  - Databox MCP tools (conversion / funnel metrics — when the connector is present)
outputs:
  - deliverables/<YYYY-MM>/funnel-diagnostic.md (the focused L4 diagnostic)
  - ontology/findings/FND-NNN-*.md (what was learned about the funnel)
  - ontology/recommendations/REC-NNN-*.md (what to do about it)
preflight:
  - client-config
connector:
  name: databox
  required: false
  degrades: true
ontology:
  consumes: [FND, REC, Layer, Goal]
  emits: [FND, REC]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
tags: [diagnostic, intelligence, funnel, conversion, cro, L4, databox]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `inbox/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

Run a **focused L4 diagnostic**: the funnel — conversion paths, landing pages, funnel drop-off, the CRO question. This is the L4 (Offer / funnel / conversion behavior) section of the seven-layer Marketing Control Framework, focused into a standalone diagnostic.

It **diagnoses** — it produces a findings document that names where the funnel leaks and why. It does **not** run a full CRO program (no test backlog grooming, no variant production, no implementation). When the diagnosis is done, the fix work is downstream.

**Posture:** Discovery, not pronouncement. Present observations with questions, not conclusions. Show the drop-off arithmetic. Invite disagreement. End the deliverable with *"What did we get wrong? What's missing?"*

**Scope boundary.** L4 is one layer. A funnel symptom often traces to a deeper layer — a positioning gap (L2), the wrong audience (L6), or a belief block (L0). This skill names that cross-layer suspicion and points to `aos-diagnose-7layer`; it does not diagnose those layers itself.

**Multi-domain:** If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` first and diagnose the funnel **per domain** — never flatten conversion rates across domains, and never use account-level totals as one domain's funnel metrics.

**Evidence:** Tag every evidence item — `[DATA]`, `[OBSERVED]`, `[STATED]`, `[NARRATIVE]`, `[INFERRED]`, `[HEARSAY]`. Only `[DATA]` and `[OBSERVED]` items carry a causal claim. Keep data confidence (is the conversion number real?) separate from causal confidence (does it explain the leak?). A single channel's analytics is never sufficient for a causal claim — triangulate.

## Connector — Databox (graceful degradation)

This skill is **connector-gated on Databox** — the conversion / funnel metrics source. The gating posture mirrors `aos-route-question`: a connector counts as connected **only if its MCP tools are present in the session**.

- **Databox present** → pull funnel-stage metrics, conversion rates, landing-page performance, and trend data through the Databox MCP tools. Tag everything sourced this way `[DATA]`.
- **Databox absent** → **degrade, do not fail.** Diagnose from local material instead: analytics exports and screenshots in `inbox/`, funnel numbers stated in `client/` or session, landing-page copy, prior `ontology/findings/`. **Flag the data gap explicitly** in the deliverable (a "Data gap — Databox not connected" callout) and lower causal confidence on every finding that would have rested on funnel metrics. Recommend connecting Databox via `aos-onboard` for a metrics-grounded re-run.

Never invent funnel numbers to fill the gap. A degraded diagnosis is an honest qualitative read with the gap named — not a fabricated quantitative one.

## Arguments

This skill operates on the **granted folder** — which is the client's folder. There is no client-slug argument: the granted-folder root is the working directory and client identity is read from `client/CLIENT_CONFIG.md` / `AOS_CONFIG.md`.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, the folder hasn't been onboarded — suggest `aos-onboard`.
3. **Connector check** — determine whether the Databox MCP tools are present in the session. Record the result; it sets the diagnostic mode (metrics-grounded vs degraded) and is stated in the deliverable.
4. If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` before any funnel work.
5. Scan `brand/` for context (POSITIONING, ICP, OFFER, 7LAYER_DIAGNOSTIC) and `inbox/` for funnel material.

### Step 1 — Map the funnel

Reconstruct the conversion path stage by stage — from first touch to converted. The stage model and the per-stage diagnostic questions are in `reference/funnel-method.md`. Mark each stage with its source (Databox metric, analytics export, stated, inferred).

### Step 2 — Locate the leak

Compute stage-to-stage drop-off and find the **worst leak** — the stage losing the most value relative to a sensible benchmark. Show the arithmetic. The drop-off tables, benchmark bands, and leak-pattern library are in `reference/funnel-method.md`.

### Step 3 — Diagnose the cause

For the worst leak (and any secondary leaks), name the **likely cause** using the leak-pattern → cause mapping in `reference/funnel-method.md` (landing-page mismatch, friction, weak offer framing, ad-to-page incongruence, trust gap, etc.). Run the **cross-layer check**: is the true cause inside L4, or is L4 carrying a symptom of L2/L6/L0? State the suspicion; do not diagnose the deeper layer here.

### Step 4 — Synthesise and emit

1. Write the focused diagnostic to `deliverables/<YYYY-MM>/funnel-diagnostic.md` using `reference/report-template.md`. Resolve the `deliverables` zone via `AOS_CONFIG.md`.
2. **Emit ontology artifacts.** For each substantive leak finding, write an `FND` to `ontology/findings/`; for each recommended fix direction, write a `REC` to `ontology/recommendations/`. Use the FND/REC frontmatter from `ontology/README.md` (`layer: L4`, `source: aos-diagnose-funnel`, `consumes`/`emits` edges). **Dedup first** — scan existing `ontology/findings/` and `ontology/recommendations/` and supersede or reference rather than duplicate.
3. Present the draft to the user before writing — Accept / Revise / Regenerate.

## Output Sections

Minimum content for the deliverable:

- Context used (files, Databox metrics or the data-gap note, sessions)
- Connector status — Databox connected / degraded
- Funnel map — stages with drop-off arithmetic
- Findings — each with evidence class and confidence; the worst leak called out
- Cross-layer suspicion — if L4 is carrying a deeper symptom
- Recommended fix directions (the REC shortlist — not an executed CRO program)
- **What did we get wrong? What's missing?**

The deliverable shell and the FND/REC emission format are in `reference/report-template.md`.

## Hard Rules

1. **Diagnose, don't execute.** Produce a findings document and RECs. Do not run a CRO program — no variant production, no test execution.
2. **Degrade, never fail, when Databox is absent.** Diagnose from local material and flag the data gap. Never fabricate funnel numbers.
3. Do not claim causality from a single channel's analytics alone — triangulate.
4. Multi-domain: never flatten conversion rates across domains.
5. L4 is one layer — name cross-layer suspicions, do not diagnose L0/L2/L6 here.
6. Single client — operate only within the granted folder; never reach outside it.
7. Write deliverables to `deliverables/<YYYY-MM>/` and FND/REC to `ontology/` — never to `brand/`. This skill produces a diagnostic, not a brand-profile file.

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder, connects Databox); `aos-route-question` routes L4 conversion questions here; `aos-diagnose-7layer` when its L4 pass flags the funnel as the constraint.
- **Downstream:** the FND/REC emitted here flow into `TASKS.md` and into CRO / landing-page / offer fix work. If the cross-layer check points deeper, hand off to `aos-diagnose-7layer`.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-743). Focuses the `aos-diagnose-7layer` L4 methodology into a standalone funnel diagnostic. Benchmark bands and leak-pattern tables likely need refinement after first real runs.

**What did we get wrong? What's missing?**
