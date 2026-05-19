# Language packs

AOS GTM produces client artifacts in the configured `content-language` (see
`docs/language-context.md`). The base system reaches every language well enough
to be *correct*. It does not reach every language well enough to be *native*.

A **language pack** closes that gap. It is a per-language **nativeness pass** — a
final quality pass that rewrites the system's already-correct output into prose a
native speaker would actually write.

`aos-localize-hu` (AOS-749) is the **first** language pack. This document defines
the pattern so adding the next language is a mechanical, self-contained job.

## What a language pack is — and is not

- It **is** a nativeness pass. Input = an artifact already in the target language.
  Output = the same artifact, in better target-language prose.
- It **is not** a translator. The base system already produced the target
  language. A language pack never sees, produces, or routes through English.
- It runs in **two modes**: as the **final** step over a content artifact (the
  *artifact pass*, when the pack's language is `content-language`), and as a
  **standing conversational pass** over every reply (the *conversational pass*,
  when the pack's language is `communication-language`). See `docs/language-context.md`.

## The pattern — adding a language pack

Adding language `<lang>` = creating one skill, `aos-localize-<lang>`, built to
the same shape as `aos-localize-hu`. No change to the system core, the router, or
any other skill.

1. **Create `aos/skills/aos-localize-<lang>/`** — copy the shape of
   `aos-localize-hu/`: a lean `SKILL.md` (procedure + core rules) plus a
   `reference/` directory holding the depth (anti-pattern catalogues, idiom
   lists, register rules, a pre-delivery checklist).
2. **Frontmatter contract** — match `aos-localize-hu` exactly except for the
   language:
   - `name: aos-localize-<lang>`
   - `class: content`, `domain: content`, `layer: [L6, L7]`
   - `flavor: [company, advanced, internal]`, `scope: int-company`
   - `client-scope: single-client`, `owner: arcanian`
   - `allowed-tools: [Read, Edit, Write, Glob, Grep]`
   - `safety.mode: mutates-state`, `safety.requires_confirmation: true`
   - `ontology.consumes: [Content, Deliverable]`, `ontology.emits: [Content, Deliverable]`
   - **`language-pack: <lang>`** — the marker field that identifies the skill as
     a language pack and binds it to a `content-language` value.
3. **Port a real style guide** — a language pack is only worth shipping if it
   encodes genuine native-speaker knowledge (anti-patterns, idioms, register).
   Port a real guide; do not write a thin generic one.
4. **Progressive disclosure** — keep `SKILL.md` to ~60–100 lines (procedure +
   the rules to hold in working memory). Push the catalogues into `reference/`.
5. **No core changes** — the language context (`docs/language-context.md`)
   already carries the chosen `content-language`. A new pack is discovered by its
   `language-pack:` frontmatter; nothing else needs editing.

## How a pack is selected

`content-language` is resolved from `AOS_CONFIG.md` during context assembly. When
its value is `<lang>` and a skill named `aos-localize-<lang>` exists, that pack is
the final quality pass over each Hungarian/`<lang>` artifact before delivery. If
no pack exists for the configured language, artifacts ship without a nativeness
pass — the base system output stands (correct, not polished).

## Current packs

| Language | Skill | Status | Source guide ported |
|---|---|---|---|
| Hungarian (`hu`) | `aos-localize-hu` | v0.3.0 | Arcanian Stílusútmutató (714-line HU writing style guide) |

Add a row when a pack lands.
