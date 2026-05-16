# Migration steps

The ordered, versioned migration steps `aos-migrate` runs to bring a granted
folder forward. Each step takes a folder from schema version `N` to `N+1`.
`aos-migrate` runs every step in the gap between the folder's `schema-version`
and the plugin's `CURRENT_SCHEMA_VERSION`, strictly in order.

Design + the four invariants (ordered, idempotent, non-destructive, logged):
`docs/artifact-versioning.md` §2.

## Current state

**Schema version: `1`.** There are **no migration steps** — `1` is the initial
schema, so there is nothing below it to migrate *from*. Every onboarded folder
is created at `1` (the value in `data-template/AOS_CONFIG.md`).

This file is the registry the first real step gets added to.

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
