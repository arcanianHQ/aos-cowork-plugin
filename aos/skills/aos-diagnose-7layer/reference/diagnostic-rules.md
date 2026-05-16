# 7-layer — Diagnostic rules and layer reference

Companion to `SKILL.md`. Deterministic tables, questions, and pattern libraries used during L0–L7 analysis.

## Framework diagram (L0–L7)

```
┌─────────────────────────────────────────────────────────────────┐
│   OUTERMOST (least control)                                     │
│   L7: Market ─────────────► Is this game changing under us?      │
│   L6: Customer ───────────► Who are they — and what identity     │
│                               do they get by buying from us?    │
│   L5: Channels ───────────► Where do we actually win?           │
│   L4: Offer ──────────────► How is it packaged and priced?      │
│   L3: Product ────────────► What do we actually deliver?        │
│   L2: Identity ───────────► Who are we? What do we stand for?   │
│   L1: Core ───────────────► Can we execute? Who owns strategy?  │
│   L0: Source ─────────────► Who runs this — what do they believe? │
│   INNERMOST (most control)                                      │
│   Problems flow outward (L0→L7). Fixes flow inward (L7→L0).      │
│   Symptoms appear 2–3 layers from their cause.                  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick reference — layers

| Layer | Name | Core Question | Shadow (hidden assumption) | When it's the constraint |
|-------|------|---------------|---------------------------|--------------------------|
| **L7** | Market | Is this game changing under us? | "We know our market" | Blindsided by shifts, new entrants, strategy invalidated externally |
| **L6** | Customer | Who are they — what identity do they get? | "We serve everyone" | Product great but "people don't get it," identity clash, no loyalty |
| **L5** | Channels | Where do we win? | "We're on all channels" | Spreading thin, spend up, results flat |
| **L4** | Offer | How is it packaged? | "Price is right" | High abandonment, no urgency |
| **L3** | Product | What do we deliver? | "Our product speaks for itself" | PMF misalignment, bloat, no differentiation |
| **L2** | Identity | Who are we? What do we stand for? | "We know who we are" | Inconsistent messaging, value not communicated |
| **L1** | Core | Can we execute? Who owns strategy? | "We just need better people" | No owner, bottlenecks, team at capacity |
| **L0** | Source | Who runs this — what do they believe? | "That's just how it is" | Great report, nothing changes; identity-level resistance |

## Symptom → cause tracing (starter map)

| Client says | Symptom layer | Actual cause layer | Possible L0 root |
|-------------|---------------|--------------------|------------------|
| "Ads aren't working" | L5 | L4 or L3 | — |
| "Nobody buys" | L4 | L2 or L6 | — |
| "We can't grow" | L7 | L4 (e.g. underpriced) | "I'm not worth more" |
| "Price is too high" | L4 | L2 (value gap) | — |
| "Wrong customers" | L6 | L3 | — |
| "Agency isn't delivering" | L5 | L1 | can't delegate |
| "Brand is weak" | Overlay | L7→L2→L3 cascade | — |
| "Great report, did nothing" | Implementation | L0 | identity resistance |

## Layer 7 — Market (macro forces)

**Diagnostic questions:** growth vs shrink drivers; macro forces (regulation, tech, economy, culture); new entrants; external disruptions; seasonal/political cycles; "do nothing" alternative.

**Patterns to detect:**

| Pattern | Symptom | Real problem |
|---------|---------|--------------|
| "We know our market" | Blindsided | Not tracking macro forces |
| Shrinking market | Declining despite optimization | Market shift |
| New entrant disruption | Price pressure | Platform/marketplace reshaping |
| Regulatory blind spot | Strategy invalidated | External forces not monitored |
| Ignoring "do nothing" | Inaction wins | Category demand problem |

## Layer 6 — Customer

**Dimensions:** who they are; **customer identity** (tribe, self-image, clash with brand).

**Patterns to detect:**

| Pattern | Symptom | Real problem |
|---------|---------|--------------|
| Sales–marketing mismatch | Leads vs close gap | Different customers targeted (L6 split) |
| "We serve everyone" | Diluted messaging | No clear customer |
| Demographic-only | Reach, no conversion | Missing psychographics |
| Customer ≠ User | Loved, doesn't sell | Wrong buyer |
| Identity clash | No conversion | Self-image vs brand |
| Wrong identity targeted | Price buyers only | L2 vs aspirational L6 misalignment |

## Layer 5 — Channels

**Patterns:** spreading thin; platform chasing; wrong channel for offer; channel-first (tactics before strategy).

## Layer 4 — Offer

**Patterns:** no urgency; no risk reversal; confusing options; price-value mismatch; marketing promise ≠ sales delivery; sales overrides pricing.

## Layer 3 — Product

**Patterns:** "product speaks for itself"; feature bloat; copy-paste competitor; over-engineered; undifferentiated service.

## Layer 2 — Identity

**Patterns:** "bit of everything"; feature-focused selling; "obvious what we offer"; misaligned perception; internal disagreement.

## Layer 1 — Core

**Patterns:** no strategy owner; overcommitted team; decision bottleneck; misaligned departments; sales–marketing blame loop; budget scattered; no single integrator.

**L0 check:** If L1 fixes don't stick, suspect L0.

## Layer 0 — Source

**Identity patterns:** Helper/Martyr; Expert/Imposter; Visible/Invisible; Abundant/Scarce; Worthy/Unworthy.

**Hungarian KKV-origin pattern (when applicable):** revenue scaled but operating model and owner identity still "small business" — L0 perpetuates L1.

**L0 shadow:** "That's just how business works" — transparent beliefs.

## Competitive matrix rules

- Competitor detail belongs in the matrix (L2–L6 columns), **not** stuffed into L7 narrative.
- L7 = macro forces shared by the category.
- L0/L1 for competitors: infer from language only.

## Common cascade patterns (sketches)

**Third agency, same results:** L0 delegation block → L1 no ownership → L2 unclear identity → L5 agency optimizes wrong layer → symptom.

**We can't grow:** L0 worth → L2 weak value → L4 underpriced → symptom.

**Ads aren't working:** L1 no owner → L3 undifferentiated → L5 price competition → symptom.

**Great report, nothing changed:** L0 transparent beliefs → L1 non-execution → symptom.

**Brand doesn't connect:** L0 "everyone" → L6 vague → L3 everything → L5 scattered → symptom.

## Key principles (short form)

1. Symptoms ≠ causes (often 2–3 layers away).
2. Expensive mistake = optimizing the wrong layer.
3. Direction rule: problems outward (L0→L7), fixes inward (L7→L0).
4. Brand is an overlay (L3–L7 alignment), not a standalone "layer fix."
5. Position is an overlay (L2×L3×L4), not a separate tweak.
6. Layers interact; use a cascade map, not a flat checklist.
7. L2↔L6 identity bridge must hold or conversion fails.
8. Competitive matrix is parallel to L7; do not merge into one wall of text.
9. Every layer has a **shadow** assumption; L0's is often invisible to the owner.
10. L0→L1: L0 makes L1 problems recur until beliefs shift.

## Scoring and evidence

Apply consistent scoring and evidence classes across every layer:

- **Evidence classes** — tag each item `[DATA]`, `[OBSERVED]`, `[STATED]`, `[NARRATIVE]`, `[INFERRED]`, `[HEARSAY]`. Only `[DATA]` and `[OBSERVED]` items can carry a causal claim.
- **Confidence** — keep *data confidence* (is the number real?) separate from *causal confidence* (does it explain the symptom?). State both.
- **Layer scoring** — rate each layer Strong / Needs Attention / Constraint from the weight of evidence in that layer's pass; the synthesis weights Foundation 30% / Value 25% / Delivery 25% / Market 20% when there is no single dominant constraint.
- **Peer review** — when `--peer-review` runs, three lenses diagnose independently; convergent findings raise confidence, divergent findings become competing hypotheses to test, not a single verdict.
