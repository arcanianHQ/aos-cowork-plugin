---
name: aos-onboard
description: "First-run setup. Locates or creates the AOS granted folder, instantiates the data structure, connects Databox, and captures client / business-unit / domain / channel context. Trigger on 'set me up', 'get started', or when the data folder is absent."
scope: int-company
flavor: [company, advanced, internal]
class: system
domain: onboarding
layer: all
client-scope: single-client
version: 0.0.1
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
2. **Instantiate the data structure.** If the granted folder is empty, copy this
   plugin's `data-template/` into it — creating `AOS_CONFIG.md`, `client/`,
   `dictionaries/`, `ontology/`, `deliverables/`. See `docs/data-folder-spec.md`.
3. **Capture client context.** Fill `client/CLIENT_CONFIG.md` and
   `client/DOMAIN_CHANNEL_MAP.yaml` — the client, its business units, domains and
   channels.
4. **Connect Databox.** Guide the user to authorise the Databox connector
   (Settings → Connectors). Confirm with a `List Accounts` call; note the client
   should authorise *their own* Databox scope.
5. **Confirm & summarise.** Show what was set up; suggest a check-in cadence.

## Guardrails

- Never overwrite an existing populated data folder — instantiate only into an
  empty one. Confirm with the user before writing.
- Storage is the granted folder via plain file ops. Never create a database file
  on it (FUSE mounts can't host a live SQLite DB).

## Status

v0.0.1 scaffold.
