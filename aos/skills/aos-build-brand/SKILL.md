---
name: aos-build-brand
description: Deliberately build, grow, or pivot a brand by engineering strategic associations that lower CAC, raise LTV, and compound advantage.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L1, L2]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder)"
inputs:
  - client/CLIENT_CONFIG.md
  - brand/
  - Optional market / persona research supplied in session
outputs:
  - brand/*.md (the Client Intelligence Profile — belief, brand, positioning, voice, customer profile as applicable)
  - Session deliverable using reference/report-template.md
preflight:
  - client-config
ontology:
  consumes: [Layer, Goal, FND]
  emits: [REC, Goal]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: false
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `content/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

Deliberately build, grow, or pivot a brand for profit by engineering **strategic brand associations** that lower acquisition cost, increase lifetime value, and build durable advantage.

**Core principle:** Branding means pairing the business with things the ideal customers already like, trust, or aspire to.

**Posture:** Discovery, not pronouncement — present every finding as a draft with sources for the user to correct, never as a verdict.

## Process

### What branding is

```
BRANDING = Pairing your business with things your ideal customers like

Good Branding → Pair with things the majority of the ideal audience LIKES
Bad Branding  → Pair with things the majority DISLIKES
No Branding   → Invisible — exposure does not change behavior
```

**Not:** logos/fonts alone (design); vague vibes; accidents — branding must be deliberate.

### Measuring brand

| Variable | Definition | Measurement |
|----------|------------|-------------|
| **Reach** | How many know you | Audience size, impressions |
| **Influence** | Likelihood behavior changes | Engagement, response |
| **Direction** | Toward purchase vs away | Qualitative + behavioral |

```
Strong Brand = High Reach + High Influence + Towards direction
Weak Brand   = Low Reach OR Low Influence OR Away direction
Ultimate measure: economic outcome over the horizon you choose (with transparent window).
```

### Four-step loop

1. **Ideal customer** — Four criteria: growing market, has money, easy to target, in pain. Score 0–4 on avatar fit.
2. **What they like** — Outcomes, problems, admired people, content, values, experiences, adjacent products.
3. **Associate** — Bouquet metaphor: many associations woven together (content, people, experiences, products, values). Authority ladder: what you say < what others say < what they experience.
4. **Optimize for profit** — Directions: up/down market, adjacent, broader, narrower. Document net trade of pivot (who you lose vs gain).

### Pivots

Every pivot: estimate who you **lose**, who you **gain**, net positive/negative, and whether the new audience buys what you sell.

### Brand mistakes

Do not try to erase a bad association. **Overwhelm** with positive associations, keep promises, let time dilute. Major controversy: recovery still depends on product truth and sustained positive signal — not empty repetition.

### Deliverable shell

Use **`reference/report-template.md`** for the full structured layout.

### Belief blocks (common)

| Weak branding behavior | Possible underlying belief |
|------------------------|----------------------------|
| Won't charge premium | Worth / deserving |
| Associates with everyone | Fear of exclusion |
| Avoids strong positioning | Fear of alienation |
| Copies competitors | Outsourced judgment |
| Constant message churn | Learned helplessness |
| Won't stand next to larger brands | Belonging / status |

### Branding cycle (summary)

Advertising and content shape short-term associations; **product experience** dominates long-term word of mouth. Virtuous vs vicious cycles depend on promise–delivery match.

### One-page checklist

- Ideal avatar (growing, pain, money, findable)
- What they like
- Associate via content, products, people they respect
- Grow strategically (up/down/adjacent/broader/narrower)
- Advertising for reach; product for truth
- Recover from mistakes with surplus positive signal
- Long horizon (multi-year) realistic expectations

## Output Sections

For `class: execute`, include:

- **Change plan** (associations to add/remove, direction)
- **Applied changes** (files updated under `brand/` when applicable)
- **Safeguards / checks** (what to verify in market)
- **Rollback guidance** (how to revert messaging or positioning experiments)

Always end with: **What did we get wrong? What's missing?**

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

1. Write or update brand intelligence files only under the `brand/` zone of the granted folder; follow the Client Intelligence Profile layout (the 7 standard `brand/` files — see `aos-build-brand-system`).
2. Do not invent financial results — show assumptions and invite correction.
3. For major pivots, cross-check with idea validation / market evidence when those skills or data are in scope.
4. Trace beliefs when the client resists visibility, premium pricing, or narrow positioning — often L0/L2, not “the algorithm.”

## Integration

- **Upstream:** Seven-layer diagnosis when L2/L6 brand–customer misalignment is the constraint.
- **Downstream:** Copy and creative checks, results mapping, assumption validation before large pivots.

## Example (abbreviated)

**Input:** “Business coach for women entrepreneurs — invisible, everyone looks the same.”

**Output sketch:** Avatar 4/4 on criteria; diagnosis = generic associations; recommendation = **narrower** positioning and outcome-specific proof; new content and partnership angles tied to that slice; belief work if visibility or premium resistance appears.

(Full ASCII layout: `reference/report-template.md`.)
