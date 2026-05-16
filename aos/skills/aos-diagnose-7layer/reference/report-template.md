# 7-layer — Report templates

Structured output shells for Marketing Röntgen (Mode 1), Pattern Map (Mode 2), Constraint Drill (Mode 3), and Competitive Matrix. Use with the main skill’s evidence and confidence rules.

---

## Mode 1 — Marketing Röntgen (quick diagnostic)

```
## MARKETING RÖNTGEN: [Company Name]

### Business Context
[Brief summary]

---

### Layer Scan

| Layer | Status | Key Finding |
|-------|--------|-------------|
| L7: Market | ... | ... |
| L6: Customer | ... | ... |
| L5: Channels | ... | ... |
| L4: Offer | ... | ... |
| L3: Product | ... | ... |
| L2: Identity | ... | ... |
| L1: Core | [Strong/Attention/Constraint] | [One-line finding] |
| L0: Source | [Strong/Attention/Constraint/Inferred] | [One-line finding — may be inferred] |

---

### TOP 5 PROBLEMS (ranked by business impact)

1. **[Problem]** — Layer [X]
   Why it matters: [Impact on business]
   What to do: [Specific action]

2. ...

---

### PRIMARY CONSTRAINT
**Layer:** [X] — [Name]
**Why this layer:** [How fixing this unlocks other layers]

### CASCADE MAP
[Show how the primary constraint flows into other layer problems]

### THE EXPENSIVE MISTAKE
[What they'll likely try to fix instead — and why it won't work]

### WHAT TO DO FIRST
[One clear next step]
```

---

## Mode 2 — Pattern Map (full diagnosis)

```
## PATTERN MAP: [Company Name]

### Business Context
[Summary]

---

### Layer 7: Market
**Status:** [Strong / Needs Attention / Constraint]
**Findings:**
- [Key observations]
**Shadow (Hidden Assumption):**
- [What they believe that may not be true]
**Red Flags:**
- [Warning signs]

[Repeat for L6 down to L1]

### Layer 0: Source
**Status:** [Strong / Needs Attention / Constraint / Insufficient Data]
**Findings:**
- [Identity patterns observed, belief markers, delegation behavior]
**Identity Pattern:** [Helper/Martyr, Expert/Imposter, etc. — if identifiable]
**Shadow (Hidden Assumption):**
- [Transparent beliefs — what they experience as "reality"]
**L0→L1 Connection:**
- [How L0 beliefs create or perpetuate L1 problems]

---

### THE PATTERN MAP (Cascade)

[Visual cascade showing how problems connect across layers, including L0 root]

---

### PRIMARY CONSTRAINT
**Layer:** [X] — [Name]
**Why this layer:** [How fixing it unlocks everything above]
**L0 Root (if applicable):** [The belief/identity pattern underneath]

### SECONDARY CONSTRAINTS
[Other layers needing attention, in priority order]

---

### RECOMMENDED ACTIONS
1. [Most important — addresses primary constraint]
2. [Second action]
3. [Third action]

### WHAT NOT TO DO
[The expensive mistake — what they'll try instead and why it'll fail]

### THE DIRECTION RULE
Problems flow outward (L0→L7). Fixes flow inward.
[Explain the specific cascade in this business]
```

---

## Mode 3 — Constraint drill (single layer)

```
## CONSTRAINT DRILL: Layer [X] — [Name]

### Current State
[What's happening at this layer]

### Root Cause (within layer)
[The deepest issue at this level]

### Cross-Layer Connections
- Caused by: [deeper layer issue, if any]
- Causing: [outer layer symptoms]

### Fix Sequence
1. [First action — addresses root within layer]
2. [Second action]
3. [Third action]

### Success Signals
[How to know when this constraint is resolved]

### What Opens Up
[Which outer layers improve when this is fixed]
```

---

## Competitive Matrix (2D)

```
COMPETITIVE MATRIX: [Client] vs. Market

| Layer              | [Client]    | [Competitor A] | [Competitor B] | [Competitor C] | Gap/Opportunity |
|--------------------|-------------|----------------|----------------|----------------|-----------------|
| L6: Customer       | [findings]  | [findings]     | [findings]     | [findings]     | [where's the gap?] |
| L5: Channels       | [findings]  | [findings]     | [findings]     | [findings]     | [where's the gap?] |
| L4: Offer          | [findings]  | [findings]     | [findings]     | [findings]     | [where's the gap?] |
| L3: Product        | [findings]  | [findings]     | [findings]     | [findings]     | [where's the gap?] |
| L2: Identity       | [findings]  | [findings]     | [findings]     | [findings]     | [where's the gap?] |

L7 (Market) is the same for all — macro forces affect everyone equally.
L0 (Source) and L1 (Core) are internal — competitors' L0/L1 can only be inferred, not directly observed.
```

End every deliverable with the discovery prompt: **What did we get wrong? What's missing?**
