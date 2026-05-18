---
name: aos-review
description: "Review workflow — the quality gate before an artifact moves draft → in-review / published. Checks a content piece (or deliverable) against the brand profile (voice + positioning adherence), its BU's content-system contract, and completeness, then issues a PASS / REVISE / BLOCK verdict with a review report. Also runs the calibration store-back: a REVISE/BLOCK routes corrections into the foundations, and a client-accepted piece flows its voice + winning structure back into brand/VOICE.md and the pattern library. The plugin analogue of the ADF verification gate. Trigger on 'review this', 'check this before publish', 'is this ready to ship', when a piece is marked client-accepted, or before aos-distribute advances a piece."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: quality
layer: [L6, L7]
client-scope: single-client
version: 0.2.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "--piece=<path-or-slug under content/> [--bu=<bu-slug>] [--accepted] — operates on the granted folder; reviews one artifact, or runs the accept-door store-back"
inputs:
  - client/CLIENT_CONFIG.md
  - content/ (the artifact under review — a single piece or a series piece)
  - content/CATALOGUE.md (the piece's current status — read; never advanced by this skill)
  - brand/VOICE.md (required — the voice contract checked for adherence)
  - brand/POSITIONING.md (required — the positioning the artifact must stay true to)
  - brand/ICP.md (who the artifact is for — audience-fit check)
  - content-system/[<bu>/]messaging.md (the messaging / register contract)
  - content-system/[<bu>/]pillars.md (the pillar the piece claims — on-pillar check)
  - content-system/[<bu>/]products.md (for product-tied content — claim accuracy)
outputs:
  - deliverables/<YYYY-MM>/review-<piece-slug>.md (the review report — verdict + checklist)
  - ontology/findings/FND-NNN-*.md (a recurring quality finding worth carrying forward — only when one is genuine)
  - ontology/gotchas/GOT-NNN-*.md (a recurring failure pattern worth recording — only when one is genuine)
  - brand/VOICE.md · brand/POSITIONING.md · brand/ICP.md (calibration store-back — proposed, user-confirmed)
  - content-system/[<bu>/]messaging.md · pillars.md (calibration store-back — proposed, user-confirmed)
  - the pattern library maintained by aos-build-patterns (accept-door pattern store-back — proposed, user-confirmed)
preflight:
  - client-config
ontology:
  consumes: [Content, Layer]
  emits: [FND, GOT]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-draft-content
  - aos-build-brand-system
  - aos-build-patterns
tags: [review, quality, qa, verification, gate, content, loop, calibration]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `content/`, `content-system/`, `brand/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content/<bu>/`, `content-system/<bu>/`) *are* a legitimate layout level for multi-BU clients. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write the review report in `communication-language` (it is an internal QA artifact, read by the operator). The artifact *under review* is in `content-language`, and the voice / register checks are run against that language.

## Purpose

`aos-review` is the **quality gate of the AOS loop** — it sits between content
and distribution:

```
onboard → catalogue → discover → brand → plan → content → REVIEW → distribute → measure → FND ↺
```

Before an artifact moves `draft → in-review / published`, `aos-review` checks it
against three contracts and issues a verdict:

1. **Brand adherence** — does the piece hold to `brand/VOICE.md` (register,
   banned words, sentence shape) and `brand/POSITIONING.md` (does it say what
   this brand is, and not contradict the positioning)?
2. **Content-system contract** — does the piece honour its BU's
   `content-system/` — on an actual `pillars.md` pillar, in the
   `messaging.md` register, with `products.md`-accurate claims?
3. **Completeness** — is the piece *finished* — no TODO markers, no placeholder
   text, no empty sections, the content-type structure fully populated, frontmatter
   and provenance block present?

This is the **plugin analogue of the ADF verification gate** — the lint →
type-check → unit → integration → business-validation chain that the Arcanian
Development Framework runs before a task is marked done. AOS content has no
compiler; `aos-review` is the equivalent quality bar, expressed against the brand
and content-system contracts instead of code.

