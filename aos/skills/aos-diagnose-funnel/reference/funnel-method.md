---
scope: int-company
---

# Funnel method — the L4 conversion diagnostic

Companion to `SKILL.md`. Deterministic tables, stage model, questions, and the
leak-pattern library used during the L4 funnel diagnosis. Grounded in the L4
section of the seven-layer Marketing Control Framework
(`aos-diagnose-7layer/reference/diagnostic-rules.md` → Layer 4 — Offer).

## Where L4 sits

L4 is the **Offer / funnel / conversion** layer of the Marketing Control
Framework — how the offer is packaged, priced, and turned into a converting
path. In the seven-layer model L4's shadow assumption is *"the price is right"*;
its constraint signature is *high abandonment, no urgency*. This skill focuses
that one layer.

```
Problems flow outward (L0→L7). A funnel leak is an L4 symptom — but the
cause may sit at L4, or deeper (L2 positioning, L6 wrong audience, L0 belief).
Always run the cross-layer check.
```

## The funnel stage model

A generic stage model — adapt the stage names to the client's actual path
(read it from `brand/OFFER.md`, the analytics, and the channel map). Diagnose
**per domain** for multi-domain clients.

| Stage | What it is | Typical metric |
|-------|------------|----------------|
| 1 — Reach | Saw the ad / listing / link | impressions, sessions entering |
| 2 — Click | Came to the site / landing page | clicks, landing-page sessions |
| 3 — Engage | Did something meaningful on-page | scroll depth, time, micro-conversions |
| 4 — Intent | Started the conversion action | add-to-cart, form-start, demo-page view |
| 5 — Convert | Completed the conversion | purchase, lead, signup |
| 6 — Confirm | Post-conversion follow-through | order confirmed, lead qualified |

Not every business has all six. A lead-gen funnel may collapse 4–6; an
e-commerce funnel keeps them distinct. Map the **real** path before measuring it.

## Drop-off arithmetic

For each adjacent stage pair, compute:

```
stage-to-stage rate   = stage[n+1] / stage[n]
drop-off              = 1 − stage-to-stage rate
value lost at stage   = drop-off × stage[n]   (in sessions, or in revenue terms)
```

The **worst leak** is the stage losing the most *value relative to benchmark* —
not simply the lowest rate. A 2% checkout completion may be normal; a 40%
landing-page bounce on paid traffic is not. Rank leaks by value lost against a
sensible band, and **show the arithmetic** in the deliverable.

## Benchmark bands (starter — directional only)

Bands are directional and category-dependent. State the band used and its
source; never present a band as a hard target.

| Stage transition | Healthy band (directional) | Investigate below |
|------------------|----------------------------|-------------------|
| Click → Engage | 55–80% (paid landing) | < 50% |
| Engage → Intent | 8–25% | < 5% |
| Intent → Convert | 30–70% | < 25% |
| Convert → Confirm | 90%+ | < 85% |

When Databox is connected, prefer the client's own historical trend as the
benchmark over a generic band — a stage's own 90-day baseline beats an
industry guess.

## Leak-pattern → cause library

| Leak pattern | Symptom | Likely L4 cause | Cross-layer suspect |
|--------------|---------|-----------------|---------------------|
| Click→Engage collapse | High bounce on paid traffic | Ad-to-page incongruence; slow / broken page | L5 wrong channel |
| Engage→Intent collapse | Visitors read, never start | Weak offer framing; no urgency; unclear next step | L2 positioning gap |
| Intent→Convert collapse | Carts / forms started, abandoned | Friction (length, cost surprise, account wall); weak risk reversal | L4 pricing; L0 trust |
| Convert→Confirm collapse | Sales close, leads don't qualify | Lead-quality mismatch; promise ≠ delivery | L6 wrong audience |
| Flat everywhere, low volume | Funnel "fine", nothing converts | Not an L4 leak — a demand / audience problem | L6 / L7 |
| Mobile-only collapse | Desktop fine, mobile leaks | Mobile UX / page friction | L4 |
| One-channel collapse | One source converts far worse | Channel-audience-page mismatch | L5 |

## Per-stage diagnostic questions

**Reach → Click.** Is the ad / listing promise specific? Does the click
audience match the ICP? (mostly L5/L6 — note, don't diagnose deeply here.)

**Click → Engage.** Does the landing page deliver the ad's promise within the
first screen? Page speed? Is the page built for this campaign or generic? Is
the value proposition legible in 5 seconds?

**Engage → Intent.** Is there a single clear next step? Is the offer framed
with a reason to act now? Risk reversal present? Are options clarifying or
paralysing? Is social proof near the decision point?

**Intent → Convert.** How many fields / steps / clicks to finish? Any surprise
cost, account wall, or shipping shock? Is the form mobile-usable? Is there an
abandonment recovery path?

**Convert → Confirm.** Do converts match the ICP? Is the post-conversion
follow-through reliable? Does the marketing promise survive contact with
delivery?

## Cross-layer check

Before finalising, ask for the worst leak: *would fixing this stage actually
fix the business?* If the funnel is mechanically fine but nothing converts, the
constraint is not L4 — it is demand (L6/L7), positioning (L2), or a belief
block (L0). State the suspicion as a hypothesis and recommend
`aos-diagnose-7layer`. Do **not** diagnose the deeper layer in this skill.

## Degraded mode (Databox absent)

Without Databox, drop-off arithmetic rests on whatever local numbers exist —
analytics exports in `inbox/`, figures stated in `client/` or session. When no
numbers exist at all, the diagnosis becomes **qualitative**: a structured read
of the landing pages, offer framing, and conversion path against the
leak-pattern library, with every finding tagged `[OBSERVED]` or `[INFERRED]`
and **causal confidence held low**. Always include the data-gap callout and
recommend connecting Databox for a quantified re-run.
