---
name: aos-diagnose-lifecycle
description: Focused L5 lifecycle / CRM diagnostic — retention, lifecycle stages, email / nurture, list health, the dormant-list and churn question. Finds where the customer relationship leaks after acquisition and produces a findings document; it does not run an email program.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: diagnostic
layer: [L5]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder; uses the HubSpot connector when present)"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (multi-domain — diagnose lifecycle per domain)
  - brand/ (ICP, OFFER, POSITIONING, 7LAYER_DIAGNOSTIC — context for the retention read)
  - ontology/findings/ (prior FNDs — dedup before emitting)
  - ontology/recommendations/ (prior RECs — dedup before emitting)
  - inbox/**/*.md (discovery material — CRM exports, email reports, lifecycle notes)
  - HubSpot MCP tools (CRM / contact / lifecycle data — when the connector is present)
outputs:
  - deliverables/<YYYY-MM>/lifecycle-diagnostic.md (the focused L5 diagnostic)
  - ontology/findings/FND-NNN-*.md (what was learned about lifecycle / retention)
  - ontology/recommendations/REC-NNN-*.md (what to do about it)
preflight:
  - client-config
connector:
  name: hubspot
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
tags: [diagnostic, intelligence, lifecycle, crm, retention, email, churn, L5, hubspot]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `inbox/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Purpose

Run a **focused L5 diagnostic**: the customer lifecycle — retention, lifecycle stages, email / nurture, list health, the dormant-list and churn question. This is the L5 (Channels / measurement / lifecycle environment) section of the seven-layer Marketing Control Framework, focused into a standalone diagnostic on what happens to the customer relationship **after acquisition**.

It **diagnoses** — it produces a findings document that names where the lifecycle leaks and why. It does **not** run an email or nurture program (no campaign building, no list segmentation execution, no automation setup). When the diagnosis is done, the program work is downstream.

**Posture:** Discovery, not pronouncement. Present observations with questions, not conclusions. Show the retention and list-health arithmetic. Invite disagreement. End the deliverable with *"What did we get wrong? What's missing?"*

**Scope boundary.** L5 is one layer. A retention symptom often traces deeper — a product gap (L3), the wrong audience acquired in the first place (L6), or a positioning gap (L2). This skill names that cross-layer suspicion and points to `aos-diagnose-7layer`; it does not diagnose those layers itself.

**Multi-domain:** If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` first and diagnose lifecycle **per domain** — never flatten retention rates or list health across domains, and never use account-level totals as one domain's lifecycle metrics.

**Evidence:** Tag every evidence item — `[DATA]`, `[OBSERVED]`, `[STATED]`, `[NARRATIVE]`, `[INFERRED]`, `[HEARSAY]`. Only `[DATA]` and `[OBSERVED]` items carry a causal claim. Keep data confidence (is the retention number real?) separate from causal confidence (does it explain the churn?). A single CRM report is never sufficient for a causal claim — triangulate.

## Connector — HubSpot (graceful degradation)

This skill is **connector-gated on HubSpot** — the CRM / contact / lifecycle data source. The gating posture mirrors `aos-route-question`: a connector counts as connected **only if its MCP tools are present in the session**.

- **HubSpot present** → pull lifecycle-stage counts, contact-list health, email engagement (open / click / unsubscribe trends), and retention / churn data through the HubSpot MCP tools. Tag everything sourced this way `[DATA]`.
- **HubSpot absent** → **degrade, do not fail.** Diagnose from local material instead: CRM exports and email reports in `inbox/`, lifecycle figures stated in `client/` or session, prior `ontology/findings/`. **Flag the data gap explicitly** in the deliverable (a "Data gap — HubSpot not connected" callout) and lower causal confidence on every finding that would have rested on CRM metrics. Recommend connecting HubSpot via `aos-onboard` for a CRM-grounded re-run.

Never invent retention numbers, list sizes, or engagement rates to fill the gap. A degraded diagnosis is an honest qualitative read with the gap named — not a fabricated quantitative one.

## Arguments

