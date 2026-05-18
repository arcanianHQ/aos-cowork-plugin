# Parallel fan-out — running independent work concurrently

Some AOS skills do work that splits into **independent units** — a diagnostic
that examines several layer groups, a plan run that covers several business
units, a content series that drafts several pieces. When those units do not
depend on one another, they can run **concurrently in parallel sub-agents**
instead of one after another. This doc is the build of architecture-gaps —
the F4 agentic behaviour (AOS-850, milestone *13. Agentic behaviour*).

Companion to `docs/design-patterns.md` (pattern 10) and `docs/the-loop.md`.

## The pattern

A skill with N independent work units:

1. **Splits** the work into units that share no ordering dependency — no unit
   reads another unit's output.
2. **Fans out** — dispatches each unit to its own sub-agent, all at once.
3. **Joins** — waits for every unit, collects the results.
4. **Synthesises** — the *parent* skill merges the unit results into the one
   coherent artifact. Synthesis is never fanned out: it is the step that needs
   to see all units at once.

```
        ┌─ sub-agent: unit A ─┐
parent ─┼─ sub-agent: unit B ─┼─▶ parent synthesises ─▶ the artifact
        └─ sub-agent: unit C ─┘
```

The fan-out changes **latency, not output**. A parallel run and a sequential
run of the same skill produce the **same artifacts** — same files, same
frontmatter, same provenance. Fan-out is an optimisation, never a different
result.

## Graceful degradation — the contract

The Cowork runtime does not guarantee a sub-agent capability — the VM facts
(`reference_cowork_vm_facts`) confirm an ephemeral sandbox, not a sub-agent
surface. So **every fan-out site degrades**:

> Fan the units out to parallel sub-agents **when the runtime exposes that
> capability**; otherwise run the same units **sequentially**. The result is
> identical — only the wall-clock time differs.

This is the same posture as `design-patterns.md` §6 (connector-aware graceful
degradation): a capability that may be absent is used when present and fallen
back from cleanly when absent — never half-failed. A skill that fans out **never
hard-depends** on sub-agents, and **never declares a `Task`/sub-agent tool in
its `allowed-tools`** — the fan-out uses whatever concurrency the runtime
offers; the SKILL.md prose carries the "if available, else sequential" gate.

## When a fan-out is valid — the independence test

Fan out **only** when the units are genuinely independent. Before splitting,
check:

- **No cross-unit reads.** Unit B must not need unit A's output. (A diagnostic
  *synthesis* reads every pass — so synthesis is the parent's job, not a unit.)
- **Disjoint writes.** Two units must not write the same file. Per-BU units
  write per-BU paths; per-piece units write per-piece files — disjoint by
  construction. If two units would write the same artifact, they are not
  independent — do not fan them out.
- **The gates stay with the parent.** A unit does not run a
  `safety.requires_confirmation` gate on its own — it produces its result; the
  parent presents the merged artifact at the skill's normal gate. Fan-out does
  not multiply the human gates.

If the independence test fails, run sequentially. A wrong parallelisation that
races on a file is worse than a slow correct one.

## The fan-out sites

Three skills in the current set have a natural fan-out:

| Skill | Units | Independence |
|-------|-------|--------------|
| `aos-diagnose-7layer` | the 4 layer-grouped passes (Foundation L0+L1, Value L2+L3, Delivery L4+L5, Market L6+L7); and, under `--peer-review`, the 3 diagnostic perspectives | each pass examines its own layers; the parent does the constraint synthesis |
| `aos-draft-content` (series mode) | the per-piece drafts, once each beat's type + structure is resolved | each piece writes its own `NN-<beat>.md`; the parent writes `INDEX.md` |
| any per-BU run (`aos-plan`, `aos-measure`, `aos-draft-content`) | one unit per business unit | per-BU paths are disjoint; per-BU work is already "never collapse BUs" |

A skill that fans out names its units and the join + synthesis step in its own
`SKILL.md`, and points here for the pattern. Adding a new fan-out site is a
SKILL.md change plus a row here — no runtime code.

## What never fans out

- **Synthesis** — the step that must see all units at once (the constraint
  judgement, the series `INDEX.md`, a cross-BU read-out).
- **The human gates** — `safety.requires_confirmation` is a parent-level step.
- **Anything with cross-unit dependency** — see the independence test.
- **Ordered loop stages** — `aos-run-cycle`'s `measure → plan → draft → …` is a
  *pipeline*, not independent units; it never fans out (each stage feeds the
  next). Fan-out is for independent work *within* a stage.

## Provenance

Every artifact a fanned-out unit writes carries the **same provenance block** as
a sequential run (`docs/artifact-versioning.md` §1) — `generated_by` is the
parent skill's name, not a sub-agent name. A sub-agent is an execution detail;
the skill that owns the work owns the provenance.
