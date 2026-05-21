# Databox Genie build recipe

The operational playbook for actually building a databoard via Genie. Pairs
with `genie-prompt-template.md` (the prompt format).

> **Empirical baseline.** Wellis Export Lead Routing dashboard build — six
> iterations, 2026-05-20/21. Target user: a non-technical sales-ops lead. Every
> finding below was paid for in iterations against the real Databox account.

## The 8-step recipe

1. **Open Databox Genie.** App nav bar → Genie chat. Confirm the right account
   is selected.
2. **Send one data-first prompt with ≤ 2 widgets.** Use the canonical 2-widget
   pattern from `genie-prompt-template.md` when possible. Be explicit about
   visualisation type.
3. **Wait for confirmation.** Genie reports back.
4. **Open the board URL — eyeball check.** Does it look right? Layout
   reasonable? Numbers plausible?
5. **If the layout is wrong:** either (a) accept the default — for 2 widgets it
   is usually fine — or (b) spend 2–5 minutes in the **Layout Designer**
   (`app.databox.com/layout-designer/<board_id>`): drag corners to resize, drag
   widgets to grid positions, per-widget *Style* / *Format* tab for colours and
   fonts.
6. **If the data is wrong:** send a focused fix-prompt naming *only the broken
   widget* (date range off, filter not applied, wrong visualisation type — see
   *Verification* below).
7. **Set board-level default date range** if not already; switch widgets to
   inherit from board for consistency.
8. **Share the board URL** with the end user.

## Verification — Genie's "confirmed" is unreliable

Always verify after build. Genie sometimes claims a setting took when it did
not. Three checks:

- **Date range** — the badge on each widget should match the board default. If
  a widget shows a different range than expected, the inheritance did not stick.
- **Filter / exclude flag** — sanity-check the numbers. If the dataset's
  test rows are a big share of the data and the widget shows the unfiltered
  total, the exclude flag did not apply.
- **Visualisation type** — confirm a single-period "bar broken down by country"
  rendered as a horizontal BAR, not a time-series LINE with countries as
  coloured lines (see pitfall below).

## Default-layout behaviour (verified empirically)

| Widget count | Default layout | Verdict |
|---|---|---|
| 2 | side-by-side, 50 / 50, balanced | ✅ usually good |
| 3 | large left + smaller stacked right | ⚠ often ugly — needs Designer |
| 4+ | 2 × 2 or row-grid, variable | ⚠ variable — needs Designer |

**Implication for planning.** Prefer **multiple 2-widget boards** over one
many-widget board unless you are willing to spend Designer time (Hard Rule 13).

## Common pitfalls

- **BAR defaults to time-series.** "BAR chart with country breakdown" can
  render as a time-series with countries as coloured lines. Force the shape:
  *"ONE bar per country, NO time axis, NO granulation."*
- **Missing exclude flag.** Forget the dataset's exclude column (e.g.
  `test_mode != TRUE`) and the widget mixes test + production data. Always
  include it (Hard Rule 14).
- **Inheritance not propagating.** A date-range or filter "✅ confirmed" claim
  can be wrong. Verify visually + numerically (Hard Rule 15).
- **Asking for aesthetic intent.** *"Balanced", "visually organised", "clean"*
  — Genie cannot interpret these; the instruction is silently dropped.

## Manual Layout Designer — when to use it, what it can do

URL: `app.databox.com/layout-designer/<board_id>`

What you can do that Genie cannot:

- Drag widget corners to **resize** precisely.
- Drag widgets to **grid positions** (X, Y).
- Per-widget **Style** / **Format** tab — custom colours (hex), fonts, spacing.

Time cost: **2–5 minutes** per dashboard for full polish. **Skip it** when the
default 2-widget layout is acceptable.

## When Databox is not enough — alternative tools

The skill plans for Databox, but recognise the limits. Hand off when the
client's real need is not a Databox board:

- **Looker Studio** — Google ecosystem, drag-drop precise layout, raw row
  tables natively (Databox cannot do a row-per-record activity feed), free,
  Workspace-friendly. Recommend for layout-precision needs or row-level feeds.
- **Google Sheets pivot** — a tab with `QUERY()` formula + embedded chart.
  Dead simple, lands in Workspace. Right for ad-hoc viewers who already live
  in Sheets.

The plan should name a hand-off recommendation when a board would require
precise layout, custom colours, row-level data, or a non-Databox-shaped view.
