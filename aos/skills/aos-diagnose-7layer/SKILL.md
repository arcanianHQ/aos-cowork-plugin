---
name: aos-diagnose-7layer
description: Seven-layer marketing diagnostic (L0–L7); finds the primary constraint, the cascade map, and a pattern map using the Marketing Control Framework.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: diagnostic
layer: [L0, L1, L2, L3, L4, L5, L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "[--mode=1|2|3] [--peer-review] — operates on the granted folder"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml
  - brand/ (existing intelligence — POSITIONING, ICP, BELIEF_PROFILE, etc.)
  - ontology/recommendations/ (prior RECs — dedup before emitting new ones)
  - ontology/findings/ (prior FNDs)
  - inbox/**/*.md (discovery material — strategy, transcripts, research)
outputs:
  - brand/7LAYER_DIAGNOSTIC.md (canonical profile slot)
  - deliverables/<YYYY-MM>/ (engagement deliverable, when run as a standalone session)
preflight:
  - client-config
ontology:
  consumes: [FND, REC, Layer, Goal]
  emits: [FND, REC, Layer]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
tags: [diagnostic, intelligence, seven-layer, constraint]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `inbox/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

Diagnose a business's marketing using the Arcanian Marketing Control Framework (L0–L7). Find the **primary constraint** — the deepest layer blocking growth — and show how problems cascade across layers. Deliver a **Pattern Map** that makes the invisible visible.

**Posture:** Discovery, not pronouncement. Present observations with questions, not conclusions. Show calculations. Invite disagreement. End every deliverable with *"What did we get wrong? What's missing?"*

**Multi-domain:** If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` first. L5 and L6 must be diagnosed **per domain** — never flatten channel/measurement/customer findings across domains, and never use account-level totals as a single domain's metrics.

**Evidence:** Tag every evidence item — `[DATA]`, `[OBSERVED]`, `[STATED]`, `[NARRATIVE]`, `[INFERRED]`, `[HEARSAY]`. Keep data confidence separate from causal confidence: a single channel's analytics is never sufficient for a causal claim — triangulate (e.g. ads UI + analytics). Before emitting new RECs, check `ontology/recommendations/` for existing RECs on the same constraint to avoid duplicates.

**Principles (summary):**

- *Every campaign result reveals the assumption that created it.*
- *You control marketing — not the other way around.*
- Sales and marketing are **one system** at L0–L7; diagnose the system, not a single department.

## Arguments

This skill operates on the **granted folder** — which is the client's folder. There is no client-slug argument: the granted-folder root is the working directory and client identity is read from `client/CLIENT_CONFIG.md` / `AOS_CONFIG.md`.

- **`--mode=1|2|3`** (optional) — pick a diagnostic mode directly (see Modes below). If omitted, the skill recommends a mode from the available context depth.
- **`--peer-review`** (optional) — after the standard diagnosis, run three independent diagnostic perspectives before synthesis. Adds time/tokens.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, the folder hasn't been onboarded — suggest running `aos-onboard`.
3. If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` before any layer work.
4. Scan the `brand/` zone for existing intelligence (POSITIONING, ICP, BELIEF_PROFILE, COMPETITIVE_LANDSCAPE) and `inbox/` for discovery material.

### Architecture (perspectives)

Diagnose in four layer-grouped passes, then synthesize. Each pass weights into the final constraint judgement:

| Pass | Layers | Weight | Focus |
|------|--------|--------|-------|
| Foundation | L0 + L1 | 30% | Beliefs, identity, capability, process |
| Value | L2 + L3 | 25% | Brand identity, positioning, product, PMF |
| Delivery | L4 + L5 | 25% | Offer, pricing, channels, measurement |
| Market | L6 + L7 | 20% | Customer journey, market forces, competition |
| Synthesis | All | — | Primary constraint + cascade |

Run the four passes (in parallel sub-agents if available, otherwise sequentially), then synthesize. **Layer reference, symptom maps, per-layer questions, and pattern tables** live in `reference/diagnostic-rules.md`.

### Modes

| Mode | Name | Input (minimum) | Output |
|------|------|-----------------|--------|
| 1 | Röntgen | Website + stated challenge (+ optional data) | Top 5 problems, primary constraint |
| 2 | Pattern Map | Full context across layers | Full L0–L7 map + cascade + competitive matrix |
| 3 | Constraint drill | Known constraint layer + data for that layer | Root cause + fix sequence for that layer |

### Mode 1 — Röntgen

1. Scan L0–L7 for strength vs weakness signals (copy, data, stated goals). L0: linguistic markers, where direct observation is impossible.
2. Rate each layer: Strong / Needs Attention / Constraint.
3. **Sales–marketing unity check** on each Constraint or Needs Attention layer — diagnose whether sales and marketing target the same customer, promise, and price.
4. Trace the stated symptom to deeper layers using the tracing table in `reference/diagnostic-rules.md`.
5. Choose the **primary constraint** — the deepest layer that unlocks the layers above it.
6. Rank the **top 5 problems** by business impact.
7. Format output using `reference/report-template.md` → Mode 1.

### Mode 2 — Pattern Map

1. Gather all listed context (web, ads, revenue, segments, team, history).
2. Work outer→inner for visibility, but assess **L0 last** — it needs the richest context.
3. For **L7**, stay on macro forces only — not competitor laundry lists (players go in the Competitive Matrix).
4. For **L6**, include customer identity and the L2↔L6 bridge.
5. Map the **cascade** after all layers: deepest → symptoms.
6. Include a **Competitive Matrix** (3–6 competitors typical; more for large retail) using `reference/report-template.md`.
7. Format using `reference/report-template.md` → Mode 2.

### Mode 3 — Constraint drill

1. Map all issues **within** the chosen layer.
2. Find the deepest sub-root inside the layer.
3. Check a cross-layer cause (deeper layer?) vs a true layer-local origin.
4. Sequence fixes; define success signals.
5. Format using `reference/report-template.md` → Mode 3.

### Peer review (`--peer-review`)

When enabled: after the standard run, spawn three subagents with distinct diagnostic lenses, anonymize their findings, synthesize, then reveal. Convergent findings → higher confidence; divergent → competing-hypotheses analysis.

## Output Sections

Minimum content for every delivery:

- Context used (files, data sources, sessions)
- Findings — each with evidence class and confidence
- Cascade / primary constraint / expensive mistake (as applicable)
- Recommended next actions
- **What did we get wrong? What's missing?**

Shell layouts for Mode 1–3 and the Competitive Matrix: `reference/report-template.md`.

## Writing the result

When run inside a full engagement, write the consolidated diagnosis to `brand/7LAYER_DIAGNOSTIC.md` — the canonical profile slot consumed by `aos-build-brand-system`. When run as a standalone session, save the deliverable under `deliverables/<YYYY-MM>/`. Either way, never hard-code the path — resolve the `brand` / `deliverables` zone via `AOS_CONFIG.md`.

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
hard-code `skill_version` or `aos_schema` — read them at write time. This is
what lets a granted folder be migrated when the plugin or schema changes.

## Hard Rules

1. Do not claim causality from a single channel's analytics alone — triangulate (e.g. ads UI + analytics).
2. Multi-domain: never flatten L5/L6 across domains.
3. Competitors belong in the **Competitive Matrix**, not as a substitute for L7 macro analysis.
4. Brand and position are **overlays**, not standalone layers to "fix" in isolation.
5. Single client — operate only within the granted folder; never reach outside it.

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder).
- **Downstream:** `aos-build-brand-system` consumes `brand/7LAYER_DIAGNOSTIC.md` as the foundation file; `aos-build-brand` reads the constraint when L2/L6 brand–customer misalignment is the primary layer. After diagnosis: constraint typing, repair roadmap, belief tracing, brand/offer/GTM skills as indicated by the primary layer.

## If no business context

Ask for: what they sell, who they sell to, challenges/symptoms, data points, what they already tried — or a website URL to start.

**What did we get wrong? What's missing?**
