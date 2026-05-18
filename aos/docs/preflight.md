# Preflight checks

Before a skill does work it runs **preflight** — `preflight:` frontmatter,
pipeline band C. Preflight verifies the folder is sound *before* the skill acts,
so a skill never runs against a stale or broken folder.

## Base checks — every skill, every run

These run on **every** skill, regardless of what its `preflight:` list says.

### `schema-current`

Compare the folder's `schema-version` (`AOS_CONFIG.md`) to **the plugin's schema
version** — the literal stated in `aos-onboard` / `aos-migrate` (and
`docs/CURRENT_SCHEMA_VERSION`).

- folder **<** plugin → **HALT.** The folder is behind — newer zones or config
  the skill expects may be missing. Tell the user plainly: *"this folder is
  schema N, the plugin is M — run `aos-migrate` first."* Do **not** run the
  skill against a behind folder.
- folder **>** plugin → halt; advise updating the plugin.
- equal → pass.

This is the guard against **silent degradation** — the failure mode where an
operator opens a session, forgets to migrate, and a loop skill runs anyway
against a folder missing newer zones / config, producing quietly-wrong output
with no loud error. `aos-onboard` and `aos-migrate` are **exempt** — they are
the skills that *fix* the gap.

### `client-config`

`client/CLIENT_CONFIG.md` exists and is not a stub. Absent → the folder is not
onboarded; route to `aos-onboard`.

## Skill-specific checks (named in `preflight:`)

- `client-config-soft` — `CLIENT_CONFIG.md` is preferred, but the skill degrades
  gracefully without it.
- `connectors` — the skill's required connectors (`## Connectors` /
  `.mcp.json`) are present; degrade or halt per the skill's connector contract.

A skill's `preflight:` list adds these on top of the base checks.

## In Cowork — where preflight actually fires

Cowork plugin **hooks do not fire**, so preflight cannot be a `SessionStart`
hook. The enforcement surfaces are:

1. **The granted folder's `CLAUDE.md`** — Cowork loads it on **every** session.
   It carries the session-start health check and runs `schema-current` + the
   connector / manifest checks **before any skill**. This is the real gate.
2. **The per-skill `preflight:`** — the second line; a skill's own Step 0
   re-checks before it acts.

`data-template/CLAUDE.md` is the template for surface 1 — every scaffolded
client folder gets it.
