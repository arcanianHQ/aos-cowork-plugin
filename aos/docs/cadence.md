# Cadence — recurring AOS workflows

AOS does recurring work. The loop is not a one-shot pipeline — `catalogue`
refreshes as inbox material lands, `aos-index-ontology` rebuilds the graph as
findings accumulate, discovery is re-run on a slower beat, and an engagement
benefits from a regular read-out (a "Monday brief"). This doc is the build of
architecture-gaps §4 (AOS-735): the **declaration mechanism** for that recurring
work, and an honest account of what the Cowork runtime can and cannot guarantee.

Companion to `docs/the-loop.md` (the loop the recurring work drives) and
`docs/architecture-gaps.md` §4.

---

## 1. The declaration — a `schedules` block in `AOS_CONFIG.md`

Recurring work is declared **as data**, in the granted folder — not in plugin
code. It lives in a `schedules:` block in `AOS_CONFIG.md`, alongside the zone
manifest. This matches the data-folder model: the plugin ships the skills, the
granted folder carries the configuration.

```yaml
schedules:
  catalogue:          weekly        # re-index inbox/ + content/
  monday-brief:       weekly        # the loop's weekly read-out
  index-ontology:     weekly        # rebuild ontology/INDEX.md
  discover-refresh:   monthly       # re-run discovery on fresh inbox material
```

Each row is a `workflow: cadence` pair:

- **workflow** — either a routable skill (`catalogue` → `aos-catalogue`,
  `index-ontology` → `aos-index-ontology`) or a **named recurring run** that maps
  to a known sequence (`monday-brief`, `discover-refresh` — see §4).
- **cadence** — one of a small fixed vocabulary: `daily`, `weekly`, `monthly`,
  `quarterly`. Nothing finer-grained; AOS recurring work is days-and-up.

`aos-onboard` seeds the block **commented-out** in the `data-template`
`AOS_CONFIG.md` — the default state is *no scheduled work*. The user (or the
operator, at Stage 1) uncomments the rows they want. The block is plain data:
inspectable, editable, diffable, version-controlled with the rest of the granted
folder.

There is **no `schedules.md`** and no separate skill for this. A standalone file
would be a second source of install config competing with `AOS_CONFIG.md`; a
skill would be ceremony around editing four lines of YAML. The mechanism is: a
config block + the runtime's own scheduler (§2).

## 2. How the schedule actually runs — Cowork `/schedule`

The `schedules` block is a *declaration*. The thing that *fires* it is **Cowork's
own `/schedule` command** — the Claude Cowork desktop app's built-in scheduler.
The user (once, at setup) registers each declared workflow with `/schedule`:

> `/schedule weekly run aos-catalogue on <granted folder>`

The `schedules` block in `AOS_CONFIG.md` is then the **source of truth for what
*should* be scheduled** — the checklist a human (or `aos-onboard`) works through
when registering jobs, and the record `aos-route-question` can read to answer
"what runs on a cadence here". The block declares; `/schedule` executes.

We deliberately do **not** try to make the plugin self-schedule. Cowork plugins
have no hook surface and no background-process surface (see
`reference_cowork_vm_facts` — plugin hooks don't fire, the VM is ephemeral). The
only scheduler in reach is the one the desktop app exposes to the user. AOS's job
is to *declare* the cadence and make registration a mechanical step, not to
reinvent a scheduler it cannot host.

## 3. The hard caveat — `/schedule` runs only while the app is open

**Cowork's `/schedule` runs a job only while the desktop application is open.**
It is not a server-side cron. If the app is closed at the scheduled time, the job
does not fire — and there is no catch-up run when the app next opens. A `weekly`
job on a laptop that was shut over the weekend simply skips that week.

For most AOS recurring work this is acceptable:

- `catalogue`, `index-ontology` — a missed run self-heals on the next run; the
  index is rebuilt from scratch each time, so a skipped week costs nothing but
  freshness.
- `monday-brief`, `discover-refresh` — a missed run is a missed *read-out*, not
  lost data. The user runs it manually when they next open the app.

But some work is **unattended-critical** — it must run on time whether or not a
human is at the desktop (a client-facing scheduled send, a billing-window
export, a compliance snapshot). For that class of work, **Cowork `/schedule` is
not a safe runner.**

### The rule

A workflow that is unattended-critical is flagged in the `schedules` block:

```yaml
schedules:
  monthly-export:   monthly   runner: server   # MUST run on time — not via Cowork
```

`runner: server` is a **declaration that this job needs a server-side runner**
(a real cron, a hosted scheduler) — which the Cowork-plugin delivery does **not**
provide. The flag does not make the job fire; it marks the job as *out of scope
for the client-run plugin* and surfaces the gap honestly:

- `aos-onboard` and `aos-route-question`, when they read a `runner: server` row,
  state plainly: *"this job needs a server-side runner; the Cowork plugin cannot
  guarantee it — schedule it externally."*
- It is never silently registered with `/schedule` and left to look reliable.

AOS as a client-run Stage-3 delivery has **no backend** (see the README). So
`runner: server` is, today, a documented escalation, not a feature. If a client
genuinely needs guaranteed unattended runs, that is a Stage-1/Stage-2
(operator-run) capability or a future hosted-runner add-on — not something the
Cowork plugin should pretend to do.

## 4. Named recurring runs

Two rows in the example block are not single skills — they are **named recurring
runs**, a known sequence given a stable name:

- **`monday-brief`** — the loop's weekly read-out. A short, recurring pass:
  re-index the ontology (`aos-index-ontology`), read `ontology/INDEX.md`'s
  unactioned-findings list and `TASKS.md`, and produce a one-page brief —
  *what shipped, what was learned, what is still open, what to do next week*.
  It writes the brief to `deliverables/<YYYY-MM>/` and does not emit ontology
  artifacts. It is a *reading* of the loop's current state, not a new loop turn.
- **`discover-refresh`** — the monthly re-discovery beat: re-run `aos-catalogue`
  over `inbox/`, then route the fresh material through the relevant
  `aos-diagnose-*` / `aos-analyze-gtm` workflow. This is the loop's slow outer
  cycle — discovery does not need to run weekly.

A named run is registered with `/schedule` exactly like a skill; when it fires,
the assistant resolves the name to its sequence. The mapping lives here, in this
doc, so a new named run is a documentation change, not a code change.

## 5. Summary

| Concern | Answer |
|---|---|
| Where cadence is declared | `schedules:` block in `AOS_CONFIG.md` |
| Cadence vocabulary | `daily` · `weekly` · `monthly` · `quarterly` |
| What fires it | Cowork's built-in `/schedule` command |
| Reliability | Runs **only while the desktop app is open**; no catch-up |
| Unattended-critical work | Flag `runner: server`; the plugin cannot guarantee it — escalate |
| New recurring sequence | Add a named run to §4 — no code change |
