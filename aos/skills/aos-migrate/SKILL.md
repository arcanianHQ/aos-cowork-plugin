---
name: aos-migrate
description: "Migrate a client's AOS granted folder forward when the plugin's data-folder schema has moved ahead of the folder's. Compares AOS_CONFIG.md's schema-version to the plugin's current schema version, runs the ordered migration steps for the gap (idempotent, non-destructive, each logged to CAPTAINS_LOG.md), then advances schema-version. Trigger on 'migrate my folder', 'upgrade the data folder', or when a skill reports the folder is behind the plugin."
scope: int-company
flavor: [company, advanced, internal]
class: system
domain: onboarding
layer: all
client-scope: single-client
version: 0.1.3
owner: arcanian
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
args-hint: "(no args — operates on the granted folder)"
preflight: []
ontology:
  consumes: []
  emits: []
safety:
  mode: mutates-state
  requires_confirmation: true
---

# AOS Migrate

Bring a client's granted folder forward when the plugin's data-folder **schema
version** has moved ahead of the folder's. Design: `docs/artifact-versioning.md`
— read it before touching this skill.

## The two version numbers

- **Folder schema version** — `schema-version` in `AOS_CONFIG.md` at the
  granted-folder root. The layout version *this folder* is at.
- **Plugin current schema version** — **this plugin build is schema version
  `3`**, stated here and in the plugin's own `docs/CURRENT_SCHEMA_VERSION`. The
  layout version *this build of the plugin* expects.

> **Never read the plugin schema version from the granted folder** or from any
> `aos/` directory inside or beside it — the granted folder holds *client data
> only*, never plugin files. A stray `aos/` copy near the granted folder is not
> "the plugin". The literal `3` in this skill is authoritative.

A migration is due when **plugin current (`3`) > folder**.

## Steps

1. **Read the folder version.** Resolve the granted-folder root, read
   `schema-version` from `AOS_CONFIG.md`.

2. **The plugin target version is `3`** — this plugin build (see "The two
   version numbers"). Do **not** read it from the granted folder or any `aos/`
   directory in its tree; a stray `aos/` near the granted folder is not the
   plugin.

3. **Compare.**
   - folder **==** target → report *"folder is up to date (schema vN)"*; stop.
   - folder **>** target → **stop.** Report a plugin/folder mismatch: the folder
     was written by a newer plugin than the one installed. Never downgrade,
     never guess. Tell the user to update the plugin.
   - folder **<** target → a migration is due; continue.

4. **Plan the run.** List the ordered steps to run — `N→N+1` for each `N` from
   folder-version up to target-1 — from `reference/migration-steps.md`. Show the
   user the plan (current version → target version, the steps in between) and
   **confirm before running** (`safety.requires_confirmation: true`).

5. **Run each step, in order.** For each `N→N+1` step, following
   `reference/migration-steps.md`:
   - Apply the step. Every step is **idempotent** — it checks the state it would
     create before creating it, so re-running a partially-done migration is
     safe.
   - Every step is **non-destructive** — it never deletes client data. Anything
     superseded is moved into `.aos/migration-backup/<N>-to-<N+1>/`, never
     removed.
   - On success: append a `CAPTAINS_LOG.md` entry (what ran, the `N → N+1`
     transition, files touched, outcome), then advance `schema-version` in
     `AOS_CONFIG.md` by one. Advancing per-step means an interrupted migration
     resumes cleanly from where it stopped.
   - On failure: stop. Do not advance `schema-version` past the failed step. Log
     the failure to `CAPTAINS_LOG.md` and report it to the user.

6. **Refresh the plugin-version stamp.** After the folder reaches the target
   schema version, set `AOS_CONFIG.md`'s `plugin-version` field to the **running
   plugin's version** — read it from the *installed plugin's* own
   `.claude-plugin/plugin.json` (`${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`
   when the runtime provides that variable). **Never read it from the granted
   folder or any `aos/` directory in its tree.** If the plugin version cannot be
   resolved, leave the existing stamp unchanged — never guess, never blank it.

7. **Confirm.** When the folder reaches the target version, summarise: versions
   before/after, steps run, files touched, anything moved to
   `.aos/migration-backup/`. Suggest the user re-run their original workflow.

## Current state

Schema version is **`3`** (`docs/CURRENT_SCHEMA_VERSION`). Two migration steps
are defined — `1→2` (the `## Connectors` block in `CLIENT_CONFIG.md`) and `2→3`
(the `LEADS.md` / `content/SCHEDULE.md` / `metrics/` file-zones) — registered in
`reference/migration-steps.md`. A folder onboarded before schema 3 reports
*behind* and this skill runs the steps in the gap.

## Adding a migration step (future work)

When the data-folder layout or an artifact format changes:

1. Choose the new schema version — next integer after `CURRENT_SCHEMA_VERSION`.
2. Add a numbered `Step N→N+1` section to `reference/migration-steps.md` — the
   change, the zones/files touched, the exact operations, the **idempotency
   check** (how the step detects it already ran), what (if anything) gets moved
   to `.aos/migration-backup/`.
3. Bump `docs/CURRENT_SCHEMA_VERSION` to the new integer.
4. Update `data-template/AOS_CONFIG.md`'s `schema-version` literal so fresh
   installs start current.
5. Bump `.claude-plugin/plugin.json` version + note the migration in `README.md`.

This skill needs **no code change** to pick up a new step — it reads the steps
from `reference/migration-steps.md` and runs every one in the gap.

## Guardrails

- **Non-destructive, always.** A migration step never deletes client data. The
  granted folder is the system of record; losing any of it is unacceptable.
  Superseded files move to `.aos/migration-backup/`, never `rm`.
- **Idempotent, always.** Every step is safe to re-run. Never assume a step is
  unrun — check.
- **Ordered, one step at a time.** Close a multi-version gap step by step; never
  jump versions. `schema-version` advances by exactly one per completed step.
- **Confirm before running.** Show the plan; do not migrate silently.
- **Never downgrade.** Folder newer than plugin → stop and report.
- **`aos-migrate` is the only skill that advances `schema-version`.** No other
  skill writes that field after `aos-onboard`'s initial install value.

## Status

v0.1.3 — the `2→3` migration step (the no-DAL file-zones `LEADS.md` /
`content/SCHEDULE.md` / `metrics/`); schema literal moved 2 → 3 (AOS-832).

Prior: v0.1.2 — a completed migration refreshes the `plugin-version` stamp in
`AOS_CONFIG.md` (step 6), read from the installed plugin; the stale "## Current
state" section is corrected to schema 2 + the `1→2` step.

Prior: v0.1.1 — the plugin target schema version is pinned to the literal `2` in this
skill, and the skill is barred from reading it out of the granted-folder tree
(an M12 dogfood finding: a stray `aos/` copy beside the granted folder poisoned
the comparison). The `1→2` migration step (the `CLIENT_CONFIG.md` `## Connectors`
block) is registered in `reference/migration-steps.md`.

Prior: v0.1.0 — migration **mechanism** + the version-comparison + per-step
log/advance loop (AOS-755). Zero migration steps defined (schema at `1`).
