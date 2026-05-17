# Changelog — AOS GTM Cowork plugin

All notable changes to the `aos` plugin. Newest first. The plugin version is
`aos/.claude-plugin/plugin.json`.

## [0.30.0] — 2026-05-17

**Campaign model finalised (AOS-834, schema v5).**

- Per-campaign files gain a **`## KPIs` table** (one row per metric — target /
  actual / unit); the single `kpi:` frontmatter field is dropped.
- **Themes get their own files** — `campaigns/themes/<slug>.md` (narrative,
  budget, window); a campaign's `theme:` is a slug referencing one.
- `content/SCHEDULE.md` + `content/CATALOGUE.md` gain a **`Campaign`** column.
- `aos-plan-campaign` v0.3.0 — writes the KPIs table + the theme file.
- Schema → **5**; `aos-migrate` ships the additive `4→5` step.
- DB side (applied to AOS Cloud): a `campaign_kpis` table, `campaign_id` on
  `content_schedule` / `publications`, `slug` on `campaigns` / `campaign_themes`.

## [0.29.0] — 2026-05-17

**The `campaigns/` zone — campaigns modelled properly (AOS-834, schema v4).**

- New **`campaigns/` zone** — `campaigns/INDEX.md` (themes + campaigns, BU-tagged)
  + per-campaign files `campaigns/<slug>.md` (a frontmatter record — theme, type,
  BU, budget, window, status, KPI, platforms — plus the brief as the body).
- Supersedes the flat `dictionaries/campaign.yaml` (removed from the template;
  an existing folder's copy is left as legacy).
- `aos-plan-campaign` v0.2.0 — writes the `campaigns/` zone instead of a prose
  brief in `deliverables/`: the campaign record and its brief are now one file.
- Schema version → **4**. `aos-migrate` ships the `3→4` step (additive). The
  AOS Cloud campaign schema-side of AOS-834 is tracked separately.

## [0.28.0] — 2026-05-17

**The no-DAL file-zones — every zone has a filesystem form (AOS-832, schema v3).**

- New filesystem zones so a customer without the `aos-data-layer` overlay holds
  100% of their data: **`LEADS.md`** (root — the lead pipeline), **`content/SCHEDULE.md`**
  (the content calendar), and the **`metrics/`** zone (`metrics/METRICS.md` —
  measurement inputs). All are per-client tables with a `BU` column — indexes
  do not nest per-BU.
- Schema version → **3**. `aos-migrate` ships the `2→3` step (additive — copies
  the three templates into an older folder). `aos-onboard` v0.7.3 / `aos-migrate`
  v0.1.3 — schema literal moved 2 → 3.
- `docs/data-folder-spec.md` + `docs/data-access-router.md` document the zones.

## [0.27.2] — 2026-05-17

**M12 dogfood finding — the `plugin-version` stamp self-heals.**

- `AOS_CONFIG.md`'s `plugin-version` stamp went stale (stayed `0.13.0` while the
  plugin moved to v0.27). `aos-onboard` v0.7.2 — a run against an existing
  folder refreshes the stamp; `aos-migrate` v0.1.2 — a completed migration
  refreshes it (step 6). The version is read from the installed plugin's own
  `plugin.json`, never from an `aos/` directory in the granted-folder tree;
  unresolvable → the stamp is left untouched, never guessed.
- `aos-migrate` — the stale "Current state" section corrected (schema 2, the
  `1→2` step registered).

## [0.27.1] — 2026-05-17

**M12 dogfood finding — schema check poisoned by a stray `aos/` copy.**

- A live `aos-onboard` run compared the folder's `schema-version` against a
  **stale `aos/` plugin copy** that happened to sit beside the granted folder
  (schema 1) instead of the installed plugin (schema 2) — so a folder that was
  *behind* read as *current*, and migration was wrongly skipped.
- `aos-onboard` v0.7.1 + `aos-migrate` v0.1.1 — the plugin schema version is now
  pinned to the literal `2` in the skill text, and both skills are explicitly
  barred from reading schema / version / template files out of the granted
  folder or any `aos/` directory in its tree. New `aos-onboard` guardrail:
  plugin files never live in the granted folder.

## [0.27.0] — 2026-05-17

**Per-client connectors definition — `CLIENT_CONFIG.md` (AOS-831, schema v2).**

