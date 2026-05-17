---
name: aos-onboard
description: "First-run setup. Locates or creates the AOS granted folder, instantiates the data structure on the selected storage, writes the location manifest, connects Databox, and captures client / business-unit / domain / channel context. Trigger on 'set me up', 'get started', or when the data folder is absent."
scope: int-company
flavor: [company, advanced, internal]
class: system
domain: onboarding
layer: all
client-scope: single-client
version: 0.6.0
owner: arcanian
allowed-tools: ["Read", "Write", "Edit", "Glob", "Bash"]
preflight: []
ontology:
  consumes: []
  emits: ["Layer"]
safety:
  mode: mutates-state
  requires_confirmation: true
---

# AOS Onboard

Walk the user through first-run setup.

## Steps

1. **Locate the granted folder.** Ask the user to grant Cowork a folder for AOS —
   recommend a folder *inside their Google Drive for Desktop directory* so it is
   cloud-synced. It appears inside the VM as `~/mnt/<name>`. Confirm the path.

2. **Choose the storage layout.** By default **every data zone lives inside the
   granted folder** — accept this unless the user has a reason not to. A zone
   (e.g. `deliverables/`) may instead be placed in a separate folder or a shared
   Drive folder. Note each choice — it drives the manifest in Step 3.

3. **Instantiate + write the location manifest.**
   - **First, check for a graduate bundle** (see "Graduate-bundle import" below).
     If the granted folder holds — or the user points at — an operator-exported
     graduate bundle, **import it** instead of scaffolding an empty template, then
     continue at the `AOS_CONFIG.md` bullet.
   - Otherwise, if the granted folder is empty, copy this plugin's `data-template/`
     into it. Scaffold **every zone at the location chosen in Step 2** — a zone
     placed elsewhere is created *there*, not in the granted folder.
   - Write `AOS_CONFIG.md` at the granted-folder root, **including the Zones
     location manifest** (the zone → location → adapter table). The data-access
     router and every skill resolve zones through it — see
     `docs/data-access-router.md`.
   - Fill `granted-folder`, `client`, `schema-version`, `plugin-version`,
     `created`. Layout reference: `docs/data-folder-spec.md`.

4. **Capture client context + languages.** Fill `client/CLIENT_CONFIG.md` and
   `client/DOMAIN_CHANNEL_MAP.yaml` — the client, its business units, domains
   and channels. Then ask the user the **communication language** (how AOS
   talks to them) and the **content language** (what created artifacts are
   written in) — they may differ — and write both into `AOS_CONFIG.md`. See
   `docs/language-context.md`.

5. **Connect the connectors.** Guide the user through Settings → Connectors:
   - **Bundled** — Databox, HubSpot, Semrush ship in `.mcp.json`; the user
     authorises each via OAuth on first use. Confirm Databox with a `List
     Accounts` call; the client authorises *their own* Databox scope.
   - **ActiveCampaign (per client) — keep it one input.** AC has **no universal
     endpoint** (each account is its own subdomain), so it is not bundled. Do
     not make the user hand-craft a connector URL. Ask whether the client uses
     ActiveCampaign; if so, ask only for their **AC URL** — the one thing they
     already know (e.g. `wellis14726.activehosted.com`). AOS does the rest:
     1. derive the account slug from that URL;
     2. build the connector URL `https://<slug>.activehosted.com/api/agents/mcp/http`;
     3. write it as an `activecampaign` server into the granted folder's
        per-client `.mcp.json` (created at the granted-folder root if absent —
        the documented home for per-client connectors, see `docs/connectors.md`);
     4. record the slug in `client/REGISTRY.md`;
     5. hand the user the finished connector URL with **one** paste step —
        Settings → Connectors → add a remote MCP connector — as the fallback for
        runtimes that do not auto-load the granted-folder `.mcp.json`.
     One AC account per install.
   - **Todoist (per client)** — if the operator runs the engagement's tasks in
     Todoist, enable the **Todoist** connector here (Settings → Connectors,
     OAuth — no URL to hand-craft). The `aos-todoist` skill then syncs
     `TASKS.md` ⇄ a Todoist project. If the operator does not use Todoist, skip
     it — `TASKS.md` works without it.
   - **Other conditional connectors** (Canva, Slack, …) — add the same way,
     only if the client uses that tool. See `docs/connectors.md`.

6. **Set the cadence.** Walk the user through the `schedules:` block in
   `AOS_CONFIG.md` (seeded commented-out from `data-template/`). Recommend the
   default recurring work — `catalogue: weekly`, `index-ontology: weekly`,
   `monday-brief: weekly`, `discover-refresh: monthly` — and uncomment the rows
   the user wants. For each enabled row, tell the user to register it with
   Cowork's `/schedule` command, and state the caveat plainly: `/schedule` runs a
   job **only while the desktop app is open**. If the user names an
   unattended-critical job, flag it `runner: server` — the Cowork plugin cannot
   guarantee it. See `docs/cadence.md`.

