# AOS plugin (`aos`)

AOS — the Go-To-Market operating system — packaged as a Claude plugin. Installs in
Claude Cowork and Claude Code (same plugin format).

This is the **client-run (Stage-3) delivery** of AOS: self-contained, no backend,
no control layer. Architecture: see `docs/aos-cowork-merged-architecture.md`,
`docs/aos-data-flow-map.md`, and `DECISIONS_2026-05-15_aos-cowork-no-control-layer.md`
in the ADF repo.

## Status

`v0.21.0` — **36 skills**; the GTM loop is complete and closed:
`onboard → catalogue → discover → brand → plan → content → review → distribute → measure → FND ↺`.

**Milestones delivered:** M1 *complete the operating system* · M2 *hardening &
fixes* · M3 *multi-tenant & graduation* (the multi-BU resolution rule + the
Stage 1→3 graduate-bundle path) · M4 *the feature wave* — the F1–F14 content &
GTM skills (campaign briefs, competitor mapping, ICP, JTBD mapping, AM coaching,
baseline, pitch-prep, the pattern library, the discovery package, and more) ·
M7 *feedback* (the in-plugin `aos-feedback` channel).

Every generated artifact carries a **provenance block** (`generated_by`,
`skill_version`, `generated_date`, `aos_schema`); `aos-migrate` upgrades a
granted folder behind the plugin's schema. **Per-skill quickstarts:**
`docs/quickstarts.md`. Design notes — the loop, the content framework, language
packs, connectors, the feedback mechanism, artifact versioning: `docs/`.

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

## Demo data

`demo/` bundles a **fictional demo client** ("Lumen Audio") — `inbox/` material
to try the pipeline without real client data. Not a real client folder; see
`demo/README.md`. (AOS-741.)

## Connectors (`.mcp.json`)

Connectors are for genuinely-remote data sources only — **never** for AOS's own
storage. Core set bundled in `.mcp.json`: **Databox**, **HubSpot**, **SEMrush**,
**ActiveCampaign** (single connection). Google Ads + GA4 have no vendor-hosted
MCP — a documented gap; Databox covers the signal. Conditional per-client
connectors and the full model: see `docs/connectors.md`.

## Layout

```
aos-cowork-plugin/               the repo — a single-plugin marketplace
├── .claude-plugin/marketplace.json
└── aos/                         the plugin
    ├── .claude-plugin/plugin.json   plugin manifest
    ├── .mcp.json                    connector declarations
    ├── skills/                      AOS skills — router · onboard · catalogue · + ported
    ├── data-template/               canonical granted-folder layout
    ├── demo/                        fictional demo client ("Lumen Audio")
    └── docs/                        data-folder-spec · design-patterns · connectors · architecture-gaps
```

## Install

This repo is a single-plugin marketplace — root `.claude-plugin/marketplace.json` lists the `aos` plugin, which lives in `aos/`.

- **Claude Code:** `claude plugin marketplace add arcanianHQ/aos-cowork-plugin`, then `claude plugin install aos@aos-cowork`.
- **Local dev / testing:** `claude --plugin-dir <path>/aos-cowork-plugin/aos`.
- **Cowork:** add the repo as a private marketplace in the admin Plugins panel (or upload a ZIP).

Full install + first-run + troubleshooting: **`docs/install.md`**. Release
history: **`CHANGELOG.md`** (repo root).
