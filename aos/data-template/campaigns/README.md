# `campaigns/` — the campaign zone

The campaign zone holds one file per campaign plus the index. It is the
filesystem form of the campaign model — themes, campaigns, platforms, budgets,
KPIs — so a customer without the `aos-data-layer` overlay has the whole picture.

```
campaigns/
├── INDEX.md            the index — themes + campaigns, BU-tagged
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
theme: <theme name, or —>
campaign_type: dealer | retail | brand | promotion
business_unit: <bu slug, or —>
budget: <amount + currency, or —>
start: <YYYY-MM-DD>
end: <YYYY-MM-DD>
status: planned | active | complete
kpi: <the primary KPI>
platforms: [<channel/platform>, ...]
# + the standard provenance block (generated_by, skill_version, …)
---

# Campaign — <name>

<the brief: objective, audience, offer / hook, messaging angle, channel plan,
timeline, the deliverables it needs, and how it will be measured>
```

Maps to the AOS Cloud campaign tables (`campaign_themes` → `campaigns` →
`campaign_platforms`) when the `aos-data-layer` overlay is installed.
