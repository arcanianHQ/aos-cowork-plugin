# Migration steps

The ordered, versioned migration steps `aos-migrate` runs to bring a granted
folder forward. Each step takes a folder from schema version `N` to `N+1`.
`aos-migrate` runs every step in the gap between the folder's `schema-version`
and the plugin's `CURRENT_SCHEMA_VERSION`, strictly in order.

Design + the four invariants (ordered, idempotent, non-destructive, logged):
`docs/artifact-versioning.md` §2.

## Current state

**Schema version: `5`.** Four migration steps — `1→2`, `2→3`, `3→4`, `4→5`, below.

### Step 1→2 — the per-client `## Connectors` block

**What changed.** `client/CLIENT_CONFIG.md` gained a `## Connectors` block —
`required` / `optional` connectors and paid `overlays` — read by `aos-onboard`
Step 5 to provision exactly the connectors a client needs (AOS-831). The schema
version moved from 1 to 2.

**Zones / files touched.** `client/CLIENT_CONFIG.md` only.

**Idempotency check.** Skip if `client/CLIENT_CONFIG.md` already contains a
`## Connectors` heading.

**Operations.** If `client/CLIENT_CONFIG.md` has no `## Connectors` section,
insert one immediately before `## Notes` (or at end of file if `## Notes` is
absent) — the `## Connectors` heading, the explanatory line, and the three empty
fields `required:` / `optional:` / `overlays:` with their guidance comments,
copied verbatim from `data-template/client/CLIENT_CONFIG.md`. Leave the values
**blank** — the operator fills them (a later `aos-onboard` run prompts for them).
Never guess a client's connectors from `.mcp.json`.

**Superseded files.** None — purely additive.

**Log line.** Append to `CAPTAINS_LOG.md`: `schema 1 → 2 — added the
CLIENT_CONFIG.md ## Connectors block`.

### Step 2→3 — the no-DAL file-zones (leads, content schedule, metrics)

**What changed.** The data-folder model gained three filesystem zones so a
customer without the `aos-data-layer` overlay still holds 100% of their data:
`LEADS.md` (root), `content/SCHEDULE.md`, and the `metrics/` zone with
`metrics/METRICS.md` (AOS-832). The schema version moved from 2 to 3.

**Zones / files touched.** Creates `LEADS.md`, `content/SCHEDULE.md`,
`metrics/METRICS.md` — nothing existing is read or rewritten.

**Idempotency check.** For each of the three files, skip if it already exists.

**Operations.** For each missing file, copy it verbatim from `data-template/`
(`data-template/LEADS.md`, `data-template/content/SCHEDULE.md`,
`data-template/metrics/METRICS.md`) to the matching path in the granted folder,
creating the `metrics/` directory if absent. The files are empty templates —
no client data is inferred or filled.

**Superseded files.** None — purely additive.

**Log line.** Append to `CAPTAINS_LOG.md`: `schema 2 → 3 — added the LEADS.md /
content/SCHEDULE.md / metrics/ file-zones`.

### Step 3→4 — the `campaigns/` zone

**What changed.** Campaigns moved from the flat `dictionaries/campaign.yaml`
into a `campaigns/` zone — `campaigns/INDEX.md` + per-campaign files
`campaigns/<slug>.md` (record + brief). `aos-plan-campaign` v0.2.0 writes it
(AOS-834). The schema version moved from 3 to 4.

**Zones / files touched.** Creates `campaigns/INDEX.md` and `campaigns/README.md`.
`dictionaries/campaign.yaml` is **left in place** as legacy — not read, not
removed (non-destructive).

**Idempotency check.** Skip if `campaigns/INDEX.md` already exists.

**Operations.** If `campaigns/` has no `INDEX.md`, create the `campaigns/`
directory and copy `INDEX.md` + `README.md` verbatim from
`data-template/campaigns/`. If the legacy `dictionaries/campaign.yaml` lists any
campaigns, note them for the user to re-file via `aos-plan-campaign` — do not
auto-convert (the new per-campaign file needs a brief the flat YAML never had).

**Superseded files.** None removed — `dictionaries/campaign.yaml` stays as
legacy. Purely additive.

**Log line.** Append to `CAPTAINS_LOG.md`: `schema 3 → 4 — added the campaigns/
zone`.

### Step 4→5 — the campaign model refinements

**What changed.** The finalised campaign model (AOS-834): per-campaign files
gain a `## KPIs` table, themes get their own files in `campaigns/themes/`, and
`content/SCHEDULE.md` + `content/CATALOGUE.md` gain a `Campaign` column. The
schema version moved from 4 to 5.

**Zones / files touched.** Creates `campaigns/themes/`. Adds a `Campaign`
column to `content/SCHEDULE.md` and `content/CATALOGUE.md` if missing.

**Idempotency check.** Skip the directory step if `campaigns/themes/` exists;
skip the column step on a file that already has a `Campaign` column.

**Operations.** Create the `campaigns/themes/` directory (copy
`data-template/campaigns/themes/.gitkeep`). For `content/SCHEDULE.md` and
`content/CATALOGUE.md`, add a `Campaign` column to their tables if absent —
header + separator + an empty cell per existing row; never drop a row. Existing
per-campaign files keep working; the `## KPIs` table is added by
`aos-plan-campaign` on the next campaign run, not retro-fitted here.

**Superseded files.** None — purely additive.

**Log line.** Append to `CAPTAINS_LOG.md`: `schema 4 → 5 — campaign model
refinements (campaigns/themes/, Campaign column)`.

## Step template — copy this when adding a step

When a schema-changing data-folder or artifact-format change ships, add a
section here using this exact shape:

---

### Step N→N+1 — <short title>

**What changed.** <The data-folder layout / artifact-format change, in one or
two sentences. Why the schema version had to move.>

**Zones / files touched.** <Which zones and file patterns this step reads or
rewrites — e.g. `brand/*.md`, `ontology/findings/FND-*.md`.>

**Idempotency check.** <Exactly how the step detects it has already run on this
folder, so a re-run is a safe no-op. E.g. "skip any file already carrying
`aos_schema: N+1`" or "skip if `<new-dir>/` already exists".>

**Operations.** <The ordered bash / file operations. Each operation states its
own pre-check. For artifact rewrites: select files whose provenance
`aos_schema` is `< N+1`, transform, re-stamp the provenance block's
`aos_schema` to `N+1`.>

**Superseded files.** <Anything this step replaces or moves aside — moved to
`.aos/migration-backup/N-to-N+1/`, never deleted. "None" if the step is purely
additive.>

**Log line.** Append to `CAPTAINS_LOG.md`: the `N → N+1` transition, files
touched, outcome.

---

## Notes for the author of the first step

- Keep each step self-contained — it must not depend on a later step having run.
- Prefer additive changes (new files/zones) over rewrites; rewrites are riskier
  and must use the provenance block to scope which files need touching.
- Test the idempotency check by running the step twice on the same fixture
  folder — the second run must change nothing.
- A step that rewrites artifacts re-stamps their provenance block (§1 of
  `docs/artifact-versioning.md`) — at minimum `aos_schema`, and `generated_date`
  if content changed.
