---
name: aos-write
description: "Draft a single content piece fast — the mid-level content-writing skill. Composes a brief plus whatever brand context already exists (brand/VOICE.md, ICP.md, a content-system, a CLIENT_CONFIG) into a publishable draft, and degrades gracefully when that context is thin: it never hard-gates on a missing brand profile. Honours a client's own content framework when one is supplied. Trigger on 'write a post', 'draft content', 'write me a LinkedIn post / blog / email', or when content is needed before the full brand pipeline has run."
scope: int-company
flavor: [shared, company, advanced, internal]
class: content
domain: content
layer: [L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "--topic=\"<phrase>\" [--type=<linkedin-post|blog-post|email|reference>] [--brief=<path under inbox/ or content/>] [--framework=<built-in slug | path to a custom framework file>] [--bu=<bu-slug>] — operates on the granted folder; drafts one piece"
inputs:
  - client/CLIENT_CONFIG.md (optional — used if present)
  - brand/VOICE.md (optional — the voice contract; inferred if absent)
  - brand/ICP.md (optional — the audience; inferred if absent)
  - brand/POSITIONING.md (optional — the identity frame)
  - content-system/[<bu>/]messaging.md · pillars.md · products.md (all optional — used if present)
  - the user's brief — pasted in chat, or a file named by --brief
  - a content framework — --framework names a built-in (content-system/frameworks/) or a client-supplied framework file
  - reference/write-method.md (the context ladder + the draft + guardrail procedure)
  - reference/custom-framework.md (how a client-supplied framework is read and followed)
outputs:
  - content/[<bu>/]<YYYY-MM-DD>-<type>-<topic-slug>.md (one publishable draft)
preflight:
  - client-config-soft
ontology:
  consumes: [VOICE, ICP, Layer]
  emits: [Content]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [content, drafting, write, mid-level, fast, loop]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`brand/`, `content-system/`, `content/`, `client/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content/<bu>/`, `content-system/<bu>/`) *are* a legitimate layout level for multi-BU clients. If the folder has not been onboarded (no `AOS_CONFIG.md`), this skill still runs — it operates on the working directory and writes to `./content/`, creating it if absent. Bash + filesystem on the granted folder is the contract.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. If there is no `AOS_CONFIG.md`, infer the content language from the brief and `client/CLIENT_CONFIG.md`; if it is still ambiguous, ask the user once. Talk to the user in `communication-language`; write the draft in `content-language`.

## Purpose

`aos-write` is the **mid-level content-writing skill** — the everyday workhorse
between "write something now" and the full `aos-draft-content` pipeline.

```
basic ──────────── aos-write (mid) ──────────── aos-draft-content (advanced)
quick / minimal      one good piece, fast,        full 9-file brand profile,
context              light context, no gate       content-system, series mode
```

It does one job: take a **topic + brief** and whatever brand context already
exists, and produce **one** publishable content draft in the client's voice. Its
defining property is **graceful degradation** — it works whether the granted
folder holds a complete brand profile or nothing but the user's brief. It never
refuses to draft because the brand profile is incomplete.

This is what a pilot user installs and uses on day one — before `aos-onboard`,
`aos-build-brand-system`, and `aos-build-brand-system`'s content-system have all
been run. The draft it produces is a real content piece: it lands in `content/`
with the standard frontmatter, so `aos-review` → `aos-distribute` → `aos-measure`
all operate on it unchanged.

**Anti-goal.** `aos-write` does not run a campaign / series — one storytelling
framework → ~10 pieces is `aos-draft-content` series mode. It does not build a
brand profile (`aos-build-brand-system`) or a content-system. It writes **one
piece**, well, fast.

## Posture

Discovery, not pronouncement. The draft is a first attempt for the user to
correct. Every draft ends with *"What did we get wrong? What's missing?"* And
the skill is **honest about its inputs** — it tells the user, up front, the
context level it is drafting at and what richer inputs would improve the result.

## The context ladder — graceful degradation, never a gate

`aos-write` assembles whatever brand context exists and drafts at the best level
that context supports. It classifies the run into one **context level** and
states it to the user before drafting (full procedure in `reference/write-method.md`):

