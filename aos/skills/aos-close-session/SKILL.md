---
name: aos-close-session
description: "Close a Cowork session cleanly — the end-of-session housekeeping orchestrator. Before the user leaves, it refreshes the indexes that went stale during the session (aos-catalogue for inbox/ + content/, aos-index-ontology for the ontology graph — each only when its inputs changed), runs the aos-daily end-of-day wrap so the next session has a continuity hand-off, and reports a clean, resumable state. A spoken command — Cowork has no shutdown hook, so the user invokes it deliberately. Trigger on 'close session', 'close the session', 'exit', 'I'm done', 'I'm leaving', 'wrap up and close', 'shut it down', 'that's it for today'."
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: orchestration
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "[--skip-reindex] — operates on the granted folder; no client argument"
inputs:
  - AOS_CONFIG.md (zone manifest, client identity, schema-version)
  - client/CLIENT_CONFIG.md
  - inbox/CATALOGUE.md · content/CATALOGUE.md (the catalogue-staleness check)
  - ontology/INDEX.md (the ontology-index-staleness check)
  - ontology/findings/ · ontology/recommendations/ · ontology/gotchas/ (change detection)
  - CAPTAINS_LOG.md (the wrap reads recent activity)
outputs:
  - inbox/CATALOGUE.md · content/CATALOGUE.md (via aos-catalogue — only when stale)
  - ontology/INDEX.md (via aos-index-ontology — only when stale)
  - CAPTAINS_LOG.md (via aos-daily --mode=end — the ## Session summary block)
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
depends_on:
  - aos-catalogue
  - aos-index-ontology
  - aos-daily
tags: [close, session, housekeeping, orchestration, workflow, cadence, agentic]
---

# AOS close-session

You are the **end-of-session housekeeping orchestrator**. The Cowork VM is
ephemeral — when the user closes the task, the session is gone and only the
granted folder persists. This skill is the one thing to run *before* that: it
leaves the granted folder **current and resumable**, so the next cold session
picks the thread up cleanly.

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given
access to, which **is** one client's folder (no per-client nesting). The
granted-folder root is the working directory. Resolve zones (`client/`, `inbox/`,
`content/`, `ontology/`, `deliverables/`, …) per `docs/data-access-router.md` and
the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths
beyond the documented zone layout. Bash + filesystem on the granted folder is the
contract; the router is an optimization.

## Language

Resolve `communication-language` from `AOS_CONFIG.md` during context assembly
(per `docs/language-context.md`) — never hard-code a language. Talk to the user
in `communication-language`.

## Purpose

`aos-close-session` is the housekeeping analogue of `aos-run-cycle` — it does no
work of its own; it runs three existing skills in order and reports the result:

```
change-detect → aos-catalogue? → aos-index-ontology? → aos-daily --mode=end → exit report
                 (if inbox/ or     (if ontology/         (the ## Session         clean &
                  content/ changed)  artifacts changed)    summary block)         resumable?
```

A clean close-out is otherwise three skills the user has to remember to run, in
the right order. This skill is the single **"close session" / "exit"** command
for that — re-index what went stale, write the continuity hand-off, report.

**A spoken command, by necessity.** Cowork has no shutdown hook — nothing fires
when the user actually closes the task. So `aos-close-session` cannot run
automatically on exit; the user invokes it deliberately, by saying "close
session" / "exit" / "I'm done", *before* leaving. If a session is closed without
it, the next session's `aos-daily --mode=start` finds no `## Session summary`
block and flags the gap — a *detected* miss, not a prevented one.

**Anti-goal.** It invents nothing and produces no artifact of its own. Every
artifact is produced by the skill that owns it (`aos-catalogue`,
`aos-index-ontology`, `aos-daily`). It does not plan, draft, diagnose, or ship,
and it does not skip the human gate `aos-daily` carries.

## Posture

Minimal friction — this is the *last* thing the user does. The re-index steps are
deterministic and run without a gate; the only stop is `aos-daily`'s
session-summary confirmation. A close where nothing changed is near-instant: the
skill reports "indexes already current" and goes straight to the wrap.

## The steps

| # | Step | Skill | Gate | Runs when |
|---|------|-------|------|-----------|
| 1 | catalogue | `aos-catalogue` | none (deterministic) | `inbox/` or `content/` changed since the last catalogue |
| 2 | index | `aos-index-ontology` | none (deterministic) | `ontology/` artifacts changed since the last index |
| 3 | wrap | `aos-daily --mode=end` | confirm | always |

## Arguments

This skill operates on the **granted folder**. There is no client-slug argument.

- `--skip-reindex` — skip the change detection and the re-index steps; run only
  the `aos-daily` wrap. The fast close — use it when nothing material changed, or
  when `aos-catalogue` / `aos-index-ontology` were just run by hand.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md`
   for the zone manifest, `client` identity, and `schema-version`.
2. `client-config-soft` — if `client/CLIENT_CONFIG.md` is absent the folder is
   barely onboarded; `aos-close-session` still runs (a close-out is always safe),
   but note it and suggest `aos-onboard` in the exit report.
3. **Schema note, not gate.** Compare `AOS_CONFIG.md`'s `schema-version` to
   `docs/CURRENT_SCHEMA_VERSION`. If the folder is behind, **do not block** — a
   user must always be able to close a session. Record it for the exit report
   ("this folder is schema N, the plugin is M — run `aos-migrate` next session").

### Step 1 — Change detection

Skip this step entirely if `--skip-reindex` was passed — go to Step 3.

Decide, by file mtime, whether each index is stale:

- **Catalogue.** Is any file under `inbox/` or `content/` newer than that zone's
  `CATALOGUE.md`? — `find inbox content -type f -newer inbox/CATALOGUE.md` (and
  the same against `content/CATALOGUE.md`), excluding the `CATALOGUE.md` files
  themselves and `inbox/_processed/`. Any hit → the catalogue is **stale**.
- **Ontology index.** Is any file under `ontology/findings/`,
  `ontology/recommendations/`, or `ontology/gotchas/` newer than
  `ontology/INDEX.md`? Any hit → the index is **stale**.
- A missing `CATALOGUE.md` / `INDEX.md` counts as stale (never indexed yet).

Report what was found — "inbox changed since the last catalogue → will
re-index", or "indexes already current → nothing to re-index".

### Step 2 — Conditional re-index

- If the catalogue is stale → **invoke `aos-catalogue`**, honouring its full
  `SKILL.md`. If it is current → skip it, and say so.
- If the ontology index is stale → **invoke `aos-index-ontology`**, honouring its
  full `SKILL.md`. If it is current → skip it, and say so.
- Both are deterministic (read + write); neither has a confirmation gate. Run
  them without stopping. If nothing was stale, this step is a clean no-op.

### Step 3 — The session wrap

**Invoke `aos-daily --mode=end`**, honouring its full `SKILL.md`. It reviews what
moved and writes the structured `## Session summary` block to `CAPTAINS_LOG.md` —
the working-memory hand-off the next session's `--mode=start` reads back. This is
the **one human gate**: `aos-daily` shows the proposed summary block and waits for
Accept / Revise before writing. `aos-close-session` does not re-implement the
wrap and does not bypass that gate.

### Step 4 — Exit report

Present a short close-out report — the last thing the user sees:

1. **Re-indexed** — which of `aos-catalogue` / `aos-index-ontology` ran, or
   "indexes already current".
2. **Session logged** — the `## Session summary` block written to
   `CAPTAINS_LOG.md`, and the concrete next-session resume point it carries.
3. **Resumable-state verdict** — one line: the folder is current and the next
   session has a clean hand-off. Or surface any **close-out smell** as a short
   "before you go" list:
   - a `content/` piece at `status: draft` with no `PASS` review in
     `deliverables/` — it will not ship until reviewed;
   - the folder is behind the plugin schema (Step 0) — `aos-migrate` next session;
   - `client/CLIENT_CONFIG.md` absent — the folder is not fully onboarded.
   Smells are **advisory** — they never block the close.

End with: the session is closed and it is safe to exit.

## Provenance

`aos-close-session` writes no artifact of its own — the chained skills stamp
their own outputs (`docs/artifact-versioning.md` §1). `CAPTAINS_LOG.md` is a
running log, appended in place by `aos-daily`.

## Hard Rules

1. **Orchestrate, don't do.** Every step's work is done by the owning skill,
   honouring its full `SKILL.md`. `aos-close-session` never re-implements
   cataloguing, indexing, or the wrap.
2. **Never block the close.** A behind-schema folder, a missing `CLIENT_CONFIG`,
   an unreviewed draft — all are *reported*, never a reason to refuse. A user
   must always be able to close a session.
3. **Re-index only what is stale.** `aos-catalogue` / `aos-index-ontology` run
   only when change detection (or a missing index) says so. A close where
   nothing changed re-indexes nothing — no churn.
4. **The wrap's gate is preserved.** `aos-daily --mode=end` shows its
   `## Session summary` block and waits for confirmation; `aos-close-session`
   never bypasses it.
5. **A spoken command.** This skill cannot auto-run on exit — Cowork has no
   shutdown hook. It runs only when the user invokes it.
6. **Single client.** Operate only within the granted folder; never reach
   outside it.
7. **Discovery, not pronouncement.** The exit report recommends; it does not
   nag. End with *"What did we get wrong? What's missing?"*

## Integration

- **Chains:** `aos-catalogue` → `aos-index-ontology` → `aos-daily --mode=end`.
- **Router:** `aos-route-question` discovers this skill by its `description` —
  "close session" / "exit" / "I'm done" route here. The router has no hard-coded
  table (v0.5.0+), so no router edit is needed.
- **Sibling — `aos-daily`.** `aos-daily --mode=end` is the wrap this skill
  orchestrates; it stays independently invokable for a mid-session "log where I
  am" without the re-index. `aos-daily --mode=start` is the other bookend — it
  reads the `## Session summary` block this skill's wrap produced.
- **Sibling — `aos-run-cycle`.** `aos-run-cycle` orchestrates *running the loop*;
  `aos-close-session` orchestrates *closing the session*. Same pattern
  (orchestrate, don't do; honour each skill's full `SKILL.md`), different job.

## Versioning

- **v0.1.0** — initial authoring (AOS-902, milestone *7. Feedback & iteration*).
  The end-of-session housekeeping orchestrator — surfaced from a pilot question,
  "is there a housekeeping skill before I close a Cowork task?". Built on the
  `aos-run-cycle` orchestration pattern. The change-detection heuristic (file
  mtime vs the `CATALOGUE.md` / `INDEX.md` files) likely needs refinement after
  first real runs — e.g. honouring the `Last catalogued:` stamp as a fallback
  when mtimes are unreliable on a cloud-synced folder.

**What did we get wrong? What's missing?**
