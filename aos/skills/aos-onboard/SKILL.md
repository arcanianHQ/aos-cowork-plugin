---
name: aos-onboard
description: "First-run setup. Locates or creates the AOS granted folder, instantiates the data structure on the selected storage, writes the location manifest, connects Databox, and captures client / business-unit / domain / channel context. Trigger on 'set me up', 'get started', or when the data folder is absent."
scope: int-company
flavor: [company, advanced, internal]
class: system
domain: onboarding
layer: all
client-scope: single-client
version: 0.2.0
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
   - If the granted folder is empty, copy this plugin's `data-template/` into it.
     Scaffold **every zone at the location chosen in Step 2** — a zone placed
     elsewhere is created *there*, not in the granted folder.
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

5. **Connect Databox.** Guide the user to authorise the Databox connector
   (Settings → Connectors). Confirm with a `List Accounts` call; note the client
   should authorise *their own* Databox scope.

6. **Confirm & summarise.** Show what was set up — including each zone's
   resolved location — and suggest a check-in cadence.

## Guardrails

- Never overwrite an existing populated data folder — instantiate only into an
  empty one. Confirm with the user before writing.
- Storage is plain file ops. Never create a database file on a granted / FUSE
  folder (FUSE mounts can't host a live SQLite DB).
- **The manifest and the structure must match.** Every zone the Zones manifest
  declares must actually be scaffolded at that location — a manifest entry with
  no folder behind it is a broken install the data-access router will fail on.

## Status

v0.2.0 — router-aware scaffolding (AOS-757) + captures the communication /
content language pair into `AOS_CONFIG.md` (AOS-750).