- `client/CLIENT_CONFIG.md` gains a `## Connectors` block: `required` /
  `optional` connectors + `overlays` (the paid product overlays the client is
  entitled to). It is the per-client connector definition — and lives in the
  granted folder, so it is shared across every operator working that client.
- `aos-onboard` v0.7.0 — Step 4 captures the block; Step 5 reads it and
  provisions exactly that set instead of asking generically.
- Schema version → **2**. `aos-migrate` ships the `1→2` step (additive — seeds
  the empty `## Connectors` block into an older folder).
- `docs/data-folder-spec.md` documents the block.

## [0.26.0] — 2026-05-17

**Todoist extracted to a paid-extra overlay — removed from core.**

- `aos-todoist` and the AOS-820 connector wiring leave the open-source `aos`
  plugin. Todoist task sync is now a **first-party product overlay** — a private,
  paid plugin (`arcanianHQ/aos-todoist-overlay`), installed alongside core.
- `docs/connectors.md` — Todoist row + paragraph removed (it is the overlay's
  concern, not core's).
- `aos-onboard` — the Todoist connector bullet removed from Step 5.
- `aos-daily` reverted to v0.1.0 — the Todoist day-bracketing left with the
  overlay.
- `docs/overlay-skill-contract.md` — new section: **first-party product
  overlays** (paid Arcanian extras) — `overlay-product:` identity, may keep the
  `aos-*` namespace, vs per-customer overlays' mandatory `<customer>-` prefix.

## [0.25.2] — 2026-05-17

**M12 dogfood finding — `aos-todoist` Todoist ID round-trip fixed.**

- `aos-todoist` v0.1.2 — the `Todoist ID` column was added only to `## Open`, so
  a row moving to `## Done` dropped its Todoist link: the "Done row →
  re-complete" reconcile case was unreachable and a re-opened Todoist task could
  never be matched back. The ID column now lives on **both** tables and travels
  with the row; a new reconcile case pulls a task re-opened in Todoist back to
  `## Open`.

## [0.25.1] — 2026-05-17

**M12 dogfood finding — `aos-todoist` confirmation gate hardened.**

- `aos-todoist` v0.1.1 — a live Cowork run skipped the reconciliation-plan
  Accept/Revise gate on a push, self-justifying "the mapping is mechanical".
  Step 4 + Hard Rule 4 now state the gate is **not skippable** — a push creates
  real tasks in the user's real Todoist account (outward-facing, not freely
  reversible). Plan → Accept → write, every run, every direction.

## [0.25.0] — 2026-05-17

**M12 — Todoist connector wiring (AOS-820).**

- `docs/connectors.md` — Todoist moved from "endpoint TBD" to a documented
  conditional connector: added from Settings → Connectors (OAuth, no custom
  URL), paired with `aos-todoist`.
- `aos-onboard` Step 5 — adds the Todoist connector per install when the
  operator runs tasks in Todoist.
- `aos-daily` v0.2.0 — brackets the day with `aos-todoist`: `--mode=pull` before
  the morning brief so `TASKS.md` is current, `--mode=sync` at the end-of-day
  wrap. No dependency — skipped cleanly when Todoist is absent.

## [0.24.0] — 2026-05-17

**M12 — `aos-todoist`, the task-sync bridge.**

- **`aos-todoist`** — syncs the engagement task list (`TASKS.md`) with a Todoist
  project. Connector-gated on Todoist (no degraded mode — a task sync with no
  target has no half-state). ID-keyed via a `Todoist ID` column → idempotent.
  `TASKS.md` stays authoritative for *what work exists*; Todoist is authoritative
  for *completion*. Divergence is surfaced to the user, never auto-resolved.
- Lets the operator run a busy day (5–10 parallel tasks) in Todoist while AOS
  keeps `TASKS.md` as the system of record. Folds in the AOS-818 mapping model +
  AOS-819 conflict semantics at v0.1.0 strength.

## [0.23.0] — 2026-05-17

**Connectors — ActiveCampaign per-client (M9).**

- Removed `activecampaign` from the bundled `.mcp.json` — its placeholder host
  (`YOUR_ACCOUNT.activehosted.com`, an underscore = invalid hostname) failed
  Cowork plugin validation. AC has no universal endpoint (per-account).
