# Artifact versioning & data-folder migration

Everything the AOS plugin writes into a client's granted folder is
**version-stamped**. Stamping is what makes the folder *migratable*: when the
plugin, a skill, or the data-folder schema changes, the system can read a stale
artifact, know exactly what produced it and under which schema, and upgrade the
folder safely.

This is the design doc for AOS-755. Two mechanisms live here:

1. **Per-artifact provenance** — the standard frontmatter block every generated
   artifact carries.
2. **The migration model** — how a granted folder is brought forward when the
   plugin's schema version moves ahead of the folder's.

It is a *system pattern* doc, in the style of `docs/language-packs.md`: it
defines the pattern once so future work (a new artifact-producing skill, a new
migration step) is a mechanical, self-contained job.

---

## 1. The provenance block

Every artifact a skill *generates* into the granted folder carries a
**provenance block** in its YAML frontmatter. The block has exactly four fields,
always in this order, always with these names:

```yaml
generated_by: <skill-name>      # the skill that wrote the file, e.g. aos-build-brand
skill_version: <semver>         # that skill's `version:` frontmatter value, e.g. 0.2.0
generated_date: <YYYY-MM-DD>    # ISO date the file was written
aos_schema: <integer>           # the data-folder schema-version the file was written under
```

### Field definitions

| Field | Value | Source |
|---|---|---|
| `generated_by` | The **skill name** exactly as in the skill's `name:` frontmatter (e.g. `aos-build-brand-system`). Not a display name, not abbreviated. | The producing skill. |
| `skill_version` | The producing skill's `version:` frontmatter value, a semver string (e.g. `0.2.0`). Stamp the *real* current version — do not hard-code. | The producing skill's own frontmatter. |
| `generated_date` | The date the artifact was written, ISO `YYYY-MM-DD`. | The runtime clock at write time. |
| `aos_schema` | The **data-folder schema version** in force when the file was written — the integer the migration model uses. Read it from `AOS_CONFIG.md`'s `schema-version` at write time. | `AOS_CONFIG.md` → `schema-version`. |

### Rules

- **Every generated artifact carries the block.** Brand-profile files, content
  drafts, diagnostic deliverables, FND / REC / GOT ontology nodes — anything a
  skill *produces* for the client. It sits in the file's frontmatter, alongside
  whatever domain frontmatter that artifact already has (`scope`, `client`,
  `status`, `sources_consulted`, `depends_on`, `needs_refresh_by`, …).
- **The block is additive.** It never replaces a file's existing domain
  frontmatter — it is added to it. Field order within the block is fixed; the
  block's position relative to other frontmatter keys is not significant.
- **It is written once, at write time.** A skill that *revises* an existing
  artifact re-stamps the block (new `skill_version` / `generated_date`, and
  `aos_schema` if the folder has since migrated). A skill that only *reads* an
  artifact never touches the block.
- **Hand-authored files are exempt.** Files a human writes or the user fills in
  by hand (e.g. `client/CLIENT_CONFIG.md`, `content-system/` operational files)
  are not "generated artifacts" — they carry no provenance block. The block
  marks *machine-produced* output.
- **`AOS_CONFIG.md` is not stamped with this block.** It is the folder's control
  file, not a generated artifact; it carries `plugin-version` + `schema-version`
  directly (see §2).

### Why these four fields

- `generated_by` + `skill_version` answer *"what produced this, and was it a
  version of the skill we still trust?"* — the basis for re-running or
  refreshing an artifact after a skill changes.
- `generated_date` answers *"how stale is this?"* — complements per-artifact
  `needs_refresh_by` where that exists.
- `aos_schema` answers *"which folder layout was this written for?"* — the field
  a migration step keys on to decide whether a file needs rewriting.

---

## 2. The migration model

### The two version numbers

| Number | Lives in | Meaning |
|---|---|---|
| **Folder schema version** | `AOS_CONFIG.md` → `schema-version` | The data-folder layout/format version *this granted folder* is currently at. Written by `aos-onboard` at install; advanced only by `aos-migrate`. |
| **Plugin current schema version** | `docs/CURRENT_SCHEMA_VERSION` (this repo) | The data-folder schema version *this build of the plugin* expects. A single integer, bumped whenever a schema-changing migration is added. |