**Anti-goal.** `aos-review` does not *draft* and does not *rewrite* — that is
`aos-draft-content`. It does not *ship* and does not advance `content/CATALOGUE.md`
status — that is `aos-distribute`. It **checks and reports**: it produces a
verdict and a review report, and on `REVISE` / `BLOCK` it hands the piece back to
the drafting skill. It is the inspector, not the author and not the shipper.

## Posture

Discovery, not pronouncement — even here. The review report names what fails and
why, with the contract line it fails against quoted, and ends with *"What did this
review get wrong? What did it miss?"* A review is a recommendation to a human, not
an automated reject. The verdict is the skill's read; the user decides.

## The verdict — PASS / REVISE / BLOCK

Every review ends in exactly one verdict:

- **PASS** — the piece holds to all three contracts. It is cleared to move to
  `in-review` / `published`. `aos-review` does not itself advance the status —
  it clears the piece and hands back to `aos-distribute`.
- **REVISE** — the piece has fixable issues (a voice slip, an off-register line,
  a missing section). The report lists each issue with the contract line it
  fails. Hand back to `aos-draft-content` for revision; re-review after.
- **BLOCK** — the piece has a structural fault that revision cannot fix in place:
  it is off-positioning, makes a `products.md`-inaccurate claim, sits on no real
  pillar, or is materially incomplete. It must not ship. The report says what is
  structurally wrong; the fix is upstream (re-draft, or fix the content-system).

A verdict is never softened: a piece with one banned-word hit is `REVISE`, not
`PASS with a note`. The gate is the gate.

## The calibration loop — bidirectional store-back

A verdict is not the end. Every review **writes back into the foundations** — a
draft is disposable; the foundation (`brand/`, `content-system/`, the pattern
library) is the asset. One loop, two doors:

- **The reject door** (`REVISE` / `BLOCK`) — the corrections are diagnosed to the
  *foundation* that was wrong, proposed **into that foundation**, and the piece
  is re-drafted from the corrected foundation — never patched in place.
- **The accept door** (`status: client-accepted`) — the accepted artifact is a
  **gold reference**: its realised voice and winning structure are stored back
  into `brand/VOICE.md` and the pattern library. A client-accepted piece
  **outranks** the originally-drafted `VOICE.md`.

This is what makes the system **compound** — every accepted piece leaves the
next client's first draft measurably better. Mechanically realised in Step 5.

### Foundation routing table

| A correction about… | Routes to… |
|---|---|
| voice, tone, register, archetype, banned phrasings | `brand/VOICE.md` |
| post structure, length, section order, opening style | the post-type spec — a client-level override if the structure fix is client-specific |
| messaging, pillars, claims, what to say | `content-system/[<bu>/]messaging.md` · `pillars.md` |
| who it's for / segments | `brand/ICP.md` |
| positioning | `brand/POSITIONING.md` |
| language nativeness (AI-Hungarian etc.) | `aos-localize-hu` handles it; if systemic, note it in `brand/VOICE.md` |

### Provenance

Every stored-back rule or pattern carries a `validated-by:` line naming the
artifact it came from — e.g. `validated-by: content/<bu>/<accepted-piece>.md`.
`VOICE.md` and the pattern library become **evidence-backed**: a later accepted
piece that contradicts a rule supersedes it cleanly — newest accepted wins, keep
the lineage. Ties to the `aos-back-statements` provenance discipline.

### Guardrails

- **Propose, never silently overwrite** — the same confirmation gate as
  `aos-build-brand-system`. Every foundation edit is shown and Accepted first.
- **Write to foundations, never patch the draft in place.**
- **Refine, don't replace** — one accepted artifact *refines* `VOICE.md`; it
  does not rewrite it wholesale.
- **Don't over-fit** — one accepted piece is one data point. Tag it; let rules
  accumulate evidence. Conflicting accepts trigger a human reconciliation, not an
  auto-merge.

