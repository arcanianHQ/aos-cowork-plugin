# AOS plugin — the overlay architecture

How a client gets **bespoke skills** — built for them — deployed *on top of* the
public AOS plugin, without those skills entering the public repo or reaching any
other client.

> **Status: design (v0).** This document is the agreed model. The build is
> ticketed under **M11 — Custom-skill overlay** (epic AOS-807). The frontmatter
> contract and the compiled router below are **not yet implemented** — see
> "What is not built yet".

The model is synthesised from two systems that have solved layered
customisation well: **Drupal** (the layering + the compiled route table) and
**Magento 2** (the override mechanics + the router chain).

## The problem

The public `aos-cowork-plugin` is **shared** — every client installs the same
skill set. AOS also develops **client-specific** skills (an agency customer's
own workflow, a bespoke drafting skill). Those must:

1. deploy **on top of** the public plugin,
2. reach **only** that client, and
3. **never** enter the public repo or another client's install.

## The three layers (Drupal: core / contrib-custom / site)

| Layer | What | Lives in | Drupal equivalent |
|---|---|---|---|
| **Core** | the public `aos-cowork-plugin` — the shared skills | the public repo; **never edited per client** | Drupal core |
| **Overlay** | a **private per-customer plugin** — the bespoke skills | a private repo + private marketplace; installed *alongside* core | contrib / custom modules |
| **Site** | per-end-client pluggable data — custom frameworks, patterns, the operating-framework adapter | the client's **granted folder** | site-level config |

Core and overlay are **both plugins** — Cowork / Claude Code load multiple
plugins at once, so the overlay's skills sit on top of core without touching it
(Magento: never edit `vendor/`). The site layer is the granted-folder data the
shared skills already consume (the Tier-1 pluggability AOS ships today —
`aos-write --framework`, `content-system/patterns.md`, `client/OPERATING_FRAMEWORK.md`).

## Namespacing — mandatory (Magento `Vendor_Module`)

Every overlay skill is **vendor-namespaced**: `<customer-slug>-<skill>` — e.g.
`vendilli-revamp-draft`. Core skills keep the bare `aos-` prefix. Consequence:
an overlay skill can never collide with `aos-*`, and two customers' overlays can
never collide. The namespace is the skill's `name:` frontmatter value.

## The three customisation modes (Magento: new module / plugin / preference)

An overlay skill declares, in frontmatter, **how** it relates to core:

| `overlay-mode:` | Behaviour | Magento equivalent |
|---|---|---|
| `add` *(default)* | a net-new skill — the common case | a new module |
| `wrap` | runs **before** / **after** a named core skill (`wraps: aos-review`, `wrap-point: before\|after`); core is untouched, the overlay composes around it | a `before` / `after` plugin (interceptor) |
| `replace` | **supersedes** a named core skill (`replaces: aos-write`); the router routes to the overlay version | a `di.xml` preference |

`replace` is used sparingly and is always **explicitly declared**, so an
override is auditable rather than hidden.

## Routing — a compiled table (Drupal `routing.yml` + Magento `routes.xml`)

The router keeps a **routing table** — but it is **compiled**, not hand-written:

1. **Each skill declares its routing metadata in frontmatter** — its 7+1 layer
   band and trigger phrases. This is the per-module `routing.yml` (Drupal) /
   `routes.xml` (Magento) equivalent.
2. **`aos-route-question` compiles the table** by aggregating every *available*
   skill's declaration — core **and** overlay. This mirrors Drupal parsing all
   modules' routing files and compiling one cached route table on cache rebuild.
3. The table is **rebuilt when the skill set changes** — never hand-maintained.
   *(Today the table is hand-edited in the router's `SKILL.md` on every new
   skill — that is the gap this closes; a hand-written table also structurally
   cannot see a private overlay's skills.)*
4. **Ordered match** — like Magento's router chain (first-match-wins): skill
   order / priority decides when several skills could match a request; an
   overlay `replace`-mode skill is ordered ahead of the core skill it replaces.

A discovery-compiled router is what makes overlay skills routable **with zero
edits to core** — the load-bearing prerequisite of the whole model.

## Compatibility (Magento `module.xml <sequence>` + Drupal `core_version_requirement`)

An overlay skill declares `requires-core: ">=0.21.0"` — the core plugin version
it targets — plus an optional load `sequence`. If core moves past the
constraint, the overlay flags **incompatible** rather than silently breaking.

## Distribution & isolation

- The overlay is a **private plugin** — a private marketplace, **never** the
  Anthropic directory. Only the one customer installs it.
- The public `aos-cowork-plugin` repo stays clean — bespoke work never enters it.
- An **agency** customer's overlay applies across all *their* end-client granted
  folders, but never reaches another agency or a public user.
- Granted-folder data is per-end-client — every skill is `client-scope:
  single-client`, so the site layer never leaks either.

## What is not built yet

This document is the design. The build (M11 / AOS-807):

- the **compiled router** in `aos-route-question` (replace the hand-written table);
- the **overlay-skill frontmatter contract** — `overlay-mode`, `wraps` /
  `replaces`, `requires-core`, the namespace rule;
- the **private-marketplace distribution** mechanism, and **verifying** Cowork
  loads multiple plugins from a private marketplace.
