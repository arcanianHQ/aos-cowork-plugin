---
name: aos-plan-campaign
description: "Produce a campaign brief — a bounded, time-boxed marketing campaign defined end to end: objective + KPI, audience, the offer / hook, messaging angle, channel plan, timeline, the deliverables it needs, and how it will be measured. Three brief types — dealer, retail, brand. Trigger on 'write a campaign brief', 'plan the <occasion> campaign', 'brief the promotion'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L3, L6, L7]
client-scope: single-client
version: 0.3.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "--type=<dealer|retail|brand> --occasion=\"<phrase>\" [--bu=<bu-slug>] — operates on the granted folder"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (multi-BU — brief per BU)
  - brand/POSITIONING.md · brand/ICP.md · brand/OFFER.md · brand/VOICE.md (the strategic frame — used if present)
  - content-system/[<bu>/]messaging.md · pillars.md · products.md · distribution.md (the operational frame — used if present)
  - deliverables/<YYYY-MM>/gtm-plan.md (the standing plan — a campaign should serve a plan move, if one exists)
  - ontology/recommendations/ (open RECs — a campaign may execute one)
  - the user — the campaign frame (occasion, objective, offer, timeframe, budget) is captured interactively
outputs:
  - campaigns/<slug>.md (the campaign record — frontmatter — + the brief as the body)
  - campaigns/INDEX.md (the campaign index — theme + campaign rows, refreshed)
preflight:
  - client-config
ontology:
  consumes: [REC, Layer, ICP, OFFER, Goal]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [campaign, brief, planning, intelligence, gtm]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `content-system/`, `deliverables/`, `ontology/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content-system/<bu>/`) *are* a legitimate layout level for multi-BU clients. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write the brief in `content-language`.

## Purpose

Produce a **campaign brief** — the single document that defines a bounded,
time-boxed marketing campaign before any content is drafted: what it is for, who
it is for, the offer at its centre, where and when it runs, what it needs built,
and how its success will be judged.

A **campaign** is a bounded push — a seasonal promotion, a launch, an event tie-in
— with a start, an end, and a goal. It is **not** the standing GTM plan: that is
`aos-plan`, the loop's ongoing planning stage. `aos-plan-campaign` produces the
brief for **one** campaign; ideally that campaign executes a move the standing
plan or an open `REC` already called for.

**Three brief types** — the campaign's audience and intent differ, and the brief's
emphasis with them (full per-type spec in `reference/brief-types.md`):

| `--type` | The campaign is for… | Emphasis |
|---|---|---|
| **brand** | end customers — building the brand itself | identity, positioning, reach |
| **retail** | end customers — driving a bounded sales push | the offer, urgency, conversion |
| **dealer** | the dealer / partner network — equipping them to market locally | the co-marketing kit, enablement, consistency |

**Anti-goal.** `aos-plan-campaign` does not draft the campaign's content (that is
`aos-write` / `aos-draft-content`), does not ship it (`aos-distribute`), and does
not replace the standing GTM plan (`aos-plan`). It writes the **brief** — the
plan *for one campaign* — that those skills then execute.

## Posture

Discovery, not pronouncement. The brief is a draft for the user to correct. The
campaign frame (occasion, objective, offer, timeframe, budget) is **captured from
the user**, not invented — a brief is only as real as the frame behind it. End
the brief with *"What did we get wrong? What's missing?"*

## Arguments

- `--type` (required) — `dealer`, `retail`, or `brand`. If omitted, the skill
  recommends one from the occasion and asks.
- `--occasion` (required) — the campaign's trigger / theme, e.g. `"Memorial Day
  sale"`, `"spring spa launch"`.
- `--bu` (required if the client uses per-BU content) — BU slug. A campaign is
  briefed **per BU**; if `content-system/` has per-BU subfolders the skill
  refuses to run without it.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. Detect per-BU layout — `ls content-system/*/messaging.md`. If any match, `--bu` is required; abort with the BU list if missing.
4. **Soft brand check.** Read `brand/POSITIONING.md`, `ICP.md`, `OFFER.md`, `VOICE.md`. A campaign brief is sharpest on a complete profile — but this is **not a hard gate**: if files are thin, proceed and flag in the brief that the strategic frame was thin (recommend `aos-build-brand-system` for a stronger next brief).
5. Validate `--type`; load its spec from `reference/brief-types.md`.

### Step 1 — Capture the campaign frame

Interactively capture — do not invent (the question set is in `reference/brief-types.md`):

- **Occasion / trigger** — why now (the `--occasion`, expanded).
- **Objective** — the one outcome the campaign exists to produce.
- **The offer / hook** — what the campaign puts in front of the audience (a
  promotion, a launch, a message). Cross-check against `brand/OFFER.md` /
  `content-system/products.md` — a campaign offer must be a real, accurate offer.
- **Timeframe** — start, end, key dates.
- **Budget band** — if there is one.
- **Whom it serves** — confirm the `--type` audience and which standing-plan move
  or open `REC` (if any) this campaign executes.

### Step 2 — Build the brief

Compose the brief from the frame + the brand / content-system context, applying
the `--type`'s emphasis (`reference/brief-types.md`) and the brief shell
(`reference/brief-template.md`):

