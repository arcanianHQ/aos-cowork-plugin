---
name: aos-build-belief-profile
description: Build the belief / fear / JTBD map of a client's marketing decision-makers — identity, capability and value beliefs, fears, and the job each person hires marketing to do. Produces brand/BELIEF_PROFILE.md, the L0 foundation that every downstream brand file filters through.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L0, L1]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder)"
inputs:
  - client/CLIENT_CONFIG.md
  - brand/BELIEF_PROFILE.md (existing state — stub or filled)
  - brand/7LAYER_DIAGNOSTIC.md (L0/L1 findings, if present)
  - inbox/**/*.md (harvest pool — strategy, transcripts, correspondence; especially session logs and meeting transcripts)
  - Existing <person>-belief-profile.md files anywhere in the granted folder
outputs:
  - brand/BELIEF_PROFILE.md (canonical profile slot consumed by aos-build-brand-system)
preflight:
  - client-config
ontology:
  consumes: [Layer, FND, Belief]
  emits: [Belief, FND]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
tags: [intelligence, belief, profile, L0, onboarding]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

Build the **Belief Profile** — the beliefs driving the people who make marketing decisions in this business. Beliefs sit at **L0** in the Marketing Control Framework: the source layer. Every downstream brand file — positioning, voice, offer, the GTM plan — filters through what these people believe about themselves, their capability, and what matters.

