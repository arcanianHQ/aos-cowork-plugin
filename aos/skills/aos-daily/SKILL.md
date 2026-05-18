---
name: aos-daily
description: "The daily routines — a session-start standing brief and an end-of-day wrap. Start: read the last session's summary as a continuity hand-off, then what is open, where the loop stands, which findings wait, what to focus on — plus the cadence catch-up, which flags scheduled work missed while the Cowork app was closed and offers to run it. End: what moved, written as a structured session summary to CAPTAINS_LOG.md so the next session can pick the thread up, tomorrow set up. Trigger on 'start my day', 'morning briefing', 'where do things stand', 'catch me up', 'wrap up the day', 'end of day', or at the start of a working session on a granted folder."
scope: int-company
flavor: [shared, company, advanced, internal]
class: reading
domain: strategy
layer: all
client-scope: single-client
version: 0.3.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "--mode=<start|end> — operates on the granted folder"
inputs:
  - client/CLIENT_CONFIG.md
  - AOS_CONFIG.md (the schedules: block — the declared cadence)
  - TASKS.md (open + done tasks)
  - CAPTAINS_LOG.md (recent activity)
  - ontology/INDEX.md (unactioned findings — the loop's in-tray)
  - content/CATALOGUE.md (content in flight)
  - deliverables/<YYYY-MM>/ (recent deliverables — also cadence run-evidence)
outputs:
  - deliverables/<YYYY-MM>/daily/<YYYY-MM-DD>-<mode>.md (the briefing / wrap — optional, on request)
  - CAPTAINS_LOG.md (end mode — the day logged)
  - AOS_CONFIG.md (the schedules: block — a last-run: annotation, after a confirmed catch-up run)
preflight:
  - client-config-soft
ontology:
  consumes: [FND, REC]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on: []
tags: [daily, routine, briefing, cadence, workflow]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`.

## Language

Resolve `communication-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. The briefing is spoken to the user in `communication-language`.

## Purpose

`aos-daily` is the **cadence routine** — the two bookend rituals that keep an
engagement moving day to day. It pairs with the AOS cadence architecture
(`docs/cadence.md`): the loop has a rhythm, and `aos-daily` is its daily beat.

- **`--mode=start`** — the **session-start standing brief**: open with the
  **continuity hand-off** — read the last session's summary from
  `CAPTAINS_LOG.md` so a cold ephemeral session picks the thread up — then read
  the granted folder's state and tell the user, in one tight brief, what is
  open, where the AOS loop stands, which findings are waiting, and what the
  highest-leverage focus is. It also runs the **cadence catch-up** — because
  Cowork's `/schedule` fires only while the app is open (`docs/cadence.md` §3),
  scheduled work is silently skipped whenever the app was closed at its time.
  The brief reads the `schedules:` block, works out what was missed, and offers
  to run it now. This is the start-of-any-working-session orientation, not only
  a literal "morning".
- **`--mode=end`** — the **end-of-day wrap**: review what moved and write a
  **structured session summary** to `CAPTAINS_LOG.md` — the working-memory
  hand-off the next session reads back — then set up tomorrow.

It reads state and reflects it back; it is not a planning skill. The standing
plan is `aos-plan`; `aos-daily` works *within* the plan, surfacing what to do
**today** from what already exists.

**Anti-goal.** `aos-daily` does not create the plan, draft content, or run a
diagnostic. It is the lightweight orient-and-log routine that brackets the day.

## Posture

Discovery, not pronouncement. The briefing names a recommended focus and the
*why* — it does not dictate. The user's day is theirs; `aos-daily` orients it.

## Process

### Step 0 — Preflight

Confirm the working directory; read `AOS_CONFIG.md` if present. Validate `--mode`
is `start` or `end`; if omitted, infer from the time of day or ask.

### Step 1 (mode=start) — The session-start standing brief

Assemble and present, concise:

0. **Continuity hand-off** — read the most recent `## Session summary` block in
   `CAPTAINS_LOG.md` (the structured summary the last `end` run wrote) and open
   the brief with it: what the last session worked on, what it left mid-flight,
   what it planned as the next step. Reconcile against live state — where the
   summary and live state disagree, live state wins and the brief notes the
   drift. If there is no session-summary block yet, skip this line. Full
   read/write discipline: `reference/session-continuity.md`.
1. **Open work** — the `TASKS.md` Open table: count, and the highest-priority few.
2. **Loop state** — where the engagement sits in `onboard → … → measure ↺`:
   what shipped recently (`content/CATALOGUE.md`, `CAPTAINS_LOG.md`), what is in
   draft / scheduled.
3. **The loop's in-tray** — unactioned findings from `ontology/INDEX.md` (open
   FNDs no REC consumes) — the learnings waiting on a plan.
4. **Cadence catch-up** — read the `schedules:` block from `AOS_CONFIG.md`, work
   out which declared workflows are overdue (missed while the Cowork app was
   closed), and surface them. If anything is overdue, **offer to run the
   catch-up now** — offered, never auto-run. Full procedure, including how
   "last run" is determined and the `last-run:` write-back, in
   `reference/cadence-catchup.md`. If there is no `schedules:` block, skip this
   line silently.
