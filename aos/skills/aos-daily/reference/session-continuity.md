---
scope: int-company
---

# Session continuity — the working-memory hand-off

Companion to `aos-daily/SKILL.md`. The format and the read/write discipline for
the **session summary** — the F6 behaviour (AOS-852, milestone *13. Agentic
behaviour*).

## Why this exists

The Cowork runtime is an **ephemeral VM** (`reference_cowork_vm_facts`): every
session starts cold — no memory of the last one. What persists is the **granted
folder**. So the granted folder has to *be* the working memory: if a session
writes down where it got to, the next session can pick the thread up.

`CAPTAINS_LOG.md` is that durable memory. F6 gives it a **structured session
summary** — written by `aos-daily --mode=end`, read first by
`aos-daily --mode=start` — so continuity across ephemeral sessions is a defined
hand-off, not a hope.

## The session-summary block

`aos-daily --mode=end` appends one block to `CAPTAINS_LOG.md`:

```markdown
## Session summary — <YYYY-MM-DD>

- **Worked on:** <the focus of this session — one line>
- **Moved:** <tasks closed · content advanced · deliverables written · FNDs/RECs emitted — concrete, with paths/ids>
- **Loop state:** <where the engagement sits in onboard → … → measure ↺ after this session>
- **Open / mid-flight:** <anything left incomplete — the precise resume points: a half-drafted piece, a cycle paused at a stage, a review awaiting a foundation edit>
- **Decisions:** <any decision of consequence taken this session — or "none">
- **Next session:** <the one or two things to pick up first>
```

It is appended in place — `CAPTAINS_LOG.md` is a running log, not a stamped
artifact. The newest block is the most recent session.

The block is **structured on purpose**: fixed fields, so the next session's
`start` can read it mechanically. Freeform prose hides the resume point; a
`**Open / mid-flight:**` field surfaces it.

## The read side — session start

`aos-daily --mode=start` reads the **most recent `## Session summary` block** in
`CAPTAINS_LOG.md` *before* assembling the rest of the brief, and opens the brief
with the continuity hand-off:

> *Last session (<date>) you worked on X. You left Y mid-flight — <resume point>.
> The planned next step was Z.*

It then reconciles that against live state — `TASKS.md`, `content/CATALOGUE.md`,
the ontology — because state may have moved since (a scheduled run, another
session). The summary is the **hand-off**, not the source of truth: where the
summary and live state disagree, live state wins, and the brief notes the drift.

If there is no `## Session summary` block yet (a fresh granted folder, or
pre-F6 history), the brief simply skips the continuity line — no error.

## Discipline

- **One summary per `end` run.** Not one per task — the summary is the
  session-level hand-off. `aos-run-cycle` and other skills still write their own
  granular `CAPTAINS_LOG.md` lines; the session summary sits alongside them.
- **The resume point is concrete.** "Open / mid-flight: garage-flooring blog
  half-drafted at `content/2026-05-18-blog-...md`, needs the CTA section" — not
  "some content in progress". The next session acts on it; it must be precise.
- **Honest, like the rest of the wrap.** A session where little moved is
  summarised as such (`aos-daily` Hard Rule 3). The summary records what did
  *not* move too — that is itself a resume signal.
- **Confirmed before writing.** The session-summary block is part of the `end`
  wrap shown to the user before the `CAPTAINS_LOG.md` append (`aos-daily`
  Hard Rule 4).
