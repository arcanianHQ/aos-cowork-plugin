---
name: aos-discovery-package
description: "Assemble a populated AOS data folder from a client's existing material plus a fresh-discovery intake — import and classify what the client already has, run a structured intake for what is missing, file everything into the right zones, and confirm the folder is ready for the brand build. The bridge from scattered client docs to a loop-ready granted folder. Trigger on 'build the discovery package', 'set up the client knowledge', 'import the client material'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: discovery
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--import=<path to a folder or file of existing client material>] — operates on the granted folder"
inputs:
  - AOS_CONFIG.md (the folder must be onboarded)
  - client/CLIENT_CONFIG.md
  - existing client material — a folder / files named by --import, or pasted / pointed to in chat
  - inbox/ (the destination zone for imported + discovered material)
  - reference/intake-method.md (the import-classification map + the fresh-discovery intake)
outputs:
  - inbox/**/ (imported + discovered material, filed into the typed inbox subfolders)
  - client/CLIENT_CONFIG.md (seeded / enriched from the intake)
  - deliverables/<YYYY-MM>/discovery-package.md (the summary + readiness check)
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
tags: [discovery, onboarding, ingestion, assembly, intake]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones (`client/`, `inbox/`, `brand/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. The intake is conducted in `communication-language`; imported material keeps its own language.

## Purpose

`aos-discovery-package` is the **assembly mechanism** — it turns a client's
scattered, unstructured material into a **loop-ready AOS granted folder**.

`aos-onboard` scaffolds the *empty* structure (the zones, `AOS_CONFIG.md`). The
loop skills (`aos-build-brand-system` → `aos-plan` → …) need that structure
**populated** with real intelligence. The gap between the two is the Discovery
Package — and this skill builds it, in two streams:

1. **Import-existing** — the client almost always already *has* material: a
   strategy deck, brand guidelines, a pitch document, past campaign reports, an
   analytics export. This skill imports it and **classifies** each piece into the
   right typed `inbox/` subfolder so the harvest skills find it.

2. **Fresh-discovery** — whatever the existing material does not cover, a
   **structured intake** captures: a focused questionnaire across the things
   `aos-build-brand-system` will need (the offer, the customer, the founder, the
   channels). The intake fills the gaps the import left.

The output is a granted folder whose `inbox/` is genuinely populated and whose
`client/CLIENT_CONFIG.md` is enriched — plus a **readiness check** that says
whether the folder is ready for the brand build, or what is still thin.

Design reference: `COWORK_CLIENT_KNOWLEDGE_INGESTION.md` (the knowledge-ingestion
design for Cowork delivery via the Drive scaffold).

**Anti-goal.** `aos-discovery-package` does not *build the brand profile* (that
is `aos-build-brand-system`) and does not scaffold the folder (`aos-onboard`). It
**assembles the inputs** the brand build then harvests.

## Posture

Discovery, not pronouncement — it is in the name. The intake is a conversation,
not an interrogation: ask in focused rounds, confirm what was imported, never
fabricate an answer the client did not give.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify the folder is onboarded — `AOS_CONFIG.md` + `client/CLIENT_CONFIG.md` present. If not, route to `aos-onboard` first; this skill populates, it does not scaffold.

### Step 1 — Import existing material

Take the client's existing material (`--import` folder / files, or material the
user points to in chat). For each piece, **classify** it into a typed `inbox/`
subfolder — `strategy/`, `transcripts/`, `correspondence/`, `research/`,
`brand-material/` — using the classification map in `reference/intake-method.md`.
Copy it in (preserve the original filename + add a short provenance note: where
it came from, its date). Material whose type is unclear is filed to
`inbox/` root and flagged. **Never alter the content of an imported document.**

### Step 2 — Run the fresh-discovery intake

Identify what the import does **not** cover — measure the imported material
against the discovery checklist in `reference/intake-method.md` (the offer, the
ICP, the founder / decision-makers, the channels, competitors, results to date).
For each genuine gap, run the **intake questions** for that area — focused,
in rounds, in `communication-language`. Write each round's answers into the
appropriate `inbox/` file (a `inbox/discovery/` note) so they harvest like any
other source. Seed / enrich `client/CLIENT_CONFIG.md` from the identity answers.

### Step 3 — Assemble + readiness check

1. Confirm `inbox/` is now genuinely populated and typed; re-run `aos-catalogue`
   conceptually (recommend running it) so the inbox catalogue reflects the import.
2. Write `deliverables/<YYYY-MM>/discovery-package.md` — the **summary**: what was
   imported (by type), what the intake captured, and a **readiness check** —
   per the 9 brand-profile files, is there enough signal in `inbox/` to draft it,
   or is it still thin? Name the specific gaps.
3. Present the summary to the user — Accept / Revise — and recommend the next
   step (`aos-catalogue` then `aos-build-brand-system`, or another intake round
   if the readiness check is red).

## Provenance

`deliverables/<YYYY-MM>/discovery-package.md` carries the **standard provenance
block** — see `docs/artifact-versioning.md` §1. Imported documents are **not**
re-stamped — they are the client's originals; their provenance note records the
import, not authorship.

## Hard Rules

1. **Never alter imported content.** An imported document is copied verbatim into
   `inbox/` with a provenance note — its content is the client's, untouched.
2. **The intake captures, never invents.** A fresh-discovery answer comes from
   the client. A gap the client cannot yet answer is recorded as an open gap —
   never filled with a plausible guess.
3. **Populate, don't build.** This skill fills `inbox/` and seeds `client/` — it
   does not draft `brand/` files (that is `aos-build-brand-system`).
4. **Classify honestly.** Material of unclear type is filed to `inbox/` root and
   flagged — not force-fitted into a typed subfolder.
5. **Readiness is honest.** The readiness check states plainly whether the folder
   is ready for the brand build — a thin import is reported as thin.
6. **Single client.** Operate only within the granted folder.
7. **Discovery, not pronouncement.** End the summary with *"What's still missing?"*

## Output Sections

- Imported — material by type, filed into `inbox/`
- Intake — the fresh-discovery rounds run, what they captured
- `client/CLIENT_CONFIG.md` — seeded / enriched
- Readiness check — per the brand profile, ready or thin (with the named gaps)
- Discovery-package summary path
- **What's still missing?**

## Integration

- **Upstream:** `aos-onboard` (scaffolds the folder this populates); `aos-route-question` routes "build the discovery package" / "import the client material" here.
- **Downstream:** `aos-catalogue` indexes the now-populated `inbox/`; `aos-build-brand-system` harvests it to draft the 9-file brand profile; the readiness check tells the user whether to run the brand build now or gather more first. The Discovery Package is delivered into Cowork via the Drive scaffold (`COWORK_CLIENT_KNOWLEDGE_INGESTION.md`).

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-798, Milestone 4 feature wave). The import + fresh-discovery assembly mechanism. The classification map and the intake question set likely need refinement after first real runs.

**What did we get wrong? What's missing?**
