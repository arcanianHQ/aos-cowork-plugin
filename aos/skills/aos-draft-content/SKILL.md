---
name: aos-draft-content
description: Draft content for a client by composing brand intelligence + content-system + the content framework library. Two modes — single-piece (one reference/blog/linkbait post) and series (walk a storytelling framework → a multi-piece, multi-platform content series). Produces publishable drafts in the client's voice.
scope: int-company
flavor: [company, internal]
class: content
domain: content
layer: [L6, L7]
client-scope: single-client
version: 0.2.1
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "single-piece: --type=<reference|blog|linkbait> --topic=\"<phrase>\" [--bu=<bu-slug>] [--pillar=<slug>]  ·  series: --framework=<slug> --topic=\"<phrase>\" [--bu=<bu-slug>] [--series=<slug>]"
inputs:
  - brand/VOICE.md (required)
  - brand/ICP.md (required)
  - brand/POSITIONING.md (recommended)
  - content-system/[<bu>/]messaging.md (required — per-BU path if multi-BU)
  - content-system/[<bu>/]products.md (required for product-tied content)
  - content-system/[<bu>/]pillars.md (recommended)
  - content-system/[<bu>/]distribution.md (recommended)
  - content-system/frameworks/ (the 3-level content framework library — required for series mode)
  - reference/post-type-<type>.md (single-piece mode — this skill's bundled spec)
  - reference/series-mode.md (series mode — the hierarchy walk)
outputs:
  - single-piece — content/[<bu>/]<YYYY-MM-DD>-<type>-<topic-slug>.md
  - series — content/[<bu>/]<series-slug>/ (NN-<beat>.md pieces + INDEX.md)
preflight:
  - client-config
  - content-system-contract
ontology:
  consumes: [Layer, ICP, VOICE]
  emits: [Content, Deliverable]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - build-brand-system (for the brand/ inputs)
tags: [content, drafting, blog, social, linkbait, pinterest]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`brand/`, `content-system/`, `content/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content-system/<bu>/`, `content/<bu>/`) *are* a legitimate layout level for multi-BU clients.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

The skill is the **composer** — it doesn't generate ideas from scratch. It takes a
topic + a content-system + a brand profile and writes drafts that fit.

## Modes

The skill runs in one of two modes, selected by the arguments given:

| Mode | Trigger | Produces |
|---|---|---|
| **single-piece** | `--type=<reference\|blog\|linkbait>` | one content piece, written flat under `content/` |
| **series** | `--framework=<storytelling-framework slug>` | a **content series** — one storytelling-framework run → ~10–11 pieces in `content/<series-slug>/` |

If both are given, `--framework` wins (series mode). If neither, ask the user which.

### Single-piece mode — three post types

| Type | Goal | Where it lives | Tone register |
|---|---|---|---|
| **reference** | Proof / social trust via a real project | Own blog + FB/IG + Pinterest pins | Premium-confident, customer-quoted |
| **blog** | SEO + topical authority, educate the ICP | Own blog only | Mentor-practitioner, educational |
| **linkbait** | Link acquisition + reach via external host | External blog platform (blog.hu, Medium, etc.) | Peer-conversational, hook-driven |

Same topic can be drafted as any of the three. The skill enforces structural
differences per type — see `reference/post-type-<type>.md`.

### Series mode — the content framework hierarchy

Series mode walks the **3-level content framework** (design:
`docs/content-framework.md`; library: `content-system/frameworks/`):

1. **Storytelling framework** (Level 1) — a generative narrative arc; one run yields
   ~10–11 distinct pieces.
2. **Content type** (Level 2) — the platform / format of one piece (LinkedIn post,
   blog post, email).
3. **Content-type structure** (Level 3) — the internal skeleton of one piece.

One framework run = **one series** (`content/<series-slug>/`). A series **may span
multiple content types**. The full walk lives in `reference/series-mode.md` — read
it when running series mode. The library is **pluggable**: drop in a new framework /
type / structure file, no skill change (same pattern as `docs/language-packs.md`).

## Posture

Discovery, not pronouncement. Every draft ends with *"What did we get wrong? What's missing?"* before the user accepts.

## Arguments

**Single-piece mode**

- `--type` (required) — one of `reference`, `blog`, `linkbait`
- `--topic` (required) — short topic phrase, e.g., `"téli kocsibeálló-építés"` or `"premium garage flooring options"`
- `--pillar` (optional) — pillar slug from the BU's `pillars.md` (if omitted, skill picks the best-matching pillar and tells the user)

**Series mode**

- `--framework` (required) — a storytelling-framework slug from
  `content-system/frameworks/storytelling/` (e.g. `heros-journey`). If omitted but
  series mode is wanted, the skill reads the library and recommends one.
