# DATABOARD_PLAN.md — deliverable template

The shell `aos-plan-databoards` writes to `metrics/DATABOARD_PLAN.md` (Step 5).
Resolve the `metrics` zone via `AOS_CONFIG.md`. For multi-BU clients, write one
plan per BU — the `business_unit` field is set and the filename / location
follows the BU convention.

Fill every section. Keep the provenance frontmatter — values read at write time,
never hard-coded (`docs/artifact-versioning.md` §1).

---

```markdown
---
generated_by: aos-plan-databoards
skill_version: <version: from SKILL.md frontmatter>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version: from AOS_CONFIG.md>
client: <client slug>
business_unit: <BU slug — multi-BU clients only>
databox_status: connected | degraded
---

# Databoard Plan — <Client / BU name>

## Context used

- Brand intelligence: <which brand/ files were read>
- Channel map: <client/DOMAIN_CHANNEL_MAP.yaml — active channels>
- Existing metrics: <metrics/METRICS.md>
- Databox: <connected | not connected — degraded plan>

## Connector status

Databox **connected** — readiness check is verified.
— or —
Databox **not connected** — readiness check is unverified; see the Data gap callout.

## Business needs harvested

- **Goals:** <the business goals from brand/OFFER.md and the diagnostic>
- **Target KPIs:** <the KPIs each goal implies>
- **Active channels:** <from the channel map>
- **Binding constraint:** <the constraint from brand/7LAYER_DIAGNOSTIC.md, with its layer>

## The databoard suite

For each board in the suite:

### <N>. <Databoard title>

- **Purpose:** <the one question it answers>
- **Audience:** <exec | operator | client>
- **Layers:** <7+1 layer coverage>
- **Metrics:** <the metric set>
- **Visualisations:** <block types>
- **Refresh cadence:** <daily | weekly | monthly + review rhythm>
- **Archetype:** <which databoard-archetypes.md entry, or "bespoke">

State plainly which board (and which metric) makes the binding constraint
visible (Hard Rule 5).

## Data-source readiness

| Connector | Status | Needed by | Action |
|-----------|--------|-----------|--------|
| <connector> | ✓ connected / ✗ missing / ⚠ partial | <boards> | <— or the connect-it action> |

> **Data gap — Databox not connected.** *(degraded mode only)* The table above is
> the suite's connector *requirement*, not a verified status. Connect Databox via
> `aos-onboard`, then re-run `aos-plan-databoards` for a verified readiness check.

## Genie prompts

One ready-to-paste Databox Genie prompt per databoard — built from
`genie-prompt-template.md`:

### <Databoard title>

```
<the full Genie prompt>
```

## What did we get wrong? What's missing?

<Invite correction. Name assumptions made — thin brand intelligence, unverified
conversion tracking, channels not yet in the map. List the next step: connect any
missing sources via aos-onboard, then run each Genie prompt in Databox; once the
boards exist, aos-measure reads them.>
```

---

## Notes for the planner

- **Present before writing.** Show the suite + readiness table + prompts to the
  user (Accept / Revise / Regenerate) before the file is written.
- **Proactive nudge.** If the readiness check found `✗ missing` connectors,
  surface the one-line nudge after writing — the missing connectors named, and
  `aos-onboard` as the next step. Surfaced, never auto-actioned (Hard Rule 11).
- **Re-runs.** On a re-run, read the existing `DATABOARD_PLAN.md` first and
  revise it — do not blind-overwrite a plan the user has already refined.