- `aos-onboard` v0.6.0 — Step 5 "connect the connectors": bundled connectors
  authorise on first use; **ActiveCampaign is added per client** from one input
  (the client's AC URL) → the per-account connector, written to the granted
  folder's `.mcp.json`. `docs/connectors.md` — AC moved to "Conditional".

## [0.22.0] — 2026-05-17

**M11 — the overlay model.**

- `aos-route-question` v0.5.0 — **discovery-based routing**: the hand-maintained
  routing table is gone; the router compiles the routing picture each turn from
  the skills actually present, core **and** any private overlay plugin.
- `docs/overlay-architecture.md` + `docs/overlay-skill-contract.md` — the
  core/overlay/site model, namespacing, the 3 override modes (add/wrap/replace).

## [0.21.0] — 2026-05-17

**M3 multi-tenant, M7 feedback, M5 launch docs.**

- **`aos-feedback`** — in-plugin feedback capture (M7). A ticket-like `FB-NNN`
  record, emailed to `aos-support@arcanian.ai`; the `#aos-support` Slack channel
  is the transport-agnostic convergence point. Mechanism: `docs/feedback.md`.
- **Multi-BU resolution rule** (M3) — `data-folder-spec.md` fixes which zones
  nest per-BU; `CLIENT_CONFIG.md` gains `bu-model`.
- **Graduate-bundle import** (M3) — `aos-onboard` v0.5.0 imports an
  operator-exported bundle (Stage 1→3) instead of an empty template.
- `docs/quickstarts.md` — a quickstart for every skill. `aos/README.md` reconciled.
- `docs/install.md` — install + first-run + troubleshooting guide. This `CHANGELOG.md`.

## [0.20.0] — 2026-05-17

**M4 feature wave complete** — 9 skills: `aos-ingest-meeting`, `aos-daily`,
`aos-registry`, `aos-fit-framework`, `aos-build-patterns`, `aos-discovery-package`,
`aos-coach-am`, `aos-set-baseline`, `aos-prep-pitch`.

## [0.19.0] — 2026-05-17

- **`aos-map-jtbd`** — GTM-team Jobs-to-be-Done / process mapping.
- **`aos-plan-campaign`** — campaign briefs (dealer / retail / brand).
- **`aos-anonymize`** — the privacy gate; PII detection + anonymised copy.
- CI: `plugin-guard` — hidden-Unicode + allowed-tools poisoning checks.

## [0.18.0] — 2026-05-17

- SEMrush + ActiveCampaign connectors wired into `.mcp.json`.
- **`aos-back-statements`** — evidence-class provenance tagging.

## [0.17.0] — 2026-05-17

- **`aos-build-icp`** — the Ideal Customer Profile brand-file skill.
- **`aos-analyze-competition`** — per-BU competitor catalogue + positioning gaps.

## [0.16.0] — 2026-05-17

- **`aos-write`** — the mid-level content-writing skill: light context, no
  brand-profile gate, custom-framework aware.

## [0.15.1] — 2026-05-17

- `aos-review` v0.1.1 — §2c availability scoping, §1b series-beat awareness (M2).
- Connector docs reconciled (AOS-724); CI: `gitleaks` secret-scan.

## [0.15.0] — 2026-05-16

**M1 — complete the operating system.** `aos-review` (the loop's quality gate);
the cadence architecture (`schedules:` block + Cowork `/schedule`).

## [0.14.0] — 2026-05-16

**The loop closes.** `aos-plan`, `aos-distribute`, `aos-measure`,
`aos-index-ontology` + the FND feedback edge — `onboard → … → measure → FND ↺`.

## [0.13.0] — 2026-05-16

Demo client ("Lumen Audio"); connectors provenance.

## [0.5.0] — 2026-05-16

Language context — per-client communication / content language; `aos-localize-hu`
language pack.

## [0.4.0] — 2026-05-16

Router-aware `aos-onboard` — per-zone storage + the `AOS_CONFIG.md` zone manifest.

## [0.2.0] — 2026-05-16

The `aos-` skill naming convention; the data-access router design.

## [0.1.0] — 2026-05-16

Initial plugin scaffold — `aos-route-question`, `aos-onboard`, `aos-catalogue`,
the brand / content / diagnostic skills ported onto the granted-folder model.

---

The `aos` plugin is the client-run (Stage-3) subset of the Arcanian Operating
System — dual-licensed (Apache-2.0 code + CC-BY-SA-4.0 prose). See `NOTICE`.
