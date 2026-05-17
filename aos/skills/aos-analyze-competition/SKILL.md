---
name: aos-analyze-competition
description: Map a client's competitive landscape — name the real competitors, build one profile file per competitor (domain, positioning, the products/services it actually competes on, strengths, observable weaknesses, pages/keywords to watch), maintain a per-business-unit competitor catalogue, and surface the positioning gaps the client can own. Produces brand/competitors/ profiles + CATALOGUE.md + brand/COMPETITIVE_LANDSCAPE.md. SEMrush-aware; degrades to manual research. Trigger on 'analyse the competition', 'who are our competitors', 'competitor map', or when COMPETITIVE_LANDSCAPE.md is a stub.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L2, L3]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--bu=<bu-slug>] — operates on the granted folder; omit --bu to cover all BUs; uses the SEMrush connector when present"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (multi-BU — the BU list)
  - brand/COMPETITIVE_LANDSCAPE.md (existing synthesis — stub or filled)
  - brand/competitors/ (existing competitor profiles + CATALOGUE.md, if present)
  - brand/POSITIONING.md (required — positioning frames who counts as a competitor)
  - brand/ICP.md (who the customer is — frames the alternatives they weigh)
  - content-system/[<bu>/]products.md (the client's products/services — to scope each competitor's overlap)
  - inbox/**/*.md (harvest pool — competitor-research docs, SEO/SEM analyses, founder "they do X better" notes)
  - competitor websites (homepage, depth 0 — WebFetch; provenance-gated on Cowork — see Step 2)
  - SEMrush MCP tools (keyword / traffic / competitor data — when the connector is present)
outputs:
  - brand/competitors/<competitor-slug>.md (one profile file per competitor)
  - brand/competitors/CATALOGUE.md (the competitor catalogue — organised by business unit)
  - brand/COMPETITIVE_LANDSCAPE.md (the synthesis — positioning gaps, per BU; consumed by aos-build-brand-system)
preflight:
  - client-config
connector:
  name: semrush
  required: false
  degrades: true
ontology:
  consumes: [Layer, ICP, FND]
  emits: [FND]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-onboard
tags: [intelligence, competition, competitive-landscape, positioning, L2, brand-profile]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `content-system/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content-system/<bu>/`) *are* a legitimate layout level for multi-BU clients. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

Map the **competitive landscape** — who else competes for this client's customer,
how each is positioned, **which of the client's products / services each
actually competes on**, and the **positioning gaps** the client can own.

`aos-analyze-competition` is a **dedicated brand-file skill** — the deep
counterpart to `aos-build-brand-system`'s inline competitive pass. It maintains a
**competitor catalogue**: one profile file per competitor under
`brand/competitors/`, indexed by `brand/competitors/CATALOGUE.md`, plus the
strategic synthesis in `brand/COMPETITIVE_LANDSCAPE.md`.

**Why this is foundational.** Competition sits at the positioning layer (**L2**):
a brand is positioned *against* a field. A flat list of competitor logos is
decoration; a catalogue where each competitor has a real profile — and where the
field is mapped **per business unit** — is a strategic input `aos-build-brand-system`
and `aos-plan` can act on.

**Two disciplines that shape the data model:**

1. **Per business unit.** A multi-BU client (different domains, different ICPs)
   has a *different competitive field per BU*. The catalogue is organised by BU;
   a competitor is stored once and tagged with every BU it competes in.
2. **Competition is scoped, never assumed head-to-head.** A competitor often
   overlaps the client only on *some* products or services. Each profile records
   `competes_on:` — the specific lines where the overlap is real — and an overlap
   scope (`full` head-to-head vs `partial`). A partial competitor is not a
   whole-business rival, and the map must not treat it as one.

**Anti-goal.** This skill does not write the client's positioning (that is
`aos-build-brand-system`'s POSITIONING pass) and does not run an SEO gap audit.
It maps the field and names the gaps; the positioning *decision* is made
elsewhere, informed by this map.

## Posture

Discovery, not pronouncement. The map is a draft grounded in cited observation —
*"this is what each competitor's site / data shows; is this the field as you see
it?"* Present the full draft for the user to correct; end every written file with
*"What did we get wrong? What's missing?"*

## Output contract

This skill writes a **three-part competitor record**:

1. **One profile file per competitor** — `brand/competitors/<competitor-slug>.md`,
   built to `reference/output-template.md` §1. Each is substantive: domain,
   positioning, `business_units:`, `competes_on:` + overlap scope, strengths,
   observable weaknesses, watch list.
2. **The catalogue** — `brand/competitors/CATALOGUE.md`, built to
   `reference/output-template.md` §2 — organised **by business unit**, each
   competitor listed under every BU it competes in, with its overlap scope.