## Arguments

This skill operates on the **granted folder** — which is the client's folder.

- `--piece` (required) — the artifact to review: a path or slug under `content/`
  (a single piece, or a piece inside a `<series-slug>/` folder). May also be a
  path under `deliverables/` to review a deliverable.
- `--bu` (required if the client uses per-BU content) — BU slug. If
  `content-system/` contains subfolders with their own `messaging.md`, the skill
  refuses to run without this flag — it cannot check the contract without knowing
  which BU's contract applies.
- `--accepted` (optional) — force the **accept-door** store-back (Step 5) on the
  piece even if its frontmatter `status:` is not yet `client-accepted`. Normally
  the door is chosen automatically from `status:` — see Step 0.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — the folder is not onboarded; suggest `aos-onboard`.
3. Detect per-BU layout — `ls content-system/*/messaging.md`. If any match, `--bu` is required; abort with the BU list if missing.
4. Resolve and **Read** the `--piece` file. Verify it exists and has content-piece (or deliverable) frontmatter. If it is a stub, empty, or missing — abort with a clear message; there is nothing to review.
5. **Pre-read the contract files** — `brand/VOICE.md`, `brand/POSITIONING.md`, `brand/ICP.md`, and the BU's `content-system/[<bu>/]messaging.md` · `pillars.md` · `products.md`. If `brand/VOICE.md` or `brand/POSITIONING.md` is a stub or missing, the review cannot be run to standard — state this and recommend `aos-build-brand-system` first; offer a **degraded completeness-only review** the user can accept explicitly.
6. **Determine the door.** Read the piece's frontmatter `status:`. If it is
   `client-accepted` (or `--accepted` was passed), this is an **accept-door**
   run — skip the verdict (Steps 1–4) and go straight to Step 5's accept door.
   Otherwise, run the verdict review (Steps 1–4); Step 5's reject door fires if
   the verdict is `REVISE` / `BLOCK`.

### Step 1 — Brand adherence check

Check the piece against the brand contract. The full per-check procedure — the
voice register test, the banned-words scan, the positioning-contradiction test —
is in `reference/review-checklist.md` §1.

- **Voice** — register, sentence shape, banned words from `brand/VOICE.md`. Every
  banned-word hit and every off-register passage is logged with its line.
- **Positioning** — does the piece *assert* the `brand/POSITIONING.md` identity,
  and does any line *contradict* it (claim a position the brand has rejected)? A
  contradiction is a `BLOCK`-class issue.

### Step 2 — Content-system contract check

Check the piece against its BU's `content-system/`. Procedure in
`reference/review-checklist.md` §2.

- **On-pillar** — the piece's `pillar` frontmatter names a real `pillars.md`
  pillar, and the body actually serves it.
- **In-register** — the piece holds the `messaging.md` register and message
  hierarchy.
- **Claim-accurate** — for product-tied content, every product claim is
  `products.md`-accurate. An inaccurate claim is a `BLOCK`-class issue.

### Step 3 — Completeness check

Check the piece is *finished*. Procedure in `reference/review-checklist.md` §3.

- No `TODO`, `TK`, `[placeholder]`, `XXX`, or empty-section markers.
- The content-type structure (per `content-system/frameworks/`) is fully
  populated — every section the structure calls for is present and substantive.
- Frontmatter is complete and the **provenance block** is present and stamped
  (`generated_by`, `skill_version`, `generated_date`, `aos_schema`).

### Step 4 — Verdict, report, emit

1. **Decide the verdict** — `PASS` / `REVISE` / `BLOCK` — by the rule in
   `reference/review-checklist.md` §4 (any `BLOCK`-class issue → `BLOCK`; else any
   issue → `REVISE`; else `PASS`).
2. **Write the review report** to `deliverables/<YYYY-MM>/review-<piece-slug>.md`
   using `reference/review-report-template.md`. Resolve the `deliverables` zone
   via `AOS_CONFIG.md`. The report carries the verdict, the per-check results,
   every issue with the contract line it fails, and the hand-back target.
