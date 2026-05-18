# Proactive finding-driven nudges

The AOS loop is **structurally** closed — `aos-measure` emits `FND` artifacts,
`aos-index-ontology` walks the `consumes`/`emits` edges into `ontology/INDEX.md`,
`aos-plan` reads open findings back (`docs/the-loop.md`). But a structurally
closed loop still has a behavioural gap: a finding can sit in
`ontology/findings/` **unread**. The loop closes on paper; nobody looks.

Proactive nudges close that gap. This is the F5 agentic behaviour (AOS-851,
milestone *13. Agentic behaviour*): the assistant **surfaces unactioned findings
unprompted**, at the moments where acting on them is the natural next step —
instead of waiting for the user to open `INDEX.md` and notice.

Companion to `docs/the-loop.md` (the feedback edge) and `docs/cadence.md`.

## What an unactioned finding is

An **unactioned finding** is an open `FND` in `ontology/findings/` that no `REC`
`consumes:` yet — a leaf in the ontology graph. `aos-index-ontology` already
computes this set and lists it in `ontology/INDEX.md` as the
*unactioned-findings list*. A nudge **reads that list**; it does not recompute
it. If `INDEX.md` is stale or absent, a nudge first suggests
`aos-index-ontology` to rebuild it.

## The three nudge moments

A nudge fires at the three points in a session where an unactioned finding is
directly relevant:

| Moment | Owning skill | The nudge |
|--------|--------------|-----------|
| **Session start** | `aos-daily --mode=start` | The session-start brief's "loop's in-tray" line — open FNDs no REC consumes, surfaced as part of the standing brief. |
| **After measure** | `aos-measure` | Right after `aos-measure` emits new FNDs: name them and nudge to `aos-index-ontology` (rebuild the graph) → `aos-plan` (plan against them). A finding is most actionable the moment it is written. |
| **Before plan** | `aos-plan` | At the top of a plan run, inventory open FNDs and surface them as a first-class planning input — the finding-first lens. `aos-plan` already does this; the nudge is to state it up front, visibly. |

Each moment's owning skill carries the nudge in its own `SKILL.md`; this doc is
the shared contract.

## The nudge rule

A nudge is a **prompt, not an action**:

- **Surfaced, never auto-actioned.** A nudge names the unactioned findings and
  the one skill that would action them, and asks. It never silently runs
  `aos-plan` or `aos-index-ontology`. The user decides — the same posture as
  every mutating step in AOS (`docs/design-patterns.md` §3).
- **One line, highest-signal first.** A nudge is short: the count of unactioned
  findings, the single highest-confidence / highest-impact one named, and the
  next skill. Not a dump of every FND — that is what `INDEX.md` is for.
- **Names the forward signal.** Every FND carries a forward signal (what the
  next cycle should do with it — `aos-measure` writes it). The nudge quotes that
  signal, so the user sees *why* it matters, not just that it exists.
- **Do not nag.** One nudge per moment per session. If the user has seen and
  declined a nudge for a given finding this session, do not re-raise it — note
  it stays open and move on. A nudge that repeats becomes noise, and noise gets
  ignored.
- **Nothing to nudge → silent.** No unactioned findings → no nudge line at all.
  The nudge appears only when there is a real finding waiting.

## Why this is not auto-planning

The nudge stops at "here is what is waiting — shall we plan against it?" It does
not plan. Planning is `aos-plan`'s job, behind `aos-plan`'s own confirmation
gate, with the user in the loop. F5 makes a finding **visible at the right
moment**; it does not make the loop run itself. The loop still turns on human
judgement — the nudge just makes sure the judgement is *invited*.
