---
name: aos-back-statements
description: "Apply evidence-class provenance tags to the material statements in a draft or deliverable — [DATA] / [STATED] / [INFERRED] / [NARRATIVE] — and report unsourced or over-confident claims. Lite tier: granted-folder only, no connector. Trigger on 'tag the provenance', 'back these statements', 'what evidence class is this', or before shipping a client-facing doc that asserts facts."
scope: int-company
flavor: [company, advanced, internal]
class: reading
domain: quality
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Write, Edit]
args-hint: "[--artifact=<path>] [--in-place] — operates on the granted folder; defaults to the artifact the user named or the file just produced this session"
inputs:
  - the target artifact (draft or deliverable under content/, deliverables/, brand/, inbox/, or pasted in chat)
  - inbox/**/*.md (optional — to verify or source claims)
  - ontology/findings/ (optional — prior FNDs referenced in the text)
  - reference/evidence-classes.md (tag definitions and decision tree)
outputs:
  - deliverables/<YYYY-MM>/provenance-<artifact-slug>.md (tagging report — default)
  - the target artifact itself (only when --in-place and the user confirms)
preflight:
  - client-config-soft
ontology:
  consumes: [Content, Deliverable, FND]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [provenance, evidence, quality, trust, statement-backing]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given
access to, which **is** one client's folder (no per-client nesting). The
granted-folder root is the working directory. Resolve zones per
`docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the
granted-folder root. Never hard-code paths beyond the documented zone layout.
Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field
of `AOS_CONFIG.md` — it is never a directory level.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md`
during context assembly (per `docs/language-context.md`) — never hard-code a
language. Talk to the user in `communication-language`; keep tags in the
standard English bracket form (`[DATA]`, etc.) even when the artifact is in
another language.

## Purpose

Client-facing drafts and deliverables often mix **measured facts**, **things
someone said**, **reasonable guesses**, and **stories repeated from earlier
docs**. Without tags, every sentence reads with the same false confidence —
and a claim copied across five files still counts as one unverified story.

`aos-back-statements` is the **lite-tier statement-backing / evidence-provenance
skill** for Cowork. It reads a target artifact, classifies each **material
statement** with its evidence class, and surfaces **unsourced** or
**over-confident** claims — without inventing sources or rewriting the argument.

**Anti-goal.** This skill does not fact-check the open web, does not run
connectors, and does not replace `aos-review` (brand/voice/completeness) or
`aos-measure` (results → findings). It tags and reports — the user decides what
to cut, soften, or go source.

## Posture

Discovery, not pronouncement. Present the tagging read as a draft for the user
to correct — *"What did we get wrong? What's mis-tagged?"* A `[DATA]` tag is
only applied when a real source exists in the granted folder or the session;
never upgrade a guess to look authoritative.

## Evidence classes

Reuse the discipline from `aos-measure` (`reference/measurement-method.md` §
Evidence classes). Cowork lite tier uses **four tags** on arbitrary prose (metrics
skills may also use `[OBSERVED]` where something was directly seen — see
`reference/evidence-classes.md`):

| Tag | Meaning |
|---|---|
| `[DATA]` | A real number or metric — verified export, connector pull, or cited primary source in the granted folder |
| `[STATED]` | The client / user / interviewee said so — not independently verified |
| `[INFERRED]` | A reasoned conclusion from indirect signal — not a fact |
| `[NARRATIVE]` | A story from a prior doc, session note, or institutional memory — **one story in five files is still one claim** |