3. **Emit ontology artifacts — only when genuine.** If the review surfaces a
   *recurring* quality problem (the same voice slip across several pieces, a
   content-system gap), write an `FND` to `ontology/findings/`. If it surfaces a
   *recurring failure pattern* worth warning future drafting against, write a
   `GOT` to `ontology/gotchas/`. A one-off issue on a single piece is **not** an
   FND — it lives in the review report only. Use the FND/GOT frontmatter from
   `ontology/README.md`; **dedup first** against existing `ontology/`.
4. **Present the verdict + report to the user before writing** — Accept / Revise
   the verdict / Regenerate. Never advance `content/CATALOGUE.md` status — that is
   `aos-distribute`'s job; this skill clears or holds the piece, it does not ship.

### Step 5 — Calibration store-back

The verdict is not the end — every review writes back into the foundations (see
"The calibration loop"). Which door runs is set in Step 0.

**Reject door** — runs when the verdict is `REVISE` or `BLOCK`:

1. Take the human's reasons for the reject — a free-text reaction, or a
   structured set of decisions. The skill accepts **free-text and structures it
   itself** — the operator does not have to fill a form.
2. **Classify** each correction by the foundation it belongs to — the routing
   table above.
3. **Propose** the edit to that foundation file — shown to the user and
   **Accepted before writing**; never silent, and never applied to the draft.
4. Hand the piece back to `aos-draft-content` to **re-draft from the corrected
   foundation** — then re-review. The correction lives in the foundation; the
   improvement is re-derived, not patched.

**Accept door** — runs when the piece is `status: client-accepted` (or
`--accepted`):

1. **Voice store-back** — diff the accepted artifact's *realised* voice against
   `brand/VOICE.md`; propose confirmations / refinements: the proven register,
   the AI-tells that were removed as explicit banned-list entries, naming
   conventions. The accepted artifact outranks the drafted `VOICE.md`.
2. **Pattern store-back** — extract the winning structure (opening style,
   section order, length band, the content-type slots) as a reusable content
   pattern; propose it into the pattern library `aos-build-patterns` maintains,
   tagged *validated*.
3. Every proposed edit carries a `validated-by:` provenance line naming the
   accepted piece, is **proposed + user-confirmed** (the guardrails), and
   **refines** rather than replaces. The accepted draft itself is never modified
   — it is the evidence, not the target.

## Output Sections

The review report's minimum content (template: `reference/review-report-template.md`):

- The piece reviewed (path, current status) and the contracts checked
- **Verdict — PASS / REVISE / BLOCK** stated up front
- Brand adherence — voice + positioning results, each issue with its line
- Content-system contract — on-pillar / in-register / claim-accurate results
- Completeness — markers, structure coverage, provenance
- Issue list — every issue, its class (`REVISE` / `BLOCK`), the contract line it fails
- Hand-back — where the piece goes next (`aos-draft-content` to revise, `aos-distribute` if PASS)
- **What did this review get wrong? What did it miss?**

## Provenance

The review report this skill writes carries the **standard provenance block** in
its frontmatter — see `docs/artifact-versioning.md` §1. Stamp all four fields:

```yaml
generated_by: aos-review               # the name: frontmatter value
skill_version: <this skill's version>  # the version: frontmatter value
generated_date: <YYYY-MM-DD>           # the date written
aos_schema: <schema-version>           # read from AOS_CONFIG.md
```

Any FND / GOT emitted carries the same block, alongside the ontology frontmatter
from `ontology/README.md`. `content/CATALOGUE.md` is not touched by this skill.
Never hard-code `skill_version` or `aos_schema` — read them at write time.

## Hard Rules

