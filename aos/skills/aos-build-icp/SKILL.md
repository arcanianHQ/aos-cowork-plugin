---
name: aos-build-icp
description: Build the Ideal Customer Profile for a client — the named segments, each with a demographic shell, a psychographic anchor, the job-to-be-done, the awareness/buying stage, and an explicit "who this is NOT for". Produces brand/ICP.md, the audience foundation every content and positioning skill filters through. Trigger on 'define the ICP', 'who is the customer', 'build the persona', or when ICP.md is a stub.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L0, L1, L6]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder)"
inputs:
  - client/CLIENT_CONFIG.md
  - brand/ICP.md (existing state — stub or filled)
  - brand/BELIEF_PROFILE.md (the decision-maker's value beliefs, if present)
  - brand/7LAYER_DIAGNOSTIC.md (L6 audience findings, if present)
  - inbox/**/*.md (harvest pool — strategy, transcripts, correspondence, research; especially testimonials, support threads, sales-call notes, analytics segment exports)
outputs:
  - brand/ICP.md (canonical profile slot consumed by aos-build-brand-system)
preflight:
  - client-config
ontology:
  consumes: [Layer, Belief, ICP, FND]
  emits: [ICP]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-onboard
tags: [intelligence, icp, persona, audience, L6, brand-profile]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

Build the **Ideal Customer Profile** — the named segments of people this business
is *for*, each profiled deeply enough that a content, positioning, or offer skill
can write *to* them rather than *about* them.

`aos-build-icp` is a **dedicated brand-file skill** — the deep, single-file
counterpart to `aos-build-brand-system`'s inline ICP pass. Where the orchestrator
drafts a thin ICP from whatever harvest is at hand, this skill builds `ICP.md` to
its full substance: real segments, the job each hires the product to do, and the
boundary that says who the brand will **not** serve.

**Why this is foundational.** The ICP sits at the audience layer (**L6**) but it
is consumed everywhere upstream: positioning is positioning *against an audience*,
voice is register *fit to an audience*, an offer is risk-reversal *for an
audience*. An ICP that is a demographic shell with no JTBD and no "not-for"
boundary produces brand work that tries to speak to everyone — and reaches no one.

**The discipline:** an ICP is defined as much by its **exclusions** as its
inclusions. The "who this is NOT for" section is not optional politeness — it is
the part that makes the rest of the profile load-bearing.

**Anti-goal.** `aos-build-icp` does not map the full input→output process of a
team (that is `aos-map-jtbd` / the JTBD-mapping skill); it does not build the
offer (`aos-build-offer`) or the positioning (`aos-build-brand-system`). It builds
**one file** — `brand/ICP.md` — well.

## Posture

Discovery, not pronouncement. Segments are surfaced as drafts grounded in cited
evidence — *"this is the segment the evidence describes; is this who you actually
want?"* — never as a verdict. Present the full draft for the user to correct, and
end the file with *"What did we get wrong? What's missing?"*

## Output contract

This skill writes exactly one file: `brand/ICP.md`, built to
**`reference/output-template.md`** (which mirrors the `aos-build-brand-system`
file-template). It must clear the **FILLED** threshold in
`aos-build-brand-system/reference/file-substance-criteria.md` → ICP.md:

- ≥2000 bytes
- ≥1 named primary segment, ≥1 named secondary segment **or** an explicit
  single-segment justification
- Per segment: demographic shell + psychographic anchor + JTBD (the job they
  hire the product / service to do) + awareness / buying stage
- A "Who this is **NOT** for" section — even one paragraph
- Cites sources (analytics segments, support tickets, sales-call notes, founder
  quotes, testimonials)

If the harvest yields **fewer than one substantive segment description**, do not
fabricate a profile — tell the user the material is too thin and route to the
JTBD-mapping skill (`aos-map-jtbd`) to build the segment ground-up, or ask for
testimonials / sales-call notes / analytics segments.

## Arguments

This skill operates on the **granted folder** — which is the client's folder.
There is no client-slug argument: the granted-folder root is the working
directory and client identity is read from `client/CLIENT_CONFIG.md` / `AOS_CONFIG.md`.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, the folder hasn't been onboarded — suggest running `aos-onboard`.
3. **Pre-read `brand/ICP.md`** — even if it is a stub. The Write tool refuses to overwrite a file that has not been Read in-conversation; a stub returns its TODO placeholder, and that is fine — the Read satisfies the harness rule.
4. If `brand/BELIEF_PROFILE.md` is FILLED, read its value-beliefs section — the decision-maker's beliefs about *who is a good customer* shape (and sometimes distort) the ICP. If `brand/7LAYER_DIAGNOSTIC.md` is FILLED, read its L6 audience section.

### Step 1 — Harvest audience evidence

Scan the `inbox/` zone (`inbox/**/*.md`, excluding `inbox/_processed/`) plus any markdown elsewhere in the granted folder outside `brand/`. Gather four evidence streams — the classification patterns are in `reference/icp-method.md`:

1. **Customer-description evidence** — strategic-plan "target audience" sections, sales / support docs describing customer types, founder statements ("our customer is…", "they buy because…").
2. **Voice-of-customer evidence** — testimonials, reviews, support threads, sales-call notes. The customer's *own words* about their problem are the gold standard for the JTBD and the psychographic anchor.
3. **Behavioural evidence** — analytics / GA4 audience segments, purchase-pattern notes — who actually buys, as distinct from who the founder pictures.
4. **Anti-customer evidence** — refunds, bad-fit complaints, "this client was a nightmare" notes — the raw material for the "not-for" boundary.

Tag every evidence item with its source `file:line`.

### Step 2 — Identify the segments

From the evidence, name the segments — the method (segment vs persona, the single-segment test, primary/secondary ranking) is in `reference/icp-method.md`. A **segment** is a group that hires the product for the *same job* with the *same buying behaviour*; do not split one segment into two on a demographic difference that does not change the job. Rank: **primary** (the segment the business is built for) and **secondary** (real, served, but not the centre). If the evidence supports only one genuine segment, say so explicitly and justify it — a forced secondary segment is worse than an honest single-segment ICP.

### Step 3 — Profile each segment

For each segment, complete the four required dimensions (per-dimension prompts in `reference/icp-method.md`):

- **Demographic shell** — the outer facts: role, business type / life stage, scale, geography, budget band. The shell *locates* the segment; it does not define it.
- **Psychographic anchor** — what this segment *believes* and *values* about the problem — the disposition that actually drives the buy. This is the load-bearing dimension.
- **JTBD** — the job they hire the product / service to do, in their own words where the harvest gives them. Functional job + the emotional / social job alongside it.
- **Awareness / buying stage** — where they are when they meet the brand (problem-unaware → solution-aware → product-aware), and how they research and decide.

### Step 4 — The "not-for" boundary

Write the **"Who this is NOT for"** section from the anti-customer evidence and the inverse of the segment definitions. Name the adjacent audiences the brand will be tempted to chase and should not — the wrong-budget buyer, the wrong-job buyer, the high-support low-value buyer. A line here that costs the brand a tempting-but-wrong segment is the section working.

### Step 5 — Surface as a draft, then write

Present the full draft to the user — **Accept** / **Revise** (user edits inline) / **Regenerate** (user supplies a correction direction). Only on Accept (or post-Revise) write `brand/ICP.md`, using the frontmatter block from `reference/output-template.md` (`scope`, `client`, the standard provenance block, `sources_consulted`, `status`, `needs_refresh_by` = generated_date + 180 days). End the file with the mandatory footer line: *"What did we get wrong? What's missing?"*

## Provenance

Every artifact this skill writes carries the **standard provenance block** in
its frontmatter — see `docs/artifact-versioning.md` §1. Stamp all four fields:

```yaml
generated_by: <this skill's name>      # the name: frontmatter value
skill_version: <this skill's version>  # the version: frontmatter value
generated_date: <YYYY-MM-DD>           # the date written
aos_schema: <schema-version>           # read from AOS_CONFIG.md
```

Never hard-code `skill_version` or `aos_schema` — read them at write time.

## Hard rules

1. **Cite every segment.** Each segment's dimensions trace to evidence (`file:line`) — a testimonial, a sales note, an analytics segment, a founder quote. A dimension with no evidence is marked *"not yet evidenced"*, never guessed.
2. **The "not-for" section is mandatory.** An ICP with no exclusion boundary is not FILLED — it is a wish list. Refuse to mark the file complete without it.
3. **No invented segments.** If the harvest supports one honest segment, write one — do not manufacture a secondary segment to look thorough.
4. **JTBD in the customer's words.** Where the harvest gives voice-of-customer language, the JTBD quotes it. Do not paraphrase the customer into marketing language.
5. **Discovery, not pronouncement.** Segments are drafts for the user to correct, not verdicts. User confirms before any write — Accept / Revise / Regenerate.
6. **Single client.** Operate only within the granted folder; never reach outside it for a "comparable" ICP.

## Output Sections

Final user-facing output:

- **Harvest summary** — evidence streams found, segment-description count, source files
- **Segments identified** — primary / secondary, with the ranking rationale
- **Per-segment profile** (drafts) — the four dimensions each
- **Who this is NOT for** (draft)
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder); `aos-build-belief-profile` (the decision-maker's value beliefs frame who they see as a good customer); `aos-diagnose-7layer` (its L6 audience findings seed the segments); the JTBD-mapping skill when the segment ground is too thin to start from.
- **Downstream:** `aos-build-brand-system` consumes `brand/ICP.md` as a profile slot; `aos-analyze-competition` reads it (who counts as a competitor depends on who the customer is); `aos-build-offer` reads the JTBD and buying stage; `aos-draft-content` and `aos-write` read it for audience fit; `aos-review` checks content against it.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-789, Milestone 4 feature wave). The dedicated ICP brand-file skill — the deep counterpart to `aos-build-brand-system`'s inline ICP pass. Segment-identification heuristics and the JTBD prompts likely need refinement after first real runs.
- **v1.0.0** — promotion criterion: 3 clients profiled end-to-end, each producing an `ICP.md` that materially sharpens downstream content / positioning / offer work.

**What did we get wrong? What's missing?**
