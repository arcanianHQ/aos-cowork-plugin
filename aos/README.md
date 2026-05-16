# AOS plugin (`aos`)

AOS — the Go-To-Market operating system — packaged as a Claude plugin. Installs in
Claude Cowork and Claude Code (same plugin format).

This is the **client-run (Stage-3) delivery** of AOS: self-contained, no backend,
no control layer. Architecture: see `docs/aos-cowork-merged-architecture.md`,
`docs/aos-data-flow-map.md`, and `DECISIONS_2026-05-15_aos-cowork-no-control-layer.md`
in the ADF repo.

## Status

`v0.10.0` — **scaffold**. The structural skills (`aos-route-question`, `aos-onboard`) are
starter drafts; building-block skills are ported under AOS-725 (`aos-build-brand`,
`aos-build-brand-system`, `aos-draft-content`) and the diagnostic skills under AOS-744
(`aos-diagnose-7layer` — the L0–L7 Marketing Control Framework diagnostic — and
`aos-analyze-gtm` — the GTM Strategist gap analysis), all rewired onto the
granted-folder / data-access-router model; workflow skills follow under AOS-728.
AOS-743 adds two net-new **focused diagnostic** skills — `aos-diagnose-funnel`
(a connector-gated L4 funnel / conversion diagnostic, Databox) and
`aos-diagnose-lifecycle` (a connector-gated L5 lifecycle / CRM / retention
diagnostic, HubSpot) — each focusing one layer of the seven-layer methodology,
degrading gracefully to a qualitative read when its connector is absent, and
emitting FND / REC into `ontology/`.
`aos-localize-hu` (AOS-749) is the first **language pack** — a Hungarian nativeness
pass over content-language artifacts; see `docs/language-packs.md`. AOS-745 adds two
net-new intelligence skills — `aos-build-belief-profile` (the L0 belief / fear / JTBD
map of the client's decision-makers) and `aos-build-offer` (the L4 offer design, built
on Arcanian's own offer framework) — which fill the `BELIEF_PROFILE.md` and `OFFER.md`
slots of the `aos-build-brand-system` Client Intelligence Profile, now a 9-file profile.
AOS-752 / AOS-753 add the **content framework system** — a 3-level, pluggable
hierarchy (storytelling framework → content type → content-type structure) that
`aos-draft-content` walks to turn one strategic idea into a multi-piece, multi-platform
**content series**. The framework library lives in the `content-system/frameworks/`
zone (seeded with Hero's Journey + Before-After-Bridge arcs); the `content/` zone
gains a **series** model — one storytelling-framework run produces one series. See
`docs/content-framework.md`.

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