- **Objective + KPI** — the objective, made measurable: the metric, a target band,
  the measurement window. (How it will actually be measured links to `aos-measure`.)
- **Audience** — the segment from `brand/ICP.md`, narrowed to this campaign; for a
  `dealer` brief, both the dealer and the dealer's end customer.
- **The offer / hook** — accurate to `products.md` / `OFFER.md`.
- **Messaging angle** — the campaign's angle, on the `messaging.md` register and a
  real `pillars.md` pillar.
- **Channel plan** — channels from `distribution.md`, sequenced across the timeframe.
- **Deliverables** — the concrete pieces the campaign needs built (each is a job
  for `aos-write` / `aos-draft-content`), listed with type and channel.
- **Timeline** — the dated run-of-show.
- **Measurement plan** — what `aos-measure` reads at the end to judge the KPI.

### Step 3 — Surface and write

Present the brief to the user — Accept / Revise / Regenerate. On Accept, write
the campaign into the **`campaigns/` zone** (schema v5):

- **`campaigns/<slug>.md`** — the per-campaign file: a frontmatter **record**
  (`campaign`, `slug`, `theme` [a theme slug], `campaign_type`, `business_unit`,
  `budget`, `start`, `end`, `status`, `platforms`) + the **brief as the body**,
  then a **`## KPIs` table** — one row per metric (`KPI` / `Target` / `Actual` /
  `Unit`); `aos-measure` fills `Actual`. Record, brief and KPIs are one artifact
  — see `campaigns/README.md`. End the file with *"What did we get wrong? What's
  missing?"*
- **`campaigns/themes/<slug>.md`** — if the campaign belongs to a theme with its
  own narrative / budget / window, write (or refresh) the theme file. A one-off
  campaign with no theme needs none.
- **`campaigns/INDEX.md`** — add (or refresh) the campaign's row under its theme,
  with the `BU` column set.

The old flat `dictionaries/campaign.yaml` is superseded by this zone.

## Provenance

The brief carries the **standard provenance block** in its frontmatter — see
`docs/artifact-versioning.md` §1. Stamp all four fields (`generated_by`,
`skill_version`, `generated_date`, `aos_schema`); never hard-code `skill_version`
or `aos_schema` — read them at write time.

## Hard Rules

1. **Brief, don't draft.** `aos-plan-campaign` produces the campaign brief. It
   does not draft the campaign's content or ship it.
2. **The frame comes from the user.** Occasion, objective, offer, timeframe — all
   captured, never invented. A campaign brief with an invented objective is fiction.
3. **The offer must be real.** The campaign's offer / hook is cross-checked against
   `brand/OFFER.md` / `content-system/products.md` — no campaign promises a price,
   discount, or product the client does not actually offer.
4. **Every objective gets a KPI.** An objective with no measurable KPI and no
   measurement window is not written — make it measurable or mark it explicitly
   as a soft / brand-awareness objective with a proxy signal.
5. **Per BU.** For multi-BU clients, brief per BU — never collapse two BUs into
   one campaign.
6. **Type emphasis honoured.** A `dealer` brief leads with enablement, a `retail`
   brief with the offer, a `brand` brief with identity — per `reference/brief-types.md`.
7. **Single client.** Operate only within the granted folder.
8. **Discovery, not pronouncement.** Present the brief for confirmation; end it
   with *"What did we get wrong? What's missing?"*

## Output Sections

User-facing summary at end of run:

- Brief type + occasion
- Objective + KPI
- The deliverables the campaign needs (the hand-off list to `aos-write` / `aos-draft-content`)
- Brief path
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-build-brand-system` (the strategic frame the brief rests on); `aos-plan` (the standing plan a campaign should serve — a campaign brief often executes an open `REC`); `aos-route-question` routes "plan the campaign" / "write a campaign brief" requests here.
- **Downstream:** the brief's deliverables list is the work order for `aos-write` / `aos-draft-content`; `aos-distribute` ships the campaign's pieces on the brief's channel plan; `aos-measure` reads the campaign's KPI at the end of the window and emits findings — closing the loop.

## Versioning

- **v0.3.0** — the finalised campaign model (AOS-834, schema v5): per-campaign files gain a **`## KPIs` table** (the single `kpi:` frontmatter field is gone); a campaign's `theme:` is a slug referencing a **`campaigns/themes/<slug>.md`** theme file the skill also writes. Mirrors the AOS Cloud `campaign_kpis` table + `campaign_themes`.
- **v0.2.0** — writes into the new **`campaigns/` zone** (AOS-834, schema v4): a per-campaign file `campaigns/<slug>.md` — a frontmatter record (theme / type / BU / budget / window / status / KPI / platforms) + the brief as the body — and a row in `campaigns/INDEX.md`. Supersedes the prose-brief-in-`deliverables/` + flat `dictionaries/campaign.yaml` split.
- **v0.1.0** — initial Cowork-plugin authoring (AOS-787, Milestone 4 feature wave). Three brief types (dealer / retail / brand). Validated against real seasonal campaign briefs; the per-type emphasis and the brief shell likely need refinement after first real runs.

**What did we get wrong? What's missing?**
