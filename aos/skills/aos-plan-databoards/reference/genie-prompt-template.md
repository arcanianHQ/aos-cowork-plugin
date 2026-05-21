# Databox Genie prompt template

Step 5 of `aos-plan-databoards` turns each planned databoard into **Databox
Genie instructions** — what the user (or the skill, when run inside Cowork)
sends to Genie to actually build the board. The skill never builds the board
itself (Hard Rule 1). Pairs with `reference/genie-build-recipe.md`.

> **Two Genie surfaces — do not confuse.** The MCP `ask_genie` tool analyses a
> *dataset* only; it does **not** build Databoards. Board-building Genie is the
> Databox **app** Genie (the nav-bar chat) or the higher-level Databox API the
> app Genie wraps. The skill emits instructions for the board-building Genie.

## What Genie can and cannot do — verified

The empirical limits from the Wellis Export Lead Routing dashboard build (six
iterations, 2026-05-20/21; full incident notes in `genie-build-recipe.md`):

**✅ Genie does:**

- Add metrics with: aggregation (`distinct count`, `SUM`, …), breakdown by a
  dimension, filters, granulation (`day` / `week` / `month`), sort direction,
  top-N, and comparison vs previous period (the % delta column is auto-rendered).
- Set / update a widget's date range, or inherit from the board.
- Delete and re-add blocks.
- Visualisation types: **TABLE · BAR · LINE · PIE · NUMBER · AREA**.

**❌ Genie does NOT do (silently ignored):**

- Widget **positioning** (X / Y) or **sizing** (width / height).
- Side-by-side vs stacked **layout** instructions.
- Custom **colours** (no custom hex — only the predefined Databox palette).
- Fonts, font sizes, padding, margin, gap, gridlines, alternating rows,
  bold / italic, snap-to-grid, grouping widgets into rows.
- **Calculated metrics** (Databox lists this as "coming soon"; the Wellis build
  did not exercise it — treat as unsupported until proven). These go in the
  manual-setup list below.

**⚠ Partial:**

- Reordering — only via delete + re-add in the new order.
- Layout polish — via the **Layout Designer** (manual, 2–5 min per board) at
  `app.databox.com/layout-designer/<board_id>`.

**Inheritance:**

- Currency + timezone **inherit from the data-source / account settings** —
  there is no prompt slot for them. Record the intended values in the plan
  frontmatter; flag any source whose setting is wrong.
- Date range can inherit from the board level — set the board default, then set
  each widget to inherit.

## The default-trust 2-widget pattern (canonical)

Genie does not lay out — but its **default layout is good when there are
exactly 2 widgets**: Databox renders them side-by-side, 50 / 50, balanced. With
3 widgets the layout often goes ugly (large left + smaller stacked right). With
4+ widgets it is variable. **For non-technical end users, this means: aim for
2-widget boards.**

When a board genuinely needs more than 2 widgets, either (a) split it into
multiple 2-widget boards or (b) accept the **Layout Designer** polish step
(`genie-build-recipe.md`).

The canonical pattern, suitable for most "what happened this period" boards:

```
DELETE all widgets in the board.

DATABLOCK 1 — TABLE
  Metric: <distinct count of X>
  Breakdown: <dimension Y>
  Filter: <exclude flag != TRUE>
  Sort: count DESCENDING
  Top-N: <if dimension is high-cardinality>
  Date range: inherit from board

DATABLOCK 2 — HORIZONTAL BAR
  Metric, breakdown, filter, sort: same as Datablock 1
  Date range: inherit from board

BOARD: default date range = <e.g. This Week (Mon–Sun, Europe/Budapest)>
```

Databox renders this as **table on the left + bar on the right, side-by-side**,
no manual layout needed.

## Per-widget prompt anatomy

Every widget the skill puts in a Genie prompt names the same six things:

1. **Visualisation type** — TABLE / BAR / LINE / PIE / NUMBER / AREA. **Be
   explicit** — Genie's default can be wrong (e.g. it picks a *time-series LINE*
   when you wanted a single-period horizontal BAR — see *Pitfalls*).
2. **Metric + aggregation** — `distinct count of <column>`, `SUM(<column>)`, …
3. **Breakdown** — the dimension to split by (country, channel, …). Optional.
4. **Filter** — the dataset's exclude flag (e.g. `test_mode != TRUE`) and any
   scoping filter. **Always include the exclude flag** if the dataset has one —
   missing it is a silent data-quality bug (Hard Rule 14).
