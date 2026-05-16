---
scope: int-company
---

# Content-system contract

The structure the granted folder's `content-system/` zone must satisfy for `/aos-draft-content` to run. All paths below are relative to the granted-folder root (which is the client folder).

## Two layouts: single-BU and multi-BU

### Single-BU layout (default for most clients)

One messaging pole, one product line, one audience. Files live directly under `content-system/`:

```
content-system/
├── messaging.md
├── products.md
├── pillars.md
└── distribution.md
```

`/aos-draft-content` runs without a `--bu` flag for these clients.

### Multi-BU layout (when the client operates 2+ business units with separate domains/ICPs/pricing)

Per-BU subfolders, each with its own complete content-system. The BU-level files NEVER reference each other's products or messaging — that's the whole point of splitting.

```
content-system/
├── <bu-slug-1>/
│   ├── messaging.md
│   ├── products.md
│   ├── pillars.md
│   └── distribution.md
└── <bu-slug-2>/
    ├── messaging.md
    ├── products.md
    ├── pillars.md
    └── distribution.md
```

`/aos-draft-content` requires `--bu=<bu-slug>` for these clients. The layout is detected by checking whether any subdirectory of `content-system/` contains a `messaging.md`; the optional `scripts/load-system.mjs` accelerator does the same detection and refuses to validate without `--bu` if multi-BU is detected.

**Reference case:** a client with `kocsibeallo` (Standard pole) + `deluxebuilding` (Premium pole) business units. `client/DOMAIN_CHANNEL_MAP.yaml` drives the split.

### When to use which layout

Use **single-BU** when the client has:
- One primary domain (or multiple domains all targeting the same audience)
- One messaging pole (premium OR standard, not both)
- One product line
- One social/Pinterest/distribution footprint

Use **multi-BU** when the client has any of:
- Multiple domains targeting genuinely different audiences (price tier, geography, B2B vs B2C)
- Pricing strategies that contradict each other if mixed (premium vs. value)
- A stated "do not mix" rule in `client/DOMAIN_CHANNEL_MAP.yaml`

When in doubt: start single-BU. Promote to multi-BU only when the cross-BU mixing problem is observable in practice (e.g., a piece of content drafted in single-BU mode read wrong for the audience it ended up reaching).

## Required files

### `messaging.md` (required)

The brand's **messaging poles** — the positions the brand can occupy on its value axis. Most brands have 2 poles (premium / standard, or expert / accessible). Some have 1; some have 3.

Each pole must specify:
- Pole label
- Anchor sentence (one-line summary)
- Target ICP segment for this pole (from `brand/ICP.md`)
- Tone shift from default voice (if any)
- Banned words specific to this pole (e.g., premium pole bans "olcsó", standard pole bans "luxus")
- Sample phrasings (3–5 short examples in this pole's register)

### `products.md` (required for product-tied content)

Catalog of products / services. Each entry must specify:
- Product name (canonical, as used in marketing)
- Category
- Positioning pole (premium / standard / etc. from `messaging.md`)
- Core value claim (one sentence — what this product DOES for the customer)
- Key specs (materials, dimensions, price band — whatever the customer asks about)
- Common objections + how the brand addresses them
- Visual notes (image style that fits this product)

Missing this file is fine if no product-tied content will be drafted. Required for reference posts and most blog posts.

## Recommended files

### `pillars.md` (recommended)

Topic pillars the brand owns. Each pillar must specify:
- Pillar slug (kebab-case)
- Pillar name (display)
- Why this pillar (one sentence on why the brand should own it)
- Sub-topics under the pillar (5–15 each)
- Primary keyword family per sub-topic
- Internal-link plan (which pillar posts link to which)

Without pillars.md, `/aos-draft-content` will warn but proceed (drafts won't be cross-linked into a topic graph).

### `distribution.md` (recommended)

Per content type, where it ships:

| Type | Primary channel | Secondary channels | Notes |
|---|---|---|---|
| reference | Own blog | FB + IG + Pinterest | Image-heavy, requires photo shoot |
| blog | Own blog | LinkedIn (cross-post) | SEO-anchored |
| linkbait | External (blog.hu, etc.) | — | Bio-link only |

Plus: posting cadence per type, image dimensions per channel, hashtag policies per channel.

Without distribution.md, `/aos-draft-content` defaults to own-blog only and skips the social/Pinterest sub-passes for reference posts.

## Optional files

### `samples/` (optional)

Subdirectory with examples of past content that landed well — `samples/reference-good-1.md`, `samples/blog-good-1.md`, etc. The skill uses these to anchor style during drafting (few-shot prompting against your actual gold-standard).

### `audience-pulse.md` (optional)

Living document of what the audience is asking about right now — questions from support, sales calls, comments. Updated quarterly. Helps `/aos-draft-content` pick topics that match current demand.

## Validation rules (bash baseline; `scripts/load-system.mjs` is an optional accelerator that enforces the same)

1. **messaging.md** must have ≥1 pole declared with all fields present
2. **products.md** must have ≥1 product entry if the draft is reference type
3. **pillars.md** if present, must have ≥1 pillar declared
4. **distribution.md** if present, must list at least the type being drafted

The script exits non-zero if a required file is missing or fails validation, with a clear "fix this" message.

## Filling the content-system

This is **practitioner work**, not orchestrator work. The orchestrator can scaffold templates, but messaging poles + product catalog + pillars are business knowledge the practitioner brings.

Suggested order to fill:
1. **products.md** first (concrete, factual — easiest to fill)
2. **messaging.md** second (derives from `brand/POSITIONING.md` + product positioning)
3. **pillars.md** third (derives from products + ICP — what does the ICP search for that maps to our products?)
4. **distribution.md** last (operational — once content starts shipping, this stabilizes naturally)

## Refresh cadence

| File | Refresh | Trigger |
|---|---|---|
| messaging.md | Yearly | Brand pivot, new pole added |
| products.md | Quarterly | New product launch, discontinued product |
| pillars.md | Yearly | SERP shift, new sub-topic emerges |
| distribution.md | Quarterly | Channel performance review |
