---
scope: int-company
---

# Write method — the context ladder, drafting, and the guardrails

Companion to `aos-write/SKILL.md`. The deterministic procedure for classifying
the context level, inferring voice when there is no `VOICE.md`, the per-type
default structures, the cliché guard, and the draft pass.

---

## §1 — Classify the context level

Inventory, then classify. The level is a quality signal, never a gate.

### 1.1 — Inventory

Check, with `ls` + a size read, what brand context exists:

- `brand/VOICE.md` — substantive if it exists and is ≥1500 bytes and not a stub
  (no `status: stub-*`).
- `brand/ICP.md` — same substance test.
- `brand/POSITIONING.md`, `client/CLIENT_CONFIG.md` — present / absent.
- `content-system/[<bu>/]messaging.md` · `pillars.md` · `products.md` — present /
  absent (used for register, pillar tagging, and product facts when present).

### 1.2 — Classify

| Level | Rule |
|---|---|
| **full** | `VOICE.md` **and** `ICP.md` both substantive. |
| **partial** | Not `full`, but *some* brand context exists — one of `VOICE.md` / `ICP.md` substantive, **or** a `CLIENT_CONFIG.md`, **or** a content-system file. |
| **brief-only** | Nothing usable in `brand/` and no `CLIENT_CONFIG.md` — only the user's brief. |

State the level and the files consulted to the user **before drafting** — e.g.
*"Context level: partial — using `brand/VOICE.md`; no `ICP.md`, so the audience is
inferred from your brief."*

---

## §2 — The brief

`aos-write` always needs a brief — the angle and the goal of the piece. Source it,
in order:

1. `--brief=<path>` — read that file.
2. The brief the user pasted in chat this turn.
3. Neither → ask the user for 2–3 lines: *who the piece is for, what it should
   make them think or do, and any must-include fact.* Do not draft without it.

---

## §3 — Voice — used or inferred

- **`VOICE.md` substantive** → draft to it directly: register, banned words,
  sentence rhythm, address form.
- **`VOICE.md` absent / stub** → infer a register from `CLIENT_CONFIG.md` (the
  business description), the brief, and the content type's norm. State the
  inference plainly — *"No `VOICE.md`; I'm writing in a plain, peer-professional
  register inferred from your brief — correct me if that is wrong."* Keep the
  inferred voice **conservative**: plain, concrete, declarative. An inferred
  voice never reaches for a strong stylistic signature — that is a real
  `VOICE.md`'s job.

---

## §4 — Per-type default structures

When `--framework` is omitted and the `content-system/frameworks/` library is not
present (an un-onboarded folder), use these built-in defaults. When the library
*is* present, prefer its `content-types/<type>.md` `default-structure`.

| `--type` | Default structure | Sections |
|---|---|---|
| `linkedin-post` | hook → insight → CTA | Hook (lands above the ~3-line fold) · context · one insight · soft CTA. 120–280 words. Short paragraphs, no heading markup, 3–5 hashtags max at the end. |
| `blog-post` | title → intro → body → close | SEO-aware title · intro that states the payoff · 2–4 body sections with headings · a close that resolves, not upsells. 600–1200 words. |
| `email` | subject → context → one thing → CTA → sign-off | Subject (30–55 chars) · preheader · one-reason context · the single ask · one CTA · sign-off. Plain, scannable, no heading markup. |
| `reference` | proof piece — situation → work → result | The real situation · what was done · the verifiable result · a quoted line if one exists. Never invent the result — see §6. |

A type the framework library defines but this table does not → follow the
library's `content-types/<type>.md` and its `default-structure`.

---

## §5 — The cliché guard (used when there is no `VOICE.md`)

When `brand/VOICE.md` exists, its banned-words list is authoritative. When it
does **not**, scan the draft against this generic guard and rewrite every hit —
these are the marketing-flavour constructions that read as AI-generated filler:

- **Empty intensifiers** — "game-changing", "revolutionary", "cutting-edge",
  "world-class", "best-in-class", "next-level", "unlock", "supercharge",
  "elevate", "seamless", "robust", "leverage" (as a verb).
- **Hype openers** — "In today's fast-paced world", "Imagine a world where",
  "We're thrilled / excited to announce".
- **Flatter-the-reader** — "savvy", "discerning", "for those who demand".
- **Hollow closers** — "the possibilities are endless", "the sky's the limit",
  "take it to the next level", a rhetorical-question close with no answer.
- **Nominalisation chains** — "the utilisation of", "the implementation of" —
  prefer the verb.

The guard is a floor, not a substitute for a real `VOICE.md` — say so in the run
summary when it was used.

---

## §6 — The honest-claims check

A draft built on thin context must not fabricate. Before write:

- Every **product fact** (price, feature, guarantee, availability, a result /
  metric) must trace to `content-system/products.md`, `CLIENT_CONFIG.md`, or the
  brief. A fact with no source is **softened to a non-claim** ("…", left for the
  user) or cut — never invented.
- A `reference` piece with no real, supplied result is not drafted as a proof
  piece — tell the user it needs the actual outcome, or re-type it to `blog-post`.

---

## §7 — The draft pass

1. Compose the piece — brief + assembled context + the resolved structure (§4 or
   the custom framework, see `custom-framework.md`).
2. Tag a pillar **only if** a `content-system/[<bu>/]pillars.md` exists and the
   topic fits one; otherwise leave `pillar:` blank — `aos-write` does not invent
   a pillar taxonomy.
3. Run the guardrails (SKILL.md Step 4 — banned-words/cliché §5, register,
   completeness, honest-claims §6). Rewrite every hit before presenting.
4. Present the draft + the context level. Accept / Revise / Regenerate. Write
   only on Accept.