| Context level | What is present | How the skill drafts |
|---|---|---|
| **full** | `brand/VOICE.md` **and** `brand/ICP.md` both substantive | Drafts to the voice + audience contract directly — near `aos-draft-content` quality. |
| **partial** | *Some* brand context — one of VOICE / ICP, or `CLIENT_CONFIG.md`, or a content-system file | Uses what is there; **infers** the rest from the brief and states each inference. |
| **brief-only** | Nothing in `brand/` — just the user's brief | Drafts from the brief; infers voice + audience; marks the draft clearly as drafted without a brand profile. |

The context level is **not a gate** — every level produces a draft. It is a
quality signal: the skill records it in the draft's frontmatter (`context_level:`)
and names, in the run summary, the one or two inputs that would lift the next
draft (e.g. "run `aos-build-brand-system` for a real `VOICE.md`").

## Arguments

This skill operates on the **granted folder** — which is the client's folder.

- `--topic` (required) — the topic phrase, e.g. `"why measurement beats adjectives"`.
- `--type` (optional) — the content type: `linkedin-post`, `blog-post`, `email`,
  or `reference` (a real-project proof piece). Plus any content type the
  `content-system/frameworks/content-types/` library defines, if present. If
  omitted, the skill recommends one from the brief and says which.
- `--brief` (optional) — a path to a brief file (under `inbox/` or elsewhere in
  the granted folder). If omitted, the skill uses the brief the user pasted in
  chat; if there is none, it asks for two or three lines on the angle and goal.
