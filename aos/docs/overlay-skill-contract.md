# Overlay-skill frontmatter contract

The frontmatter an **overlay skill** must carry — so the discovery-based router
(`aos-route-question`) and the rest of the plugin treat it correctly. Companion
to `docs/overlay-architecture.md`.

An overlay skill lives in a **private per-customer plugin**, installed alongside
the public core plugin. It carries **every field a core AOS skill carries**
(`name`, `description`, `scope`, `flavor`, `class`, `domain`, `layer`, `version`,
`owner`, `allowed-tools`, …) — plus the overlay fields below.

## Overlay fields

| Field | Required | Value | Purpose |
|---|---|---|---|
| `name` | yes | `<customer-slug>-<skill>` (customer overlay) | **Mandatory vendor namespacing** (Magento `Vendor_Module`) for a per-customer overlay; never bare `aos-*`. A first-party product overlay may keep `aos-*` — see "First-party product overlays". |
| `overlay` | yes | `true` | Marks the skill as an overlay (not core). |
| `overlay-customer` / `overlay-product` | yes | `<slug>` | Whose overlay this is — a customer (`overlay-customer`) or an Arcanian product (`overlay-product`). Exactly one. |
| `overlay-mode` | yes | `add` \| `wrap` \| `replace` | How it relates to core. Default reasoning: `add`. |
| `wraps` | if `wrap` | `<core-skill-name>` | The core skill this one composes around. |
| `wrap-point` | if `wrap` | `before` \| `after` \| `around` | Run before, after, or **bracketing** `wraps` — `around` runs both before and after the core skill (Magento `around` plugin). |
| `replaces` | if `replace` | `<core-skill-name>` | The core skill this one supersedes. |
| `requires-core` | yes | a semver range, e.g. `">=0.21.0"` | The core plugin version the overlay targets. If core moves past it, the overlay flags **incompatible** rather than breaking silently. |

## The three modes

- **`add`** — a net-new skill. No `wraps` / `replaces`. The common case. The
  router discovers it and places it by `layer` like any skill.
- **`wrap`** — runs before/after a named core skill. The core skill is untouched;
  the overlay composes around it (Magento `before`/`after`/`around` plugin). The
  router routes to the *core* skill; the wrap fires at its `wrap-point` —
  `before`, `after`, or `around` (bracketing — runs before *and* after, e.g. a
  Todoist sync that pulls before the morning brief and syncs after the wrap).
- **`replace`** — supersedes a named core skill (Magento `di.xml` preference).
  When a `replace` overlay skill is present, the router routes to **it** instead
  of the core skill it `replaces:`. Use sparingly — always explicit, so an
  override is auditable.

## First-party product overlays

The fields above (`overlay-customer`, the mandatory `<customer-slug>-` namespace)
model a **per-customer** overlay — one client's bespoke skills. AOS also ships
**first-party product overlays** — paid extras Arcanian builds and sells to many
clients (the Todoist task-sync overlay, the data-layer overlay). They differ in
exactly two ways:

| | Per-customer overlay | First-party product overlay |
|---|---|---|
| Identity field | `overlay-customer: <slug>` | `overlay-product: <slug>` |
| `name:` namespace | `<customer-slug>-<skill>` — mandatory | **may keep the `aos-*` namespace** — Arcanian owns both core and the overlay, so an external collision is impossible; core simply never ships a skill the product overlay already owns |
| `owner:` | the customer | `arcanian` |
| `scope:` | `int-confidential` | `int-company` |

Everything else — `overlay: true`, `overlay-mode`, `requires-core`, the three
modes — is identical. A product overlay is still a **private** plugin, sold and
licensed, never committed to the public repo.

## Example — an `add` overlay skill

```yaml
---
name: vendilli-revamp-draft
description: "Draft content to Vendilli's REVAMP story-crafting framework. Trigger on 'revamp draft', 'write a REVAMP piece'."
scope: int-company
flavor: [company]
class: content
domain: content
layer: [L6, L7]
version: 0.1.0
owner: vendilli
allowed-tools: [Read, Grep, Glob, Bash, Write]
overlay: true
overlay-customer: vendilli
overlay-mode: add
requires-core: ">=0.21.0"
---
```

## Example — a `wrap` overlay skill

```yaml
---
name: vendilli-extra-qa
description: "An extra brand-compliance pass after the standard review."
# ... standard fields ...
overlay: true
overlay-customer: vendilli
overlay-mode: wrap
wraps: aos-review
wrap-point: after
requires-core: ">=0.21.0"
---
```

## Rules

1. **Namespacing is mandatory** — `name:` is `<customer-slug>-<skill>`; an overlay
   skill is never published into the public `aos-*` namespace.
2. **The mode is declared, never inferred** — `overlay-mode` is explicit; `wrap`
   carries `wraps` + `wrap-point`, `replace` carries `replaces`.
3. **A `replace` is auditable** — it names exactly the core skill it supersedes;
   the router logs that it routed to the overlay version.
4. **`requires-core` is honoured** — an overlay incompatible with the installed
   core version flags rather than runs.
5. **Overlay skills carry the standard provenance block** like any AOS artifact,
   plus `owner:` set to the customer, not `arcanian`.
6. **Privacy** — an overlay skill is `scope: int-confidential` or tighter unless
   the customer agrees otherwise; it ships only in that customer's private
   overlay plugin, never the public repo.

> **Status: contract spec (v0).** The router already reads `overlay-mode` /
> `wraps` / `replaces` (AOS-809, `aos-route-question` v0.5.0). The `requires-core`
> compatibility check and an overlay-plugin scaffold are M11 follow-ups
> (AOS-811). See `docs/overlay-architecture.md`.
