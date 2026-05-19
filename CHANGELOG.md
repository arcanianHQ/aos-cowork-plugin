# Changelog — AOS GTM Cowork plugin

All notable changes to the `aos` plugin. Newest first. The plugin version is
`aos/.claude-plugin/plugin.json`.

## [0.43.0] — 2026-05-19

**`aos-route-question` — pre-route overlay hook (skill v0.5.0 → v0.6.0).**

- The router can now be **wrapped by an overlay**. An overlay skill declaring
  `overlay-mode: wrap` + `wraps: aos-route-question` + `wrap-point: before` is
  discovered and run *before* the router commits to a routing decision; a
  `wrap-point: after` overlay runs after it. Until now the router fired `wrap`
  overlays on the skills it *routed to*, but never on itself — so a
  router-level gate or context-injector had no way to compose onto the front
  door. This adds that generic extension point.
- A pre-route overlay may inject context the routed-to skill must honour (e.g.
  an engagement frame) or hold the request until a condition is met; the
  router honours the outcome before continuing. Core names **no** specific
  overlay — it only honours the `wraps: aos-route-question` declaration, so the
  hook stays generic.
- Enables first-party and customer overlays that gate or frame *every* request
  — the first consumer is the private `aos-painpoint` overlay.

## [0.42.0] — 2026-05-19

**`aos-localize-hu` — conversational mode + a calibration round (skill v0.1.0 → v0.3.0).**

- **Conversational pass (Mode 2).** The Hungarian nativeness pack was
  artifact-only — bound to `content-language` and run over files. It now also
  runs as a standing conversational pass: its Core rules self-apply to every
  Hungarian chat reply (no file, no diff, no confirmation). Trigger broadened to
  "you reply in Hungarian / the user writes or expects Hungarian /
  `communication-language: hu`". The standing rule is documented in
  `docs/language-context.md` ("Nativeness applies to BOTH languages"). This
  closes the gap where AI-Hungarian leaked into conversation because the pack
  only ever saw delivered artifacts.
- **Calibration from a live client letter.** 12 new patterns added to the
  reference catalogues: calqued English idioms (`calques.md` §6d), calqued
  word-senses (§6e), a PPC/ads-domain stuck-word table (§8e), the
  "performance leaks" + abstract-noun-plus-motion-verb traps (§6b); the letter
  register extended with the forced-`Hogy …`-purpose-clause rule and the "×"
  connector; a self-introduced-calque guard.
- **Docs.** `docs/install.md` troubleshooting corrected — a Cowork marketplace
  caches by URL, so a same-URL re-add does not refresh; each update needs a new
  marketplace URL (use the per-version GitHub Release).

## [0.41.0] — 2026-05-19

**`aos-plan-databoards` — the Databox databoard planner (AOS-910).**

- New skill `aos-plan-databoards` — plans a client's Databox databoard suite
  from their AOS brand intelligence: harvests business needs, designs the
  dashboards from an 8-archetype library, checks data-source readiness against
  the live Databox account (`list_data_sources`), and emits ready-to-paste
  Databox Genie prompts. Output: `metrics/DATABOARD_PLAN.md`.
- Fills the gap in the Databox lifecycle — `aos-onboard` connects Databox,
  `aos-measure` reads results, but nothing *designed* the boards. Connector-gated
  on Databox; degrades to an unverified plan when Databox is absent. Read-only
  against Databox (the MCP has no create-databoard tool) — it plans, the user
  runs the Genie prompts in Databox. Discovered by the router via its
  `description`; no router edit (v0.5.0 routing is table-free).

## [0.40.0] — 2026-05-18

**`aos-close-session` — the end-of-session housekeeping orchestrator (AOS-902).**