1. **Check, don't author.** `aos-review` produces a verdict and a report. It does not draft and does not rewrite — that is `aos-draft-content`.
2. **Check, don't ship.** It never advances `content/CATALOGUE.md` status — that is `aos-distribute`. On `PASS` it clears the piece; the status move belongs to the shipping skill.
3. **The gate is the gate.** One banned-word hit is `REVISE`, not `PASS-with-a-note`. An off-positioning line or an inaccurate product claim is `BLOCK`. Verdicts are not softened.
4. **No contract, no full review.** If `brand/VOICE.md` or `brand/POSITIONING.md` is missing/stub, a full review cannot run — recommend `aos-build-brand-system`; offer a degraded completeness-only review only with explicit user consent, and label the report degraded.
5. **Per BU.** For multi-BU clients, check against the *piece's own BU* content-system — never another BU's contract.
6. **One-off ≠ finding.** Emit an FND/GOT only for a *recurring* problem. A single-piece issue lives in the review report, not the ontology.
7. **Single client.** Operate only within the granted folder; never reach outside it.
8. **Discovery, not pronouncement.** Present the verdict + report for confirmation before writing; end the report with *"What did this review get wrong?"*
9. **Calibration writes to the foundations, never the draft.** The reject door routes corrections into `brand/` / `content-system/` / the post-type spec and re-drafts from there; the accept door stores voice + structure back to `brand/VOICE.md` + the pattern library. The draft is disposable — never patched in place.
10. **Store-back is proposed, never silent.** Every foundation edit — reject-door or accept-door — is shown and Accepted first; it *refines*, never rewrites wholesale; one accepted piece is one data point — tag it `validated-by:` and let rules accumulate evidence, never over-fit on a single blog.

## Integration

- **Upstream:** `aos-draft-content` (produces the draft this reviews); `aos-build-brand-system` (produces the brand contract this checks against); `aos-route-question` routes "review this" / "is this ready" / "check before publish" / "this piece is accepted" requests here.
- **Downstream:** on `PASS`, `aos-distribute` ships the cleared piece — `aos-distribute` Step 0 checks for a `PASS` review and routes back here if none exists. On `REVISE` / `BLOCK`, the piece goes back to `aos-draft-content`; re-review after the fix. A recurring FND feeds the next `aos-plan` cycle; a GOT warns future `aos-draft-content` runs.
- **Calibration (Step 5):** the reject door writes corrections into `brand/` / `content-system/` (consumed by the next `aos-draft-content` re-draft); the accept door stores voice back to `brand/VOICE.md` (the contract `aos-build-brand-system` owns) and patterns into the library `aos-build-patterns` maintains — so every accepted piece improves the next client's first draft.

## Versioning

- **v0.2.0** — the **calibration loop** (AOS-843; spec: `COWORK_CALIBRATION_LOOP_SPEC.md`; learning from the 2026-05-14 DeluxeBuilding content session). `aos-review` is now bidirectional — a verdict writes back into the *foundations*, never just the draft. **Reject door:** `REVISE`/`BLOCK` corrections are classified (the routing table) and proposed into `brand/` / `content-system/` / the post-type spec, then re-drafted from there. **Accept door:** a `client-accepted` piece flows its realised voice → `brand/VOICE.md` and winning structure → the pattern library, `validated-by:`-tagged. Step 5 + `--accepted`. This is the system's compounding mechanism.
- **v0.1.0** — initial Cowork-plugin authoring (AOS-738, architecture-gaps §7 / Milestone 1). The quality gate of the AOS loop — the plugin analogue of the ADF verification gate. The checklist thresholds and the `REVISE` / `BLOCK` boundary likely need refinement after first real runs.
- **v0.1.1** — first-run refinements (Milestone 2 / v0.15.0 loop re-test). §2c no longer checks temporal availability ("in stock") against `products.md` — `products.md` is a product-spec contract, not live inventory; availability is operator-confirmed via a Hand-back note, verdict unaffected. §1b assertion test is now series-beat-aware — an identity-withholding beat (BAB "Before", Hero's-Journey early arc) is checked for brand *worldview*, not brand *identity*.

**What did we get wrong? What's missing?**