- `--topic` (required) — the strategic idea the whole series is about
- `--series` (optional) — the series slug; if omitted the skill derives one from
  framework + topic. Re-passing an existing `--series` **resumes** that run.

**Both modes**

- `--bu` (required if client uses per-BU content-system) — BU slug, e.g., `kocsibeallo` or `deluxebuilding`. If the client's `content-system/` contains subfolders with their own `messaging.md`, the skill refuses to run without this flag.

There is no `--client` argument: the granted folder *is* the client folder, and client identity is read from `client/CLIENT_CONFIG.md` / `AOS_CONFIG.md`.

## Multi-BU clients

Some clients operate **multiple business units (BUs)** under one tenant — different domains, different ICPs, different price points, different messaging poles. Deluxe is the reference case: `kocsibeallo.hu` (Standard) and `deluxebuilding.hu` (Premium) under one client tree.

For multi-BU clients, the `content-system/` zone is split into per-BU subfolders:

```
content-system/
├── kocsibeallo/
│   ├── messaging.md       (Standard pole)
│   ├── products.md
│   ├── pillars.md
│   └── distribution.md
└── deluxebuilding/
    ├── messaging.md       (Premium pole)
    ├── products.md
    ├── pillars.md
    └── distribution.md
```

`brand/` stays at the granted-folder level (one founder, one identity diagnosis, one umbrella positioning) — only the operational content-system splits per BU.

**Strict separation rule** (from `client/DOMAIN_CHANNEL_MAP.yaml` when applicable): a draft for BU A NEVER references BU B's products, messaging, or audience. The skill enforces this by loading only the requested BU's content-system files.

Per-BU layout is detected by checking whether any subdirectory of `content-system/` contains a `messaging.md`; if so, `--bu` is required. (The optional `load-system.mjs` accelerator does this same detection.)

## Process

The Process below is **single-piece mode**. For **series mode**, the skill walks
the content framework hierarchy — see the dedicated procedure in
`reference/series-mode.md`. The series walk in brief:

1. **Choose / instruct a storytelling framework** (Level 1) — the user names one or
   the skill recommends from `content-system/frameworks/storytelling/`. The chosen
   framework's **Beats** table is the run plan (~10–11 pieces).
2. **Name the series** — derive a `<series-slug>`; the run becomes one
   `content/[<bu>/]<series-slug>/` folder.
3. **Per beat, pick a content type** (Level 2) — default = the beat's suggested
   type; the user may re-type any beat. A series may span multiple content types.
4. **Per piece, pick / instruct a structure** (Level 3) — default = the content
   type's `default-structure` or the structure whose **Fit** matches the beat.
5. **Draft each piece** — same composition + voice enforcement as Step 1 / Step 3
   below, with the Level-2 platform constraints and the Level-3 section skeleton.
   Once every beat's type + structure is resolved (steps 3–4), the per-piece
   drafts are **independent units** — each writes its own `NN-<beat>.md` and
   reads no other piece — so they **fan out to parallel sub-agents when the
   runtime exposes them, and run sequentially otherwise** (`docs/parallel-fanout.md`;
   design-patterns §10). Same series either way — only the latency differs.
6. **Write the series** — each piece to `content/[<bu>/]<series-slug>/`, plus a
   series `INDEX.md`. The content `CATALOGUE.md` indexes by series. The `INDEX.md`
   is **synthesis** — it must see every piece, so it stays with the parent and
   never fans out.

Series mode still runs the brand gate and content-system contract from Step 0, and
the voice rules from Step 3. The brand gate, the beat→type→structure resolution,
and the user-review gate are **parent-level steps** — a fanned-out per-piece draft
never runs them on its own. The depth — beat→type→structure resolution, frontmatter,
the `INDEX.md` template, resumable runs — is in `reference/series-mode.md`.

