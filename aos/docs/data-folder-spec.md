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
├── LEADS.md                    lead pipeline — stage / score / source, BU-tagged
├── CAPTAINS_LOG.md             running engagement log — sessions, decisions, events
├── client/
│   ├── CLIENT_CONFIG.md       client profile
│   └── DOMAIN_CHANNEL_MAP.yaml  domains × channels
├── inbox/                     discovery drop zone — typed (see inbox/README.md)
│   ├── strategy/ · transcripts/ · correspondence/ · research/ · brand-material/
│   ├── CATALOGUE.md            index of inbox material — built by the `aos-catalogue` skill
│   └── _processed/             harvested items, excluded from re-harvest
├── brand/                     9-file Client Intelligence Profile (build-brand-system)
│   └── <bu>/                  multi-BU: only when BUs are distinct brands — see Multi-BU resolution
├── content-system/
│   ├── <bu>/                  pillars · messaging · products · distribution (per BU)
│   └── frameworks/            content framework library — storytelling · content-types · structures
├── content/
│   ├── <series-slug>/         a content series (one storytelling-framework run, ~10–11 pieces + INDEX.md)
│   ├── <bu>/                  multi-BU: series + single pieces nest under the BU folder
│   ├── CATALOGUE.md            content index — by series — built by the `aos-catalogue` skill
│   └── SCHEDULE.md             content calendar — scheduled + published (BU column)
├── campaigns/                  the campaign zone — themes + per-campaign files
│   ├── INDEX.md               campaign index — themes + campaigns, BU-tagged
│   └── <slug>.md              one file per campaign — record (frontmatter) + brief
├── dictionaries/
│   ├── access.yaml            Access dictionary — accounts / properties
│   └── subscription.yaml      Subscription dictionary
├── ontology/                  the FND/REC/GOT knowledge graph (see ontology/README.md)
│   ├── findings/              FND-NNN-*.md  — what was learned
│   ├── recommendations/       REC-NNN-*.md  — what to do
│   ├── gotchas/               GOT-NNN-*.md  — anti-patterns / traps to avoid
│   └── INDEX.md               graph view — built by the `ontology` skill
├── metrics/                   measurement inputs — channel metrics + analytics exports
│   └── METRICS.md             the metrics table, BU-tagged
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
  are resolved per the **Multi-BU resolution** rule below — not ad hoc.
- The DAL reads/writes this via the existing `dal-fs` adapter.

## Multi-BU resolution

Some clients run multiple business units (BUs) under one tenant. Which zones
**nest per-BU** (`<zone>/<bu>/`) and which stay **per-client** is fixed by this
rule — so a 4-BU client (Wellis) and a single-BU client lay out consistently.

| Zone | Resolution |
|---|---|
| `content-system/` | **Per-BU** — `content-system/<bu>/`, for any multi-BU client. Each BU has its own pillars / messaging / products / distribution. |
| `content/` | **Per-BU** — `content/<bu>/` — series + single pieces nest under the BU. |
| `brand/` | **Per-BU *only when the BUs are genuinely distinct brands*** (the Deluxe case — `kocsibeallo` vs `deluxebuilding`). A **single-brand** multi-BU client keeps **one** `brand/` — one identity, one founder, one positioning. |
| `dictionaries/` | **Per-client** — never nested. Each entry carries a `business_unit` field instead. |
| `ontology/` | **Per-client** — never nested. Each FND / REC / GOT carries a `business_unit` field instead. |
| `deliverables/` | **Per-client**, dated (`<YYYY-MM>/`); a deliverable names its BU in frontmatter (`business_unit:`). |

**Detecting multi-BU — the declaration is the source of truth.** A client is
multi-BU **iff `AOS_CONFIG.md`'s `business-units:` is a non-empty list** (mirrored
in `client/CLIENT_CONFIG.md`). That declaration — not the folder layout — is what
a skill reads to decide whether `--bu` is required.

A skill must **not** infer multi-BU from `content-system/<bu>/` alone. The
`content-system/<bu>/` nesting is *where* per-BU content-system files live **once
they are populated** — it is a layout, not the detector. A client can be
genuinely multi-BU (`business-units` declared, `brand/` split) **before**
`content-system/` has been split per BU — a normal mid-build state (the brand
profile is built before the content-system is). A skill that keys detection on
`ls content-system/*/messaging.md` mis-reads that client as single-BU.

So the Step-0 rule for every BU-aware skill is:

1. Read `business-units:` from `AOS_CONFIG.md`. Non-empty → multi-BU → `--bu` is
   required (abort with the BU list if missing).
2. Resolve the content-system path: `content-system/<bu>/` when it exists.
3. If multi-BU is declared but `content-system/<bu>/` is **absent**, surface the
   **incomplete-scaffold state** plainly — the per-BU content-system is not
   populated yet — rather than silently proceeding single-BU.

**`client/CLIENT_CONFIG.md` declares the BU model** — the `bu-model` field is
`single-brand` (one `brand/`) or `distinct-brand` (`brand/<bu>/`). Skills read it
to resolve the `brand/` path; `content-system/` and `content/` nest per-BU
regardless of the model.

**`client/CLIENT_CONFIG.md` declares the connectors** — the `## Connectors`
block lists this client's `required` connectors (`aos-onboard` must wire them),
`optional` connectors (wired only if the client uses them), and `overlays` (the
paid product overlays the client is entitled to — e.g. `aos-todoist-overlay`).
`aos-onboard` Step 5 reads the block and provisions exactly that set; because
the file lives in the granted folder, the definition is shared across every
operator working the client. Added in schema version 2.

**`LEADS.md`, `content/SCHEDULE.md` and `metrics/` are per-client tables**
(schema version 3) — like `TASKS.md` and `content/CATALOGUE.md` they are
*indexes*, so they do not nest per-BU; each row carries a `BU` column instead.
They are the **filesystem form** of the leads / content-schedule / metrics zones
— present for every install, so a customer without the `aos-data-layer` overlay
still has the full data. The overlay only ever *accelerates* these zones; it
never introduces one.

**`campaigns/` is the campaign zone** (schema version 4) — `campaigns/INDEX.md`
(themes + campaigns, BU-tagged) plus one file per campaign, `campaigns/<slug>.md`
(a frontmatter record + the brief as the body — see `campaigns/README.md`). It
**supersedes the flat `dictionaries/campaign.yaml`**, which is removed from the
template; an existing folder's `campaign.yaml` is left in place as legacy.
`aos-plan-campaign` writes the zone. It is the filesystem form of the campaign
model — themes, campaigns, platforms, budgets, KPIs.

Rationale: a zone nests per-BU when its *content genuinely differs per BU*
(messaging, pillars, the content itself). A zone stays per-client when it is a
**graph or an index** that benefits from being whole — the ontology's edges and
the dictionaries' lookups fragment if split — so those carry a `business_unit`
field per entry instead.

## Lifecycle

`aos-onboard` instantiates the layout. Skills read it during context assembly and
write to it on deliverable/emit. Full data-flow: `docs/aos-data-flow-map.md` in
the ADF repo.
