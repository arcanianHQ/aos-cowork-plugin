---
name: aos-coach-am
description: "Coach an account manager and red-team their work before it reaches the client — pressure-test the plan, brief, or deliverable: challenge its assumptions, surface blind spots, ask what a sceptical client or a competitor would say, and turn each into a coaching prompt. Produces a coaching / red-team report. Trigger on 'red-team this', 'coach me on this plan', 'pressure-test before the client sees it', 'what am I missing'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: quality
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "--artifact=<path under the granted folder> — the plan / brief / deliverable to red-team"
inputs:
  - client/CLIENT_CONFIG.md
  - the artifact under review — a plan, brief, or deliverable named by --artifact
  - brand/ (POSITIONING, ICP, BELIEF_PROFILE — the strategic frame to test against)
  - deliverables/<YYYY-MM>/gtm-plan.md · ontology/findings/ (what is already known)
outputs:
  - deliverables/<YYYY-MM>/coaching-<artifact-slug>.md (the coaching / red-team report)
preflight:
  - client-config
ontology:
  consumes: [Layer, FND, ICP]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [coaching, red-team, quality, account-manager, review]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`.

## Language

Resolve `communication-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. The coaching report is an internal artifact — written in `communication-language`, read by the account manager.

## Purpose

`aos-coach-am` is the **coaching and red-team** skill — it pressure-tests an
account manager's work *before* the client sees it.

An AM's plan, brief, or deliverable is usually right enough to ship — and that is
the danger: the gaps are the things the AM cannot see *because* they wrote it.
This skill is the second pair of eyes that asks the uncomfortable questions:
which assumption here is load-bearing and unproven? what would a sceptical client
push back on? what would a competitor exploit? what does the brand profile or the
open findings say that this artifact ignores?

It produces a **coaching / red-team report** — every challenge paired with a
coaching prompt, so the AM does not just get a critique, they get a way to think
about it.

This is the **plugin-lite tier** of AM coaching — artifact-by-artifact. The
fuller tiered version (manager dashboards, performance-by-AM) is Code-tier.

**Anti-goal.** `aos-coach-am` does not rewrite the artifact (the AM owns it) and
does not check brand-voice / completeness on *content* (that is `aos-review`). It
red-teams the **thinking** — the strategy, the assumptions, the blind spots.

## Posture

Discovery, not pronouncement — and here it matters most. The report **coaches**,
it does not grade. Every challenge is a question, not a verdict; the AM's
judgement is respected, their thinking is sharpened. The report ends with
*"Which of these challenges did I get wrong?"*

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Read** the `--artifact` in full. If it is a stub or missing, abort — there
   is nothing to red-team.

### Step 1 — Load the frame

Read the strategic frame the artifact should be consistent with: `brand/POSITIONING.md`,
`brand/ICP.md`, `brand/BELIEF_PROFILE.md`, the standing `gtm-plan.md`, and the
open `ontology/findings/`. The red-team tests the artifact against what the
engagement already knows.

### Step 2 — Red-team — the four lenses

Work the artifact through all four lenses:

1. **Assumption lens.** What does this artifact *assume* is true? List the
   load-bearing assumptions. For each — is it evidenced (a FND, a brand-file
   citation, a real number), or asserted? An unproven load-bearing assumption is
   the headline finding.
2. **Sceptical-client lens.** Read the artifact as the client's most sceptical
   stakeholder. Where would they push back? What claim would they not believe?
   What would make them feel sold-to rather than served?
3. **Competitor lens.** What would a competitor do in response to this? What gap
   does it leave open? Where is it a move a competitor would welcome?
4. **What-the-engagement-knows lens.** Does the artifact contradict, or ignore,
   an open `FND`, a brand-profile constraint, or a standing-plan priority?

### Step 3 — Write the coaching report

Write `deliverables/<YYYY-MM>/coaching-<artifact-slug>.md`: per challenge — the
lens, what was found, **how serious it is** (would it change the outcome?), and
a **coaching prompt** — the question that helps the AM resolve it themselves, not
the answer. End with the strongest two or three to act on first, and the
*"Which of these did I get wrong?"* invitation. Present before writing.

## Provenance

The coaching report carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1; never hard-code `skill_version` / `aos_schema`.

## Hard Rules

1. **Coach, don't grade.** Every challenge is a question paired with a coaching
   prompt — never a score, never a verdict on the AM.
2. **Red-team the thinking, not the typography.** Strategy, assumptions, blind
   spots — content-voice / completeness is `aos-review`'s job.
3. **Challenges trace to a lens.** Each challenge names the lens and the evidence
   — no vague "this feels weak".
4. **The AM owns the artifact.** This skill does not rewrite it; it hands back
   sharpened questions.
5. **Single client.** Operate only within the granted folder.
6. **Discovery, not pronouncement.** End the report inviting disagreement.

## Output Sections

- The artifact red-teamed
- Challenges by lens — assumption / sceptical-client / competitor / what-we-know
- The 2–3 to act on first
- **Which of these challenges did I get wrong?**

## Integration

- **Upstream:** `aos-plan`, `aos-plan-campaign`, the diagnostics (the artifacts this red-teams); `aos-route-question` routes "red-team this" / "pressure-test" / "what am I missing" here.
- **Downstream:** the AM revises the artifact against the coaching report; `aos-review` then checks the *content* of any client-facing piece before it ships. The two are complementary — `aos-coach-am` tests the thinking, `aos-review` tests the artifact.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-790 / F5, Milestone 4 feature wave). The plugin-lite tier of AM coaching — artifact-by-artifact red-teaming. Manager dashboards / performance-by-AM are Code-tier. The red-team lenses likely need refinement after first real runs.

**What did we get wrong? What's missing?**