5. **Sort + top-N** — `DESC` / `ASC`, `top 10`.
6. **Date range** — natural language ("last 30 days") or `inherit from board`.

For trend widgets add **granulation** (daily / weekly / monthly) and the period
**comparison** if wanted (vs previous period — Databox renders the % delta
automatically).

## Calculated metrics → manual-setup list

A **calculated / derived metric** is a ratio or formula (conversion rate, ROAS,
AOV, CAC, share-of-X, cross-source gaps). Databox marks the Genie-creates-them
ability as **"coming soon"**, and the empirical Wellis build only used direct
aggregations — so the planner treats these as **unsupported until proven** and
hands them to the user as a manual custom-metric setup step.

A connector that **reports a ratio natively** (Google Ads' own `ROAS` column,
GA4's `conversion rate`) is a *direct* metric — fine to put in the prompt.
The rule is about figures Databox would have to *calculate*, not ones a source
already delivers.

**Cross-source** calculations (a formula spanning two sources) are harder still
— they need a Databox **merged dataset**, not just a custom metric. Flag those
explicitly in the manual-setup list.

## What Genie ignores — do not waste prompt-bytes on these

These instructions are silently dropped, so they do not belong in the prompt:

- *"Place X on the left and Y on the right."*
- *"Make the widgets the same size."*
- *"Use brand colours (#B89452, #…)."*
- *"Bold the headers, monospace the numbers."*
- *"Balanced / visually organised / clean layout."*

Put aesthetic intent in the **manual-setup notes** (Designer polish step), not
the prompt.

## Pitfalls

- **BAR chart defaults to time-series.** If you ask for "BAR chart of X broken
  down by country", Genie may render countries as **coloured lines over time**,
  not single-period horizontal bars. Force the right shape with: *"ONE bar per
  country, NO time axis, NO granulation."* Or use *NUMBER with breakdown* —
  which sometimes renders as horizontal bars per dimension. **Verify visually.**
- **"✅ Confirmed" claims may not be true.** Genie sometimes says
  "Inherits board date range" or "Filter applied" when the underlying call did
  not propagate. Always verify by comparing the widget's date-range badge to
  the board's, and sanity-checking the numbers vs a known count (Hard Rule 15).

## Output structure per board

For every board in the plan, emit **three parts**:

1. **Primary Genie prompt** — the canonical 2-widget pattern when possible (or
   a focused multi-widget prompt if the board genuinely needs more, with a note
   that Designer polish will be required).
2. **Follow-up prompts** — short refinements (add a chart, change a sort,
   adjust a filter), pasted one at a time after the board exists.
3. **Manual-setup list** — calculated metrics (custom metrics to create first),
   any Designer polish steps, and the verification checklist (see
   `genie-build-recipe.md`).

## Worked example

Board: *Sales Pulse Overview* — the Video 1 "Sales Pulse" demo, canonical
2-widget pattern.

```
PRIMARY GENIE PROMPT — paste first

Delete all widgets in the board "Sales Pulse Overview".

Create two datablocks:

DATABLOCK 1 — TABLE
  Metric: SUM sessions from "Video 1 — GA4 Sessions"
  Breakdown: channel
  Filter: (none — this dataset has no exclude flag)
  Sort: sessions DESCENDING
  Top-N: 10
  Date range: inherit from board

DATABLOCK 2 — HORIZONTAL BAR (ONE bar per channel, NO time axis, NO granulation)
  Metric, breakdown, filter, sort: same as Datablock 1
  Date range: inherit from board

BOARD: default date range = last 30 days, compared to prior 30 days.

FOLLOW-UP PROMPTS — paste one at a time, after the board exists

Add a NUMBER widget for total Revenue from "Video 1 — Shopify Orders" for the
last 30 days, compared to prior 30 days.

Add a LINE widget for daily Sessions from "Video 1 — GA4 Sessions" for the
last 60 days. Granulation: day.

MANUAL SETUP — calculated metrics + verification (NOT for Genie)

- Conversion rate = SUM(conversions) / SUM(sessions) × 100 — create as a
  Databox custom metric spanning the GA4 sources, then add it as a NUMBER widget.
- Verify after build: open the board, check the date-range badge on each widget
  matches the board default; sanity-check sessions total against a known figure.
- Optional polish: 2 min in the Layout Designer if the four widgets need
  resizing.
```

The three direct widgets Genie can place are the table, the bar, and (via
follow-ups) the revenue NUMBER and the sessions LINE. The conversion-rate
metric is calculated → it goes in the manual-setup list, not in the prompt.