7. **Confirm & summarise.** Show what was set up — including each zone's
   resolved location and the enabled schedule rows.

## Existing-folder schema check

When this skill runs against a granted folder that **already has** an
`AOS_CONFIG.md` (a re-run, or onboarding onto a previously-used folder), compare
its `schema-version` to the plugin's current schema version in
`docs/CURRENT_SCHEMA_VERSION`:

- folder `schema-version` **<** plugin's → the folder is **behind**. Do not
  re-scaffold; tell the user the data folder predates this plugin build and
  **suggest running `aos-migrate`** before any workflow.
- folder `schema-version` **>** plugin's → the folder is newer than the plugin;
  advise updating the plugin (do not write to the folder).
- equal → current; proceed normally.

A fresh install seeds `schema-version` from `data-template/AOS_CONFIG.md`, so a
brand-new folder is always current. See `docs/artifact-versioning.md` §2.

## Graduate-bundle import (Stage 1 → 3)

A client's engagement can move **operator-run → client-run** — Stage 1/2 to
Stage 3. When it does, the client's existing data must come *with* them: the
brand profile, the content, the ontology graph, the captain's log. A Stage-3
client-run install that started from an empty template would throw away the
whole engagement's history.

The **graduate path** (`aos-onboard`'s side of it):

1. **Detect.** A graduate bundle is an operator-exported, **granted-folder-shaped**
   directory (or archive) — the same zone layout as `data-folder-spec.md`,
   carrying a root marker file `GRADUATE_BUNDLE.md` (the export's manifest:
   source client, export date, schema-version, a zone inventory). On first run,
   look for `GRADUATE_BUNDLE.md` in the granted folder or at a path the user
   gives. If none → normal empty-template scaffolding.
2. **Import, do not scaffold.** Copy the bundle's zones into the granted folder
   at the Step-2 locations — `brand/`, `content/`, `content-system/`, `ontology/`,
   `dictionaries/`, `deliverables/`, `CAPTAINS_LOG.md`, `TASKS.md` — **preserving
   every artifact's history**. Never overwrite imported data with a template stub.
3. **Write `AOS_CONFIG.md` fresh** for the client-run install — new
   `granted-folder` path, the bundle's `client`, `schema-version` from the
   bundle. Set `client/CLIENT_CONFIG.md` `aos-stage: 3`.
4. **Schema-reconcile.** If the bundle's `schema-version` is **behind** the
   plugin, do not import-and-run blind — tell the user and route to `aos-migrate`
   before any workflow (same rule as the existing-folder schema check).
5. **Append a graduation entry** to `CAPTAINS_LOG.md` — the engagement graduated
   to client-run on this date, importing the bundle.

The **operator-side export** — producing the bundle from the operator surface —
is **not** part of this plugin; it extends the operator's `finalize-engagement`
(a different surface). `aos-onboard` owns only the *import* half of the seam.

## Guardrails

- Never overwrite an existing populated data folder — instantiate only into an
  empty one. Confirm with the user before writing.
- Storage is plain file ops. Never create a database file on a granted / FUSE
  folder (FUSE mounts can't host a live SQLite DB).
- **The manifest and the structure must match.** Every zone the Zones manifest
  declares must actually be scaffolded at that location — a manifest entry with
  no folder behind it is a broken install the data-access router will fail on.

## Status

v0.6.0 — Step 5 broadened to **connect the connectors** (M9): bundled connectors
(Databox / HubSpot / Semrush) authorise on first use; **ActiveCampaign is added
per client** — AC has no universal endpoint, so onboarding takes one input (the
client's AC URL), derives the per-account connector, and writes it to the
granted folder's per-client `.mcp.json`. AC was removed from the bundled
`.mcp.json` (a placeholder host is an invalid URL and fails plugin validation).

Prior: v0.5.0 — graduate-bundle import path (AOS-739, Milestone 3): `aos-onboard`
detects an operator-exported graduate bundle and imports the client's data
(brand, content, ontology, history) instead of scaffolding an empty template —
the client-run side of the Stage 1→3 seam. The operator-side export is out of
plugin scope.

Prior: v0.4.0 — router-aware scaffolding (AOS-757) + captures the communication /
content language pair into `AOS_CONFIG.md` (AOS-750) + an existing-folder
schema-version check that suggests `aos-migrate` when the folder is behind the
plugin (AOS-755) + sets the recurring-workflow cadence via the `schedules:`
block and Cowork `/schedule` (AOS-735, Milestone 1; see `docs/cadence.md`).
