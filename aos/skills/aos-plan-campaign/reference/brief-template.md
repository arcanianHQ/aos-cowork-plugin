---
scope: int-company
---

# Campaign brief template

Companion to `aos-plan-campaign/SKILL.md`. The shell for
`deliverables/<YYYY-MM>/campaign-brief-<slug>.md`.

```markdown
---
scope: int-confidential
client: <slug>
business_unit: <set for multi-BU clients — or blank>
artifact: campaign-brief
campaign_type: <dealer | retail | brand>
occasion: <the campaign trigger / theme>
generated_by: aos-plan-campaign
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
campaign_window: <YYYY-MM-DD> → <YYYY-MM-DD>
status: confirmed-by-user
serves_rec: <REC-id this campaign executes — or blank>
---

# Campaign brief — <campaign name>  ·  <type>

> **What this is.** The plan for one bounded campaign — what it is for, who it is
> for, the offer, where and when it runs, what it needs built, and how it will be
> measured. A draft for you to correct before any content is drafted.

## Goal and situation

<Two or three sentences: what the client is trying to achieve with this campaign,
and where it stands now. Each recommendation below names the goal it serves and
the evidence it rests on; a label (a budget level, a tier) is defined where it
first appears. (`docs/deliverable-writing.md` §1–§2)>

## Frame

- **Occasion / trigger:** <why now>
- **Type:** <dealer | retail | brand> — <one line on the type's intent>
- **Serves:** <the gtm-plan move or REC this executes — or "standalone">

## Objective + KPI

- **Objective:** <the one outcome>
- **KPI:** <the metric> · target <band> · measured over <window> · read by `aos-measure`
- <If the objective is soft (brand): name the proxy signal honestly.>

## Audience

<The ICP segment, narrowed to this campaign. For a dealer brief: both the dealer
and the dealer's end customer.>

## The offer / hook

<What the audience gets or sees — cross-checked against brand/OFFER.md /
content-system/products.md. State the source.>

## Messaging angle

<The campaign's angle — on the messaging.md register, on a real pillars.md
pillar. Name the pillar.>

## Channel plan

| Channel | Role in the campaign | Timing in the window |
|---|---|---|
| <from distribution.md> | … | … |

## Deliverables — the work order

The concrete pieces this campaign needs built. Each is a job for `aos-write` /
`aos-draft-content`.

| # | Deliverable | Content type | Channel | For |
|---|-------------|--------------|---------|-----|
| 1 | … | linkedin-post / email / blog-post / reference / kit-asset | … | … |

## Timeline — run of show

| Date | Milestone |
|------|-----------|
| … | … |

## Measurement plan

<What `aos-measure` reads at the end of the window to judge the KPI — the
metric source, the comparison (against-plan / against-benchmark / against-prior).
Name the comparison's base ("than the same weeks of last year") and the metric's
platform (Google Ads or GA4 conversions); purchases and revenue are read from the
shop's order export, with GA4 reconciled against it (`docs/deliverable-writing.md`).>

## What did we get wrong? What's missing?

<Invite correction — the brief is a draft. Where was the frame thin? Which
deliverable is under-specified?>
```

## Notes

- The **deliverables table is the hand-off** — it is the work order `aos-write`
  and `aos-draft-content` run against. Make each row specific enough to draft from.
- For a `dealer` brief, deliverables are **kit assets** — templated and
  localisable — not finished brand content. Mark them `kit-asset` in the type column.
- `serves_rec:` ties the campaign back into the loop — when set, `aos-measure`
  can report whether the REC's intent was met.
