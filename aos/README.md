# AOS plugin (`aos`)

AOS — the Go-To-Market operating system — packaged as a Claude plugin. Installs in
Claude Cowork and Claude Code (same plugin format).

This is the **client-run (Stage-3) delivery** of AOS: self-contained, no backend,
no control layer. Architecture: see `docs/aos-cowork-merged-architecture.md`,
`docs/aos-data-flow-map.md`, and `DECISIONS_2026-05-15_aos-cowork-no-control-layer.md`
in the ADF repo.

## Status

`v0.2.0` — **scaffold**. The structural skills (`aos-route-question`, `aos-onboard`) are
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
aos-cowork-plugin/               the repo — a single-plugin marketplace
├── .claude-plugin/marketplace.json
└── aos/                         the plugin
    ├── .claude-plugin/plugin.json   plugin manifest
    ├── .mcp.json                    connector declarations
    ├── skills/                      AOS skills — router · onboard · catalogue · + ported
    ├── data-template/               canonical granted-folder layout
    └── docs/                        data-folder-spec · design-patterns · connectors · architecture-gaps
```

## Install

This repo is a single-plugin marketplace — root `.claude-plugin/marketplace.json` lists the `aos` plugin, which lives in `aos/`.

- **Claude Code:** `claude plugin marketplace add arcanianHQ/aos-cowork-plugin`, then `claude plugin install aos@aos-cowork`.
- **Local dev / testing:** `claude --plugin-dir <path>/aos-cowork-plugin/aos`.
- **Cowork:** add the repo as a private marketplace in the admin Plugins panel (or upload a ZIP).
