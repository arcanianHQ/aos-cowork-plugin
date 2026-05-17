---
name: aos-build-patterns
description: "Build a client's content pattern library and dialect tone layer — the repeatable content formats their best content piggybacks on, and a sub-locale tone modifier (a regional dialect, a house cadence) layered on top of brand voice. Produces content-system/patterns.md. Trigger on 'build the pattern library', 'what content formats work for us', 'add a dialect layer', 'write in <regional> tone'."
scope: int-company
flavor: [company, advanced, internal]
class: content
domain: content
layer: [L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--bu=<bu-slug>] — operates on the granted folder"
inputs:
  - client/CLIENT_CONFIG.md
  - brand/VOICE.md (the base voice the dialect layer modifies)
  - content/ + content/CATALOGUE.md (the client's content — what patterns recur, what worked)
  - content-system/[<bu>/]messaging.md · pillars.md (the content-system the patterns serve)
  - content-system/[<bu>/]patterns.md (existing library — refreshed in place)
  - inbox/**/*.md (harvest — high-performing posts, the client's "we always do X" formats)
outputs:
  - content-system/[<bu>/]patterns.md (the pattern library + the dialect tone layer)
preflight:
  - client-config
ontology:
  consumes: [VOICE, Layer]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [content, patterns, dialect, tone, content-system]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones (`brand/`, `content/`, `content-system/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Business-unit subfolders (`content-system/<bu>/`) *are* a legitimate layout level for multi-BU clients.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. The dialect layer is a modifier *within* `content-language` (a regional / register variant), not a different language — a different language is `docs/language-packs.md`'s job.

## Purpose

`aos-build-patterns` builds two operational content assets a client's drafting
leans on, both into `content-system/[<bu>/]patterns.md`:

1. **The content pattern library (F1 — "piggyback").** Most good content is not
   invented from nothing — it **piggybacks on a format that already works** for
   the client: a measurement-teardown post, a customer-question answer, a
   before/after build, a "what we learned shipping X" note. This skill captures
   those recurring formats as a **named, reusable pattern library** — so drafting
   a new piece starts from a proven shape, not a blank page.

2. **The dialect tone layer (F2).** Sometimes content needs a **sub-locale tone**
   on top of the brand voice — a regional dialect, a market-specific register, a
   house cadence for one audience. This is **not a different language** (that is
   a language pack) and **not a different brand voice** — it is a *modifier*
   applied over `brand/VOICE.md`: a thin layer the drafting skills add last.

**Anti-goal.** `aos-build-patterns` does not draft content (`aos-write` /
`aos-draft-content`), does not define the brand voice (`aos-build-brand-system`),
and does not add a new language (`docs/language-packs.md`). It captures the
**repeatable shapes** and the **tone modifier** the drafting skills then apply.

> **On F9 (pluggable custom content framework).** AOS-786 also names F9 — a
> client's own content framework as a drop-in. That capability already ships:
> `aos-write`'s `--framework` accepts a client-supplied framework file (see
> `aos-write/reference/custom-framework.md`), and `aos-draft-content`'s series
> mode reads the pluggable `content-system/frameworks/` library. F9 needs no new
> skill — a custom framework is a drop-in file.

## Posture

Discovery, not pronouncement. A pattern is captured from content that **actually
worked** for the client — not a generic template imposed on them. The dialect
layer is captured from how the client (or the target sub-locale) **actually
talks**. Present both as drafts for correction.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. Detect per-BU layout — `ls content-system/*/messaging.md`. If any match, `--bu` is required.
4. **Pre-read** `content-system/[<bu>/]patterns.md` if it exists (the harness rule).

### Step 1 — Harvest recurring patterns

Scan `content/` (+ `content/CATALOGUE.md`) and `inbox/` for the **shapes that
recur** — formats the client uses repeatedly, and especially formats that
performed well (a piece marked successful, a post the founder cites). Look for
the structural recipe under the surface: hook style, the sections, the proof
move, the close. A pattern is a shape used **2+ times**, or one the client
explicitly wants to standardise.

### Step 2 — Name and templatise each pattern

For each pattern, capture (per `reference/patterns-template.md`): a **name**, the
**job** it does, the **structure** (the section recipe), when to **use it / not
use it**, and a worked **example reference** from `content/`. A pattern with only
one weak instance and no client intent behind it is **not** added — the library
is proven shapes, not aspirations.

### Step 3 — Capture the dialect layer (if there is one)

Ask whether content for this client (or a BU / sub-audience) needs a **sub-locale
tone** on top of `brand/VOICE.md`. If yes, capture it as a *modifier*: the
register shift, the vocabulary substitutions, the cadence change — **and what it
must NOT do** (a dialect layer never overrides `VOICE.md`'s banned words or
breaks the brand register; it tunes, it does not replace). If there is no dialect
need, the layer is omitted — do not invent one.

### Step 4 — Write

Write `content-system/[<bu>/]patterns.md` — the pattern library + the dialect
layer — to `reference/patterns-template.md`. Present for Accept / Revise /
Regenerate before writing.

## Provenance

`content-system/[<bu>/]patterns.md` carries the **standard provenance block** —
see `docs/artifact-versioning.md` §1; never hard-code `skill_version` / `aos_schema`.

## Hard Rules

1. **Proven shapes only.** A pattern enters the library because it recurred and
   worked, or the client explicitly wants to standardise it — never because it is
   a generic content template.
2. **The dialect layer is a modifier, not a replacement.** It tunes `brand/VOICE.md`
   — it never overrides the banned-words list or breaks the brand register.
3. **No invented dialect.** A client with no sub-locale tone need gets no dialect
   layer — do not manufacture one.
4. **Per BU.** For multi-BU clients, build the library per BU — a pattern proven
   for one BU is not assumed to fit another.
5. **Single client.** Operate only within the granted folder.
6. **Discovery, not pronouncement.** Present both assets for confirmation.

## Output Sections

- Patterns captured — the named library, each with its job
- Dialect layer — captured, or "none needed"
- `content-system/[<bu>/]patterns.md` path
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-build-brand-system` (the `VOICE.md` the dialect layer modifies); `content/` (the proven content patterns are harvested from it); `aos-route-question` routes "build the pattern library" / "add a dialect" here.
- **Downstream:** `aos-write` and `aos-draft-content` read `content-system/[<bu>/]patterns.md` — a draft can start from a named pattern, and the dialect layer is applied last, over the brand voice. `aos-review` can check a piece against the pattern it claims.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-786 / F1 + F2, Milestone 4 feature wave). The content pattern library + the dialect tone layer. F9 (pluggable custom framework) already ships via `aos-write --framework`. Pattern-harvest heuristics likely need refinement after first real runs.

**What did we get wrong? What's missing?**
