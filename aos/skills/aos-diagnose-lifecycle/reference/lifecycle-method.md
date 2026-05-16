---
scope: int-company
---

# Lifecycle method — the L5 retention / CRM diagnostic

Companion to `SKILL.md`. Deterministic tables, stage model, questions, and the
leak-pattern library used during the L5 lifecycle diagnosis. Grounded in the L5
section of the seven-layer Marketing Control Framework
(`aos-diagnose-7layer/reference/diagnostic-rules.md` → Layer 5 — Channels).

## Where L5 sits

L5 is the **Channels / measurement / lifecycle environment** layer of the
Marketing Control Framework — where the business wins, and how it keeps a
customer once won. In the seven-layer model L5's shadow assumption is *"we're
on all channels"*; its constraint signature is *spreading thin, spend up,
results flat*. This skill focuses the **post-acquisition** half of L5: the CRM,
the list, the lifecycle. Acquisition-side channel mix is a sibling concern; if
the question is "which channels should we be on", that is the broader L5 read,
not this diagnostic.

```
Problems flow outward (L0->L7). A churn / dormant-list symptom is an L5 symptom -
but the cause may sit at L5, or deeper (L3 product gap, L6 wrong audience
acquired, L2 positioning). Always run the cross-layer check.
```

## The lifecycle stage model

A generic post-acquisition stage model — adapt the stage names to the client's
actual lifecycle (read it from `brand/OFFER.md`, the CRM lifecycle stages, and
the channel map). Diagnose **per domain** for multi-domain clients.

| Stage | What it is | Typical metric |
|-------|------------|----------------|
| New | Just acquired — first contact / first purchase | new contacts / new customers per period |
| Onboarding | Being activated into the product / relationship | activation rate, first-value time |
| Active | Engaging, buying, opening | active share, repeat rate |
| At-risk | Engagement decaying — early churn signal | declining open / login / purchase recency |
| Dormant | No engagement for a defined window | dormant share of list |
| Churned | Gone — unsubscribed, lapsed, cancelled | churn rate, lapsed count |
| Won-back | Re-activated from dormant / churned | win-back rate |

Not every business has all stages. A pure e-commerce list may collapse
Onboarding into New; a subscription business keeps every stage distinct. Map
the **real** lifecycle before measuring it.

## List health

Three list-health reads, computed per domain / per list:

```
deliverable share   = deliverable contacts / total list
engaged share       = engaged (opened/clicked in window) / deliverable
dormant share       = dormant (no engagement in window) / deliverable
```

A large list with a low engaged share is not an asset — it is a deliverability
risk. The **dormant-list question** is the classic L5 finding: a big list, a
small engaged core, no nurture or win-back path keeping the middle alive.

## Retention math

For cohort retention, compute per cohort:

```
period-N retention  = active at period N / cohort size at period 0
```

Plot the decay. A healthy curve flattens (a stable retained core); a curve that
decays to near-zero means no relationship is being built post-acquisition.
Compare cohorts over time — improving or worsening.

## Health bands (starter — directional only)

Bands are directional and category-dependent. State the band used and its
source; never present a band as a hard target.

| Metric | Healthy band (directional) | Investigate when |
|--------|----------------------------|------------------|
| Engaged share of list | 20–40%+ | < 15% |
| Dormant share of list | < 40% | > 60% |
| Email unsubscribe rate | < 0.5% per send | > 1% |
| Repeat / retention rate | category-dependent | trending down across cohorts |
| Win-back rate | 5–15% of targeted dormant | ~0% (no win-back exists) |

When HubSpot is connected, prefer the client's own historical trend as the
benchmark over a generic band.

## Leak-pattern -> cause library

| Leak pattern | Symptom | Likely L5 cause | Cross-layer suspect |
|--------------|---------|-----------------|---------------------|
| Dormant-list dominance | Huge list, tiny engaged core | No nurture / no win-back path; list never tended | L5 |
| Onboarding collapse | New contacts never activate | No onboarding sequence; weak first-value | L3 product gap |
| Retention curve to zero | Every cohort decays to nothing | No lifecycle program; one-and-done relationship | L3 / L6 |
| Engagement decay | Open / click rates falling over time | Stale content; over-mailing; deliverability decay | L5 |
| High unsubscribe | Sends bleed the list | Wrong frequency / relevance; bad segmentation | L6 wrong audience |
| At-risk invisible | Churn happens with no warning | No at-risk detection; no recency tracking | L5 |
| Churn high, acquisition fine | Funnel converts, customers leave fast | Product / expectation gap, not lifecycle tactics | L3 / L2 |
| Segments treated as one | One message to the whole list | No segmentation; lifecycle stage ignored | L5 |

## Per-stage diagnostic questions

**New -> Onboarding.** Is there an onboarding / welcome sequence at all? Does a
new contact reach first value? Is the first 30 days deliberate or silent?

**Onboarding -> Active.** What turns an onboarded contact into an active one?
Is there a reason to come back? Is engagement measured?

**Active -> At-risk.** Is at-risk defined and detected? Is engagement recency
tracked? Does anything trigger when a contact starts to decay?

**At-risk -> Dormant.** Is there an intervention before a contact goes dormant?
Or does the list silently accumulate dead weight?

**Dormant -> Won-back / Churned.** Is there a win-back path? Is dormant ever
re-engaged or pruned? Or does the dormant share just grow?

**List health.** Deliverability trend? Engaged share? Is the list segmented by
lifecycle stage, or mailed as one block? Unsubscribe trend?

## Cross-layer check

Before finalising, ask for the worst leak: *would fixing the lifecycle program
actually fix retention?* If customers leave fast no matter the nurture, the
constraint is not L5 — it is the product (L3), the audience acquired (L6), or a
positioning / expectation gap (L2). State the suspicion as a hypothesis and
recommend `aos-diagnose-7layer`. Do **not** diagnose the deeper layer in this
skill.

## Degraded mode (HubSpot absent)

Without HubSpot, retention and list-health arithmetic rest on whatever local
numbers exist — CRM exports and email reports in `inbox/`, figures stated in
`client/` or session. When no numbers exist at all, the diagnosis becomes
**qualitative**: a structured read of the lifecycle program (does an onboarding
sequence exist? a win-back path? segmentation?) against the leak-pattern
library, with every finding tagged `[OBSERVED]` or `[INFERRED]` and **causal
confidence held low**. Always include the data-gap callout and recommend
connecting HubSpot for a quantified re-run.