3. **The synthesis** — `brand/COMPETITIVE_LANDSCAPE.md`, built to
   `reference/output-template.md` §3 — the positioning-gap read (per BU for
   multi-BU clients). This is the slot `aos-build-brand-system` consumes; it must
   clear the **FILLED** threshold in
   `aos-build-brand-system/reference/file-substance-criteria.md` →
   COMPETITIVE_LANDSCAPE.md: ≥3 competitors mapped (now via the catalogue +
   profiles it references), ≥3 monitored pages/keyword clusters each, a cadence
   statement, cited sources.

If fewer than 3 real competitors can be named and evidenced for a BU, do not pad
— write what is solid, mark the synthesis `status: partial` with the named gap.

## Connector — SEMrush (graceful degradation)

This skill is **SEMrush-aware**, not SEMrush-gated. A connector counts as
connected **only if its MCP tools are present in the session**.

- **SEMrush present** → pull competitor keyword overlap, traffic estimates, and
  top pages through the SEMrush MCP tools. Tag everything sourced this way `[DATA]`.
- **SEMrush absent** → **degrade, do not fail.** Build the map from scraped
  competitor pages + the `inbox/` research material + founder observations. Tag
  those `[OBSERVED]` / `[STATED]`. Flag the data gap; hold the keyword-cluster
  section to what manual research supports. Recommend connecting SEMrush for a
  metrics-grounded refresh. Never report a missing connector as a failure.

## Arguments

This skill operates on the **granted folder** — which is the client's folder.

- `--bu` (optional) — a BU slug. Given → scope the run to that BU's field.
  Omitted on a multi-BU client → cover **all** BUs (the catalogue always reflects
  the whole client). Multi-BU layout is detected from `client/DOMAIN_CHANNEL_MAP.yaml`
  and `content-system/*/` subfolders.

There is no client-slug argument — the granted folder *is* the client folder.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Detect the BU set** — read `client/DOMAIN_CHANNEL_MAP.yaml` and `ls content-system/*/`. Single-BU → one field. Multi-BU → the field is mapped per BU; `--bu` scopes a run, its absence means all BUs.
4. **Pre-read** `brand/COMPETITIVE_LANDSCAPE.md` and any existing `brand/competitors/*.md` you intend to rewrite — the Write tool refuses to overwrite an un-Read file.
5. **Positioning gate (soft).** Read `brand/POSITIONING.md`. FILLED → its category landscape + anti-claims frame who counts as a competitor. A stub → the map can still be built, but say so: ask the user to name competitors directly, and note the field was named without a positioning frame.
6. **Connector check** — record whether the SEMrush MCP tools are present (sets metrics-grounded vs degraded mode).

### Step 1 — Identify candidate competitors, per BU

For each BU in scope, name the field — the candidate-sourcing lenses are in `reference/competition-method.md`: `brand/POSITIONING.md` (category landscape, anti-claims), `brand/ICP.md` (indirect alternatives — what else the customer hires for the same JTBD), `inbox/` research and founder notes. Classify each **direct** / **indirect**. Aim for ≥3 direct per BU; name the strongest indirect alternatives too. A competitor surfacing in more than one BU is **one** competitor — note every BU it appears in.

### Step 2 — Gather competitor evidence

For each competitor, gather observed evidence — method in `reference/competition-method.md`:

- **Scrape the homepage (depth 0, one page each)** with `WebFetch`.
  **⚠ Cowork — the `WebFetch` provenance gate.** On Cowork, `WebFetch` only
  retrieves URLs that appeared in a **user message** (or a prior `WebFetch`
  result). A competitor URL the skill derived from `POSITIONING.md` / `inbox/` is
  **not** in the provenance set. So: state the competitor domains you intend to
  fetch, **ask the user to paste them into chat**, then `WebFetch` the pasted
  URLs in the very next step. If the user declines, build that profile from
  `inbox/` research + founder observation and note it. See `docs/connectors.md`.
- **SEMrush** (if connected) — keyword overlap, traffic estimate, top pages.
- **`inbox/` research** — anything already gathered.
- **`content-system/[<bu>/]products.md`** — the client's own product/service
  list, so each competitor's overlap can be scoped against real lines.

Tag every evidence item with its class — `[DATA]` / `[OBSERVED]` / `[STATED]` — and its source.

### Step 3 — Write one profile per competitor

For each competitor, write `brand/competitors/<competitor-slug>.md` to
`reference/output-template.md` §1:

