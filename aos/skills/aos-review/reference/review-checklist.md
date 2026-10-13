---
scope: int-company
---

# Review checklist — the three contracts, the deliverable check, and the verdict rule

Companion to `aos-review/SKILL.md`. The deterministic per-check procedure and the
`PASS` / `REVISE` / `BLOCK` decision rule. The SKILL.md names the checks;
this file is *how* each one is run.

A check produces **issues**. Each issue carries:

- a **location** — file:line in the reviewed piece;
- a **class** — `REVISE` (fixable in place) or `BLOCK` (structural — revision
  cannot fix it);
- the **contract line it fails** — quoted from the brand / content-system file.

---

## §1 — Brand adherence

Checks the piece against `brand/VOICE.md` and `brand/POSITIONING.md`.

### 1a — Voice

Run, in order:

1. **Banned-words scan.** `brand/VOICE.md` carries a banned-words / banned-phrase
   list (the register's "never say this"). `grep` the piece for each. Every hit
   is an issue, class `REVISE`. This is the same scan `aos-draft-content` and
   `aos-distribute` run — `aos-review` runs it again as the independent gate.
2. **Register test.** Read the piece against `brand/VOICE.md`'s register
   description (formality, person, sentence shape, energy). A passage that breaks
   register — corporate filler in a plain-spoken brand, hype in a measured one —
   is an issue, class `REVISE`. Quote the off-register passage and the register
   line it fails.
3. **Sentence-shape test.** If `brand/VOICE.md` specifies sentence-shape rules
   (max length, no nominalisation chains, active voice), scan for violations.
   Class `REVISE`.

A voice issue is almost always `REVISE` — voice is fixable line by line. It is
`BLOCK` only if the *entire piece* is in the wrong voice (it reads as a different
brand) — that is a re-draft, not an edit.

### 1b — Positioning

Run, in order:

1. **Assertion test.** Does the piece *say what this brand is*? A piece that
   could be any competitor's — that asserts no `brand/POSITIONING.md` identity —
   is weak. Class `REVISE` (a positioning line can be worked in).

   **Series-beat exception.** If the piece carries `series_framework:` and
   `beat:` frontmatter, read the beat's role *before* applying the assertion
   test. Some beats deliberately withhold the brand: a Before-After-Bridge
   **"Before"** beat (the pain, before the brand enters), a Hero's-Journey
   **"Ordinary World" / early-arc** beat. For such an identity-withholding beat,
   asserting no explicit brand identity is the framework working as designed —
   it is **not** an issue. Apply the assertion test to the brand's **worldview**
   instead: the piece must still embody the positioning's underlying belief /
   epistemology (e.g. a measurement-led brand's "Before" beat still frames the
   pain in measurement terms). Worldview present → pass; worldview absent on an
   identity-withholding beat → class `REVISE`. The brand-assertion beats of the
   series (the **"Bridge"**, the Hero's-Journey **"Return"**) still get the full
   identity assertion test.
2. **Contradiction test.** Does any line *contradict* `brand/POSITIONING.md` —
   claim a position the brand has explicitly rejected, target an audience the
   positioning excludes, or compete on an axis the positioning disowns? A
   contradiction is class **`BLOCK`** — shipping it would actively mis-position
   the brand. Quote the contradicting line and the positioning line it breaks.

---

## §2 — Content-system contract

Checks the piece against its BU's `content-system/` — the per-BU contract. For
multi-BU clients, use the **piece's own BU** folder (`--bu`); never another BU's.

### 2a — On-pillar

1. Read the piece's `pillar` frontmatter field.
2. Verify that value names a real pillar in `content-system/[<bu>/]pillars.md`.
   A `pillar` that names nothing real is an issue, class `BLOCK` (the piece is
   un-anchored).
3. Read the body against the named pillar — does it actually *serve* that pillar,
   or just tag it? A piece tagged to a pillar it does not serve is class `REVISE`
   (re-tag or re-angle).

### 2b — In-register

Check the piece against `content-system/[<bu>/]messaging.md` — the message
hierarchy and register. A piece that pushes a message not in the hierarchy, or
inverts the priority (leads with a tertiary message), is class `REVISE`. Quote
the messaging line.

### 2c — Claim-accurate

For product-tied content (the piece references a product / offer):

1. Read `content-system/[<bu>/]products.md`.
2. Check every **durable product claim** in the piece — feature, price, spec,
   guarantee, comparison — against `products.md`. A claim `products.md` does not
   support is class **`BLOCK`**. Shipping an inaccurate product claim is a
   client-facing factual error — it must not pass. Quote the claim and the
   `products.md` line (or its absence).
3. **Temporal availability claims** — "in stock", "back in stock", "shipping
   now", "sold out", a stated lead time — are **not** product specs and are
   **not** verified against `products.md`. `products.md` is a product-spec
   contract, not live inventory; it carries no stock state and should not. An
   availability claim is verified by **operator confirmation** — or a
   campaign-trigger entry in `CAPTAINS_LOG.md`. Do **not** raise an issue
   against such a claim for "products.md does not support it". Instead record an
   **operator-confirm note** in the review report's Hand-back section ("confirm
   <claim> is live before `aos-distribute` ships"). The verdict is unaffected —
   an otherwise-clean piece still earns `PASS` with the operator-confirm note
   attached. (It becomes an issue only if the claim is internally contradictory
   or contradicts a durable `products.md` fact.)

A piece with no product claim skips 2c — note "n/a, no product claim" in the
report.

---

## §3 — Completeness

Checks the piece is *finished*.

1. **Placeholder scan.** `grep` the piece for `TODO`, `TK`, `XXX`, `[placeholder]`,
   `[...]`, `FIXME`, `<` + `>` placeholder tokens, and empty-section markers
   (a heading with no body under it). Every hit is class `BLOCK` if it is a
   missing *section*, `REVISE` if it is an inline gap.
2. **Structure-coverage test.** Identify the piece's content type and its
   structure (from `content-system/frameworks/content-types/` and
   `frameworks/structures/`). Verify every section the structure calls for is
   present **and substantive** (not a one-line stub). A missing or stub section
   is class `BLOCK`.
3. **Frontmatter + provenance.** The piece must carry complete content-piece
   frontmatter and the **provenance block** (`generated_by`, `skill_version`,
   `generated_date`, `aos_schema` — see `docs/artifact-versioning.md` §1). A
   missing provenance block is class `REVISE` (it can be stamped); missing core
   frontmatter (`content_type`, `pillar`) is class `BLOCK`.

---

## §4 — Deliverable writing (deliverables only)

Runs when `--piece` is a **deliverable** — a path under `deliverables/` or
`campaigns/`, or any summary, report, plan, brief, pitch or offer. Skipped for a
content piece (note "n/a, content piece" in the report). The rules themselves
live in `docs/deliverable-writing.md`; this section is how they are checked. Do
not restate them in the report — quote the rule number.

### 4a — The seven writing rules (summaries and reports — doc §1)

Read every sentence that reports a result and check:

1. **Base named** — every comparison names what it compares against (*"than the
   same 60 days of last year"*). A bare *"above last year"* / *"up 12%"* is an issue.
2. **One comparison per sentence** — and the "why it changed" explains the same
   comparison as the "where we are", or says explicitly that it switches.
3. **Corrections announced** — a figure that replaces an earlier one first
   states what was claimed and where.
4. **Platform named** — *conversions*, *leads*, *sessions*, *ROAS* each carry
   their platform (Google Ads / GA4 / Meta Ads / CRM).
5. **Labels defined** — every label (budget levels, segment names, grades) is
   defined at first use in this document.
6. **Own changes not blamed unchecked** — a deliberate change of ours listed
   under "what went wrong" without a check showing it hurt is an issue; it
   belongs under "to check", with the deciding check named.
7. **Who did what** — a process failure names the role and the action (handed
   to sales, closed lost, no reason recorded by sales), not *"was lost"*.

### 4b — Goal and context (proposals and plans — doc §2)

1. The document opens with the client's **goal and situation** in two or three
   sentences.
2. Each recommendation states **which goal it serves** and **what evidence it
   rests on**.
3. No recommendation is compressed to a single detail that loses the goal.

### 4c — Evidence and source of record (doc §3, §4)

1. Nothing graded *strong* rests on one day or a single-digit sample.
2. A claim that turns on an unknown fact reads *"open — decided by …"*.
3. No lesson is drawn from an event whose dates and content are unknown.
4. A conversion-rate order between channels is described as attribution, not
   presented as a lever.
5. Purchase counts and revenue trace to the shop's order export, with GA4
   reconciled against it. A count or revenue conclusion resting on GA4 alone —
   or drawn when the deliverable itself says the order export is missing — is
   an issue.

Every §4 issue is class `REVISE` — each is fixable by rewording, re-grading, or
removing the conclusion. Quote the sentence and the rule (`deliverable-writing
§1.4`) it fails.

---

## §5 — The verdict rule

After all the checks that apply (§1–§3, and §4 for a deliverable), collect every
issue and apply, in order:

1. **Any issue of class `BLOCK`** → verdict is **`BLOCK`**. The piece has a
   structural fault revision cannot fix in place — it must not ship; the fix is
   upstream.
2. **Else, any issue at all (all class `REVISE`)** → verdict is **`REVISE`**.
   The piece is fixable — hand back to `aos-draft-content` with the issue list;
   re-review after.
3. **Else, zero issues** → verdict is **`PASS`**. The piece holds to all three
   contracts — cleared for `aos-distribute` to ship.

The rule is mechanical and is not softened. A piece is `PASS` only with **zero**
issues. One banned-word hit makes it `REVISE`. One inaccurate product claim makes
it `BLOCK`. The verdict is the skill's read and the user can override it — but the
skill never reports `PASS` with an open issue.

### Degraded review

If `brand/VOICE.md` or `brand/POSITIONING.md` is missing/stub and the user
accepted a degraded **completeness-only** review (SKILL.md Step 0.5): run **§3
only** (plus §4 for a deliverable — it needs no brand profile), skip §1 and §2, and label the report `DEGRADED — completeness-only`. A
degraded review can never return `PASS` — its best verdict is `REVISE — full
review blocked on brand profile`, because brand adherence was never checked.
