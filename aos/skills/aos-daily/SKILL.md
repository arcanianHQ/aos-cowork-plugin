---
name: aos-daily
description: "The daily routines — a morning briefing and an end-of-day wrap. Start of day: what is open, where the loop stands, what to focus on. End of day: what moved, logged to CAPTAINS_LOG.md, tomorrow set up. Trigger on 'start my day', 'morning briefing', 'wrap up the day', 'end of day'."
scope: int-company
flavor: [shared, company, advanced, internal]
class: reading
domain: strategy
layer: all
client-scope: single-client
version: 0.2.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "--mode=<start|end> — operates on the granted folder"
inputs:
  - client/CLIENT_CONFIG.md
  - TASKS.md (open + done tasks — kept current by aos-todoist when Todoist is connected)
  - CAPTAINS_LOG.md (recent activity)
  - ontology/INDEX.md (unactioned findings — the loop's in-tray)
  - content/CATALOGUE.md (content in flight)
  - deliverables/<YYYY-MM>/ (recent deliverables)
outputs:
  - deliverables/<YYYY-MM>/daily/<YYYY-MM-DD>-<mode>.md (the briefing / wrap — optional, on request)
  - CAPTAINS_LOG.md (end mode — the day logged)
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

- **`--mode=start`** — the **morning briefing**: read the granted folder's state
  and tell the user, in one tight brief, what is open, where the AOS loop stands,
  which findings are waiting, and what the highest-leverage focus for today is.
- **`--mode=end`** — the **end-of-day wrap**: review what moved, log the day to
  `CAPTAINS_LOG.md`, and set up tomorrow — the one or two things to pick up first.

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

### Step 1 (mode=start) — The morning briefing

Assemble and present, concise:

1. **Open work** — the `TASKS.md` Open table: count, and the highest-priority few.
2. **Loop state** — where the engagement sits in `onboard → … → measure ↺`:
   what shipped recently (`content/CATALOGUE.md`, `CAPTAINS_LOG.md`), what is in
   draft / scheduled.
3. **The loop's in-tray** — unactioned findings from `ontology/INDEX.md` (open
   FNDs no REC consumes) — the learnings waiting on a plan.
4. **Today's focus** — name the **one** highest-leverage thing to do today, with
   one sentence of why, drawn from the above. Offer one or two alternatives.

**Todoist sync (if connected).** If the Todoist connector is present, run
`aos-todoist --mode=pull` *before* assembling the brief — so `TASKS.md` reflects
what the operator already checked off in Todoist. The briefing reads `TASKS.md`;
`aos-todoist` is what keeps it current. If Todoist is not connected, skip this —
`TASKS.md` is read as-is.

### Step 2 (mode=end) — The end-of-day wrap

1. **What moved** — compare `TASKS.md` and `CAPTAINS_LOG.md` against the day:
   tasks closed, content advanced, deliverables written, findings emitted.
2. **Log the day** — append a dated entry to `CAPTAINS_LOG.md`: what moved, any
   decision of consequence, anything left mid-flight.
3. **Set up tomorrow** — name the one or two things to pick up first, so the next
   `start` briefing has a running start.
4. Present the wrap + the proposed `CAPTAINS_LOG` entry — Accept / Revise —
   before writing.

**Todoist sync (if connected).** Offer `aos-todoist --mode=sync` as part of the
wrap — so the day's task changes (items closed in `TASKS.md`, new RECs emitted)
round-trip to Todoist before tomorrow.

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
5. **Single client.** Operate only within the granted folder.
6. **Discovery, not pronouncement.** Recommend a focus; the user decides.

## Output Sections

- **start:** open-work count · loop state · unactioned findings · today's focus
- **end:** what moved · the CAPTAINS_LOG entry · tomorrow's first pick-up
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-route-question` routes "start my day" / "wrap up" here. Reads the output of every loop skill — `TASKS.md`, `CAPTAINS_LOG.md`, `ontology/INDEX.md`, `content/CATALOGUE.md`.
- **Downstream:** the morning briefing's "today's focus" points the user at the right next skill (`aos-plan`, `aos-write`, a diagnostic); the end-of-day `CAPTAINS_LOG.md` entry feeds tomorrow's `start`. Pairs with the cadence architecture in `docs/cadence.md`.
- **Connector:** when the Todoist connector is present, `aos-daily` brackets the day with `aos-todoist` — `--mode=pull` before the morning brief so `TASKS.md` is current, `--mode=sync` at the end-of-day wrap so the day's changes round-trip. See `skills/aos-todoist`, `docs/connectors.md`.

## Versioning

- **v0.2.0** — Todoist integration (AOS-820, Milestone 12). When the Todoist connector is present, the morning brief runs `aos-todoist --mode=pull` first so `TASKS.md` reflects overnight Todoist activity, and the end-of-day wrap offers `--mode=sync`. No dependency — skipped cleanly when Todoist is absent.
- **v0.1.0** — initial Cowork-plugin authoring (AOS-794, Milestone 4 feature wave). The daily cadence routine — morning briefing + end-of-day wrap. Couples to the cadence architecture (`docs/cadence.md`).

**What did we get wrong? What's missing?**
