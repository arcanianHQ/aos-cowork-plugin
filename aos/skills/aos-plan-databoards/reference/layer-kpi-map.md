# 7+1 Layer → KPI map

Step 2 of `aos-plan-databoards` uses this map to place the client's goals on the
7+1 Layer Framework and pick metrics. It also drives **Hard Rule 5**: the binding
constraint named in `brand/7LAYER_DIAGNOSTIC.md` must be measurable somewhere in
the suite — this map says *which metrics* make a given layer visible.

The 7+1 layers (innermost / most control → outermost / least), per the
`aos-diagnose-7layer` methodology:

| Layer | Name | Databoard measurability |
|---|---|---|
| L0 | Source | **Not Databox-measurable** — beliefs of who runs it |
| L1 | Core | **Largely not Databox-measurable** — execution capability, strategy ownership |
| L2 | Identity | Partially — brand-demand signals |
| L3 | Product | Partially — engagement / quality signals |
| L4 | Offer | **Yes** — conversion & pricing economics |
| L5 | Channels | **Yes — the heart of the suite** |
| L6 | Customer | **Yes** — retention & lifetime value |
| L7 | Market | Partially — share & category signals |

**The suite lives L2–L7, heaviest at L4–L6** — which is why the skill's
`layer:` frontmatter is `[L4, L5, L6, L7]`. A databoard cannot see L0/L1.

---

## L0 — Source

The beliefs of the people who run the venture. **No Databox metric reaches
this.** If `brand/7LAYER_DIAGNOSTIC.md` names the binding constraint at L0, say
so plainly in the plan: a databoard will not surface it — the work is the
7-layer diagnostic and coaching, not a dashboard.

## L1 — Core

Can the team execute; who owns strategy. Internal-operations territory —
**largely outside Databox's reach.** Proxy signals only (e.g. output cadence,
time-to-ship) and usually not worth a board. Same note as L0: an L1 constraint is
not a measurement-infrastructure problem.

## L2 — Identity

Who the brand is, what it stands for. **Brand-demand KPIs:**

- Branded-keyword search impressions / clicks (Search Console)
- Brand search-volume trend (Semrush)
- Direct traffic (GA4)
- Social follower growth, share of voice (Semrush, social platforms)

## L3 — Product

What is actually delivered. **Engagement & quality KPIs:**

- Product / feature engagement, activation rate, returning-user rate (GA4)
- Reviews and ratings volume / score
- Support or quality signals where exposed; NPS where tracked

## L4 — Offer

How the product is packaged and priced. **Conversion & pricing economics:**

- Overall and offer-level conversion rate
- Average order value, pricing-page conversion
- Win rate, discount rate (HubSpot, billing)

## L5 — Channels — *the heart of the suite*

Where the brand actually wins attention and demand. **The densest layer:**

- Sessions / leads / revenue by channel; channel mix and share
- Paid: spend, CPC, CTR, CPA / CAC, ROAS
- Organic: rankings, organic sessions, visibility
- Email / lifecycle: list growth, open / click rates, email-attributed revenue
- Social: reach, engagement

## L6 — Customer

Who the customers are and the identity they get from the brand. **Retention &
value KPIs:**

- Retention, churn, cohort retention
- Repeat-purchase rate, LTV, LTV:CAC
- Expansion revenue, lifecycle-stage movement
- Segment-level performance

## L7 — Market

Whether the category game is changing. **Share & category KPIs:**

- Market share of voice (Semrush)
- Category search-demand trend
- Competitor visibility / ranking movement (Semrush)

---

## How the planner uses this map

1. **Place each goal** harvested in Step 1 on a layer using the rows above.
2. **Pick the metrics** for that layer from the same row.
3. **Constraint check.** Find the binding constraint's layer in
   `brand/7LAYER_DIAGNOSTIC.md`. If L2–L7 → ensure at least one board carries a
   metric from that layer's row (the constraint-metric slot of the Executive
   Overview, or a dedicated board). If L0/L1 → state in the plan that the suite
   *cannot* measure the constraint, and point back to the 7-layer diagnostic.
