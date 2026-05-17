---
scope: int-company
---

# Patterns template

Companion to `aos-build-patterns/SKILL.md`. The shell for
`content-system/[<bu>/]patterns.md` — the pattern library and the dialect layer.

```markdown
---
scope: int-confidential
client: <slug>
business_unit: <set for multi-BU clients — or blank>
generated_by: aos-build-patterns
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
status: confirmed-by-user
---

# Content patterns — <Client Display Name>[ — <BU>]

> **What this is.** The repeatable content formats this client's best content
> piggybacks on, and a dialect tone layer if one is needed. Read by `aos-write`
> and `aos-draft-content`; a draft can start from a named pattern here.

## Pattern library

### <Pattern name>
- **Job:** <what this pattern does — the reader outcome>
- **Structure:** <the section recipe — hook → … → close>
- **Use it when:** <the situation this pattern fits>
- **Do not use it when:** <where it misfires>
- **Example:** <content/…/piece.md — a worked instance that proved it>

### <Pattern name>
<same shape>

_(A pattern enters the library because it recurred and worked, or the client
wants to standardise it — not because it is a generic template.)_

## Dialect tone layer

> A sub-locale **modifier** applied on top of `brand/VOICE.md` — a regional
> dialect, a market register, a house cadence. Not a different language (that is
> a language pack); not a different brand voice. Omit this section entirely if
> the client needs no dialect layer.

- **Applies to:** <whole brand / a BU / a sub-audience / a market>
- **Register shift:** <how the tone moves from the base VOICE.md>
- **Vocabulary substitutions:** <word / phrase swaps>
- **Cadence change:** <sentence rhythm / length shifts, if any>
- **Must NOT do:** <never overrides VOICE.md banned words; never breaks the
  brand register — the layer tunes, it does not replace>

---

**What did we get wrong? What's missing?**

<Which patterns are thinly evidenced? Does the dialect layer hold against
brand/VOICE.md? Which pattern needs another worked example to trust?>
```

## Notes

- `aos-write` / `aos-draft-content` apply the **dialect layer last** — after the
  brand voice, after the structure — as a final tuning pass.
- A pattern that proves out broadly can be promoted into the shared
  `content-system/frameworks/` library (as a content-type structure) so series
  mode can use it — a deliberate copy, not automatic.
