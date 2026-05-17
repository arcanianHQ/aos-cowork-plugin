# Migration steps

The ordered, versioned migration steps `aos-migrate` runs to bring a granted
folder forward. Each step takes a folder from schema version `N` to `N+1`.
`aos-migrate` runs every step in the gap between the folder's `schema-version`
and the plugin's `CURRENT_SCHEMA_VERSION`, strictly in order.

Design + the four invariants (ordered, idempotent, non-destructive, logged):
`docs/artifact-versioning.md` §2.

## Current state

**Schema version: `3`.** Two migration steps — `1→2` and `2→3`, below.

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
