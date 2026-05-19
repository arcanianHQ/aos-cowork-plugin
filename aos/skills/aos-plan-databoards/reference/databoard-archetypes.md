# Databoard archetypes — the AOS measurement-board library

The curated set of standard GTM databoards `aos-plan-databoards` draws from.
Step 2 of the skill matches the client's harvested business needs to the
archetypes below; it does **not** invent boards from scratch and it does **not**
ship every archetype — it selects a **suite**.

Each archetype is described by seven fields:

- **Purpose** — the one question the board answers.
- **Audience** — who reads it: *exec* (founder / client leadership), *operator*
  (the person running the channel), or *client* (a board shared with the client).
- **Layers** — 7+1 Layer Framework coverage (L0 Source … L7 Market).
- **Metrics** — the metric set. Concrete; the planner trims to what the client
  actually has data for (Step 3–4).
- **Visualisations** — recommended Databox block types.
- **Sources** — the data-source connectors the board depends on (see
  `metric-source-map.md`).
- **Cadence** — refresh frequency and review rhythm.

---

## Suite-selection logic

The planner assembles a **suite of 2–4 boards** (rarely 5), not one board and not
a board per metric. Selection rules:

1. **Board #1 is almost always the Executive GTM Overview** — the single screen
   that answers "is the engine working?".
2. **One channel board per materially-active channel** — read the active
   channels from `client/DOMAIN_CHANNEL_MAP.yaml`. Paid → *Paid Acquisition*;
   organic → *Organic / SEO*; owned email/CRM → *Email & CRM Lifecycle*.
3. **Add Funnel Health when the binding constraint is conversion / leak** — the
   constraint comes from `brand/7LAYER_DIAGNOSTIC.md`. This is the *constraint
   board* (Hard Rule 5): the suite must make the constraint measurable.
4. **Add Retention & LTV** when the offer is subscription / repeat-purchase, or
   when the constraint sits at L6 Customer.
5. **Add Channel Mix** when the client runs 3+ channels and the strategic
   question is allocation.
6. **Cap the suite.** Match board count to channel count and team capacity.
   A board nobody reads is waste — fewer, well-aimed boards beat a wall of them.
7. **Match audience to delivery stage.** AOS Stage 1 (consultant-run) → operator
   boards. Stage 2–3 (co-run / client-run) → add a clean *client*-audience
   Executive Overview.

---

## 1. Executive GTM Overview

- **Purpose** — One screen: is the GTM engine working? Revenue / pipeline,
  acquisition efficiency, and the binding constraint, at a glance.
- **Audience** — exec / client leadership.
- **Layers** — L4 Offer, L5 Channels, L6 Customer, L7 Market (top-line only).
- **Metrics** — revenue or pipeline value · new customers or qualified leads ·
  blended CAC · total sessions / reach · overall conversion rate · MoM trend on
  each · **one constraint-metric slot** (the metric that tracks the binding
  constraint named in the 7-layer diagnostic).
- **Visualisations** — big-number tiles with period-over-period comparison · one
  revenue trend line · one channel-mix bar.
- **Sources** — GA4 + Google Ads (via Databox) · CRM (HubSpot) · billing (Stripe).
- **Cadence** — daily refresh; weekly leadership review.

## 2. Paid Acquisition

- **Purpose** — Are paid channels efficient — does spend convert to leads / sales
  at the target CAC / ROAS?
- **Audience** — operator (PPC / paid-media manager).
- **Layers** — L5 Channels.
- **Metrics** — spend · impressions · clicks · CTR · CPC · conversions ·
  CPA / CAC · ROAS · conversion rate — broken out by campaign and by platform.
- **Visualisations** — spend-vs-conversions dual-axis chart · CPA trend ·
  platform comparison table · campaign leaderboard.
- **Sources** — Google Ads, Meta Ads, LinkedIn Ads (via Databox).
- **Cadence** — daily refresh; weekly optimisation review.

## 3. Organic / SEO

