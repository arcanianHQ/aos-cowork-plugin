# frameworks/ — the content framework library

The 3-level, pluggable hierarchy `aos-draft-content` walks to turn one strategic
idea into a coherent **content series**. Full design: `docs/content-framework.md`.

```
frameworks/
├── storytelling/    LEVEL 1 — narrative arcs (generative: 1 arc → ~10–11 pieces)
├── content-types/   LEVEL 2 — platforms / formats of a single piece
└── structures/      LEVEL 3 — internal skeletons, namespaced by content type
```

## The 3 levels in one line each

1. **Storytelling framework** — the narrative ARC. One framework run yields a *series*
   of ~10–11 distinct pieces that together walk an audience through a journey.
2. **Content type** — the PLATFORM / FORMAT of one piece (LinkedIn post, blog, email).
3. **Content-type structure** — the internal SKELETON of one piece (hook → … → CTA).

## Shared across business units

This `frameworks/` library is **shared** — it sits at `content-system/frameworks/`,
not inside each `content-system/<bu>/`. A narrative arc is brand-craft, reusable
across BUs. The per-BU split stays at `messaging.md` / `products.md` / `pillars.md`
/ `distribution.md`. A BU run draws its *substance* from its own BU folder and its
*shape* from this shared library.

## Extending the library (pluggable — no skill change)

- **New storytelling framework** → drop `storytelling/<slug>.md` (shape:
  `heros-journey.md`). Discovered by being in the folder.
- **New content type** → drop `content-types/<slug>.md`, then create
  `structures/<slug>/` with ≥1 structure.
- **New structure** → drop `structures/<type>/<slug>.md`, then list it under that
  type's **Supported structures**.

This is the language-pack pattern (`docs/language-packs.md`): discovery by
convention, zero core change.

## Seeded starter set

| Level | Seeded |
|---|---|
| Storytelling frameworks | `heros-journey` · `before-after-bridge` |
| Content types | `linkedin-post` · `blog-post` · `email` |
| Structures | `linkedin-post/hook-insight-cta` · `linkedin-post/story-lesson` · `blog-post/problem-framework-proof` · `email/one-thing` |

The starter set is real but lean — enough to run a series end-to-end and to
demonstrate the expansion pattern. Practitioners extend it per client.
