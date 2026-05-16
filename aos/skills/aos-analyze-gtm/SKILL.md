---
name: aos-analyze-gtm
description: Diagnoses a business's Go-To-Market strategy against the complete GTM Strategist framework — finds gaps, weaknesses, and opportunities before any action planning.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L2, L3, L4, L5, L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder)"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml
  - brand/ (existing intelligence — POSITIONING, ICP, 7LAYER_DIAGNOSTIC, etc.)
  - ontology/recommendations/ (prior RECs — dedup before emitting new ones)
  - ontology/findings/ (prior FNDs)
  - inbox/**/*.md (discovery material — strategy, transcripts, research)
outputs:
  - deliverables/<YYYY-MM>/ (GTM gap-analysis deliverable)
preflight:
  - client-config
ontology:
  consumes: [FND, REC, Layer]
  emits: [FND, REC]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: read-only
  requires_confirmation: false
tags: [diagnostic, intelligence, gtm, strategy]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `inbox/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Purpose

Analyzes a business's Go-To-Market strategy against the complete GTM Strategist framework to identify gaps, weaknesses, and opportunities. Provides a clear diagnosis of what is missing or underperforming **before** action planning.

**The core principle:**
> "A go-to-market strategy is the difference between a hope and a plan." — J.P. Eggers, NYU Stern School of Business

**Posture:** Discovery, not pronouncement. Present observations with questions, not conclusions. Show calculations. Invite disagreement. End every deliverable with *"What did we get wrong? What's missing?"*

## Diagnostic guardrails

- **Multi-domain.** If `client/CLIENT_CONFIG.md` (or `client/DOMAIN_CHANNEL_MAP.yaml`) lists 2+ domains, load the domain-channel map FIRST. Filter all channel/ROAS/spend queries by domain. Never use account-level totals as a single domain's metric.
- **Evidence classification.** Every evidence item must be tagged: `[DATA]`, `[OBSERVED]`, `[STATED]`, `[NARRATIVE]`, `[INFERRED]`, `[HEARSAY]`. Only `[DATA]` and `[OBSERVED]` items can carry a causal claim. Keep data confidence separate from causal confidence. GA4 alone is insufficient for causal diagnosis — always check platform-side data (Meta Ads Manager, Google Ads, etc.).
- **Attribution windows.** Before comparing conversion metrics across platforms, account for window mismatch — Google Ads (30-day click) ≠ Meta (7-day click) ≠ GA4 (data-driven). Never sum platform conversions; use GA4 as the cross-platform arbitrator. Flag any window mismatch in the finding.
- **Currency normalization.** Before summing monetary values across domains/markets, convert to the client's reporting currency and state the conversion rate and its source.
- **Dedup.** Before emitting new RECs, check `ontology/recommendations/` for existing RECs on the same gap.

## Trigger

Use this skill when:

- The client is launching a new product/service
- The current GTM isn't producing results
- The client feels "stuck" in growth
- Before creating a GTM action plan
- The client is unsure where to focus GTM efforts
- Pivoting to a new market or segment

## The GTM framework — the 6 core decisions (+ system)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GTM STRATEGIST FRAMEWORK                         │
├─────────────────────────────────────────────────────────────────────────┤
│  1. MARKET          "What terrain should we win?"                        │
│  2. EARLY CUSTOMER  "Who do we serve FIRST?"                             │
│  3. PRODUCT         "What value do we deliver?"                          │
│  4. PRICING         "How do we capture value?"                           │
│  5. POSITIONING     "How do we stand out?"                               │
│  6. GROWTH          "How do we acquire customers?"                       │
│  + GTM SYSTEM       "How do we execute?"                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, suggest running `aos-onboard`.
3. If the client has 2+ domains, load `client/DOMAIN_CHANNEL_MAP.yaml` before any analysis.
4. Scan the `brand/` zone for existing intelligence (POSITIONING, ICP, 7LAYER_DIAGNOSTIC) and `inbox/` for discovery material.

### Step 1 — Gap analysis (7 areas)

Work each of the 7 areas — MARKET, EARLY CUSTOMER PROFILE, PRODUCT, PRICING, POSITIONING, GROWTH, GTM SYSTEM. For each, ask its key questions, look for gap indicators, and compare against "what good looks like." The full per-area question lists, symptom→gap tables, and "what good looks like" criteria live in **`reference/gap-analysis-framework.md`**.

### Step 2 — Rate and prioritize

Rate each area `🔴 Critical / 🟡 Gaps Present / 🟢 Solid`. Build the **Gap Priority Matrix** (severity × urgency × effort) and pick the top 3 gaps with a recommended first focus.

### Step 3 — Belief check

Surface limiting beliefs that may be causing the gaps — what would someone have to believe to get this result? Trace deeper if the GTM block is identity-level (consider running `aos-diagnose-7layer` for L0 work).

### Step 4 — Format and write

Format the deliverable using the output template in **`reference/gap-analysis-framework.md`**. Save it under `deliverables/<YYYY-MM>/` — resolve the `deliverables` zone via `AOS_CONFIG.md`, never hard-code the path.

## Key distinctions

- **ECP (Early Customer Profile)** — for GTM: who to target FIRST.
- **ICP (Ideal Customer Profile)** — for Growth: who to target at SCALE.
- **Beachhead Strategy** — focus on one segment before expanding.
- GTM has a 3–18 month lifespan — urgency matters. Iterate fast, learn faster.

## Output sections

Minimum content for every delivery:

- Executive summary — overall GTM health + top 3 gaps + recommended focus
- Detailed gap analysis — all 7 areas
- Gap priority matrix
- Belief check
- Recommended next steps
- **What did we get wrong? What's missing?**

## Hard Rules

1. This skill is for **analysis** — not action planning. Diagnose gaps; do not write the plan.
2. Never sum platform conversions across mismatched attribution windows.
3. Multi-domain: filter every channel/spend/ROAS metric by domain; never use account-level totals.
4. Cite evidence with its class; a single channel's analytics is never a causal claim on its own.
5. Single client — operate only within the granted folder; never reach outside it.

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder); `aos-diagnose-7layer` (the L0–L7 diagnosis — run first when the GTM block looks identity-level).
- **Downstream:** GTM action planning (close the gaps); `aos-build-brand` to fix a positioning gap; idea/assumption validation when the gap is market/ECP; `aos-build-brand-system` consumes GTM findings into the Client Intelligence Profile.

## Key quotes

> "Over 95% of businesses fail in their first three years of existence."

> "If you are serving everybody, you are not doing a fantastic job for anybody."

> "A winning strategy is to create a critical mass of activities for success."

> "The best GTM strategies are simple yet proprietary."

> "In GTM, you need to be extremely careful to resist shiny objects and commit your limited resources to the mission."

**What did we get wrong? What's missing?**
