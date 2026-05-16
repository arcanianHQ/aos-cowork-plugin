# AOS plugin (`aos`)

AOS — the Go-To-Market operating system — packaged as a Claude plugin. Installs in
Claude Cowork and Claude Code (same plugin format).

This is the **client-run (Stage-3) delivery** of AOS: self-contained, no backend,
no control layer. Architecture: see `docs/aos-cowork-merged-architecture.md`,
`docs/aos-data-flow-map.md`, and `DECISIONS_2026-05-15_aos-cowork-no-control-layer.md`
in the ADF repo.

## Status

`v0.0.1` — **scaffold**. The structural skills (`aos-router`, `aos-onboard`) are
starter drafts; building-block skills are ported under AOS-725 and workflow
skills under AOS-728.

## Storage model

AOS data is stored as **plain files in a granted folder** — the system of record.
The folder is one the user grants Cowork access to, placed inside their Google
Drive for Desktop directory so it is cloud-synced and backed up for free. No
database, no Drive MCP connector.

- `data-template/` is the **canonical layout**; `aos-onboard` instantiates it into
  the client's granted folder on first run.
- Full spec: `docs/data-folder-spec.md`.
- SQLite, if used for graph queries, is operated on the ephemeral sandbox `/tmp`,
  never on the granted folder (FUSE mounts can't host a live DB).

## Connectors (`.mcp.json`)

Connectors are for genuinely-remote data sources only — **never** for AOS's own
storage. Core set: **Databox**, **HubSpot** (Google Ads + GA4 pending endpoint
confirmation — AOS-724). Conditional per-client connectors, and the full model:
see `docs/connectors.md`.

## Layout

```
aos-cowork-plugin/
├── .claude-plugin/plugin.json   plugin manifest
├── .mcp.json                    connector declarations
├── skills/                      AOS skills — router, onboard, + ported skills
├── data-template/               canonical granted-folder layout
└── docs/data-folder-spec.md     the data-folder spec
```

## Install

- **Claude Code:** `claude plugin marketplace add <marketplace>` then
  `claude plugin install aos@<marketplace>`.
- **Cowork:** via the private plugin marketplace (Settings → Plugins).
