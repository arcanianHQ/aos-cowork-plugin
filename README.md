# AOS GTM — Claude plugin

**AOS GTM** is the Go-To-Market operating system, delivered as a Claude plugin —
it installs in **Claude Cowork** and **Claude Code** (same plugin format).
Layer-indexed routing (the **7+1 Layer Framework**) over GTM workflows and
skills. Client-run, self-contained, no backend.

This repository is the **client-run subset (~15–20%)** of the Arcanian Operating
System (AOS). The full AOS system stays private.

## Install

This repo is a single-plugin marketplace — the root
`.claude-plugin/marketplace.json` lists the `aos` plugin, which lives in `aos/`.

- **Claude Cowork** — Plugins → `+` → Create plugin → **Add marketplace** →
  `https://github.com/arcanianHQ/aos-cowork-plugin`
- **Claude Code** — `claude plugin marketplace add arcanianHQ/aos-cowork-plugin`,
  then `claude plugin install aos@aos-cowork`
- **Local dev** — `claude --plugin-dir <path>/aos-cowork-plugin/aos`

## What's inside

The `aos` plugin (`aos/`) ships 6 skills — `aos-router`, `aos-onboard`,
`catalogue`, `build-brand`, `build-brand-system`, `content-draft` — plus the
granted-folder data template and docs. See [`aos/README.md`](aos/README.md) for
the full picture.

## Layout

```
aos-cowork-plugin/                a single-plugin marketplace
├── .claude-plugin/marketplace.json
├── LICENSE · NOTICE
└── aos/                          the plugin
    ├── .claude-plugin/plugin.json
    ├── .mcp.json                 connector declarations
    ├── skills/                   the AOS skills
    ├── data-template/            granted-folder layout
    └── docs/
```

## License

Dual-licensed — see [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE):

- **Apache 2.0** — code, skills, configuration, manifests
- **CC BY-SA 4.0** — prose, methodology, documentation

IP is held personally by László Fazakas. Arcanian Consulting Kft. commercialises
services around AOS but does not own the underlying IP.

---

Arcanian — <https://arcanian.com>
