# `campaigns/` — the campaign zone

The campaign zone holds one file per campaign plus the index. It is the
filesystem form of the campaign model — themes, campaigns, platforms, budgets,
KPIs — so a customer without the `aos-data-layer` overlay has the whole picture.

```
campaigns/
├── INDEX.md            the index — themes + campaigns, BU-tagged
├── themes/<slug>.md    one file per theme — narrative, budget, window
└── <slug>.md           one file per campaign: the record + the brief
```

## A per-campaign file — `campaigns/<slug>.md`

Frontmatter is the **campaign record**; the body is the **brief** that
`aos-plan-campaign` writes. One file, not two — the record and the brief are the
same artifact.

```yaml
---
campaign: <name>
slug: <slug>
theme: <theme-slug, or —>          # references campaigns/themes/<slug>.md
campaign_type: dealer | retail | brand | promotion
business_unit: <bu slug, or —>
budget: <amount + currency, or —>
start: <YYYY-MM-DD>
end: <YYYY-MM-DD>
status: planned | active | complete
platforms: [<channel/platform>, ...]
# + the standard provenance block (generated_by, skill_version, …)
---

# Campaign — <name>

<the brief: objective, audience, offer / hook, messaging angle, channel plan,
timeline, the deliverables it needs, and how it will be measured>

## KPIs

| KPI | Target | Actual | Unit |
|---|---|---|---|
| <the primary KPI> | | | |
```

The `## KPIs` table is the campaign's metrics — one row per KPI. `aos-measure`
fills `Actual` at the end of the window. (Maps to the `campaign_kpis` table.)

## A theme file — `campaigns/themes/<slug>.md`

A **theme** groups campaigns under one narrative. Themes that have their own
narrative / budget / window get a file; a one-off campaign needs no theme.

```yaml
---
theme: <name>
slug: <slug>
business_unit: <bu slug, or —>
budget: <amount + currency, or —>
start: <YYYY-MM-DD>
end: <YYYY-MM-DD>
status: planned | active | complete
# + the standard provenance block
---

# Theme — <name>

<the theme narrative — the through-line the campaigns under it share>
```

The zone maps to the AOS Cloud campaign tables — `campaign_themes` → `campaigns`
→ `campaign_platforms`, the `campaign_kpis` table, and the `campaign_id` link on
`content_schedule` / `publications` — when the `aos-data-layer` overlay is
installed.