Keep **data confidence** (is the number real?) separate from **causal
confidence** (does the sentence's "because" follow?). Tag the evidence class on
the claim; note causal overreach separately in the report.

## Arguments

- `--artifact=<path>` — file under the granted folder to tag (required unless the
  user pasted the text in chat or named a file this session).
- `--in-place` — write tags into the artifact body (inline, before each material
  statement or at paragraph end per `reference/evidence-classes.md`). Default
  is a **sidecar report** only; in-place requires explicit user confirmation
  after they see the report.

## Process

### Step 0 — Preflight

1. Resolve the target artifact — `--artifact`, user-named path, or the file
   just produced this session. If none, ask once for the path or a paste.
2. **Read** the artifact in full. If `--in-place` is planned, the Read satisfies
   the harness before any Write/Edit.
3. Note `content-language` and whether the piece is client-facing (stricter) or
   internal (same tags, lighter tone in the report).

### Step 1 — Extract material statements

Walk the artifact and list **material statements** — sentences that assert a
fact, a number, a causal link, or a recommendation grounded in "what we know."
Skip headings, boilerplate, and pure structure. Procedure and heuristics in
`reference/evidence-classes.md` § Material statements.

### Step 2 — Classify each statement

For each material statement:

1. Decide the evidence class using the decision tree in
   `reference/evidence-classes.md`.
2. If a source exists in the granted folder, cite it (`path:Lline` or section).
3. If **no source** exists and the statement presents as fact → flag
   **UNSOURCED** in the report (do not invent a tag that implies verification).
4. If the statement is causal ("X caused Y", "because", "due to") but only
   `[STATED]` or `[NARRATIVE]` backs it → flag **CAUSAL OVERREACH**.

### Step 3 — Produce the report

Write `deliverables/<YYYY-MM>/provenance-<artifact-slug>.md` using this shape:

- **Summary** — counts by tag, unsourced count, causal-overreach count
- **Tagged statements** — table: location · statement (short) · tag · source (or UNSOURCED)
- **Load-bearing risks** — claims that would change the conclusion if wrong
- **Recommended fixes** — soften, cut, source, or run a connector skill (e.g.
  `aos-measure` for metrics) — not rewrites of the whole doc

Surface the report to the user. Ask whether to apply `--in-place` tagging.

### Step 4 — In-place write (optional)

Only after user confirmation:

- Insert tags per `reference/evidence-classes.md` § In-place format.
- Do not change meaning — tags only.
- Re-read the file and confirm every material statement is tagged or explicitly
  marked UNSOURCED in the report.

## Hard Rules

1. **Never invent a source.** No tag implies verification unless a source exists.
2. **Never silently upgrade.** `[INFERRED]` and `[NARRATIVE]` stay honest — do
   not relabel as `[DATA]` to make the doc look stronger.
3. **Narrative repetition ≠ data.** Prior docs, CAPTAINS_LOG, and "we already
   knew" → `[NARRATIVE]`, not `[DATA]`.
4. **Cite when you can.** Every `[DATA]` and most `[STATED]` rows in the report
   carry a `path:line` or session reference.
5. **Sidecar by default.** Do not edit the artifact in place without confirmation.
6. **Single client.** Operate only within the granted folder.
7. **Discovery, not pronouncement.** End with *"What did we get wrong? What's missing?"*

## Output Sections

User-facing summary:

- Artifact path and purpose (client-facing vs internal)
- Tag counts + unsourced / causal-overreach flags
- Report path
- Whether in-place tagging was applied
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** any skill that produces prose (`aos-write`, `aos-draft-content`,
  `aos-plan`, `aos-analyze-gtm`, diagnostics). Run before `aos-distribute` on
  client-facing pieces when provenance was not applied during drafting.
- **Downstream:** `aos-review` (completeness + brand — orthogonal); `aos-measure`
  (uses the same tag discipline on metrics). `aos-route-question` routes
  provenance / "back these statements" requests here.
- **Code tier:** a fuller statement-backing skill exists in Arcanian Code (hub
  methodology + confidence engine). This Cowork skill is the **lite port** —
  tags + report only, no backend.

## Versioning

- **v0.1.0** — initial Cowork lite port (AOS-795). Built from
  `COWORK_FEATURE_CATALOGUE.md` §8 + `aos-measure` evidence-class discipline.
  **Note:** no dedicated `back-statements` skill file was found in
  `~/Sites/_arcanian-ops` or `~/Sites/arcanian-aos/skills` at port time; method
  follows catalogue intent and in-repo measure patterns.

**What did we get wrong? What's missing?**