This skill operates on the **granted folder** — which is the client's folder. There is no client-slug argument: the granted-folder root is the working directory and client identity is read from `client/CLIENT_CONFIG.md` / `AOS_CONFIG.md`.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, the folder hasn't been onboarded — suggest `aos-onboard`.
3. **Connector check** — determine whether the HubSpot MCP tools are present in the session. Record the result; it sets the diagnostic mode (CRM-grounded vs degraded) and is stated in the deliverable.
4. If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` before any lifecycle work.
5. Scan `brand/` for context (ICP, OFFER, POSITIONING, 7LAYER_DIAGNOSTIC) and `inbox/` for CRM / email material.

### Step 1 — Map the lifecycle

Reconstruct the post-acquisition lifecycle stage by stage — from new contact through active, at-risk, dormant, and churned. The stage model and the per-stage diagnostic questions are in `reference/lifecycle-method.md`. Mark each stage with its source (HubSpot metric, CRM export, stated, inferred).

### Step 2 — Locate the leak

Assess **list health** (deliverability, engaged share, dormant share), **retention curve** (how cohorts decay), and **lifecycle stage flow** (where contacts stall or drop). Find the **worst leak** — the stage or list segment bleeding the most value. Show the arithmetic. The list-health bands, retention math, and leak-pattern library are in `reference/lifecycle-method.md`.

### Step 3 — Diagnose the cause

For the worst leak (and any secondary leaks), name the **likely cause** using the leak-pattern → cause mapping in `reference/lifecycle-method.md` (dormant-list neglect, no nurture path, weak onboarding, poor segmentation, deliverability decay, no win-back, etc.). Run the **cross-layer check**: is the true cause inside L5, or is L5 carrying a symptom of L3/L6/L2? State the suspicion; do not diagnose the deeper layer here.

### Step 4 — Synthesise and emit

1. Write the focused diagnostic to `deliverables/<YYYY-MM>/lifecycle-diagnostic.md` using `reference/report-template.md`. Resolve the `deliverables` zone via `AOS_CONFIG.md`.
2. **Emit ontology artifacts.** For each substantive lifecycle finding, write an `FND` to `ontology/findings/`; for each recommended fix direction, write a `REC` to `ontology/recommendations/`. Use the FND/REC frontmatter from `ontology/README.md` (`layer: L5`, `source: aos-diagnose-lifecycle`, `consumes`/`emits` edges). **Dedup first** — scan existing `ontology/findings/` and `ontology/recommendations/` and supersede or reference rather than duplicate.
3. Present the draft to the user before writing — Accept / Revise / Regenerate.

## Output Sections

Minimum content for the deliverable:

- Context used (files, HubSpot metrics or the data-gap note, sessions)
- Connector status — HubSpot connected / degraded
- Lifecycle map — stages with retention / flow arithmetic
- List health — deliverability, engaged share, dormant share
- Findings — each with evidence class and confidence; the worst leak called out
- Cross-layer suspicion — if L5 is carrying a deeper symptom
- Recommended fix directions (the REC shortlist — not an executed email program)
- **What did we get wrong? What's missing?**

The deliverable shell and the FND/REC emission format are in `reference/report-template.md`.

## Hard Rules

1. **Diagnose, don't execute.** Produce a findings document and RECs. Do not run an email / nurture program — no campaign building, no list segmentation execution, no automation setup.
2. **Degrade, never fail, when HubSpot is absent.** Diagnose from local material and flag the data gap. Never fabricate retention numbers, list sizes, or engagement rates.
3. Do not claim causality from a single CRM report alone — triangulate.
4. Multi-domain: never flatten retention or list health across domains.
5. L5 is one layer — name cross-layer suspicions, do not diagnose L2/L3/L6 here.
6. Single client — operate only within the granted folder; never reach outside it.
7. Write deliverables to `deliverables/<YYYY-MM>/` and FND/REC to `ontology/` — never to `brand/`. This skill produces a diagnostic, not a brand-profile file.
8. **Privacy.** Diagnose lifecycle in aggregate — stage counts, cohort rates, segment shares. Do not enumerate or export individual contacts from the CRM.

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder, connects HubSpot); `aos-route-question` routes L5 retention / CRM / lifecycle questions here; `aos-diagnose-7layer` when its L5 pass flags lifecycle as the constraint.
- **Downstream:** the FND/REC emitted here flow into `TASKS.md` and into email-program / nurture / win-back fix work. If the cross-layer check points deeper, hand off to `aos-diagnose-7layer`.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-743). Focuses the `aos-diagnose-7layer` L5 methodology into a standalone lifecycle diagnostic. List-health bands and leak-pattern tables likely need refinement after first real runs.

**What did we get wrong? What's missing?**