### Step 0 — Preflight (single-piece)

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest.
2. Verify `brand/VOICE.md` and `brand/ICP.md` exist and pass minimum substance (≥1500 bytes each). If not: tell user to run `/aos-build-brand-system` first; abort. Hard gate.
3. Verify the `content-system/` zone exists, then validate the content-system contract.

   **Baseline (bash + filesystem — the contract):**
   - Detect per-BU layout — `ls content-system/*/messaging.md`; if any match, BU mode is on and `--bu` is required (abort with the list of BU folders if it's missing).
   - Resolve the content-system dir: `content-system/<bu>/` in BU mode, else `content-system/`.
   - Confirm `messaging.md` is non-stub, and `products.md` is non-stub for `--type=reference`. Confirm `brand/VOICE.md` + `brand/ICP.md` are non-stub. Abort with a clear fix message if any check fails.

   **Optional accelerator:** `node scripts/load-system.mjs <type> [<bu>]` runs exactly these checks in one call and exits non-zero with the fix message. Use it if Node is available; the bash baseline is equivalent.
4. Validate `--type` against allowed values.
5. Load `reference/post-type-<type>.md` from this skill's reference directory.

### Step 1 — Load context

In priority order:

1. **Brand inputs** (the WHO):
   - `brand/VOICE.md` → register, banned words, sentence rhythm
   - `brand/ICP.md` → primary segment, JTBD, awareness stage
   - `brand/POSITIONING.md` → L2 identity sentence, competitive frame
   - `brand/BELIEF_PROFILE.md` (if filled) → founder beliefs that may color the angle

2. **Content-system inputs** (the WHAT) — loaded from `content-system/` for single-BU clients, or `content-system/<bu>/` for multi-BU clients:
   - `messaging.md` → the pole for this BU (premium / standard / etc.)
   - `products.md` → product/service catalog for this BU
   - `pillars.md` → topic pillars + sub-topics this BU owns
   - `distribution.md` → which channels this BU's content ships to

3. **Post-type inputs** (the HOW):
   - The bundled `reference/post-type-<type>.md` spec

### Step 2 — Pillar resolution

If `--pillar` was given: verify it exists in `pillars.md`. If not: warn user, ask to pick one.
If `--pillar` was omitted: read `pillars.md`, match `--topic` against pillar sub-topics, pick the best match, tell the user which pillar was chosen and why.

If the topic doesn't fit ANY pillar: ask the user before drafting. The system should be opinionated about pillar coverage — random topics dilute the brand.

### Step 3 — Draft

Apply the post-type spec's structure rules. Use the brand voice rules (register, banned words, preferred constructions). Cite product / messaging facts from `content-system/`.

Per-type structural rules live in `reference/post-type-<type>.md`. The skill's job here is faithful execution — do not improvise structure.

**Voice enforcement (hard rule):**
- Banned words from `VOICE.md` must NOT appear in the draft. Run a final pass and rewrite any hits.
- Address form (tegező/magázó for HU; tu/vous for FR; etc.) per `VOICE.md`.
- For HU clients: apply Hungarian-text quality rules — no AI-magyar phrasing patterns, no EN-calque verbs, correct definite articles on brand names, register (tegező/magázó) consistent with `VOICE.md`.

### Step 4 — Multi-surface output (reference type only)

For `--type=reference`, the draft includes three sections in the same file:

1. **Blog version** — full post (300–600 words + image placeholders)
2. **Social copy** — one FB caption (~150 chars) + one IG caption (~2200 chars max but 200–400 sweet spot) + hashtags appropriate to platform
3. **Pinterest pins** — 3–5 pin specs, each with: image-direction prompt, pin title (≤100 chars), pin description (≤500 chars), destination URL

For `--type=blog` and `--type=linkbait`: single blog draft only. The user re-runs with `--type=reference` if they want social/Pinterest derivatives.

**Privacy note (reference type).** A reference post is a real-project case study — it routinely names or quotes a real customer. That is third-party personal data: flag at draft time that the piece must pass `aos-anonymize` — or have recorded consent — before `aos-distribute` ships it (`aos-distribute`'s Step 0 privacy gate enforces this).

### Step 5 — Write

Output path (relative to the granted-folder root). A single-piece draft is written
**flat** — a series is a folder (series mode — see `reference/series-mode.md`):
- Single-BU client: `content/<YYYY-MM-DD>-<type>-<topic-slug>.md`
- Multi-BU client: `content/<bu>/<YYYY-MM-DD>-<type>-<topic-slug>.md`

Frontmatter:

```yaml
---
scope: int-confidential
client: <slug>
content_type: <type>
topic: <topic>
pillar: <pillar slug>
generated_by: aos-draft-content        # provenance block — see docs/artifact-versioning.md
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
status: draft  # → review → approved → published
target_channel: <from distribution.md>
voice_check_passed: true
banned_words_check_passed: true
---
```

`generated_by` / `skill_version` / `generated_date` / `aos_schema` are the standard provenance block (`docs/artifact-versioning.md` §1) — see the **Provenance** section below.

### Step 6 — User review

Present the draft with three options:
- **Accept** — write to disk as-is
- **Revise** — user makes edits; skill applies and re-validates voice rules
- **Regenerate** — user provides correction direction; redraft

Do not write until accept.

## Provenance

Every artifact this skill writes carries the **standard provenance block** in
its frontmatter — see `docs/artifact-versioning.md` §1. Stamp all four fields:

```yaml
generated_by: <this skill's name>      # the name: frontmatter value
skill_version: <this skill's version>  # the version: frontmatter value
generated_date: <YYYY-MM-DD>           # the date written
aos_schema: <schema-version>           # read from AOS_CONFIG.md
```

Add it to whatever domain frontmatter the artifact already carries; never
hard-code `skill_version` or `aos_schema` — read them at write time. This is
what lets a granted folder be migrated when the plugin or schema changes.

## Hard rules

1. **Brand gate.** Refuse to draft if `brand/VOICE.md` or `brand/ICP.md` are stubs. Send user to `/aos-build-brand-system`. No exceptions.
2. **Content-system gate.** Refuse to draft if `content-system/messaging.md` and `content-system/products.md` don't exist with substance.
3. **Voice fidelity.** Every banned word in VOICE.md gets flagged and rewritten before write. The skill is responsible for this — not the user.
4. **Pillar coverage.** Drafts must fit a named pillar. Off-pillar topics get an explicit user confirmation step.
5. **Single client.** The granted folder is one client's folder — operate only within it. There is no other client's content-system or brand to read.
6. **Multilingual.** Draft in the client's primary brand language. Never default to EN if the brand operates in HU/DE/FR/etc.
7. **Discovery, not pronouncement.** Every draft footer asks *"What did we get wrong? What's missing?"*.
8. **Framework fidelity (series mode).** A series follows its storytelling framework's beat list exactly — every beat becomes a piece, in order. Do not improvise, drop, or reorder beats. Re-typing a beat's content type is allowed; skipping a beat is not.
9. **One framework run = one series.** A series-mode run writes exactly one `content/[<bu>/]<series-slug>/` folder with one `INDEX.md`. Never scatter a framework run's pieces flat under `content/`.

## Output sections

User-facing summary at end of run:

- Pillar chosen + why
- Voice-fidelity check result (any banned words flagged + how they were rewritten)
- Draft path
- Which content-system / brand files were consulted
- Suggested next actions (e.g., for reference posts: "generate the image directions next" — though that's a separate skill)
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `/aos-build-brand-system` (must complete before content-draft runs); the per-client `content-system/` folder (which lives in the client tree and is filled by the practitioner who knows the business)
- **Downstream:** image-generation skill (planned), translation skill (if cross-language distribution), publishing-pipeline skill (planned)
- **Related:** Hungarian-text quality rules (applied inline in Step 3 for HU clients); when a blog post will be cross-posted to LinkedIn, tighten the hook and trim to LinkedIn's shorter attention budget.
- **Content framework system:** series mode consumes the 3-level content framework library in `content-system/frameworks/` — design in `docs/content-framework.md`, the walk in `reference/series-mode.md`. The library is pluggable; new frameworks / types / structures are drop-in files.

## Versioning

- **v0.1.0** — initial dogfood version. Reference / blog / linkbait types defined. Multi-surface output for reference type only.
- **v0.2.0** — **series mode** added (AOS-752 / AOS-753): walks the 3-level content framework library (`content-system/frameworks/`); one storytelling-framework run produces one multi-piece, multi-platform content series. Single-piece mode unchanged.
- **v0.2.1** — **parallel fan-out** in series mode (AOS-850, milestone *13. Agentic behaviour* — F4). Once each beat's type + structure is resolved, the per-piece drafts are documented as independent units that fan out to parallel sub-agents when the runtime exposes them and run sequentially otherwise — same series, lower latency. The brand gate, beat resolution, the `INDEX.md` synthesis, and the user-review gate stay parent-level. See `docs/parallel-fanout.md`.
- **v0.3.0 planned** — add `--variants=N` for A/B title generation; add image-prompt sub-pass; multilingual cross-pollination (one topic, two languages).
- **v1.0.0** — promotion criterion: 30+ pieces shipped through this skill across 3+ clients with positive feedback.

## Notes for the practitioner

- The `content-system/` zone is where client-specific operational knowledge lives — products, messaging, pillars, distribution. These don't fit in `brand/` because they're operational, not identity-level.
- A reference post (real project case study) is usually the highest-converting content type per the data we have on physical-product brands. Prefer reference posts over generic blog posts when a real project is available to write about.
- Linkbait is the riskiest type — register drifts toward "clickbait" easily. The post-type spec for linkbait enforces a "hook earns the read" rule.
- **Series vs single-piece.** Reach for **series mode** when the goal is a campaign — to walk an audience through a narrative arc over weeks. Reach for **single-piece** when one post is needed now. A series is the natural unit of a storytelling-framework run; a single piece is a one-off.
- The `content-system/frameworks/` library is **shared across BUs** and **pluggable** — extending it (a new storytelling framework, content type, or structure) is a drop-in file, no skill change. See `content-system/frameworks/README.md`.

**What did we get wrong? What's missing?**
