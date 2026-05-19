# Metric → data-source map

Step 3 of `aos-plan-databoards` resolves **every metric** in the proposed
databoard suite to the **data-source connector** that supplies it. The
consolidated set of distinct connectors becomes the suite's *required-connector
list*, which Step 4 checks against the live Databox account.

**One aggregation point.** Every connector below reaches AOS **through Databox** —
Databox aggregates GA4, Google Ads, Meta Ads, the CRM, billing, and the rest into
a single account. The lone exception is **Semrush**, which has its own MCP. This
is why AOS gates the skill on *Databox*, not on each underlying platform
(`docs/connectors.md`): Google Ads and GA4 ship **no vendor MCP** (documented gap
AOS-724) — Databox is the only path to their data.

A metric whose source connector is **not connected** becomes a `✗ missing` row in
the Step 4 readiness check.

---

## Web & traffic

| Metric | Primary source |
|---|---|
| Sessions, users, new users | GA4 |
| Pageviews, entrances | GA4 |
| Average engagement time, engagement rate | GA4 |
| Traffic by channel / source / medium | GA4 |
| On-site conversions, goal / key-event completions | GA4 |
| Landing-page performance | GA4 |

## Paid acquisition

| Metric | Primary source |
|---|---|
| Spend, impressions, clicks, CTR, CPC | Google Ads · Meta Ads · LinkedIn Ads |
| Conversions, CPA / CAC | Ad platform (with conversion tracking) |
| ROAS, conversion value | Ad platform + revenue source |
| Conversion rate by campaign / platform | Ad platform |

## Search & SEO

| Metric | Primary source |
|---|---|
| Search impressions, clicks, CTR, average position | Google Search Console |
| Indexed pages, coverage | Google Search Console |
| Organic sessions, organic conversions | GA4 |
| Keyword rankings, position buckets | Semrush |
| Visibility / share of voice, backlinks | Semrush |

## Pipeline & funnel

| Metric | Primary source |
|---|---|
| Leads, MQL, SQL, deals | HubSpot |
| Pipeline value, deal-stage volumes | HubSpot |
| Funnel stage-to-stage conversion | HubSpot (+ GA4 for top of funnel) |
| Win rate, sales-cycle length | HubSpot |

## Revenue & retention

| Metric | Primary source |
|---|---|
| Revenue, AOV | Stripe / billing (B2C) · HubSpot (B2B deal revenue) |
| MRR / ARR, expansion revenue | Stripe / billing |
| New customers | Stripe · HubSpot |
| Churn rate, retention cohorts | Stripe / billing · HubSpot |
| Repeat-purchase rate, LTV, LTV:CAC | Stripe / billing (CAC from ad platforms) |

## Email & lifecycle

| Metric | Primary source |
|---|---|
| List size, list growth | HubSpot · ActiveCampaign · Mailchimp |
| Send volume, open rate, click-through rate, unsubscribe | HubSpot · ActiveCampaign · Mailchimp |
| Email-attributed conversions / revenue | Email platform + GA4 |
| Lifecycle-stage movement | HubSpot |

## Social & owned media

| Metric | Primary source |
|---|---|
| Reach, impressions, followers, follower growth | Facebook / Instagram / LinkedIn Pages · YouTube |
| Engagement (likes, comments, shares), engagement rate | Social platforms |
| Branded / direct traffic, brand search demand | GA4 · Search Console · Semrush |

---

## Caveats the planner must apply

- **Conversion-tracking dependency.** `Conversions`, `CPA`, `CAC`, and `ROAS` are
  only as trustworthy as the client's conversion-tracking setup. If the brand
  intelligence or session signals that tracking is broken or unverified, flag the
  metric as low-confidence in the plan rather than presenting it as solid.
- **Bundled vs per-client connectors.** Databox, HubSpot, and Semrush are
  *bundled* (`.mcp.json`). **Meta Ads, LinkedIn Ads, ActiveCampaign, Mailchimp,
  Stripe** are *per-client* — they exist in a client's Databox account only if
  that client connected them. The Step 4 readiness check is what reveals this;
  never assume a per-client source is present.
- **Currency & timezone.** Revenue, spend, and CAC metrics are currency-bound and
  the date ranges are timezone-bound — both must be pinned explicitly in the
  Genie prompt (the AOS currency-guard rule). See `genie-prompt-template.md`.
- **No source → `✗`.** If a wanted metric maps to a connector that the readiness
  check finds unconnected, the metric cannot ship on the board — surface it as a
  gap with the connect-it action item, do not silently drop it.
