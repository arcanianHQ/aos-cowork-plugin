---
name: aos-draft-content
description: Draft a single piece of content (reference post, blog post, or linkbait) for a client by composing brand intelligence + content-system + a post-type spec. Produces a publishable draft in the client's voice with the structure and tone the type requires.
scope: int-company
flavor: [company, internal]
class: content
domain: content
layer: [L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "--type=<reference|blog|linkbait> --topic=\"<short topic phrase>\" [--bu=<bu-slug>] [--pillar=<pillar slug>]"
inputs:
  - brand/VOICE.md (required)
  - brand/ICP.md (required)
  - brand/POSITIONING.md (recommended)
  - content-system/[<bu>/]messaging.md (required — per-BU path if multi-BU)
  - content-system/[<bu>/]products.md (required for product-tied content)
  - content-system/[<bu>/]pillars.md (recommended)
  - content-system/[<bu>/]distribution.md (recommended)
  - reference/post-type-<type>.md (this skill's bundled spec)
outputs:
  - content/[<bu>/]<YYYY-MM-DD>-<type>-<topic-slug>.md
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

## Purpose

Draft one piece of content per invocation. The skill is the **composer** — it doesn't generate ideas from scratch. It takes a topic + a content-system + a brand profile and writes a draft that fits.

Three post types are supported:

| Type | Goal | Where it lives | Tone register |
|---|---|---|---|
| **reference** | Proof / social trust via a real project | Own blog + FB/IG + Pinterest pins | Premium-confident, customer-quoted |
| **blog** | SEO + topical authority, educate the ICP | Own blog only | Mentor-practitioner, educational |
| **linkbait** | Link acquisition + reach via external host | External blog platform (blog.hu, Medium, etc.) | Peer-conversational, hook-driven |

Same topic can be drafted as any of the three. The skill enforces structural differences per type — see `reference/post-type-<type>.md`.

## Posture

Discovery, not pronouncement. Every draft ends with *"What did we get wrong? What's missing?"* before the user accepts.

## Arguments

- `--type` (required) — one of `reference`, `blog`, `linkbait`
- `--topic` (required) — short topic phrase, e.g., `"téli kocsibeálló-építés"` or `"premium garage flooring options"`
- `--bu` (required if client uses per-BU content-system) — BU slug, e.g., `kocsibeallo` or `deluxebuilding`. If the client's `content-system/` contains subfolders with their own `messaging.md`, the skill refuses to run without this flag.
- `--pillar` (optional) — pillar slug from the BU's `pillars.md` (if omitted, skill picks the best-matching pillar and tells the user)

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

### Step 0 — Preflight

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

### Step 5 — Write

Output path (relative to the granted-folder root):
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
generated_by: content-draft v0.1
generated_date: <YYYY-MM-DD>
status: draft  # → review → approved → published
target_channel: <from distribution.md>
voice_check_passed: true
banned_words_check_passed: true
---
```

### Step 6 — User review

Present the draft with three options:
- **Accept** — write to disk as-is
- **Revise** — user makes edits; skill applies and re-validates voice rules
- **Regenerate** — user provides correction direction; redraft

Do not write until accept.

## Hard rules

1. **Brand gate.** Refuse to draft if `brand/VOICE.md` or `brand/ICP.md` are stubs. Send user to `/aos-build-brand-system`. No exceptions.
2. **Content-system gate.** Refuse to draft if `content-system/messaging.md` and `content-system/products.md` don't exist with substance.
3. **Voice fidelity.** Every banned word in VOICE.md gets flagged and rewritten before write. The skill is responsible for this — not the user.
4. **Pillar coverage.** Drafts must fit a named pillar. Off-pillar topics get an explicit user confirmation step.
5. **Single client.** The granted folder is one client's folder — operate only within it. There is no other client's content-system or brand to read.
6. **Multilingual.** Draft in the client's primary brand language. Never default to EN if the brand operates in HU/DE/FR/etc.
7. **Discovery, not pronouncement.** Every draft footer asks *"What did we get wrong? What's missing?"*.

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

## Versioning

- **v0.1.0** — initial dogfood version. Reference / blog / linkbait types defined. Multi-surface output for reference type only.
- **v0.2.0 planned** — add `--variants=N` for A/B title generation; add image-prompt sub-pass; multilingual cross-pollination (one topic, two languages).
- **v1.0.0** — promotion criterion: 30+ pieces shipped through this skill across 3+ clients with positive feedback.

## Notes for the practitioner

- The `content-system/` zone is where client-specific operational knowledge lives — products, messaging, pillars, distribution. These don't fit in `brand/` because they're operational, not identity-level.
- A reference post (real project case study) is usually the highest-converting content type per the data we have on physical-product brands. Prefer reference posts over generic blog posts when a real project is available to write about.
- Linkbait is the riskiest type — register drifts toward "clickbait" easily. The post-type spec for linkbait enforces a "hook earns the read" rule.

**What did we get wrong? What's missing?**
