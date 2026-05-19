# Databox Genie prompt template

Step 5 of `aos-plan-databoards` turns each planned databoard into a
**ready-to-paste Databox Genie prompt**. The user opens Databox Genie and pastes
the prompt; Genie builds the board. The skill never builds the board itself
(Hard Rule 1) — it produces the prompt.

**One prompt per databoard.** Each prompt is self-contained — Genie should not
need the rest of the plan to act on it.

## Template

```
Create a new Databoard titled "<DATABOARD TITLE>".

Settings:
- Timezone: <IANA timezone, e.g. Europe/Budapest>
- Currency: <ISO code, e.g. EUR>
- Default date range: <e.g. Last 30 days>, compared to <e.g. previous period>

Add these metrics, each as its own block:

1. <Metric name> — <visualisation type> — source: <data source> — <grouping / breakdown if any>
2. <Metric name> — <visualisation type> — source: <data source> — <grouping / breakdown if any>
3. ...

Layout: <section grouping, ordering, what goes at the top>.
Filters: <board-level filters, e.g. exclude internal traffic; or "none">.
```

## Rules for filling the template

- **Pin timezone and currency on every prompt** — never leave Genie to infer
  them (the AOS currency-guard rule). Read the timezone from the client context;
  read the currency from `AOS_CONFIG.md` / `client/CLIENT_CONFIG.md`. If a board
  carries no money metric, still state the timezone.
- **Name the exact data source** per metric — use the vendor name as it appears
  in the client's Databox account (the un-normalised name; see
  `readiness-check.md`). Genie binds the block to that source.
- **Pick the visualisation** from the archetype's *Visualisations* field
  (`databoard-archetypes.md`): big-number tile, trend line, bar, stacked area,
  table, funnel, gauge, cohort grid.
- **Only metrics that passed the readiness check.** A metric whose source is
  `✗ missing` does not go in the prompt — it goes in the gap list. A `⚠ partial`
  metric may be included with a one-line caveat noted in the plan.
- **Date range + comparison are explicit.** Every board states a default range
  and a period comparison; trend blocks may override with their own range.
- **Keep prompts plain.** Real newlines, no escape sequences, no markdown
  styling inside the prompt body — Genie reads it as instructions.

## Worked example

```
Create a new Databoard titled "Acme — Executive GTM Overview".

Settings:
- Timezone: Europe/Budapest
- Currency: EUR
- Default date range: Last 30 days, compared to previous period

Add these metrics, each as its own block:

1. Revenue — big-number tile with period comparison — source: Stripe
2. New Customers — big-number tile with period comparison — source: HubSpot CRM
3. Blended CAC — big-number tile with period comparison — source: Google Ads + Stripe
4. Sessions — trend line, daily — source: Google Analytics 4
5. Conversion Rate — big-number tile with period comparison — source: Google Analytics 4
6. Sessions by Channel — stacked bar — source: Google Analytics 4 — broken down by default channel grouping
7. Marketing Qualified Leads — trend line, weekly — source: HubSpot CRM   [constraint-metric slot]

Layout: revenue and customer tiles across the top row; traffic and conversion in
the middle; channel breakdown and the MQL trend at the bottom.
Filters: exclude internal/office IP traffic.
```

The bracketed `[constraint-metric slot]` is a note for the *plan*, not for Genie
— strip it from the pasted prompt; it records which block makes the binding
constraint visible (Hard Rule 5).