- `--framework` (optional) — a content framework to follow: a built-in slug from
  `content-system/frameworks/`, **or a path to a client-supplied framework file**
  (the client's own structure — see `reference/custom-framework.md`). If omitted,
  the skill uses the default structure for the `--type`.
- `--bu` (required if the client uses per-BU content) — BU slug. If
  `content-system/` contains subfolders with their own `messaging.md`, the skill
  refuses to run without this flag — it cannot honour a BU's content-system
  without knowing which BU.

There is no `--client` argument — the granted folder *is* the client folder.

## Process

### Step 0 — Preflight (soft — never a hard gate)

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md`
   for the zone manifest and `client` identity **if it exists**; if it does not,
   operate on the working directory and treat `./content/` as the content zone.
2. Detect per-BU layout — `ls content-system/*/messaging.md`. If any match,
   `--bu` is required; abort with the BU list if it is missing. (This is the one
   abort condition — it is a correctness guard, not a brand gate.)
3. Resolve `--type` (recommend one from the brief if omitted) and the content
   language.

### Step 1 — Assemble context + classify the level

Inventory the brand context that exists — `brand/VOICE.md`, `brand/ICP.md`,
`brand/POSITIONING.md`, `client/CLIENT_CONFIG.md`, the BU's `content-system/`
files — and the user's brief (from `--brief`, chat, or by asking). Classify the
run into a **context level** (`full` / `partial` / `brief-only`) per the table
above and the procedure in `reference/write-method.md`. **State the level and the
inputs consulted to the user before drafting.**

### Step 2 — Resolve the framework / structure

Resolve how the piece is structured (detail in `reference/custom-framework.md`):

- `--framework` is a **built-in slug** → load it from `content-system/frameworks/`.
- `--framework` is a **path to a client-supplied file** → read that file as the
  structural spec and follow it. This is how a client's own content framework
  (e.g. a "REVAMP" / story-crafting structure) is honoured without a skill change.
- `--framework` omitted → use the **default structure** for the `--type`
  (`reference/write-method.md` carries the per-type defaults).

### Step 3 — Draft

Compose the piece from the brief + the assembled context + the resolved
structure. Apply voice — from `brand/VOICE.md` if present; if absent, infer a
register from `CLIENT_CONFIG.md` / the brief and **state the inference**. The
draft procedure is in `reference/write-method.md`.

### Step 4 — Quality guardrails

Run the guardrails — they run at **every** context level, brief-only included:

1. **Banned-words / cliché scan.** If `brand/VOICE.md` exists, scan its banned
   list. If it does not, scan the **default marketing-cliché guard** in
   `reference/write-method.md` (the generic "never say this" list). Rewrite hits.
2. **Register consistency** — the piece holds one register start to finish.
3. **Completeness** — no placeholder / TODO markers; the structure's sections all
   present and substantive.
4. **Honest-claims check** — a draft drawn from a thin context must not invent
   product facts. A claim with no source in the context is softened or cut.

### Step 5 — Write + present

Write the draft to `content/[<bu>/]<YYYY-MM-DD>-<type>-<topic-slug>.md` with the
frontmatter below. Present the draft + the context level for the user — Accept /
Revise / Regenerate. Do not write until Accept.

## Output frontmatter

```yaml
---
scope: int-confidential
client: <slug — or "unknown" if no CLIENT_CONFIG>
content_type: <type>
topic: <topic>
pillar: <pillar slug if a content-system pillars.md was used — else blank>
draft_tier: mid
context_level: <full | partial | brief-only>
framework: <built-in slug | custom:<filename> | default>
generated_by: aos-write
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md — or "0" if not onboarded>
status: draft
voice_check_passed: true
banned_words_check_passed: true
---
```

`content_type` and `status: draft` keep the piece compatible with `aos-review`,
`aos-distribute`, and `aos-catalogue`. `context_level` tells `aos-review` how
much brand contract was available.

## Provenance

The draft carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1. Stamp all four fields (`generated_by`,
`skill_version`, `generated_date`, `aos_schema`); never hard-code `skill_version`
or `aos_schema` — read them at write time. When the folder is not onboarded,
`aos_schema` is `0` (un-onboarded marker) — a later `aos-migrate` will reconcile.

## Hard Rules

1. **Never hard-gate on the brand profile.** A missing or thin `brand/` profile
   makes the run `partial` / `brief-only` — it never makes the skill refuse. This
   is the defining difference from `aos-draft-content`.
2. **Honest about context.** Every draft records its `context_level`, and the run
   summary names the inputs that would lift the next draft. A `brief-only` draft
   says so plainly — in the frontmatter and to the user.
3. **One piece.** `aos-write` drafts a single piece. A campaign / multi-piece
   series → route to `aos-draft-content` series mode.
4. **Guardrails always run.** Banned-words / cliché scan, register, completeness,
   and the honest-claims check run at every context level — quality holds even on
   thin inputs.
5. **Custom-framework fidelity.** If `--framework` names a client-supplied file,
   follow *that* structure — never silently substitute an AOS built-in.
6. **No invented facts.** A draft from a thin context does not fabricate product
   facts, prices, or proof. Unsupported claims are softened or cut.
7. **Per BU.** For multi-BU clients, draft against the piece's own BU
   content-system — never another BU's.
8. **Single client.** Operate only within the granted folder; never reach outside it.
9. **Discovery, not pronouncement.** The draft ends with *"What did we get wrong?
   What's missing?"* before the user accepts.

## Output Sections

User-facing summary at end of run:

- Context level — `full` / `partial` / `brief-only` — and the inputs consulted
- Content type + framework / structure used
- Guardrail result — banned-words / cliché hits found and how they were rewritten
- The draft path
- What richer input would lift the next draft (the honest upgrade path)
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** none required — `aos-write` runs with or without `aos-onboard` /
  `aos-build-brand-system`. When those have run, it uses their output; `aos-route-question`
  routes "write a post / draft content" requests here.
- **Downstream:** the draft lands in `content/` as `status: draft` — `aos-review`
  checks it (degrading its own §1/§2 when the brand contract is thin),
  `aos-distribute` ships it, `aos-catalogue` indexes it, `aos-measure` measures it.
- **Sibling:** `aos-draft-content` — the **advanced** tier. Reach for it when the
  brand profile and content-system are complete and a multi-piece series is the
  goal. `aos-write` is the fast lane; `aos-draft-content` is the full lane. A
  `brief-only` `aos-write` draft is a natural prompt to run `aos-build-brand-system`
  next.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-785, Milestone 4 feature
  wave). The mid-level content-writing skill — built for the Cohort-1 pilot
  install. The context-ladder thresholds, the default per-type structures, and
  the cliché guard list likely need refinement after first real runs.

**What did we get wrong? What's missing?**
