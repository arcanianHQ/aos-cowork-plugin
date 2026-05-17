---
name: aos-feedback
description: "Report feedback from inside the plugin — a bug, a confusion, a missing feature, or praise — captured as a ticket-like record and formatted as an email the user sends to the AOS feedback intake. The in-plugin reporting channel. Trigger on 'report feedback', 'this is broken', 'submit feedback', 'something went wrong', 'feature request'."
scope: int-company
flavor: [shared, company, advanced, internal]
class: content
domain: quality
layer: all
client-scope: single-client
version: 0.2.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "(no args — an interactive capture; operates on the granted folder)"
inputs:
  - AOS_CONFIG.md (plugin version + schema — stamped onto the record; the feedback-intake address if set)
  - client/CLIENT_CONFIG.md (which engagement the feedback came from)
  - feedback/ (existing feedback records — for the running index + the next id)
outputs:
  - feedback/FB-NNN-<slug>.md (the feedback record — the capture edge of the item)
  - feedback/INDEX.md (the running feedback index)
  - a formatted email the user sends to the AOS feedback intake (the transport)
preflight:
  - client-config-soft
ontology:
  consumes: []
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [feedback, pilot, quality, testing, capture]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. The `feedback/` zone sits at the granted-folder root; create it if absent. If the folder is not onboarded the skill still runs — feedback capture must never be gated.

## Language

Resolve `communication-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. Talk to the user, and capture their words, in `communication-language`.

## Purpose

`aos-feedback` is the **in-plugin reporting channel** — the skill a tester or user
invokes, inside Cowork or Claude Code, the moment something is wrong, confusing,
missing, or worth praising.

A feedback item is **one logical object with two representations** (the full
mechanism is in `docs/feedback.md`):

1. **The capture edge** — `feedback/FB-NNN-*.md` in the tester's granted folder.
   This is all the plugin can physically produce: the plugin has **no backend**
   and a tester's install has **no Linear access**, so feedback cannot be *born*
   as a Linear ticket. It is born here — but **ticket-like from birth**: a stable
   `FB-NNN` id and a status lifecycle (`new → triaged → filed → resolved`).
2. **The managed form** — a Linear ticket in the **Cohort 1 Feedback** project,
   created by **auto-triage** on Arcanian's side when the item arrives. The Linear
   ticket is the real ticket-management surface; the `FB-NNN` record syncs to it.

`aos-feedback` owns the **capture edge** and hands the item to **transport**.

## Transport — email now, a Slack channel as the common denominator

The plugin cannot post anywhere — so `aos-feedback` formats the record as an
**email the user sends** to the AOS support intake. Email is the v1 transport
because it needs no backend, no connector, and no code — and it works
identically in Cowork and in Claude Code.

- The intake address is **`aos-support@arcanian.ai`** (override: an
  `AOS_CONFIG.md` `feedback-intake:` field, if present).
- The skill produces the email **subject** (a fixed, machine-parseable convention
  — see Step 3) and **body**, and hands it to the user to send from their own
  mail client. The skill does **not** send mail itself and depends on **no**
  email connector.

**The Slack channel is the common denominator.** `aos-support@arcanian.ai` routes
into the Arcanian **`#aos-support` Slack channel** — the single convergence point
for all feedback. This matters: the transport *in* will change (email now, a
dedicated MCP server later), but every generation lands in the **same Slack
channel**. The team sees feedback live there; **auto-triage** reads the channel
and routes to Linear (`docs/feedback.md`).

> **Later — a dedicated feedback MCP server.** Email is the v1 transport. A
> purpose-built feedback MCP server — bundled in `.mcp.json` — will push the
> record straight into the **same `#aos-support` channel**, replacing the manual
> email step. `aos-feedback`'s capture and record format do not change when that
> lands; only the transport step does. Tracked as a follow-up.

## Posture

Discovery, not pronouncement — and zero friction. Capturing feedback must be
faster than not capturing it. Ask only the few questions that make a report
actionable; never interrogate. Capture the user's words; never reframe a
complaint into something softer.

## The feedback record — what makes it triageable

Every record carries the fields auto-triage needs (template:
`reference/feedback-template.md`):

- **Type** — `bug` · `confusion` (it worked but was unclear) · `missing` (a
  feature / skill gap) · `praise` (what worked — keep it).
- **What the user was doing** — the skill / task in play.
- **What they expected** vs. **what happened** — the gap, in their words.
- **Severity** — `blocker` (could not proceed) · `major` (worked around it) ·
  `minor` (friction) · `note` (praise / idea).
