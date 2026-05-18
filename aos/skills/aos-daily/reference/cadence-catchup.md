---
scope: int-company
---

# Cadence catch-up — the procedure

Companion to `aos-daily/SKILL.md`. The detailed procedure for the **cadence
catch-up** check the session-start brief runs — the F3 behaviour (AOS-849,
milestone *13. Agentic behaviour*).

## Why this exists

Cowork's `/schedule` runs a job **only while the desktop app is open**, with no
catch-up run when the app reopens (`docs/cadence.md` §3). A `weekly` job on a
laptop that was shut over the weekend simply skips that week — silently.

The catch-up check is the mitigation: at session start, `aos-daily` compares
each declared schedule against when it actually last ran, and **surfaces the
overdue ones so the user can run them now**. It does not replace `/schedule` —
it makes a missed run *visible* instead of silent.

## Step 1 — Read the declared schedules

Read the `schedules:` block from `AOS_CONFIG.md` (the manifest at the
granted-folder root — see `docs/cadence.md` §1). Each row is a
`workflow: cadence` pair, e.g.:

```yaml
schedules:
  catalogue:        weekly
  index-ontology:   weekly    last-run: 2026-05-09
  monday-brief:     weekly
  discover-refresh: monthly   last-run: 2026-04-20
```

- If there is **no `schedules:` block**, or every row is commented out, there is
  no cadence to catch up — skip the check silently. The default state is *no
  scheduled work* (`docs/cadence.md` §1).
- A row flagged `runner: server` is **out of scope** — the Cowork plugin cannot
  guarantee it (`docs/cadence.md` §3). Note it in the brief as "needs an
  external runner", but do not offer a catch-up run for it.

## Step 2 — Determine each workflow's last run

For each declared, non-`runner: server` row, find the most recent run:

1. **The `last-run:` annotation is authoritative.** If the row carries
   `last-run: <YYYY-MM-DD>`, use it. `aos-daily` writes this annotation after a
   confirmed catch-up run (Step 4); the user may also set it by hand.
2. **Otherwise, fall back to run-evidence** — the artifact each workflow
   regenerates is its own timestamp:

   | Workflow | Run-evidence (most recent wins) |
   |----------|----------------------------------|
   | `catalogue` | mtime of `inbox/CATALOGUE.md` / `content/CATALOGUE.md` |
   | `index-ontology` | mtime of `ontology/INDEX.md` |
   | `monday-brief` | newest brief file under `deliverables/<YYYY-MM>/` |
   | `discover-refresh` | newest diagnostic deliverable under `deliverables/<YYYY-MM>/` |
   | `run-cycle` | newest `deliverables/<YYYY-MM>/cycle-run.md` |
   | any other skill | its primary output artifact, or a `CAPTAINS_LOG.md` mention |

3. **If neither exists** — the workflow is declared but has no evidence of ever
   running. Treat it as **overdue, last run unknown**.

Run-evidence is best-effort: a regenerated artifact's mtime is a reliable
"last run", but it is a signal, not a ledger. When evidence is ambiguous, say
so in the brief rather than guessing.

## Step 3 — Compute overdue

Map the cadence word to an interval, then compare to the last run:

| Cadence | Interval | Grace |
|---------|----------|-------|
| `daily` | 1 day | +1 day |
| `weekly` | 7 days | +2 days |
| `monthly` | ~30 days | +5 days |
| `quarterly` | ~90 days | +10 days |

A workflow is **overdue** when `today − last-run > interval + grace`. The grace
band keeps a job that is merely a day late off the list — the brief flags
genuine misses, not noise.

## Step 4 — Surface and offer

In the session-start brief, add a **Cadence** line:

- **Nothing overdue** — one line: "Cadence: N schedules, all current."
- **Something overdue** — list each overdue workflow with how late it is and its
  last-run date (or "last run unknown"), then **offer to run the catch-up now**.

The catch-up is **offered, never auto-run** — it is a confirmation gate like
every other mutating action in AOS. The user picks which overdue workflows to
run; `aos-daily` then resolves each to its skill / named run
(`docs/cadence.md` §4) and runs it.

After a catch-up run the user confirmed, **write `last-run: <today>` back into
that workflow's row** in `AOS_CONFIG.md` (add the annotation if absent, update
it if present) — so the next session's check sees it. This write is part of the
catch-up the user already confirmed; show the edited block once.

## Guardrails

- **Offer, never auto-run.** A catch-up run is gated; the user chooses.
- **`runner: server` is never offered.** It is surfaced as out-of-scope, with
  the `docs/cadence.md` §3 escalation note.
- **A missed self-healing job is low-stakes.** `catalogue` / `index-ontology`
  rebuild from scratch — a skipped week costs only freshness. Say so; do not
  alarm. `monday-brief` / `discover-refresh` missed = a missed read-out, not
  lost data.
- **Best-effort, stated as such.** When last-run evidence is unknown or
  ambiguous, the brief says "last run unknown" — never a fabricated date.