5. **Today's focus** — name the **one** highest-leverage thing to do, with one
   sentence of why, drawn from the above. Offer one or two alternatives.

### Step 2 (mode=end) — The end-of-day wrap

1. **What moved** — compare `TASKS.md` and `CAPTAINS_LOG.md` against the day:
   tasks closed, content advanced, deliverables written, findings emitted.
2. **Write the session summary** — append a structured `## Session summary`
   block to `CAPTAINS_LOG.md` — the fixed-field block in
   `reference/session-continuity.md`: *worked on · moved · loop state · open /
   mid-flight · decisions · next session*. The block is structured on purpose:
   the next session's `start` reads it mechanically as the continuity hand-off,
   and the **Open / mid-flight** field carries the **concrete resume point** (a
   path, a stage, an id — not "some work in progress").
3. **Set up tomorrow** — the summary's `Next session` field names the one or two
   things to pick up first, so the next `start` brief has a running start.
4. Present the wrap + the proposed `## Session summary` block — Accept / Revise —
   before writing.

### Step 3 — Optional written brief

By default the briefing / wrap is **spoken in chat** — it is ephemeral by nature.
If the user asks for a written copy, write it to
`deliverables/<YYYY-MM>/daily/<YYYY-MM-DD>-<mode>.md`.

## Provenance

A written brief carries the **standard provenance block** — see
`docs/artifact-versioning.md` §1. `CAPTAINS_LOG.md` is a running log — appended
in place, not stamped.

## Hard Rules

1. **Reflect state, don't invent it.** The briefing reports what `TASKS.md`,
   `CAPTAINS_LOG.md`, the catalogue, and the ontology actually say — no invented
   progress, no invented tasks.
2. **One focus.** The morning briefing names **one** primary focus, not a menu —
   a day with five priorities has none.
3. **End mode logs honestly.** The wrap records what moved *and* what did not —
   a day where little moved is logged as such, not dressed up.
4. **Confirm the log entry.** The `CAPTAINS_LOG.md` append (end mode) is shown to
   the user before it is written.
5. **Catch-up is offered, never auto-run.** Overdue scheduled work is surfaced
   and offered; the user chooses what to run. A `runner: server` row is never
   offered — it is out of scope for the plugin (`docs/cadence.md` §3). The
   `last-run:` write-back happens only after the user confirms the run.
6. **The session summary is the continuity hand-off.** End mode writes the
   structured `## Session summary` block; start mode reads the most recent one
   first. Its **Open / mid-flight** field is a *concrete* resume point — a path,
   a stage, an id — never vague. See `reference/session-continuity.md`.
7. **Single client.** Operate only within the granted folder.
8. **Discovery, not pronouncement.** Recommend a focus; the user decides.

## Output Sections

- **start:** continuity hand-off · open-work count · loop state · unactioned
  findings · cadence catch-up · today's focus
- **end:** what moved · the `## Session summary` block · tomorrow's first pick-up
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-route-question` routes "start my day" / "where do things stand" / "catch me up" / "wrap up" here. Reads the output of every loop skill — `TASKS.md`, `CAPTAINS_LOG.md`, `ontology/INDEX.md`, `content/CATALOGUE.md` — and the `schedules:` block in `AOS_CONFIG.md`.
- **Downstream:** the session-start brief's "today's focus" points the user at the right next skill (`aos-plan`, `aos-write`, a diagnostic); a cadence catch-up runs the overdue workflow / named run (`docs/cadence.md` §4); the end-mode `## Session summary` block feeds the next `start`'s continuity hand-off — working memory across ephemeral Cowork sessions. Pairs with the cadence architecture in `docs/cadence.md` — `aos-daily` is the catch-up mechanism §3 names.

## Versioning

- **v0.3.0** — **working-memory continuity** (AOS-852, milestone *13. Agentic behaviour* — F6). End mode writes a **structured `## Session summary`** block to `CAPTAINS_LOG.md` (fixed fields incl. a concrete *Open / mid-flight* resume point); start mode opens with a **continuity hand-off** — reading the most recent summary so a cold ephemeral Cowork session picks the thread up. New: `reference/session-continuity.md`.
- **v0.2.0** — the **session-start standing brief + cadence catch-up** (AOS-849, milestone *13. Agentic behaviour* — F3). `--mode=start` is reframed as the start-of-session orientation (not only a literal morning), and gains the cadence catch-up: it reads the `schedules:` block, determines what scheduled work was missed while the Cowork app was closed, and offers to run it — the mitigation for `/schedule`'s no-catch-up gap (`docs/cadence.md` §3). New: `reference/cadence-catchup.md`; the optional `last-run:` annotation on `schedules:` rows.
- **v0.1.0** — initial Cowork-plugin authoring (AOS-794, Milestone 4 feature wave). The daily cadence routine — morning briefing + end-of-day wrap. Couples to the cadence architecture (`docs/cadence.md`).

**What did we get wrong? What's missing?**
