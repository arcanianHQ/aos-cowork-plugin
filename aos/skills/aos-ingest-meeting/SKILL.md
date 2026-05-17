---
name: aos-ingest-meeting
description: "Turn a meeting / call transcript or notes into engagement tasks — extract the decisions and action items, land them in TASKS.md with owner and due date where stated, write a short meeting-notes record, and log the meeting to CAPTAINS_LOG.md. Lite tier — paste-based. Trigger on 'process this meeting', 'turn these notes into tasks', 'log the call'."
scope: int-company
flavor: [shared, company, advanced, internal]
class: content
domain: discovery
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--transcript=<path under the granted folder>] — or paste the transcript / notes in chat"
inputs:
  - client/CLIENT_CONFIG.md
  - the transcript / notes — a file named by --transcript, a file under inbox/, or pasted in chat
  - TASKS.md (existing tasks — dedup against)
  - CAPTAINS_LOG.md (the running log)
outputs:
  - TASKS.md (action items appended as tasks)
  - deliverables/<YYYY-MM>/meeting-notes-<slug>.md (the decisions + action-item record)
  - CAPTAINS_LOG.md (the meeting logged)
preflight:
  - client-config-soft
ontology:
  consumes: [Layer]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [meeting, transcript, tasks, ingestion, discovery, loop]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones (`client/`, `inbox/`, `deliverables/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`. If the folder is not onboarded, the skill still runs against the working directory.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write the meeting record in `content-language`. The transcript may be in any language — extract in the language it is in, record in `content-language`.

## Purpose

`aos-ingest-meeting` turns a **meeting / call transcript or notes** into structured
engagement state: the **decisions** made and the **action items** agreed, landed
as tasks in `TASKS.md`, with a short meeting-notes record and a `CAPTAINS_LOG.md`
entry.

A meeting's value leaks the moment it ends — decisions get forgotten, action
items live only in someone's memory. This skill captures it before it leaks.

**Tier.** This is the **lite tier** — paste-based: the user pastes a transcript,
or names a notes file. A live meeting-recording connector (auto-capture, speaker
diarisation) is **Code-tier**, out of scope for the Cowork plugin.

**Anti-goal.** `aos-ingest-meeting` does not run a diagnostic on what the meeting
revealed (that is the `aos-diagnose-*` skills) and does not plan (`aos-plan`). It
captures what was decided and what was agreed — faithfully, nothing invented.

## Posture

Discovery, not pronouncement. Action items and decisions are extracted from the
transcript and presented for the user to confirm before anything is written —
*"this is what I read as agreed; correct me."* Never infer a commitment the
transcript does not contain.

## Process

### Step 0 — Preflight + get the transcript

1. Confirm the working directory; read `AOS_CONFIG.md` if present.
2. Resolve the transcript — `--transcript`, a file the user named, or a chat
   paste. If there is none, ask for it. Note the meeting date (from the
   transcript, or ask).

### Step 1 — Extract

Read the transcript and extract four things — each item tied to the transcript
line(s) it came from:

- **Decisions** — what was decided / agreed / chosen.
- **Action items** — who agreed to do what, by when. Capture **owner** and **due**
  where the transcript states them; mark them *unstated* where it does not — do
  not invent an owner or a deadline.
- **Open questions** — what was raised but not resolved.
- **Context worth keeping** — a fact or number stated that the engagement should
  remember (these may belong in `inbox/` or a brand file — note, do not file).

### Step 2 — Dedup against TASKS.md

Read `TASKS.md`. For each extracted action item, check whether it already exists
as a task — match on substance, not exact wording. An item already tracked is
referenced, not duplicated.

### Step 3 — Write

1. **TASKS.md** — append each new action item to the **Open** table: the task,
   `Source` = `meeting <YYYY-MM-DD>`, the `Layer` if it maps to one, a `Priority`,
   `Status: open`. Update the `Last updated` line.
2. **Meeting-notes record** — write `deliverables/<YYYY-MM>/meeting-notes-<slug>.md`
   — the decisions, the action items (with owner / due), the open questions, and
   the context worth keeping.
3. **CAPTAINS_LOG.md** — append a one-paragraph entry: the meeting, its date, the
   headline decisions, and the count of action items captured.
4. Present the extracted decisions + action items to the user — Accept / Revise /
   Regenerate — **before** writing.

## Provenance

The meeting-notes record carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1 (`generated_by`, `skill_version`,
`generated_date`, `aos_schema`); never hard-code `skill_version` / `aos_schema`.
`TASKS.md` and `CAPTAINS_LOG.md` are running logs — updated in place, not stamped.

## Hard Rules

1. **Nothing invented.** Every decision, action item, owner, and due date traces
   to a transcript line. An unstated owner / due is marked *unstated*, never guessed.
2. **Capture, don't diagnose.** The skill records what the meeting decided — it
   does not analyse what it means (route that to `aos-diagnose-*` / `aos-plan`).
3. **Dedup.** An action item already in `TASKS.md` is referenced, not duplicated.
4. **Confirm before write.** Present the extraction; Accept / Revise / Regenerate.
5. **Single client.** Operate only within the granted folder.
6. **Discovery, not pronouncement.** End the meeting-notes record with
   *"What did we get wrong? What's missing?"*

## Output Sections

- Meeting date + source
- Decisions captured
- Action items → tasks added to `TASKS.md` (count, with owners / dues)
- Open questions
- Records written (meeting-notes path, CAPTAINS_LOG entry)
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-route-question` routes "process this meeting" / "turn these notes into tasks" here. The transcript itself may also live in `inbox/transcripts/`.
- **Downstream:** the tasks land in `TASKS.md` where `aos-plan` reads them (dedup against live work); the meeting-notes record is `inbox/`-grade discovery material for `aos-build-brand-system`; decisions of consequence belong in `CAPTAINS_LOG.md`, which this skill writes.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-792 / F6, Milestone 4 feature wave). Lite tier — paste-based ingestion. A live meeting-recording connector is Code-tier. The extraction heuristics likely need refinement after first real runs.

**What did we get wrong? What's missing?**
