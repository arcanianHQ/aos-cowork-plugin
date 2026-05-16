---
name: catalogue
description: "Index the granted folder's two working zones — inbox/ (client material for discovery) and content/ (produced content pieces) — into their CATALOGUE.md files, each entry with type, status and key metadata. Trigger on 'catalogue the inbox', 'catalogue the content', 'what's in the inbox', or after material/content changes."
scope: int-company
flavor: [company, advanced, internal]
class: execute
domain: discovery
layer: all
client-scope: single-client
version: 0.0.3
owner: arcanian
allowed-tools: [Read, Glob, Grep, Bash, Write, Edit]
args-hint: "[inbox|content|all] — which zone to catalogue; default all"
preflight: []
ontology:
  consumes: []
  emits: []
safety:
  mode: mutates-state
  requires_confirmation: false
---

# Catalogue

Index the granted folder's two working zones into their `CATALOGUE.md` files.
Re-run after material or content changes.

## Zone — `inbox/` → `inbox/CATALOGUE.md`  (client input material, discovery prep)

Runs *before* `build-brand-system` harvests, so discovery knows what is new.

- **Scan** every file under the `inbox/` typed folders + root. Skip
  `inbox/_processed/`, `inbox/README.md`, `inbox/CATALOGUE.md`.
- **Type** = the inbox folder (root files = `unsorted`).
- **Status** — `new` / `catalogued` / `harvested` / `processed`. Preserve
  `harvested` / `processed` from the prior catalogue — never downgrade.
- **Columns:** `File · Type · Size · Modified · Status · Summary`.

## Zone — `content/` → `content/CATALOGUE.md`  (produced content pieces)

- **Scan** every piece under `content/<bu>/`. Skip `README.md`, `CATALOGUE.md`.
- **Type** = `reference` / `blog` / `linkbait` (from the piece's frontmatter).
- Pull **BU**, **pillar**, **channel**, **status** from each piece's frontmatter.
- **Status** — `draft` / `in-review` / `scheduled` / `published`. Preserve
  `published` across re-runs.
- **Columns:** `File · Type · BU · Pillar · Channel · Status · Created`.

## Process

1. Resolve the zone(s) from the argument (`inbox` / `content` / `all`; default `all`).
2. For each zone: scan, classify, summarise. Then **Read** the zone's
   `CATALOGUE.md` (it pre-exists — shipped in the data-template), diff status
   against it, and **rewrite it with `Edit`** — refreshed table + footer
   (`Last catalogued: <date> · <N> items`). Only `Write` it if genuinely missing.

## Guardrails

- **Read-and-index only** — never modify, move, or delete the material itself.
- `CATALOGUE.md` always pre-exists (data-template) — **Read it before rewriting**; a blind `Write` over an un-Read file is refused by the harness.
- Preserve lifecycle status (`harvested`, `published`) across re-runs.

## Status

v0.0.3 scaffold — two-zone. Pairs with `build-brand-system` (inbox → discovery)
and `content-draft` (content production).
