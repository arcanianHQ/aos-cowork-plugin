---
name: aos-map-jtbd
description: "Map the Jobs-to-be-Done of a client's GTM organisation — survey the marketing team / stakeholders, capture each role's inputs and outputs, and surface the process gaps and hand-off failures between them. Produces a team JTBD map and emits a finding per genuine process gap. Trigger on 'map the team', 'who does what in marketing', 'find the process gaps', 'survey the stakeholders'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder; an interactive survey)"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (multi-BU — roles may differ per BU)
  - inbox/**/*.md (harvest pool — org charts, role descriptions, team-call transcripts, RACI / process docs)
  - ontology/findings/ (prior FNDs — dedup before emitting)
  - the user / the team — the interactive survey is the primary evidence source
outputs:
  - deliverables/<YYYY-MM>/team-jtbd-map.md (the GTM-team Jobs-to-be-Done map)
  - ontology/findings/FND-NNN-*.md (one finding per genuine process gap)
preflight:
  - client-config
ontology:
  consumes: [Layer, FND]
  emits: [FND]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-onboard
tags: [intelligence, jtbd, team, process, roles, discovery]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `inbox/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write the map in `content-language`.

## Purpose

Map the **Jobs-to-be-Done of the client's GTM organisation** — not the customer's
JTBD (that is `aos-build-icp`'s audience job), but the **internal** one: what job
each role in the marketing team is hired to do, what it takes in, what it puts
out, and where the process between them breaks.

`aos-map-jtbd` surveys the marketing team / stakeholders, captures the
**input → role → output** chain for each role, and surfaces the **process gaps**:
the hand-offs where an output nobody owns, an input nobody supplies, or a job two
people both think the other does. Those gaps are the real reason GTM work stalls
— and each genuine one is emitted as a finding for the next plan.

**Why this matters.** AOS is a GTM operating system; it slots into a team that
already exists. Before AOS can improve a client's GTM, it has to know **how that
team actually works** — who produces what, for whom, and where the chain has a
hole. A skill that recommends moves without knowing the org delivering them
recommends into a vacuum.

**Anti-goal.** `aos-map-jtbd` does not define the customer / ICP (that is
`aos-build-icp`) and does not build the brand profile. It maps the **team and its
process** — the people and the workflow, not the market.

## Posture

Discovery, not pronouncement — literally: this skill is a **survey**. It asks,
it does not assert. Role descriptions and process gaps are captured from the
team's own answers and surfaced back as a draft — *"this is the process as you
described it; where did we get it wrong?"* A gap is named as an observation, never
as a judgement on a person.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. If `client/DOMAIN_CHANNEL_MAP.yaml` shows multiple BUs, note it — roles and processes may differ per BU; survey per BU where they do.

### Step 1 — Identify the roles and stakeholders

Determine **who is in the GTM function**. Read `client/CLIENT_CONFIG.md` and scan
`inbox/` for org charts, role descriptions, and team-call transcripts. List every
role that touches go-to-market — internal staff, the founder where they act as a
marketer, external contractors / agencies, and AOS itself if it is already in the
loop. If the harvest names no roles, **ask the user** to list the team before
surveying — a process map of an unknown team is not a map.

### Step 2 — Survey each role (input → output)

For each role, run the survey — the question set is in `reference/survey-method.md`.
Capture, from the team's own answers (or the harvest where it already answers):

- **The job** — what this role is hired to accomplish in GTM, in one line.
- **Inputs** — what the role needs to do its job, and **who supplies each**.
- **Outputs** — what the role produces, and **who consumes each**.
- **Cadence** — how often the role's core output is produced.
- **Tools / surfaces** — where the work happens (channels, tools, docs).

Survey interactively — ask the user role by role; do not invent answers. Where
`inbox/` already answers a question, show the user what you found and ask them to
confirm or correct it rather than re-asking from scratch.

### Step 3 — Map the chain and find the gaps

Assemble the **input → role → output** chain across the team and walk it for
process gaps — the gap taxonomy is in `reference/survey-method.md`:

- **Orphan output** — a role produces something no role consumes.
- **Missing input** — a role needs an input no role supplies.
- **Unowned job** — a job both roles think the other owns (or neither does).
- **Bottleneck** — one role is the single input source for many others.
- **Broken hand-off** — an output exists but reaches its consumer late, in the
  wrong form, or not at all.

Each gap is stated as an observation with the two roles it sits between.

### Step 4 — Synthesise, surface, emit

1. Write the map to `deliverables/<YYYY-MM>/team-jtbd-map.md` using
   `reference/map-template.md` — the role table, the chain, the gap list.
2. **Emit a finding per genuine process gap** — write an `FND` to
   `ontology/findings/` (`source: aos-map-jtbd`, `consumes:` the Layer the gap
   sits in, `emits: []`) so `aos-plan` can act on it. A gap the team already
   knows about and manages is noted in the map but is **not** an FND — only a
   real, unaddressed gap is. Dedup against existing `ontology/findings/` first.
3. Present the map + the gap list to the user — Accept / Revise / Regenerate —
   before writing.

## Provenance

Every artifact this skill writes carries the **standard provenance block** in
its frontmatter — see `docs/artifact-versioning.md` §1. Stamp all four fields
(`generated_by`, `skill_version`, `generated_date`, `aos_schema`); never
hard-code `skill_version` or `aos_schema` — read them at write time.

## Hard Rules

1. **Survey, don't assume.** Role jobs, inputs, and outputs come from the team's
   own answers or the harvest — never invented. An un-answered field is marked
   *"not yet surveyed"*, not guessed.
2. **Map the team, not the market.** Customer / ICP work is `aos-build-icp`. This
   skill maps the GTM organisation's internal jobs and process.
3. **A gap is an observation, not a verdict.** Name the process gap and the roles
   it sits between — never frame it as a person failing at their job.
4. **One FND per genuine gap.** A gap the team already manages is noted, not
   emitted. Only a real, unaddressed gap becomes a finding. Dedup first.
5. **Per BU where the team differs.** If roles / processes differ by BU, survey
   and map per BU — do not flatten two BUs' org into one chain.
6. **Single client.** Operate only within the granted folder.
7. **Discovery, not pronouncement.** Present the map for confirmation before
   writing; end the deliverable with *"What did we get wrong? What's missing?"*

## Output Sections

User-facing summary at end of run:

- Roles surveyed — the GTM team as mapped
- The input → output chain
- Process gaps found — orphan outputs, missing inputs, unowned jobs, bottlenecks, broken hand-offs
- FNDs emitted (one per genuine gap)
- Map deliverable path
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder); `inbox/` org / process material; `aos-route-question` routes "map the team" / "who does what" / "find the process gaps" requests here.
- **Downstream:** the process-gap `FND`s feed `aos-plan` (a process gap is a planning input — sometimes the highest-leverage one); the role map informs `aos-build-brand-system` (who the decision-makers are) and any cadence / routine skill (which role owns which recurring output).

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-791 / F14, Milestone 4 feature wave). Jobs-to-be-Done mapping applied to the GTM organisation. The survey question set and the gap taxonomy likely need refinement after first real runs. ("Jobs-to-be-Done" is used here as a generic methodology term — see `NOTICE`.)

**What did we get wrong? What's missing?**
