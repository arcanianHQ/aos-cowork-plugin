# AOS data-folder spec

The AOS plugin stores all its data as **plain files in a granted folder** — the
system of record. `data-template/` in this plugin is the canonical layout;
`aos-onboard` instantiates it into the client's granted folder.

## Where the folder lives

A folder the user grants Cowork access to — recommended **inside the client's
Google Drive for Desktop directory**, so it is cloud-synced and backed up for
free. Inside the Cowork VM it appears as `~/mnt/<name>` — a virtiofs passthrough:
persistent, read-write for plain files. If the client has no Drive for Desktop it
is simply local-only — still works.

## Layout

```
AOS/                           the granted folder
├── AOS_CONFIG.md              install config — client, BUs, paths, mode
├── TASKS.md                   engagement task list — REC → tasks, layer-tagged
├── CAPTAINS_LOG.md             running engagement log — sessions, decisions, events
├── client/
│   ├── CLIENT_CONFIG.md       client profile
│   └── DOMAIN_CHANNEL_MAP.yaml  domains × channels
├── inbox/                     discovery drop zone — typed (see inbox/README.md)
│   ├── strategy/ · transcripts/ · correspondence/ · research/ · brand-material/
│   ├── CATALOGUE.md            index of inbox material — built by the `catalogue` skill
│   └── _processed/             harvested items, excluded from re-harvest
├── brand/                     7-file Client Intelligence Profile (build-brand-system)
├── content-system/
│   └── <bu>/                  pillars · messaging · products · distribution (per BU)
├── content/
│   ├── <bu>/                  produced content pieces (reference / blog / linkbait)
│   └── CATALOGUE.md            content index — built by the `catalogue` skill
├── dictionaries/
│   ├── access.yaml            Access dictionary — accounts / properties
│   ├── campaign.yaml          Campaign dictionary
│   └── subscription.yaml      Subscription dictionary
├── ontology/                  the FND/REC/GOT knowledge graph (see ontology/README.md)
│   ├── findings/              FND-NNN-*.md  — what was learned
│   ├── recommendations/       REC-NNN-*.md  — what to do
│   ├── gotchas/               GOT-NNN-*.md  — anti-patterns / traps to avoid
│   └── INDEX.md               graph view — built by the `ontology` skill
├── deliverables/
│   └── <YYYY-MM>/             reports, decks
└── .aos/                      runtime artifacts (rebuildable; safe to delete)
```

## Rules

- **Plain files only.** No live database on the granted folder — FUSE mounts
  cannot host SQLite (POSIX-locking failure). SQLite indexes are built on the
  ephemeral `/tmp` and may be copied into `.aos/` to persist.
- **Human-readable formats** — YAML / markdown-with-frontmatter, never opaque
  blobs — so the data is inspectable and editable.
- **One client per folder.** A Cowork install serves one client; business units
  nest *inside* it — a `business_units` field, or `business-units/<bu>/` subtrees
  under `dictionaries` / `ontology` / `deliverables` for multi-BU clients.
- The DAL reads/writes this via the existing `dal-fs` adapter.

## Lifecycle

`aos-onboard` instantiates the layout. Skills read it during context assembly and
write to it on deliverable/emit. Full data-flow: `docs/aos-data-flow-map.md` in
the ADF repo.
