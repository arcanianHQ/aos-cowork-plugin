# Changelog — AOS GTM Cowork plugin

All notable changes to the `aos` plugin. Newest first. The plugin version is
`aos/.claude-plugin/plugin.json`.

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
