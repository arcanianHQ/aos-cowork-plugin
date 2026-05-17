---
name: aos-anonymize
description: "The privacy gate — scan an artifact for personal data (names, emails, phone numbers, addresses, account / tax IDs, private financial data) and produce an anonymised copy plus a PII report, before the artifact is shared outside the granted folder. Pseudonymises consistently or redacts; never overwrites the original. Trigger on 'anonymise this', 'scrub the PII', 'is this safe to share', or before any deliverable leaves the engagement."
scope: int-company
flavor: [shared, company, advanced, internal]
class: reading
domain: quality
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "--artifact=<path under the granted folder> [--mode=pseudonymise|redact] — operates on the granted folder; writes a new anonymised copy, never overwrites"
inputs:
  - the target artifact (a deliverable, content piece, inbox file, or brand file under the granted folder)
  - client/CLIENT_CONFIG.md (the client's own identity — what legitimately stays)
  - reference/pii-categories.md (detection categories + the keep / remove decision rules)
outputs:
  - <artifact-dir>/<artifact-name>-anon.md (the anonymised copy — a new file, never the original)
  - deliverables/<YYYY-MM>/pii-report-<artifact-slug>.md (the PII report — int-confidential)
preflight:
  - client-config-soft
ontology:
  consumes: [Content, Deliverable]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [privacy, pii, anonymise, gdpr, safety, quality, gate]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`. If the folder is not onboarded, the skill still runs — it operates on the working directory.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`. **PII detection is language-aware** — name, address, phone, and national-ID formats differ by locale (a Hungarian `+36` number, a Hungarian tax number, a Hungarian address order). Detect against the artifact's actual language, not English by default.

## Purpose

`aos-anonymize` is the **privacy gate** of AOS — the check an artifact passes
before it leaves the granted folder.

An AOS granted folder legitimately holds personal data: customer names in
testimonials, emails and phone numbers in correspondence, named decision-makers
in `brand/BELIEF_PROFILE.md`, account IDs in analytics exports. Inside the folder
that is correct — it is the client's own data, held for the engagement. The risk
is at the **boundary**: when a deliverable is sent to a third party, a case study
quoting a real customer is published, or material is pasted into a context the
granted folder's confidentiality no longer covers.

`aos-anonymize` reads a target artifact, detects the personal data in it, and
produces an **anonymised copy** — plus a **PII report** of what was found and what
was done. It is the data-minimisation step that keeps AOS's handling of client
and customer data defensible (GDPR data-minimisation; the client's own duty of
care to the people in their data).

**Honest scope.** This skill is a **detection-and-assist** tool, not a certified
data-loss-prevention system. It finds the personal data it can recognise and
flags what it is unsure about — the user must still review the anonymised copy
before relying on it. It reduces risk; it does not certify safety.

**Anti-goal.** `aos-anonymize` does not delete or alter the **original** — the
original legitimately holds PII and is the engagement's system of record. It does
not run connectors and does not check brand / voice / provenance (that is
`aos-review` / `aos-back-statements`).

## Posture

Discovery, not pronouncement. Present the detected PII (by category and count —
**not** the values, in the chat) and the proposed anonymisation for the user to
confirm. End the report with *"What did we miss? What got over-redacted?"*

## What is PII here — and what stays

The detection categories and the keep / remove decision rules are in
`reference/pii-categories.md`. The core distinction:

- **Remove / anonymise — third-party personal data.** A customer's name, a
  private individual's email / phone / address, an account or tax / national ID,
  private financial data, a named person who has not consented to external use.
- **Keep — the client's own public identity.** The client's brand name, its
  public business address and contact details, the founder's name **when they
  speak publicly as the brand** (e.g. a by-lined post). The client's own public
  face is not third-party PII — removing it would break the artifact.

When a name is ambiguous (is this founder line public or private?), the skill
**flags it for the user** rather than guessing — see Hard Rule 4.

## Arguments

- `--artifact` (required) — the file to anonymise, a path under the granted
  folder. If omitted, the skill asks which artifact (or accepts a chat paste).
- `--mode` (optional) — `pseudonymise` (default) replaces each PII item with a
  **consistent** placeholder (`[Customer A]`, `[email]`, the same real value
  always mapping to the same placeholder within the artifact, preserving
  readability); `redact` masks each item (`████`). Pseudonymise unless the user
  asks for hard redaction.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` if present.
2. **Read the target artifact in full.** Note its `content-language`.
3. Read `client/CLIENT_CONFIG.md` — the client's own name, brand, and public
   contact details, so they can be told apart from third-party PII.

### Step 1 — Detect

Scan the artifact for every PII category in `reference/pii-categories.md` —
person names, email addresses, phone numbers, postal addresses, account /
customer IDs, tax / national IDs, dates of birth, private financial figures,
and identifying URLs / handles. Detect against the artifact's **actual language
and locale**. Record each hit with its location and category.

### Step 2 — Classify: remove or keep

For each hit, apply the keep / remove rule (`reference/pii-categories.md`):
third-party personal data → **remove / anonymise**; the client's own public
identity → **keep**. Anything genuinely ambiguous → **flag for the user**, do not
silently decide.

### Step 3 — Anonymise

Produce the anonymised copy. In `pseudonymise` mode, build a **consistent**
substitution — the same real value always maps to the same placeholder within
this artifact, so the text still reads (`Mara Ellison` → `[Founder]`,
`jane@acme.com` → `[email]`, `Acme Ltd` kept if it is the client, replaced if a
third party). In `redact` mode, mask each removed item. Never alter non-PII text.

### Step 4 — Write + report

1. Write the anonymised copy to `<artifact-dir>/<artifact-name>-anon.md` — a
   **new file**. Never overwrite the original.
2. Write the **PII report** to `deliverables/<YYYY-MM>/pii-report-<slug>.md`
   (`scope: int-confidential`) — counts **by category**, the keep / remove
   decisions, every item flagged ambiguous, and the residual-risk note (what the
   skill could not be sure about). The report does not need to list raw PII
   values; where it must, it is itself confidential and stays in the granted folder.
3. Present the report (categories + counts, not raw values) and the proposed
   anonymisation to the user — Accept / Revise / Regenerate — before writing.

## Provenance

The anonymised copy and the PII report carry the **standard provenance block** —
see `docs/artifact-versioning.md` §1 (`generated_by`, `skill_version`,
`generated_date`, `aos_schema`); never hard-code `skill_version` / `aos_schema`.
The anonymised copy also carries `anonymised_from: <original path>` and
`anonymise_mode:` so its lineage is traceable.

## Hard Rules

1. **Never touch the original.** `aos-anonymize` always writes a **new**
   `-anon` file. The original legitimately holds PII and is the system of record.
2. **Detection-and-assist, not certification.** The skill is honest that it finds
   what it can recognise and may miss things — the report carries a residual-risk
   note and the user must review. Never tell the user an artifact is "safe".
3. **Consistent pseudonyms.** In `pseudonymise` mode a real value maps to one
   placeholder throughout — the anonymised copy must still read.
4. **Ambiguous → flag, don't guess.** A name that could be the client's public
   identity or a private third party is flagged for the user, never silently kept
   or removed.
5. **Keep the client's own public identity.** Removing the client's brand name or
   public contact details would break the artifact — that is not third-party PII.
6. **The report is confidential.** The PII report is `scope: int-confidential`
   and stays in the granted folder; raw PII values are never echoed into chat.
7. **Single client.** Operate only within the granted folder.
8. **Discovery, not pronouncement.** Present for confirmation; end the report
   with *"What did we miss? What got over-redacted?"*

## Output Sections

User-facing summary at end of run:

- PII detected — counts **by category** (no raw values in chat)
- Remove / keep / flagged-ambiguous breakdown
- The anonymised copy path + mode
- Residual-risk note — what the skill could not be certain about
- **What did we miss? What got over-redacted?**

## Integration

- **Upstream:** any skill producing an artifact that might leave the engagement —
  `aos-measure` / `aos-plan` / the diagnostics (deliverables shared with the
  client), `aos-draft-content` / `aos-write` (a reference piece quoting a real
  customer). `aos-route-question` routes "anonymise" / "scrub the PII" / "safe to
  share" requests here.
- **Downstream:** the privacy gate before external sharing — run `aos-anonymize`
  on a deliverable before it is sent to a third party, and on any case-study /
  reference content that quotes a real customer before `aos-distribute` ships it.
  Complements `aos-review` (brand / voice / completeness) and `aos-back-statements`
  (evidence provenance) — three orthogonal pre-share gates.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (Milestone 4 feature wave). The
  privacy gate — locale-aware PII detection + consistent pseudonymisation. The
  detection category list and the keep / remove heuristics likely need refinement
  after first real runs; non-EN/HU locale coverage is a known follow-up.

**What did we get wrong? What's missing?**