- New skill `aos-close-session` — the single "close session" / "exit" command.
  Before a Cowork task ends it refreshes the indexes that went stale during the
  session (`aos-catalogue` for `inbox/` + `content/`, `aos-index-ontology` for
  the ontology graph — each **only when its inputs changed**, by an mtime check),
  runs the `aos-daily --mode=end` wrap so the next cold session has a continuity
  hand-off, and reports a clean, resumable state.
- The housekeeping analogue of `aos-run-cycle` — it orchestrates, never
  re-implements; honours each chained skill's full `SKILL.md`; preserves
  `aos-daily`'s session-summary confirm gate; never blocks the close.
- A **spoken command** by necessity — Cowork has no shutdown hook, so the user
  invokes it deliberately ("close session" / "exit" / "I'm done"). Discovered by
  the router via its `description`; no router edit (v0.5.0 routing is table-free).

## [0.39.0] — 2026-05-18

**Multi-BU detection reads `AOS_CONFIG` business-units (AOS-853).**

- Surfaced by the milestone-13 dogfood against the live Wellis folder: Wellis is
  declared 4-BU with a `brand/` split, but its `content-system/` is not yet
  split per BU — so the inherited `ls content-system/*/messaging.md` heuristic
  mis-read it as single-BU.
- `docs/data-folder-spec.md` — new "Detecting multi-BU" rule: `AOS_CONFIG`
  `business-units` is the source of truth; `content-system/<bu>/` is layout, not
  the detector. A multi-BU client can predate its `content-system` split.
- `aos-run-cycle` v0.1.2, `aos-plan` v0.1.1, `aos-measure` v0.2.1,
  `aos-draft-content` v0.2.2 — Step 0 detects multi-BU from the declaration; a
  multi-BU-declared-but-`content-system`-not-split folder surfaces as an
  incomplete-scaffold state, not silent single-BU.

## [0.38.0] — 2026-05-18

**`aos-daily` working-memory continuity (AOS-852)** — milestone 13, F6.

- The Cowork VM is ephemeral — every session starts cold; the granted folder
  persists and carries the working memory.
- `aos-daily` v0.3.0: end mode writes a structured `## Session summary` block to
  `CAPTAINS_LOG.md` (fixed fields, incl. a concrete open / mid-flight resume
  point); start mode opens with a continuity hand-off — reads the most recent
  summary so a cold session picks up the thread, reconciled against live state.
- New `reference/session-continuity.md` — the block format + read/write
  discipline.

## [0.37.0] — 2026-05-18

**Proactive finding-driven nudges (AOS-851)** — milestone 13, F5.

- The loop is structurally closed, but a finding can still sit unread — nudges
  surface unactioned findings unprompted, at the moments where acting on them is
  the natural next step.
- `docs/proactive-nudges.md` — the three nudge moments (session start / after
  measure / before plan) + the rule: surfaced never auto-actioned, one line,
  highest-signal first, no nagging.
- `aos-measure` v0.2.0 — after emitting FNDs, surfaces a one-line nudge
  (unactioned findings + next skill) instead of stopping silently.

## [0.36.0] — 2026-05-18

**Parallel sub-agent fan-out pattern (AOS-850)** — milestone 13, F4.

- Independent work units fan out to parallel sub-agents; the parent synthesises.
- `docs/parallel-fanout.md` — the pattern, the independence test, the
  graceful-degradation contract (sub-agents when the runtime exposes them, else
  sequential — identical artifacts, only latency differs); no skill
  hard-depends on sub-agents.
- `aos-diagnose-7layer` v0.2.0 and `aos-draft-content` v0.2.1 — their
  independent passes documented as fan-out units; synthesis stays parent-level.

## [0.35.0] — 2026-05-18

**`aos-daily` session-start brief + cadence catch-up (AOS-849)** — milestone 13, F3.

- `aos-daily` v0.2.0: `--mode=start` reframed as the session-start standing
  brief, and gains cadence catch-up — reads the `schedules:` block, determines
  what scheduled work was missed while the Cowork app was closed, and offers to
  run it (offered, never auto-run).
