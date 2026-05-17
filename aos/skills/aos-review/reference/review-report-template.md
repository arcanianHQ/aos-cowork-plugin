---
scope: int-company
---

# Review report template

Companion to `aos-review/SKILL.md`. The shell for the review report written to
`deliverables/<YYYY-MM>/review-<piece-slug>.md`, and the FND / GOT emission
format. The report is an **internal QA artifact** — written in the
`communication-language`, read by the operator, not delivered to the client.

---

## The review report

````markdown
---
scope: int-confidential
client: <slug>
business_unit: <bu-slug or blank>
artifact: review
reviewed_piece: content/<...>/<piece>.md
reviewed_piece_status: <draft | in-review — the status at review time>
verdict: <PASS | REVISE | BLOCK>
generated_by: aos-review
skill_version: <aos-review version: frontmatter value>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version read from AOS_CONFIG.md>
---

# Review — <piece title>

## Verdict — <PASS | REVISE | BLOCK>

<One line. PASS: cleared for aos-distribute. REVISE: fixable — back to
aos-draft-content. BLOCK: structural fault — fix upstream, must not ship.>

> If degraded: **DEGRADED — completeness-only.** Brand profile incomplete;
> §1 and §2 not checked. Best possible verdict is REVISE.

## Contracts checked

- Brand — `brand/VOICE.md`, `brand/POSITIONING.md`
- Content-system — `content-system/[<bu>/]messaging.md` · `pillars.md` · `products.md`
- Completeness — content-type structure + frontmatter / provenance

## 1 — Brand adherence

**Voice:** <pass / N issues>
**Positioning:** <pass / N issues>

<Per issue — or "No issues.">

## 2 — Content-system contract

**On-pillar:** <pass / issue> · **In-register:** <pass / issue> · **Claim-accurate:** <pass / issue / n-a>

<Per issue — or "No issues.">

## 3 — Completeness

**Placeholders:** <none / N found> · **Structure coverage:** <full / N gaps> · **Frontmatter + provenance:** <complete / issue>

<Per issue — or "No issues.">

## Issue list

| # | Class | Check | Location | Fails contract line |
|---|-------|-------|----------|---------------------|
| 1 | REVISE / BLOCK | voice / positioning / pillar / register / claim / completeness | piece:Lnn | "<quoted contract line>" |

<If zero issues: "No issues — the piece holds to all three contracts.">

## Hand-back

- **PASS** → `aos-distribute` ships the cleared piece.
- **REVISE** → `aos-draft-content` revises against the issue list; re-run `aos-review` after.
- **BLOCK** → fix upstream (re-draft, or correct the content-system); re-run `aos-review` after.

## What did this review get wrong? What did it miss?

<Invite disagreement. The verdict is a recommendation to a human, not an
automated reject.>
````

---

## FND / GOT emission — only for a recurring problem

A one-off issue lives in the issue list above and **nowhere else**. Emit an
ontology artifact **only** when the review surfaces something that recurs across
pieces or is worth warning future drafting against. Dedup against existing
`ontology/` first (SKILL.md Step 4.3).

### FND — a recurring quality finding

Use when the same quality problem appears across several pieces (e.g. "every
LinkedIn piece this month drifts into corporate register"). Frontmatter per
`ontology/README.md`, plus the provenance block:

```yaml
---
id: FND-NNN
layer: L6
business_unit: <bu-slug or blank>
status: open
date: <YYYY-MM-DD>
source: aos-review
consumes: [Content]
emits: []
generated_by: aos-review
skill_version: <aos-review version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version>
---
```

Body: what recurs, the evidence (which pieces / reviews), and the **forward
signal** — a plain statement of what the next `aos-plan` cycle should do with it
(e.g. "messaging.md register guidance is too thin — tighten it").

### GOT — a recurring failure pattern

Use when the review surfaces a *trap* worth warning future `aos-draft-content`
runs against (e.g. "product-claim drift — drafts pull pricing from old
inbox material, not products.md"). Frontmatter as for FND with `id: GOT-NNN`.

Body: the failure mode, what triggers it, and how to avoid it — the "don't" that
sits alongside FND's "learned".