**Why this is foundational.** A weak-branding behaviour (won't charge a premium, associates with everyone, churns the message every quarter) is almost never a tactics problem. It traces to a belief the decision-maker holds as *reality*, not as a belief. This skill makes those beliefs visible so the rest of the profile can be built on truth instead of on a symptom.

**The Arcanian principle (Avatar lineage):**
> *Every business result is a creation that reveals the beliefs that created it.*

We work **backwards** — from observable results and the decision-maker's own words to the belief that would have to be true for that result to exist.

**Posture:** Discovery, not pronouncement. Beliefs are surfaced as observations with questions — *"this is what the evidence suggests; is this true?"* — never as a verdict on someone's psychology. Present every profiled belief as a draft for the user to correct.

## Output contract

This skill writes exactly one file: `brand/BELIEF_PROFILE.md`, built to **`reference/output-template.md`** (which mirrors the `aos-build-brand-system` file-template). It must clear the **FILLED** threshold in `aos-build-brand-system/reference/file-substance-criteria.md` → BELIEF_PROFILE.md:

- ≥3000 bytes
- Profile for at least the **primary decision-maker**
- Each profiled person has: identity beliefs, capability beliefs, value beliefs, fears, and the JTBD register (what they hire marketing to do)
- If psychometric data (Kolbe A, Wealth Dynamics, etc.) exists in the harvest → integrated
- Concrete cited quotes from session logs, meetings, or written correspondence

## Arguments

This skill operates on the **granted folder** — which is the client's folder. There is no client-slug argument: the granted-folder root is the working directory and client identity is read from `client/CLIENT_CONFIG.md` / `AOS_CONFIG.md`.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, the folder hasn't been onboarded — suggest running `aos-onboard`.
3. **Pre-read `brand/BELIEF_PROFILE.md`** — even if it is a stub. The Write tool refuses to overwrite a file that hasn't been Read in-conversation. A stub returns its TODO placeholder; that is fine — the Read satisfies the harness rule.
4. If `brand/7LAYER_DIAGNOSTIC.md` exists and is FILLED, read its L0 and L1 sections — they often already name an identity pattern.

### Step 1 — Identify the decision team

Determine **who actually makes marketing decisions** in this business. Read `client/CLIENT_CONFIG.md` and scan the harvest for named people with decision power. For each, classify decision power: **primary** (owns the call), **approver** (signs off), **influencer** (shapes it). The primary decision-maker is mandatory; profile approvers and influencers when the evidence supports it.

If the harvest names no people at all — only "the company" — surface that gap and ask the user who the decision-maker is before drafting. A belief profile of a company is not a belief profile.

### Step 2 — Harvest belief evidence

Scan the `inbox/` zone (`inbox/**/*.md`, excluding `inbox/_processed/`) plus any `<person>-belief-profile.md` files elsewhere in the granted folder. Two evidence streams feed every profiled belief:

1. **Spoken / written evidence** — first-person statements: *"I believe…", "I think…", "what bothers me is…", "we can't…", "our market won't…", "that's just how it is."* Session-log and meeting-transcript quotes are the gold standard — they are voice in the wild.
2. **Result evidence** — observable business results (pricing, visibility cadence, client quality, message churn) read backwards into the belief that would create them.

Use the **result→belief mapping table** and the **linguistic markers** in `reference/belief-method.md` to classify each. Tag every evidence item with its source `file:line`.

If the harvest yields **fewer than 5 direct decision-maker quotes**, the material is too thin — tell the user and ask for session logs, meeting transcripts, or a recorded conversation rather than fabricating a profile. Do not infer a person's fears from a website.

### Step 3 — Profile each decision-maker

For each person, complete the five required dimensions. The method, archetype patterns, and per-dimension prompts are in **`reference/belief-method.md`** — read it before drafting:

- **Identity beliefs** — what kind of person they believe they are in this role.
- **Capability beliefs** — what they believe they can and can't do; the self-imposed ceilings.
- **Value beliefs** — what they believe matters in this business (quality, speed, reputation, margin, control).
- **Fears** — what scares them about the business, the market, their role.
- **JTBD register** — in their own words, the job they hire the marketing function to do.

Then identify the **identity pattern** (Helper/Martyr, Expert/Imposter, Visible/Invisible, Abundant/Scarce, Worthy/Unworthy — see `reference/belief-method.md`) where the evidence supports one, with its asserted pole, resisted pole, and core fear. State the pattern as a hypothesis, never a diagnosis.

### Step 4 — Cross-team and growth-blocking synthesis

If more than one decision-maker is profiled, map where their beliefs **agree** and where they **conflict** — and which conflicts block which marketing decisions (a contradiction between two leaders is itself a constraint). Then list the specific **beliefs that block growth** in the table the template provides. These are the beliefs to surface in coaching or repair work.

### Step 5 — Surface as a draft, then write

Present the full draft to the user with the three options:

- **Accept** — write to `brand/BELIEF_PROFILE.md`
- **Revise** — user edits inline before write
- **Regenerate** — user supplies a correction direction, redraft

Only on Accept (or post-Revise) write the file, with the frontmatter block from `reference/output-template.md` (`scope`, `client`, the standard provenance block — `generated_by`, `skill_version`, `generated_date`, `aos_schema` — `sources_consulted`, `status`, `needs_refresh_by` = generated_date + 180 days). See the **Provenance** section below and `docs/artifact-versioning.md` §1. End the file with the mandatory footer line: *"What did we get wrong? What's missing?"*

## Provenance

Every artifact this skill writes carries the **standard provenance block** in
its frontmatter — see `docs/artifact-versioning.md` §1. Stamp all four fields:

```yaml
generated_by: <this skill's name>      # the name: frontmatter value
skill_version: <this skill's version>  # the version: frontmatter value
generated_date: <YYYY-MM-DD>           # the date written
aos_schema: <schema-version>           # read from AOS_CONFIG.md
```

Add it to whatever domain frontmatter the artifact already carries; never
hard-code `skill_version` or `aos_schema` — read them at write time. This is
what lets a granted folder be migrated when the plugin or schema changes.

## Hard rules

1. **Cite every belief.** Each profiled belief carries a source citation (`file:line`) — a quote or a result. No invented psychology. If a dimension has no evidence, mark it *"not yet evidenced"* — never fill it with a guess.
2. **Discovery, not pronouncement.** Beliefs and identity patterns are hypotheses presented for correction, not verdicts. Never tell the user what their client "is."
3. **User confirms the draft.** No silent write — Accept / Revise / Regenerate is mandatory.
4. **Real people only.** Profile named decision-makers, not "the company." If no person is named in the harvest, ask first.
5. **Single client.** Operate only within the granted folder. Never reach outside it for "comparable" belief profiles.
6. **Confidential by default.** The file is `scope: int-confidential` — it contains sensitive observations about named individuals. Do not echo it outside the engagement.

## Output Sections

Final user-facing output:

- **Decision team** identified (who, decision power)
- **Harvest summary** — quote count, result signals, source files
- **Per-person belief profile** (drafts)
- **Cross-team belief map** (if multiple people)
- **Beliefs that block growth** (the coaching/repair shortlist)
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder); `aos-diagnose-7layer` (its L0/L1 findings seed this profile).
- **Downstream:** `aos-build-brand-system` consumes `brand/BELIEF_PROFILE.md` as a profile slot; `aos-build-brand` reads it when L0/L2 belief blocks resist premium pricing or visibility; `aos-build-offer` reads the value beliefs and fears that shape what the client will let an offer claim; voice work reads it for the why-they-talk-this-way.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring. Grounded in the Arcanian belief methodology (Avatar-lineage belief tracking). Archetype patterns and result→belief tables likely need refinement after first real runs.
- **v1.0.0** — promotion criterion: 3 clients profiled end-to-end, each producing a BELIEF_PROFILE.md that materially sharpens downstream voice / offer / positioning work.

**What did we get wrong? What's missing?**
