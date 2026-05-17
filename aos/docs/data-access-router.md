# Data-access router

How AOS GTM skills find and touch client data — **without hard-coding where it
lives.** Design for AOS-756; consumed by AOS-725 (skill rewire).

## Principle

A skill asks the router for a **zone** (`client`, `inbox`, `brand`, `content`,
`ontology`, …) — never a literal path. The router resolves the zone to a real
location. Move the data, and skills keep working.

## Grounded in the AOS DAL (AOS-71)

This is the **Cowork-plugin profile** of the AOS Data Access Layer
(`core/methodology/DATA_ACCESS_LAYER.md`). Two rules carry over **verbatim**:

1. **Bash + filesystem is the contract; the router is an optimization.** Every
   skill must work via plain `bash` + filesystem on the granted folder — no
   Node, no DAL library required. The router accelerates; it is never mandatory.
2. Route by **how data is consumed**, not by its shape.

No Supabase / control plane in this profile (per
`DECISIONS_2026-05-15_aos-cowork-no-control-layer.md`).

## The config file — `AOS_CONFIG.md`

The **location manifest** lives at the granted-folder root: `AOS_CONFIG.md`.
`aos-onboard` writes it; every skill reads it. It records:

- `granted-folder` — the host path the folder was granted at
- `schema-version` — data-folder layout version (migration — AOS-755)
- a **Zones** table — per-zone location + adapter

Default for a zone is `granted` — i.e. `<granted-folder>/<zone>/`. A zone is
overridden only when it genuinely lives elsewhere.

## Zones

`client` · `inbox` · `brand` · `content` · `content-system` · `dictionaries` ·
`ontology` · `metrics` · `deliverables` — plus the root files (`AOS_CONFIG.md`,
`TASKS.md`, `LEADS.md`, `CAPTAINS_LOG.md`).

## Resolution — what a skill does

1. Read `AOS_CONFIG.md` from the granted-folder root.
2. Look up the zone in the **Zones** table → its location + adapter.
3. Operate via bash + filesystem (`fs`), or the named adapter.

A `SKILL.md` **never** hard-codes a zone path. It resolves through step 1–2.

## Adapters

| Adapter | For |
|---|---|
| `fs` | the granted folder — the baseline, always present. If the granted folder is inside Google Drive for Desktop, that is *transparent* `fs` — Drive sync happens underneath. |
| `drive` | a zone explicitly **outside** the granted folder, reached via the Drive connector. |

Designed to take more adapters. There is deliberately **no `supabase`** adapter
in the Cowork profile.

## Relation

- Implements the **AOS-71** DAL contract for the Cowork surface.
- **AOS-725** (port + rewire skills) targets this router — skills resolve zones
  here, not by literal path.
- **AOS-755** (artifact versioning) — `AOS_CONFIG.md` also carries
  `schema-version` for migration.
