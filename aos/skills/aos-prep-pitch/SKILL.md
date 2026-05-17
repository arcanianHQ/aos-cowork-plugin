---
name: aos-prep-pitch
description: "Analyse a tender, RFP, or pitch opportunity and prep the response strategy — read what the buyer actually wants, find the win themes, surface the fit gaps honestly, and recommend what to emphasise and what to address. Produces a pitch-prep analysis. Trigger on 'prep this pitch', 'analyse this tender', 'how do we win this RFP', 'should we bid'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "--tender=<path under the granted folder> — the tender / RFP / pitch brief to analyse"
inputs:
  - client/CLIENT_CONFIG.md
  - the tender / RFP / pitch brief — a file named by --tender, or pasted in chat
  - brand/POSITIONING.md · OFFER.md · ICP.md · COMPETITIVE_LANDSCAPE.md (the client's strengths + the field)
  - content/ + deliverables/ (proof — real results the pitch can cite)
outputs:
  - deliverables/<YYYY-MM>/pitch-prep-<slug>.md (the pitch-prep analysis)
preflight:
  - client-config
ontology:
  consumes: [Layer, OFFER, ICP]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [pitch, tender, rfp, prep, strategy, intelligence]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. The tender may be in any language — analyse it in the language it is in.

## Purpose

`aos-prep-pitch` analyses a **tender, RFP, or pitch opportunity** and preps the
response strategy — *before* anyone writes a word of the proposal.

A pitch is won or lost in the prep: most responses answer the questions asked and
miss the **decision the buyer is actually making**. This skill reads the tender
for what the buyer truly wants (stated *and* unstated), finds the **win themes**
the client can credibly own, surfaces the **fit gaps** honestly (where the client
is weak against the ask), and recommends what to emphasise, what to address head
on, and — sometimes — that this is not a bid worth making.

It works from the client's own intelligence: `POSITIONING.md`, `OFFER.md`,
`COMPETITIVE_LANDSCAPE.md` say where the client is strong and who else is in the
room; `content/` and `deliverables/` hold the real proof the pitch can cite.

**Anti-goal.** `aos-prep-pitch` does not *write* the proposal (that is
`aos-draft-content` / `aos-write` once the strategy is set) and does not invent
capabilities the client does not have. It preps the **strategy** for the response.

## Posture

Discovery, not pronouncement. The analysis is honest both ways — it names the win
themes *and* the fit gaps, and if the honest read is "do not bid", it says so
with the reasoning. A pitch prep that flatters the client into a losing bid has
failed.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Read** the `--tender` in full. If missing or a stub, abort — there is nothing to analyse.

### Step 1 — Read the buyer

Analyse the tender for what the buyer wants — both layers:

- **Stated** — the explicit requirements, evaluation criteria, scope, constraints,
  deadlines, budget signals.
- **Unstated** — the *decision behind the document*: what problem made them issue
  this tender, what outcome they actually need, what a safe choice looks like to
  them, who the internal stakeholders are. The unstated layer is where pitches
  are won.

### Step 2 — Find the win themes

Read the buyer's wants against the client's strengths (`POSITIONING.md`,
`OFFER.md`, the proof in `content/` / `deliverables/`). A **win theme** is a
point where (a) the buyer genuinely cares, (b) the client is genuinely strong,
and (c) the client can **prove it** with a real result. A theme missing any of
the three is not a win theme — it is a hope.

### Step 3 — Surface the fit gaps

Honestly: where does the ask exceed what the client can credibly deliver? A
requirement the client only partly meets, a scope edge outside the offer, a
criterion a competitor (`COMPETITIVE_LANDSCAPE.md`) will score higher on. For
each gap — can it be **addressed** (a partner, a reframe, a phased approach) or
is it **disqualifying**? If the gaps are disqualifying, the recommendation is
**do not bid** — with the reasoning.

### Step 4 — Recommend the response strategy + write

Write `deliverables/<YYYY-MM>/pitch-prep-<slug>.md`: the buyer analysis (stated +
unstated), the win themes (each with its proof), the fit gaps (each addressed or
disqualifying), the **bid / no-bid recommendation**, and — if bid — what to lead
with, what to address head on, and the proof to assemble. Present before writing.

## Provenance

The pitch-prep analysis carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1; never hard-code `skill_version` / `aos_schema`.

## Hard Rules

1. **Honest both ways.** The analysis names win themes *and* fit gaps. A prep
   that hides the gaps to keep the bid alive has failed.
2. **A win theme needs proof.** Buyer-cares + client-strong + can-prove-it — all
   three. A theme without a real result behind it is flagged as a hope, not a theme.
3. **No invented capability.** The client's strengths come from `OFFER.md` /
   `POSITIONING.md` / real proof — the pitch never claims what the client cannot do.
4. **No-bid is a valid output.** When the fit gaps are disqualifying, recommend
   not bidding, with the reasoning — do not manufacture a strategy for a losing bid.
5. **Prep, don't write.** This skill sets the strategy; the proposal itself is
   drafted by `aos-write` / `aos-draft-content` afterward.
6. **Single client.** Operate only within the granted folder.
7. **Discovery, not pronouncement.** Present the analysis for confirmation.

## Output Sections

- Buyer analysis — stated + unstated wants
- Win themes — each with its proof
- Fit gaps — each addressed or disqualifying
- **Bid / no-bid recommendation** — with the reasoning
- If bid — what to lead with, what to address, the proof to assemble
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-build-brand-system` (POSITIONING / OFFER / COMPETITIVE_LANDSCAPE — the client's strengths and the field); `content/` + `deliverables/` (the real proof); `aos-route-question` routes "prep this pitch" / "analyse this tender" / "should we bid" here.
- **Downstream:** on a bid, `aos-draft-content` / `aos-write` draft the proposal to the strategy this set; `aos-coach-am` can red-team the prep before the proposal is written.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-790 / F13, Milestone 4 feature wave). Tender / pitch-prep analysis. The buyer-analysis and win-theme heuristics likely need refinement after first real runs.

**What did we get wrong? What's missing?**
