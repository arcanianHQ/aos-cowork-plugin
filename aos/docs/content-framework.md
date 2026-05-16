# Content framework system

How AOS turns one strategic idea into a coherent body of content. `aos-draft-content`
walks a **3-level, pluggable hierarchy** — storytelling framework → content type →
content-type structure — and produces a **content series** (`docs` cross-ref:
`data-folder-spec.md`, the `content/` zone).

The framework **library** lives in the `content-system/` zone of the granted folder
(`content-system/frameworks/`). It is shipped seeded in `data-template/` and grows
per client. Adding a framework / type / structure is a **drop-in file** — no skill
or router change. Same spirit as the language-pack pattern (`docs/language-packs.md`).

## The 3 levels

```
LEVEL 1 — Storytelling framework      content-system/frameworks/storytelling/
   the narrative ARC. GENERATIVE.        e.g. heros-journey.md, before-after-bridge.md
   ONE framework → ~10–11 distinct
   content pieces for the SAME platform.
        │
        │  yields a piece set (a "beat sheet"):
        │  beat 1 … beat 11, each beat = one piece
        ▼
LEVEL 2 — Content type                content-system/frameworks/content-types/
   the PLATFORM / FORMAT of ONE piece.    e.g. linkedin-post.md, blog-post.md, email.md
   chosen per beat.
        │
        │  each type declares which structures it supports
        ▼
LEVEL 3 — Content-type structure      content-system/frameworks/structures/<type>/
   the internal SKELETON of ONE piece.    e.g. structures/linkedin-post/hook-insight-cta.md
   hook → context → insight → CTA, etc.
```

### Level 1 — Storytelling framework (top, generative)

A **multi-piece narrative arc**, not a single template. The defining property:
**one framework, applied once, yields ~10–11 distinct content pieces** — a *series*
— that together walk an audience through a complete narrative. Hero's Journey is
the archetype: its 11 stages each become one piece.

A storytelling-framework file declares:

- **Arc** — what journey the audience is taken on, and why it persuades.
- **Beats** — the ordered list of ~10–11 beats. Each beat = one content piece, with
  a beat name, narrative job, and a default content-type suggestion.
- **Platform note** — the canonical run is single-platform (all 11 beats as
  LinkedIn posts, say), but beats may be re-typed per piece (see Level 2). The
  framework is platform-agnostic; the *run* picks platforms.
- **When to use / not use** — which GTM situations the arc fits.

### Level 2 — Content type (middle)

The **platform / format** of a single piece — LinkedIn post, blog post, email, etc.
One beat from Level 1 is realised as one content type. A content-type file declares:

- **Platform** + format constraints (length band, media, tone register).
- **Supported structures** — which Level-3 structures are valid for this type
  (a type with no listed structures falls back to its `default-structure`).
- **Distribution note** — where the piece ships, cadence.

The legacy `--type=reference|blog|linkbait` post-types still exist as
`skills/aos-draft-content/reference/post-type-*.md` and remain valid; the
`content-types/` library is the **forward** model and is what a framework run walks.
A content type may *reference* a legacy post-type spec for deep platform rules.

### Level 3 — Content-type structure (bottom)

The **internal skeleton** of a single piece — the ordered sections that compose it
(`hook → context → insight → CTA`). Structures are **namespaced by content type**
(`structures/<type>/<structure>.md`) because a skeleton that works for a LinkedIn
post does not transfer 1:1 to a blog post. A structure file declares:

- **Sections** — ordered, each with a job and a length hint.
- **Fit** — which beats / narrative jobs this skeleton serves best.
- **Anti-patterns** — how the skeleton is mis-built.

## Directory layout — `content-system/frameworks/`

```
content-system/
├── messaging.md            ┐
├── products.md             │  the existing 4-file content foundation
├── pillars.md              │  (per-BU; unchanged — see content-system-contract.md)
├── distribution.md         ┘
└── frameworks/             the 3-level content framework library
    ├── README.md           how the library is structured + how to extend it
    ├── storytelling/       LEVEL 1 — narrative arcs
    │   ├── heros-journey.md
    │   └── before-after-bridge.md
    ├── content-types/      LEVEL 2 — platforms / formats
    │   ├── linkedin-post.md
    │   ├── blog-post.md
    │   └── email.md
    └── structures/         LEVEL 3 — internal skeletons, namespaced by type
        ├── linkedin-post/
        │   ├── hook-insight-cta.md
        │   └── story-lesson.md
        ├── blog-post/
        │   └── problem-framework-proof.md
        └── email/
            └── one-thing.md
```

For **multi-BU clients** the framework library is **shared across BUs** — it lives
at `content-system/frameworks/`, *not* inside each `content-system/<bu>/` folder.
A narrative arc is brand-craft, not BU-operational knowledge; the per-BU split
stays at the messaging/products/pillars/distribution level. A BU run still draws
its *substance* (pole, products, pillars) from its own `content-system/<bu>/` files.

## Pluggability — adding a level

The whole point: extend without re-architecture. Each level is a drop-in file.

**Add a storytelling framework** — drop `storytelling/<slug>.md`, built to the shape
of `heros-journey.md` (Arc · Beats · Platform note · When to use). It is discovered
by being in the folder. No skill edit.

**Add a content type** — drop `content-types/<slug>.md` (Platform · constraints ·
Supported structures · `default-structure` · Distribution note). Create the matching
`structures/<slug>/` folder with at least one structure. No skill edit.

**Add a content-type structure** — drop `structures/<type>/<slug>.md` (Sections ·
Fit · Anti-patterns), then list its slug under the type's **Supported structures**.

This mirrors `docs/language-packs.md`: a new pack is a new directory discovered by
convention, with no change to the system core or the router.

## How `aos-draft-content` walks the hierarchy

The skill has two modes. **Single-piece** mode (legacy) drafts one piece. **Series**
mode walks the full 3-level hierarchy:

1. **Choose / instruct a storytelling framework (Level 1).** The user names one, or
   the skill reads `storytelling/` and recommends the arc that fits the goal. The
   chosen framework's **Beats** list is the run plan — ~10–11 pieces.
2. **Confirm the run as a series.** The run becomes one `content/<series>/` folder
   (see `data-folder-spec.md` + the `content/` README). One framework run = one series.
3. **Per beat, pick a content type (Level 2).** Default = the beat's suggested type.
   The user may re-type any beat — beats may span multiple platforms in one series.
4. **Per piece, pick / instruct a structure (Level 3).** Default = the content type's
   `default-structure`, or the structure whose **Fit** matches the beat's narrative
   job. The user may override.
5. **Draft each piece** — compose brand intelligence (`brand/`) + the per-BU
   content-system substance (`messaging.md`, `products.md`, `pillars.md`) + the
   Level-2 platform constraints + the Level-3 section skeleton. Voice rules from
   `brand/VOICE.md` are enforced exactly as in single-piece mode.
6. **Write the series** — each piece to `content/<series>/`, plus a series
   `INDEX.md`. The content `CATALOGUE.md` indexes by series.

Single-piece mode skips steps 1–3: the user supplies a content type directly, the
skill picks a structure, drafts one piece, writes it to `content/` (no series).

## Relation to existing docs

- `docs/data-folder-spec.md` — the `content-system/` and `content/` zones.
- `skills/aos-draft-content/reference/content-system-contract.md` — the existing
  4-file content foundation; the `frameworks/` library sits alongside it.
- `docs/language-packs.md` — the pluggability pattern this design follows.
- `content/README.md` — the **series** model (one framework run → one series).
