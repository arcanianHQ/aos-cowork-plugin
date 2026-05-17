---
scope: int-company
---

# Custom frameworks — resolving and following `--framework`

Companion to `aos-write/SKILL.md`. How `aos-write` resolves the `--framework`
argument, and how it reads and follows a **client-supplied** content framework —
the F9 "pluggable custom framework" capability, expressed for the mid-level skill.

---

## The principle

A client often has their **own** content framework — a named structure their
team already writes to (a "REVAMP" arc, a story-crafting skeleton, a house
post recipe). `aos-write` honours it as a **drop-in file**: the client puts the
framework doc in the granted folder, points `--framework` at it, and the skill
follows that structure instead of an AOS built-in. No skill change, no
conversion step.

This is the same pluggability principle as `docs/language-packs.md` and the
`content-system/frameworks/` library — structure is data, not code.

---

## Resolving `--framework`

| `--framework` value | Resolution |
|---|---|
| omitted | Use the per-type default structure — `write-method.md` §4, or the `content-system/frameworks/content-types/<type>.md` `default-structure` if the library is present. |
| a **slug** (no `/`, no `.md`) | A built-in — look it up under `content-system/frameworks/` (storytelling, content-types, or structures). If no such slug exists, tell the user and fall back to the per-type default. |
| a **path** (contains `/` or ends `.md`) | A client-supplied framework file — resolve it relative to the granted-folder root, read it, and follow it (below). |

If a path is given but the file does not exist, **stop and ask** — do not
silently fall back; the user asked for a specific framework.

---

## Reading a client-supplied framework file

A custom framework file is free-form — a client wrote it, not AOS. Read it as a
**structural spec** and extract:

1. **The arc / section list** — the ordered beats, sections, or moves the
   framework defines. This becomes the piece's skeleton.
2. **Per-section intent** — what each section is *for* (the job of the beat),
   in the framework's own words.
3. **Any voice / tone notes** the framework carries — apply them *on top of*
   `brand/VOICE.md` (the brand voice still wins on a conflict; the framework
   adds, it does not override the brand's banned words).
4. **Length / format guidance**, if any.

If the file is ambiguous — no clear section list — summarise back to the user
what structure you extracted and confirm it before drafting. Never guess a
structure into a client's framework.

---

## Following it — fidelity rule

- Draft the piece **section by section, in the framework's order**. Every
  section the framework defines becomes part of the piece.
- Do **not** substitute an AOS built-in structure for a section, and do not
  reorder or drop the framework's sections — that is the custom-framework
  fidelity hard rule (SKILL.md Hard Rule 5).
- The framework sets the **structure**; `brand/VOICE.md` (or the inferred voice)
  still sets the **voice**, and the guardrails (`write-method.md` §5–§6) still
  run. A custom framework never exempts a draft from the banned-words / cliché
  scan or the honest-claims check.

---

## Recording it

The draft's frontmatter records which framework was used:

```yaml
framework: custom:<filename>     # e.g. custom:vendilli-revamp.md
```

— so `aos-review` and a later reader can see the piece was drafted to a
client framework, not an AOS built-in. A built-in run records `framework:
<slug>`; a default run records `framework: default`.

---

## Promoting a custom framework into the library

If a client's custom framework proves out, it can be promoted into the shared
`content-system/frameworks/` library (as a storytelling framework, content type,
or structure) so `aos-draft-content` series mode can use it too. That promotion
is a deliberate step — copy the file into the library with the library's
frontmatter (`level:`, `slug:`, …) — not something `aos-write` does automatically.