- **Purpose** — Is organic discovery growing — visibility, traffic, rankings?
- **Audience** — operator (SEO).
- **Layers** — L5 Channels, L7 Market (share of voice).
- **Metrics** — organic sessions · Search Console impressions / clicks · average
  position · indexed pages · keyword count by position bucket · organic
  conversions · visibility / share-of-voice (Semrush).
- **Visualisations** — organic-sessions trend · position-bucket stacked area ·
  top-pages table · share-of-voice gauge.
- **Sources** — GA4 + Google Search Console (via Databox) · Semrush.
- **Cadence** — weekly.

## 4. Content Performance

- **Purpose** — Which content earns attention and converts — per piece?
- **Audience** — operator (content).
- **Layers** — L5 Channels, L6 Customer.
- **Metrics** — pageviews · average engagement time · engagement / scroll rate ·
  entrances · conversions and assisted conversions per piece · social reach and
  engagement.
- **Visualisations** — per-piece leaderboard table · engagement-time
  distribution · publish-date-vs-traffic scatter.
- **Sources** — GA4 (via Databox) · social platforms.
- **Cadence** — weekly / per publishing cycle. Pairs with `content/CATALOGUE.md`
  and `aos-measure`.

## 5. Funnel Health — *the constraint board*

- **Purpose** — Where does the customer journey leak — stage-by-stage conversion?
- **Audience** — exec + operator.
- **Layers** — L4 Offer, L5 Channels, L6 Customer.
- **Metrics** — stage volumes (visitor → lead → MQL → SQL → customer) ·
  stage-to-stage conversion % · drop-off per stage · time-in-stage — broken out
  by source.
- **Visualisations** — funnel chart · stage-conversion trend lines · drop-off
  table by source.
- **Sources** — GA4 + CRM (HubSpot) via Databox.
- **Cadence** — weekly. Selected when the binding constraint is conversion / a
  funnel leak. Pairs with `aos-diagnose-funnel`.

## 6. Channel Mix

- **Purpose** — Where does traffic / revenue actually come from — and is the mix
  shifting?
- **Audience** — exec / operator.
- **Layers** — L5 Channels.
- **Metrics** — sessions / leads / revenue by channel (organic, paid, direct,
  referral, social, email) · channel share % · channel-level CAC · MoM mix shift.
- **Visualisations** — stacked-area chart of channel share over time · channel
  comparison table · contribution breakdown.
- **Sources** — GA4 (via Databox) · CRM.
- **Cadence** — weekly / monthly.

## 7. Retention & LTV

- **Purpose** — Do customers stay and expand — retention, churn, lifetime value?
- **Audience** — exec.
- **Layers** — L6 Customer.
- **Metrics** — active customers · churn rate · cohort retention ·
  repeat-purchase rate · LTV · LTV:CAC ratio · MRR / ARR and expansion revenue
  (subscription offers).
- **Visualisations** — cohort retention grid · churn trend · LTV:CAC ratio tile.
- **Sources** — billing (Stripe) · CRM (HubSpot) via Databox.
- **Cadence** — monthly.

## 8. Email & CRM Lifecycle

- **Purpose** — Is the owned-audience / lifecycle engine working — list growth,
  engagement, lifecycle conversion?
- **Audience** — operator.
- **Layers** — L5 Channels, L6 Customer.
- **Metrics** — list size and growth · send volume · open rate · click-through
  rate · unsubscribe rate · email-attributed conversions / revenue ·
  lifecycle-stage movement.
- **Visualisations** — list-growth trend · campaign performance table ·
  lifecycle-stage funnel.
- **Sources** — HubSpot · ActiveCampaign · Mailchimp (via Databox).
- **Cadence** — weekly.

---

## Adding an archetype

This library is curated, not exhaustive. When a real client need fits none of
the eight, the planner may design a bespoke board for that engagement — but if
the same bespoke board recurs across clients, add it here as a ninth archetype
(calibration loop, AOS-916). Every archetype must keep the seven-field shape.