- **Domain** + direct / indirect classification.
- **`business_units:`** — every BU this competitor competes in.
- **`competes_on:`** — the **specific products / services / lines** of the client
  where the overlap is real, and the **overlap scope**: `full` (head-to-head
  across the client's offer) or `partial` (competes only on the named lines).
  This is mandatory — never leave a competitor implicitly head-to-head.
- **Primary positioning** — in the competitor's own homepage words.
- **Key strengths** — what they genuinely do well, from observed evidence.
- **Observable weaknesses** — what their site / data shows they do not do, do
  badly, or leave uncovered.
- **Watch list** — ≥3 monitored pages or keyword clusters for the ongoing watch.

A competitor that spans BUs gets **one** file with all BUs in `business_units:` — never duplicate it per BU.

### Step 4 — Rebuild the catalogue

Write / rewrite `brand/competitors/CATALOGUE.md` (`reference/output-template.md` §2)
— organised **by business unit**. Each BU section lists the competitors that
compete in it, with each competitor's direct/indirect class and overlap scope
(`full` / `partial` + the `competes_on:` summary). A competitor that competes in
two BUs appears under both. Use `Edit` if the catalogue pre-exists (Read first);
`Write` only if it is genuinely new.

### Step 5 — Synthesis: positioning gaps + cadence

Write `brand/COMPETITIVE_LANDSCAPE.md` (`reference/output-template.md` §3) — the
strategic read, **per BU** for a multi-BU client. For each BU, read the mapped
field for **positioning gaps**: positions no competitor credibly holds that the
client's `POSITIONING.md` + `ICP.md` say the client could hold. Where a gap is
sharp and high-confidence, emit it as an `FND` into `ontology/findings/`
(`source: aos-analyze-competition`, `consumes:` the ICP / Layer, `emits: []`) so
`aos-plan` picks it up — only when genuine. State the **refresh cadence**.

### Step 6 — Surface as a draft, then write

Present the full three-part record — **Accept** / **Revise** / **Regenerate**.
Only on Accept (or post-Revise) write the files, each with the standard
provenance block (see Provenance). End each file with the mandatory footer line:
*"What did we get wrong? What's missing?"*

## Provenance

Every profile, the catalogue's competitor entries, and the synthesis carry the
**standard provenance block** in frontmatter — see `docs/artifact-versioning.md`
§1. Stamp all four fields (`generated_by`, `skill_version`, `generated_date`,
`aos_schema`); never hard-code `skill_version` or `aos_schema` — read them at
write time. `brand/competitors/CATALOGUE.md` is a rebuilt index — like
`content/CATALOGUE.md`, it carries only its own footer, not the provenance block.
Any emitted `FND` carries the block alongside the `ontology/README.md` frontmatter.

## Hard rules

1. **Observed, not asserted.** Every strength and weakness traces to evidence
   (`[DATA]` / `[OBSERVED]` / `[STATED]` + source). No invented competitor facts.
2. **One profile per competitor; never duplicate.** A competitor that spans BUs
   is one `brand/competitors/<slug>.md` with all BUs in `business_units:`.
3. **Scope every competitor.** `competes_on:` + overlap scope (`full` / `partial`)
   is mandatory on every profile — a competitor is never implicitly head-to-head.
4. **Per BU.** A multi-BU client's field is mapped per BU; the catalogue is
   organised by BU. Never collapse two BUs' competitive fields into one list.
5. **≥3 real competitors per BU, or an honest gap.** Do not pad — mark the
   synthesis `partial` if a BU's field is short.
6. **Degrade, never fail, without SEMrush.** Manual research + scraped pages is a
   valid path; flag the data gap, never fabricate a keyword / traffic number.
7. **Respect the WebFetch provenance gate.** On Cowork, never silently `WebFetch`
   a config-derived competitor URL — ask the user to paste it first.
8. **The gap is the point.** The synthesis is not done until the
   positioning-gap read is written.
9. **Discovery, not pronouncement.** The record is a draft for the user to
   correct; user confirms before any write.
10. **Single client.** Operate only within the granted folder. (Reading a
    competitor's public website is public research, not a cross-client read — a
    competitor is not an AOS client.)

## Output Sections

Final user-facing output:

- **Connector status** — SEMrush connected / degraded
- **BU set** — single-BU, or the BUs mapped this run
- **The field, per BU** — competitors identified, direct / indirect, overlap scope
- **Profiles written** — `brand/competitors/` file list
- **Catalogue** — `brand/competitors/CATALOGUE.md` rebuilt
- **Positioning gaps** — per BU; any FND emitted
- **Refresh cadence**
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder); `aos-build-brand-system`'s POSITIONING pass and `aos-build-icp` (positioning + ICP frame who counts as a competitor and which alternatives the customer weighs); `aos-diagnose-7layer` (L2 findings).
- **Downstream:** `aos-build-brand-system` consumes `brand/COMPETITIVE_LANDSCAPE.md` as a profile slot; a positioning-gap `FND` feeds `aos-plan`; `aos-build-brand` reads the field for an association / repositioning move; `aos-build-offer` reads it for competitive risk-reversal.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-788, Milestone 4 feature wave). The dedicated competitive-landscape brand-file skill — a per-BU competitor catalogue with one profile file per competitor, each scoped by `competes_on:`. The candidate-sourcing lenses and positioning-gap heuristics likely need refinement after first real runs. SEMrush connector integration is minimal until the endpoint is wired (AOS-797).

**What did we get wrong? What's missing?**
