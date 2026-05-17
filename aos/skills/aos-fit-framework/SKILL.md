---
name: aos-fit-framework
description: "Fit AOS to the operating framework a client already runs — EOS, Scaling Up, OKRs, or the client's own — as a drop-in adapter layer. Maps AOS concepts and cadence to the client's framework so AOS outputs land in the language and rhythm the team already uses. Produces client/OPERATING_FRAMEWORK.md. Trigger on 'we run EOS', 'fit this to our operating system', 'use our meeting format'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--framework=<eos|scaling-up|okr | path to a client-supplied framework file>] — operates on the granted folder"
inputs:
  - client/CLIENT_CONFIG.md
  - client/OPERATING_FRAMEWORK.md (existing adapter — refreshed in place)
  - inbox/**/*.md (harvest — references to EOS, Rocks, L10, OKRs, the client's framework)
  - reference/known-frameworks.md (built-in mappings — EOS, Scaling Up, OKR)
  - a client-supplied framework file, when --framework names a path
outputs:
  - client/OPERATING_FRAMEWORK.md (the adapter layer — read by aos-daily, aos-plan, aos-map-jtbd)
preflight:
  - client-config
ontology:
  consumes: [Layer]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-onboard
tags: [framework, eos, operating-system, adapter, pluggable, cadence]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones (`client/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. The adapter is written in `content-language`; framework terms (Rocks, L10, OKR) keep their canonical names.

## Purpose

A client does not adopt AOS into a vacuum — many already run a named operating
framework: **EOS** (the Entrepreneurial Operating System — Rocks, the Level-10
meeting, the Scorecard, the Issues list), **Scaling Up**, **OKRs**, or their own
house system. AOS should land *inside* that — in the team's language and on the
team's rhythm — not fight it.

`aos-fit-framework` produces the **adapter layer**: `client/OPERATING_FRAMEWORK.md`,
a file that maps AOS concepts and cadence onto the client's framework. With it in
place, every downstream skill speaks the client's dialect — an AOS recommendation
is framed as a *Rock*, a process gap as an *Issue*, the daily routine fits around
the *L10*.

**Pluggable.** A framework adapter is **data, not code** — the same principle as
`docs/language-packs.md` and the content-framework library. Built-in mappings for
EOS / Scaling Up / OKR ship in `reference/known-frameworks.md`; a client's own
framework is a drop-in file pointed at by `--framework`. No skill change to add one.

**Anti-goal.** `aos-fit-framework` does not replace AOS's method or the 7+1 Layer
Framework — those stay. It produces a **translation layer** so AOS's output is
legible and well-timed for a team that already runs something else.

## Posture

Discovery, not pronouncement. The mapping is a draft — the client knows how they
actually run their framework better than any built-in template. Present the
adapter for correction; a built-in mapping is a starting point, not the truth.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Pre-read `client/OPERATING_FRAMEWORK.md`** if it exists (the Write/Edit harness rule).

### Step 1 — Identify the client's framework

Determine which framework the client runs — from `--framework`, from
`client/CLIENT_CONFIG.md`, from `inbox/` references (mentions of "Rocks", "L10",
"V/TO", "OKR", "quarterly priorities"), or by asking. If the client runs **no**
named framework, say so — AOS's own cadence (`docs/cadence.md`) applies as-is and
no adapter is needed; do not invent a framework.

### Step 2 — Resolve the mapping source

- A **built-in** (`eos`, `scaling-up`, `okr`) → load its mapping from
  `reference/known-frameworks.md`.
- A **client-supplied file** (`--framework` is a path) → read it and extract the
  framework's cadence, artifacts, and vocabulary.
- Built-in **plus** the client's own twist → start from the built-in, then
  capture how *this* client diverges (every team runs EOS slightly differently).

### Step 3 — Build the adapter

Write `client/OPERATING_FRAMEWORK.md` (`reference/known-frameworks.md` carries the
shape) with:

- **The framework** — named, with the client's own variations noted.
- **Concept map** — AOS concept ↔ framework concept: e.g. AOS `REC` / plan move ↔
  EOS *Rock*; AOS `FND` / process gap ↔ EOS *Issue*; `aos-measure` results ↔ the
  *Scorecard*; the brand profile ↔ the *V/TO* marketing strategy.
- **Cadence alignment** — how AOS's loop beats sit against the framework's
  meeting rhythm: where `aos-daily` fits, where `aos-plan` aligns to the
  quarterly Rock-setting, where `aos-measure` feeds the weekly Scorecard.
- **Vocabulary** — the terms downstream skills should use when talking to this
  client (say "Rock", not "recommendation", when the client runs EOS).

### Step 4 — Surface and write

Present the adapter — Accept / Revise / Regenerate. Write `client/OPERATING_FRAMEWORK.md`
with the standard provenance block. End with *"What did we get wrong?"*

## Provenance

`client/OPERATING_FRAMEWORK.md` carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1; never hard-code `skill_version` / `aos_schema`.

## Hard Rules

1. **Adapter, not replacement.** AOS's method and the 7+1 Layer Framework stay —
   this skill adds a translation layer, it does not swap AOS's engine out.
2. **The client's variation wins.** A built-in mapping is a starting point; how
   *this* client runs the framework, captured from them, overrides the template.
3. **No invented framework.** A client running no named framework gets no adapter
   — AOS's own cadence applies; do not manufacture a framework to map to.
4. **Pluggable.** A new framework is a drop-in mapping file — never a skill change.
5. **Single client.** Operate only within the granted folder.
6. **Discovery, not pronouncement.** Present the adapter for confirmation.

## Output Sections

- The client's framework (and their variations)
- Concept map — AOS ↔ framework
- Cadence alignment
- Vocabulary downstream skills should adopt
- Adapter path
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard`; `inbox/` framework references; `aos-route-question` routes "we run EOS" / "fit this to our operating system" here.
- **Downstream:** `aos-daily` fits its routine around the framework's meeting rhythm; `aos-plan` frames moves in the framework's vocabulary (a *Rock*); `aos-map-jtbd` frames a process gap as an *Issue*; any client-facing deliverable adopts the vocabulary. The adapter is read by every skill that talks *to* the client.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-796 / F11, Milestone 4 feature wave). Built-in mappings: EOS, Scaling Up, OKR. The concept maps likely need refinement after first real runs; the framework library is pluggable.

**What did we get wrong? What's missing?**