When **plugin current schema > folder schema**, the granted folder is **behind**
and a migration is due. When they are equal, the folder is current. The folder
schema must never exceed the plugin's (that would mean an older plugin opening a
newer folder — `aos-migrate` reports it and stops rather than guessing).

`docs/CURRENT_SCHEMA_VERSION` is a dedicated one-line file holding just the
integer — kept separate from prose so `aos-migrate` can read it with a plain
`cat` and no parsing. It is the **single source of truth** for the plugin's
schema version; nothing else declares it.

> **Current value: schema version `1`.** There are no migration steps yet. The
> mechanism below is built and documented so the *first* real migration is a
> drop-in.

### How a migration runs

`aos-migrate` (skill, `class: system`) performs migration:

1. Read `schema-version` from `AOS_CONFIG.md` (the folder's version).
2. Read `docs/CURRENT_SCHEMA_VERSION` from the plugin (the target version).
3. If folder == target → nothing to do, report "up to date".
4. If folder > target → stop; report a plugin/folder mismatch (folder newer than
   plugin). Never downgrade.
5. If folder < target → run the **ordered** migration steps for every version in
   the gap: step `N→N+1` for each `N` from folder-version up to target-1.
6. After each step succeeds, append a log entry to `CAPTAINS_LOG.md` and advance
   `schema-version` in `AOS_CONFIG.md` by one — so the folder's recorded version
   tracks progress step by step, and an interrupted migration resumes cleanly.

### The four invariants of a migration step

Every migration step **must** be:

- **Ordered** — steps run strictly in sequence, `N→N+1`. A multi-version gap is
  closed one step at a time; no step may assume a later step has run.
- **Idempotent** — running a step on an already-migrated folder is a safe no-op.
  A step checks the state it would create before creating it. This is what makes
  an interrupted migration safe to re-run.
- **Non-destructive** — a step never deletes client data. It adds, renames, or
  rewrites in place; anything it supersedes is moved aside (e.g. into
  `.aos/migration-backup/<from>-<to>/`), never removed. The client's material is
  the system of record — a migration must not lose any of it.
- **Logged** — every step appends a `CAPTAINS_LOG.md` entry: what ran, the
  version transition, files touched, and the outcome.

### Adding a migration step (the future-work procedure)

When a change to the data-folder layout or artifact format ships:

1. **Pick the new schema version** — the next integer after the current
   `CURRENT_SCHEMA_VERSION` (e.g. `1` → `2`).
2. **Write the step procedure** — add a numbered `Step N→N+1` section to
   `aos/skills/aos-migrate/reference/migration-steps.md`, describing precisely:
   what the change is, which zones/files it touches, the exact bash/file
   operations, the idempotency check (how the step detects it already ran), and
   what gets moved to `.aos/migration-backup/` if anything is superseded.
3. **Bump the plugin's schema version** — set `docs/CURRENT_SCHEMA_VERSION` to
   the new integer.
4. **Update `data-template/AOS_CONFIG.md`** — its `schema-version` literal so
   fresh installs start at the new version.
5. **Bump the plugin version** in `.claude-plugin/plugin.json` and note the
   migration in `README.md`.

`aos-migrate` needs no code change to pick up a new step — it reads the steps
from `reference/migration-steps.md` and runs every one in the gap. Adding a step
is editing two files (the steps doc + `CURRENT_SCHEMA_VERSION`) plus the
template and manifest housekeeping.

---

## 3. How the pieces connect

- **`aos-onboard`** writes `schema-version` into `AOS_CONFIG.md` at install,
  seeded from `data-template/AOS_CONFIG.md` — so a fresh folder starts current.
  It also checks an *existing* folder's `schema-version` against
  `CURRENT_SCHEMA_VERSION` and, if the folder is behind, suggests `aos-migrate`.
- **`aos-route-question`** does the same check during its preflight: a folder
  behind the plugin gets routed to `aos-migrate` before any workflow runs.
- **`aos-migrate`** is the only skill that advances a folder's `schema-version`.
- **Every artifact-producing skill** stamps the §1 provenance block, reading
  `aos_schema` from `AOS_CONFIG.md`'s `schema-version` at write time.

A migration step that needs to rewrite stale artifacts uses the provenance block
to find them: select files whose `aos_schema` is below the target, transform
them, re-stamp. Provenance and migration are two halves of one mechanism —
stamping makes migration *possible*; migration is what stamping is *for*.
