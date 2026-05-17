# AOS_CONFIG

Install-level config for this AOS data folder. Written by `aos-onboard`; read by
every skill to resolve where data lives — see `docs/data-access-router.md`.

- **client**: <client-slug>
- **business-units**: []              # for multi-BU clients
- **granted-folder**: <path>          # the host path this folder was granted at
- **mode**: local                     # Cowork = local; the granted folder is the system of record
- **communication-language**: <lang>  # how skills talk to the user (see docs/language-context.md)
- **content-language**: <lang>         # language of created / delivered artifacts
- **plugin-version**: <plugin-version>
- **schema-version**: 4               # data-folder layout version (migration — AOS-755)
- **created**: <date>

## Schedules — recurring workflows

Recurring AOS work — declared as `workflow: cadence` pairs. Cowork's `/schedule`
runs these **only while the desktop app is open**; see `docs/cadence.md` for the
mechanism, the cadence vocabulary, and the unattended-critical caveat.

Each row names a workflow (a routable skill or a named recurring run) and a
cadence. `aos-onboard` seeds this block commented-out; the user uncomments and
edits it. An empty block means no recurring work is scheduled — the default.

```yaml
schedules:
  # workflow            cadence       notes
  # catalogue:          weekly        # re-index inbox/ + content/
  # monday-brief:       weekly        # the loop's weekly read-out
  # discover-refresh:   monthly       # re-run discovery on fresh inbox material
  # index-ontology:     weekly        # rebuild ontology/INDEX.md
```

Cadence vocabulary: `daily` · `weekly` · `monthly` · `quarterly`. A workflow that
must run unattended (no one at the desktop) is **not reliable in Cowork** — flag
it `runner: server` and see `docs/cadence.md` §3.

## Zones — location manifest

Where each data zone lives. The data-access router resolves a zone here before
any read/write; skills never hard-code a path. `granted` = the zone sits at
`<granted-folder>/<zone>/`. Override a row only if a zone genuinely lives
elsewhere (then give an absolute path + the matching adapter).

| Zone | Location | Adapter |
|---|---|---|
| client | granted | fs |
| inbox | granted | fs |
| brand | granted | fs |
| content | granted | fs |
| content-system | granted | fs |
| dictionaries | granted | fs |
| ontology | granted | fs |
| deliverables | granted | fs |
