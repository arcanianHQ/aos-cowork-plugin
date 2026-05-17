---
name: aos-todoist
description: "Sync the engagement task list (TASKS.md) with Todoist — push AOS tasks to a Todoist project, pull completions and operator-added tasks back. Connector-gated on Todoist; the operator runs the day in Todoist while AOS keeps TASKS.md authoritative for what work exists. Trigger on 'sync Todoist', 'push tasks to Todoist', 'pull my Todoist tasks', 'sync my tasks'."
scope: int-company
flavor: [company, advanced, internal]
class: system
domain: strategy
layer: all
client-scope: single-client
version: 0.1.1
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--mode=<sync|push|pull>] — operates on the granted folder; uses the Todoist connector when present"
inputs:
  - AOS_CONFIG.md (the client identity + the todoist: block — project / section IDs)
  - client/CLIENT_CONFIG.md (bu-model — multi-BU clients map BUs to Todoist sections)
  - TASKS.md (the engagement task list — the Open + Done tables)
  - Todoist MCP tools (find-projects, add-projects, find-sections, add-sections, find-tasks, add-tasks, update-tasks, complete-tasks — when the connector is present)
outputs:
  - TASKS.md (the Todoist ID column written back; completions reflected; operator-added Todoist tasks pulled into Open)
  - AOS_CONFIG.md (the todoist: block — the resolved project / section IDs)
preflight:
  - client-config
connector:
  name: todoist
  required: true
  degrades: false
ontology:
  consumes: [REC]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-onboard
tags: [todoist, tasks, sync, connector, cadence, workflow]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given
access to, which **is** one client's folder. The granted-folder root is the
working directory. Resolve zones per `docs/data-access-router.md` and the
`AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone
layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client`
field of `AOS_CONFIG.md`. Todoist itself is **not** AOS storage — it is a remote
connector; the granted folder's `TASKS.md` remains the authoritative task list.

## Language

Resolve `communication-language` from `AOS_CONFIG.md` (per
`docs/language-context.md`) — never hard-code a language. Talk to the user in
`communication-language`. Task **content** pushed to Todoist is left in whatever
language `TASKS.md` already uses — `aos-todoist` mirrors text, it does not
translate it.

## Purpose

`aos-todoist` is the **task-sync bridge** — it keeps the engagement's `TASKS.md`
and a Todoist project in step, so the operator can run a busy day (5–10 parallel
tasks) in Todoist while AOS keeps `TASKS.md` as the system of record.

The division of authority is deliberate:

- **`TASKS.md` is authoritative for what work exists.** AOS skills emit
  recommendations (`REC`) that land in `TASKS.md`; that is where a task is *born*.
- **Todoist is authoritative for completion.** The operator checks tasks off in
  Todoist through the day; `aos-todoist` pulls those completions back.

It is the connector sibling of `aos-daily` (the cadence routine) and
`aos-registry` (the account index) — a `class: system` plumbing skill, not a
GTM-content or intelligence skill.

**Anti-goal.** `aos-todoist` does not *create* tasks of its own, plan, or
prioritise. It mirrors `TASKS.md` ⇄ Todoist. The plan is `aos-plan`; the daily
orientation is `aos-daily`. `aos-todoist` is the sync underneath them.

## Connector — Todoist (required, no degrade)

This skill is **connector-gated on Todoist** — and unlike `aos-measure`'s
Databox gating, there is **no degraded mode**: a task-sync skill with nothing to
sync to has no useful half-state. A connector counts as connected **only if its
MCP tools are present in the session**.

- **Todoist present** → run the sync.
- **Todoist absent** → **do not fail loudly, do not pretend.** Tell the user
  Todoist is not connected, point them at `aos-onboard` (Step 5 adds conditional
  connectors), and stop. `TASKS.md` continues to work without Todoist — the sync
  is an enhancement, never a dependency. This keeps the open-source plugin fully
  usable backend-free; Todoist is opt-in.

## The mapping model