- The mitigation for `/schedule`'s no-catch-up gap; optional `last-run:`
  annotation on schedules rows.
- New `reference/cadence-catchup.md`.

## [0.34.0] — 2026-05-18

**`aos-review` autonomous revision micro-loop (AOS-848)** — milestone 13, F2.

- A `REVISE` verdict no longer bounces the piece back to the human each turn —
  `aos-review` re-drafts and re-reviews the piece itself, iterating to a final
  outcome.
- `aos-review` v0.3.0: the micro-loop runs inside Step 5's reject door; a repeat
  detector promotes an issue that survives a re-draft to foundation-level.
  Bounded by `--max-iterations` (default 3); `BLOCK` is never auto-fixed;
  `--no-auto-revise` restores the v0.2.0 hand-back behaviour.
- New `reference/revision-microloop.md`.

## [0.33.0] — 2026-05-18

**`aos-run-cycle` — the autonomous loop-runner (AOS-847)** — milestone 13, F1.

- A new orchestrator skill that turns the whole AOS loop in one session —
  measure → index-ontology → plan → draft → review → distribute — chaining the
  stage skills and halting only at the human confirmation gates.
- Measure-first ordering so the turn's plan reads the prior turn's FNDs;
  resumable via `deliverables/<YYYY-MM>/cycle-run.md` (ephemeral-VM safe).
- `docs/the-loop.md` "Running the loop" documents the end-to-end path.

## [0.32.0] — 2026-05-18

**Folder-currency guard — no more silent degradation (AOS-844).**

- A session opened on a *behind* folder (folder `schema-version` < plugin) used
  to run loop skills anyway and degrade silently — missing zones, stale config,
  no loud error. Now guarded:
- **`data-template/CLAUDE.md`** — every scaffolded client folder gets a
  session-start health check. Cowork loads the granted folder's `CLAUDE.md`
  every session (hooks don't fire — `CLAUDE.md` is the only session-start
  surface); it runs the **`schema-current` gate** first — a behind folder HALTS
  with "run `aos-migrate`" before any loop skill touches it.
- **`docs/preflight.md`** — formalises the preflight checks; `schema-current` +
  `client-config` are base checks (every skill, every run).
- `aos-onboard` v0.7.6 — back-fills `CLAUDE.md` into folders that predate it.

## [0.31.0] — 2026-05-18

**The calibration loop — `aos-review` becomes bidirectional (AOS-843).**

- `aos-review` v0.2.0 — a verdict no longer just gates; it **writes back into the
  foundations**. Two doors:
  - **Reject door** (`REVISE`/`BLOCK`) — corrections are classified by a routing
    table and proposed into `brand/` / `content-system/` / the post-type spec,
    then the piece is re-drafted from the corrected foundation — never patched.
  - **Accept door** (`status: client-accepted`) — the accepted piece's realised
    voice flows back to `brand/VOICE.md`, its winning structure to the pattern
    library; `validated-by:`-tagged, propose-don't-overwrite.
- The compounding mechanism — every accepted piece improves the next client's
  first draft. Learning from the 2026-05-14 DeluxeBuilding content session; spec
  `COWORK_CALIBRATION_LOOP_SPEC.md`.

## [0.30.1] — 2026-05-17

**Fix — the Zones manifest was behind the structure (Wellis dogfood finding).**

- The `campaigns/` (v4) and `metrics/` (v3) zones were added to the data-folder
  tree + the data-access router, but **not** to the `AOS_CONFIG.md` Zones
  manifest table — so the manifest was stale in the template and every
  scaffolded folder. `data-template/AOS_CONFIG.md` now lists all 10 zones.
- `aos-migrate` — the `2→3` and `3→4` steps now also add the `metrics` /
  `campaigns` rows to the manifest. (`aos-onboard`'s "patch the Zones manifest"
  gap-closer already self-heals an existing folder.)

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
