# AOS plugin (`aos`)

AOS — the Go-To-Market operating system — packaged as a Claude plugin. Installs in
Claude Cowork and Claude Code (same plugin format).

This is the **client-run (Stage-3) delivery** of AOS: self-contained, no backend,
no control layer. Architecture: see `docs/aos-cowork-merged-architecture.md`,
`docs/aos-data-flow-map.md`, and `DECISIONS_2026-05-15_aos-cowork-no-control-layer.md`
in the ADF repo.

## Status

`v0.15.0` — **Milestone 1: complete the operating system**. The structural skills (`aos-route-question`, `aos-onboard`) are
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
AOS-755 adds **artifact versioning + data-folder migration**. Every generated
artifact now carries a standard **provenance block** (`generated_by`,
`skill_version`, `generated_date`, `aos_schema`) so a client's granted folder can
be migrated when the plugin or data-schema changes. The new `aos-migrate` skill
compares `AOS_CONFIG.md`'s `schema-version` to the plugin's current schema
version (`docs/CURRENT_SCHEMA_VERSION`) and runs the ordered, idempotent,
non-destructive migration steps for the gap. `aos-onboard` and `aos-route-question`
detect a folder behind the plugin and route to `aos-migrate`. Design:
`docs/artifact-versioning.md`.
**v0.14.0 closes the loop** (architecture-gaps §1 + §2). AOS is a GTM *operating
system* — a loop, not a one-way pipeline. Four net-new skills turn
`onboard → catalogue → discover → brand → content → stop` into
`onboard → catalogue → discover → brand → plan → content → distribute → measure → FND ↺`:
`aos-plan` (intelligence) turns the 9-file brand profile + content-system into a
prioritised GTM plan and emits `REC` artifacts; `aos-distribute` (content) ships
a content piece to its channel — channel-formats it and advances its
`content/CATALOGUE.md` status; `aos-measure` (intelligence, Databox-gated,
degrades gracefully) reads results for shipped content and emits `FND` artifacts;
`aos-index-ontology` (reading, sibling of `aos-catalogue`) scans
`ontology/findings/` + `ontology/recommendations/`, walks the FND/REC edges, and
writes `ontology/INDEX.md`. The **feedback edge** — `aos-measure`'s findings feed
the next `aos-plan` / `discover` cycle — is what makes it a loop. Design:
`docs/the-loop.md`.
**v0.15.0 — Milestone 1: complete the operating system** (architecture-gaps §3
+ §4 + §7). Three gaps close. **§3 workflow tier** — reconciled, not padded: the
tier was already complete via the loop stages + orchestrators (`aos-plan`,
`aos-draft-content`, `aos-distribute`, `aos-measure`, `aos-build-brand-system`,
the diagnostics, the maintenance skills); §3 closed with the one genuine net-new
workflow it still needed — the quality gate. **§7 review/QA** — `aos-review`
(intelligence / quality) is the loop's **quality gate**: before a piece moves
`draft → published` it is checked against the brand profile (voice + positioning),
the content-system contract, and completeness, and given a `PASS` / `REVISE` /
`BLOCK` verdict — the plugin analogue of the ADF verification gate. It is routed
by `aos-route-question`, and `aos-distribute` now ships only `PASS`-cleared
pieces. **§4 cadence** — recurring work is declared as a `schedules:` block in
`AOS_CONFIG.md` (`workflow: cadence` pairs); Cowork's `/schedule` fires them while
the desktop app is open; unattended-critical jobs carry `runner: server` as a
documented escalation (the client-run plugin has no backend). Design:
`docs/cadence.md`. The loop is now `onboard → catalogue → discover → brand →
plan → content → review → distribute → measure → FND ↺`.

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
    ├── demo/                        fictional demo client ("Lumen Audio")
    └── docs/                        data-folder-spec · design-patterns · connectors · architecture-gaps
```

## Install

This repo is a single-plugin marketplace — root `.claude-plugin/marketplace.json` lists the `aos` plugin, which lives in `aos/`.

- **Claude Code:** `claude plugin marketplace add arcanianHQ/aos-cowork-plugin`, then `claude plugin install aos@aos-cowork`.
- **Local dev / testing:** `claude --plugin-dir <path>/aos-cowork-plugin/aos`.
- **Cowork:** add the repo as a private marketplace in the admin Plugins panel (or upload a ZIP).