| AOS — `TASKS.md` | Todoist |
|---|---|
| The engagement (one granted folder) | one **project**, named for the `client` |
| A business unit (multi-BU `bu-model`) | a **section** within that project |
| A row in the `## Open` table | a **task** in the project / its BU section |
| `Layer` (e.g. `L4`) | a **label** — `@L4` |
| `Priority` — High / Medium / Low | Todoist priority — `p1` / `p2` / `p3` (Low→`p3`; Todoist's `p4` default = unset) |
| A row in the `## Done` table | a **completed** task |
| `Source` (the `REC-NNN` / skill) | appended to the task **description**, so the AOS provenance survives in Todoist |

The join key is a **`Todoist ID` column** added to the `## Open` table. On its
first run against a `TASKS.md` that has the original five columns, `aos-todoist`
appends a sixth column, `Todoist ID`, and fills it as it creates Todoist tasks.
That ID is what makes every later sync deterministic and idempotent — a task is
matched by ID, never re-created by title.

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest, the
   `client` identity, and any existing `todoist:` block.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`, stop.
3. **Connector check** — determine whether the Todoist MCP tools are present in
   the session. If absent → see "Connector — Todoist" above; stop.
4. Validate `--mode` (`sync` default, or `push` / `pull`).
5. **Pre-read `TASKS.md`** (the Write/Edit harness rule).

### Step 1 — Resolve the Todoist project

1. If `AOS_CONFIG.md` has a `todoist:` block with a `project-id`, trust it
   (verify it still exists with `find-projects`).
2. Otherwise, `find-projects` by the client name. If a project matches, confirm
   it with the user. If none, **ask before creating** — then `add-projects` one
   named for the client.
3. **Multi-BU** — if `CLIENT_CONFIG.md` declares a `bu-model` with multiple BUs,
   resolve one **section** per BU (`find-sections`; `add-sections` for any
   missing, after confirmation). A single-BU client uses no sections.
4. Write the resolved `project-id` and the `section` map back into the
   `AOS_CONFIG.md` `todoist:` block — this skill owns that block.

### Step 2 — Read both sides

1. Parse `TASKS.md` — the `## Open` table and the `## Done` table.
2. `find-tasks` for the resolved Todoist project (open tasks), and the project's
   completed tasks (`find-completed-tasks`) for the rows expected in `## Done`.

### Step 3 — Reconcile

Build the reconciliation plan by the join key. The cases (v0.1.0):

| State | Action |
|---|---|
| Open row, **no** `Todoist ID` | **create** a Todoist task; write the new ID back to the row |
| Open row, has `Todoist ID`, Todoist task **open**, fields differ | **update** the Todoist task to match `TASKS.md` (`push`/`sync`) |
| Open row, has `Todoist ID`, Todoist task **completed** | **pull**: move the row to `## Done` in `TASKS.md` |
| `Done` row, has `Todoist ID`, Todoist task still **open** | **push**: `complete-tasks` the Todoist task |
| A Todoist task in the project with **no matching row** | **pull**: offer to add it to `## Open` (a task the operator created directly in Todoist) |
| Same task changed **on both sides** since last sync | **divergence — do not auto-resolve.** Surface both versions to the user and let them choose. (See Hard Rules.) |

`--mode` scopes which directions run: `push` = `TASKS.md` → Todoist only;
`pull` = Todoist → `TASKS.md` only; `sync` (default) = both.

### Step 4 — Apply

**Show the reconciliation plan first — then write. This gate is not skippable.**
Present every create / update / complete / pull, counted, and get **Accept /
Revise** before *any* Todoist write or `TASKS.md` edit. A push that looks
mechanical ("just three creates", "the mapping is obvious") still creates real
tasks in the user's **real Todoist account** — an outward-facing write that is
not freely reversible. "It's mechanical" is never grounds to execute first and
report after. Plan → Accept → write. Then:

- `add-tasks` (max 25 per call) / `update-tasks` / `complete-tasks` on Todoist;
  use `reschedule-tasks`, never `update-tasks`, to move a due date.
- `Edit` `TASKS.md` — write back `Todoist ID`s, move pulled completions to
  `## Done`, append operator-added tasks to `## Open`, update `Last updated:`.

### Step 5 — Confirm & summarise

Report what synced: created / updated / completed / pulled counts, the project
(and sections), and any divergence left for the user to resolve.

## Provenance

`TASKS.md` is a running list — appended and edited in place, not stamped with a
provenance block. The `Source` column already carries each task's `REC` / skill
origin, and that origin is mirrored into the Todoist task description so the
provenance survives a round-trip.

## Hard Rules

1. **Connector-gated, no fabrication.** No Todoist connector → say so and stop.
   Never simulate a sync or invent task IDs.
2. **Match by ID, never by title.** The `Todoist ID` column is the join key —
   re-running the sync must never duplicate a task. Idempotent by construction.
3. **Never auto-resolve a divergence.** A task edited on both sides since the
   last sync is shown to the user with both versions — the user decides. Same
   posture as a wiki conflict: surface, don't guess.
4. **Confirm before writing — no exceptions.** The reconciliation plan is shown
   and **Accepted** before any Todoist write or any `TASKS.md` edit. "The
   mapping is mechanical" / "it is only a few creates" is **not** grounds to
   skip the gate — a push writes to the user's real Todoist account. Plan →
   Accept → write, every run, every direction.
5. **`TASKS.md` stays authoritative for existence; Todoist for completion.** A
   task is born in `TASKS.md`; it is finished in Todoist. Respect both.
6. **Single client.** One granted folder ⇄ one Todoist project. Never touch
   another client's project, and never read across clients.
7. **Todoist is a connector, not storage.** No AOS state lives only in Todoist —
   `TASKS.md` is always the durable copy.

## Output Sections

- Connector status — Todoist connected / not connected
- The Todoist project (+ BU sections) resolved
- Reconciliation — created / updated / completed / pulled counts
- Divergences surfaced for the user
- `TASKS.md` path
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` adds the Todoist connector (Step 5, conditional
  connectors) and seeds the `todoist:` block; every loop skill that emits a `REC`
  feeds `TASKS.md`; `aos-route-question` routes "sync Todoist" here.
- **Downstream:** `aos-daily`'s morning briefing reads the synced `TASKS.md`, so
  the operator's Todoist day and the AOS loop state stay one picture.
- **Sibling:** `aos-daily` (the cadence routine) and `aos-registry` (the account
  index) — the same `class: system` plumbing pattern.

## Versioning

- **v0.1.1** — the reconciliation-plan confirmation gate hardened (AOS-817
  dogfood finding, 2026-05-17): a live run skipped the Accept/Revise gate on a
  push, self-justifying "the mapping is mechanical". Step 4 + Hard Rule 4 now
  state the gate is not skippable — a push creates real tasks in the user's real
  Todoist account; plan → Accept → write, every run.
- **v0.1.0** — initial Cowork-plugin authoring (AOS-817, Milestone 12 —
  Arcanian Dogfood). The `TASKS.md` ⇄ Todoist sync bridge: connector-gated,
  ID-keyed and idempotent, `TASKS.md`-authoritative-for-existence /
  Todoist-authoritative-for-completion, divergence surfaced not auto-resolved.
  The mapping model (AOS-818) and conflict semantics (AOS-819) are folded in at
  v0.1.0 strength; the connector / `aos-daily` wiring is AOS-820.

**What did we get wrong? What's missing?**