- **Context** — plugin version + schema (from `AOS_CONFIG.md`), the skill, and —
  with the user's say-so — a short transcript excerpt.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` if present (plugin version
   + schema to stamp; `feedback-intake:` address if set). Read `client/CLIENT_CONFIG.md` if present.
2. Ensure the `feedback/` zone exists at the granted-folder root; create it, with
   an `INDEX.md`, if it does not.

### Step 1 — Capture

Ask the user, in a short interactive pass (prompts in
`reference/feedback-template.md`): the **type**, **what they were doing**, **what
they expected**, **what happened**, the **severity**. Keep it to the few questions
that make the report actionable — confirm what the user already said rather than
re-asking. Capture their words; do not soften a complaint.

### Step 2 — Write the record

Write `feedback/FB-NNN-<slug>.md` (NNN continues the sequence in `feedback/`)
using `reference/feedback-template.md` — the fields above, the provenance stamp,
`status: new`, and an empty `linear: ` field (auto-triage fills it). Include a
transcript excerpt **only** with the user's explicit say-so.

### Step 3 — Format the transport email

Produce the email for the user to send to the intake address:

- **Subject** — the fixed convention auto-triage parses:
  `[AOS Feedback] FB-NNN | <type> | <severity> | <client-slug>`
- **Body** — the full record content (the `FB-NNN-*.md` body), so the email is
  self-contained and the record travels intact.

Hand the user the subject + body (and a `mailto:aos-support@arcanian.ai` link
when the environment supports it). The user sends it from their own mail client
— one click / one paste. The skill never sends mail itself.

### Step 4 — Update the index + confirm

1. Append the record to `feedback/INDEX.md` — id, type, severity, the skill in
   play, `status: new`, `linear:` blank.
2. Show the user the record + the email before they send — Accept / Revise. Tell
   them what happens next: they send the email; auto-triage files it into Linear;
   the `FB-NNN` status will sync back so they can check it later. The user does
   nothing further. Thank them.

## Privacy

A feedback record can contain a transcript excerpt or the user's own words —
which may carry personal data. Rules: (1) a transcript excerpt is included only
on the user's explicit say-so; (2) the record is `scope: int-confidential`;
(3) before auto-triage routes a record into Linear it passes `aos-anonymize` —
the triage process owns that step (`docs/feedback.md`).

## Provenance

Each feedback record carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1 (`generated_by`, `skill_version`,
`generated_date`, `aos_schema`); never hard-code `skill_version` / `aos_schema`.
`feedback/INDEX.md` is a running index — appended in place, not stamped.

## Hard Rules

1. **Never gate feedback capture.** The skill runs even on an un-onboarded folder
   — a tester hitting a wall must always be able to report it.
2. **Capture the user's words.** Do not soften, reframe, or editorialise a
   complaint — triage needs the real signal.
3. **Capture + transport, don't triage.** The skill records the item and formats
   the email. Classification, prioritisation, dedup, and the Linear ticket are
   auto-triage's job, on Arcanian's side (`docs/feedback.md`).
4. **The plugin never sends mail and never writes to Linear.** No backend, no
   email connector, no Linear credentials on the tester's side — by design.
5. **Transcript only on consent.** A transcript excerpt is included only when the
   user explicitly agrees; the record is `int-confidential`.
6. **Zero friction.** Ask only what makes the report actionable.
7. **Single client.** Operate only within the granted folder.

## Output Sections

- The feedback record written (id, type, severity)
- The transport email — subject + body, ready to send to the intake
- What happens next — auto-triage files it into Linear; the status syncs back
- **Thank the user — and ask if there is anything else.**

## Integration

- **Upstream:** any skill or moment in the plugin — `aos-route-question` routes "report feedback" / "this is broken" / "feature request" here; a tester can invoke it directly.
- **Downstream:** the user emails the record to `aos-support@arcanian.ai`, which routes into the **`#aos-support` Slack channel** — the common denominator. **Auto-triage** (`docs/feedback.md`) reads the channel, runs `aos-anonymize`, classifies, dedups, and creates the Linear ticket in the **Cohort 1 Feedback** project — a human overrides. The `FB-NNN` record's `status` / `linear:` fields sync back so the tester can track it.
- **Future:** a dedicated feedback MCP server replaces the email transport step — pushing to the same `#aos-support` channel.

## Versioning

- **v0.1.0** — initial authoring (AOS-773, Milestone 7). In-plugin feedback capture into `feedback/`.
- **v0.2.0** — the two-representation model (capture edge ⟷ Linear managed form), **email transport** to the AOS feedback intake, and the auto-triage hand-off. The record is ticket-like from birth (`FB-NNN` id + status lifecycle). A dedicated feedback MCP server is the planned transport successor.

**What did we get wrong? What's missing?**
