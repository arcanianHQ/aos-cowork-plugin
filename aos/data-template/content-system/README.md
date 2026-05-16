# content-system/ — the content foundation

The content foundation `aos-draft-content` composes from. Two parts:

## 1. The per-BU content foundation (4 files)

One folder per business unit, each holding the 4-file foundation:

- `pillars.md` — the 3–5 topics the BU should own
- `messaging.md` — the BU's messaging / voice register
- `products.md` — the BU's product & service catalog
- `distribution.md` — where each content type ships, per channel

For a single-BU client these sit directly under `content-system/`; for a multi-BU
client each BU gets its own `content-system/<bu>/` folder. The layout contract is
`skills/aos-draft-content/reference/content-system-contract.md`.

## 2. The content framework library — `frameworks/`

The 3-level, pluggable hierarchy `aos-draft-content` walks to turn one strategic
idea into a content **series**:

```
frameworks/
├── storytelling/    LEVEL 1 — narrative arcs (1 arc → ~10–11 pieces = 1 series)
├── content-types/   LEVEL 2 — platforms / formats of a single piece
└── structures/      LEVEL 3 — internal skeletons, namespaced by content type
```

The framework library is **shared across BUs** — it lives at
`content-system/frameworks/`, not inside each `content-system/<bu>/`. Design:
`docs/content-framework.md`; library guide: `frameworks/README.md`.

---

Populated by the content pipeline: `aos-build-brand-system` (brand docs) →
the per-BU foundation (practitioner work) → `aos-draft-content` (walks the
`frameworks/` library to produce content series into `content/`).
