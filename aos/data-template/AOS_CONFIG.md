# AOS_CONFIG

Install-level config for this AOS data folder. Written by `aos-onboard`; read by
every skill to resolve where data lives — see `docs/data-access-router.md`.

- **client**: <client-slug>
- **business-units**: []              # for multi-BU clients
- **granted-folder**: <path>          # the host path this folder was granted at
- **mode**: local                     # Cowork = local; the granted folder is the system of record
- **plugin-version**: <plugin-version>
- **schema-version**: 1               # data-folder layout version (migration — AOS-755)
- **created**: <date>

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
