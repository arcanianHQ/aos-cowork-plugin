---
scope: int-company
---

# Cycle-run progress file — template

Companion to `SKILL.md`. The shell for `deliverables/<YYYY-MM>/cycle-run.md` —
the loop-runner's durable progress + summary file. It is written at Step 1,
updated at every stage transition (Step 2.5), and finalised at Step 4.

It is the **source of truth for cycle progress**: an interrupted cycle resumes
from this file via `aos-run-cycle --resume`.

## The file — `deliverables/<YYYY-MM>/cycle-run.md`

```markdown
---
scope: int-confidential
client: <slug>
business_unit: <set for multi-BU clients>
generated_by: aos-run-cycle
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
horizon: <this-month | quarter>
cycle_status: in-progress    # in-progress | complete | halted
started: <YYYY-MM-DD HH:MM>
finished: <YYYY-MM-DD HH:MM — set at close>
---

# Cycle run — <Client Display Name>[ — <BU>] — <YYYY-MM>

> One turn of the AOS loop. This file tracks where the cycle got to; each
> stage's real output is its own artifact, linked below.

## Stage checklist

| # | Stage | Skill | Status | Started | Finished | Result |
|---|-------|-------|--------|---------|----------|--------|
| 1 | measure | aos-measure | pending | | | |
| 2 | index | aos-index-ontology | pending | | | |
| 3 | plan | aos-plan | pending | | | |
| 4 | draft | aos-draft-content | pending | | | |
| 5 | review | aos-review | pending | | | |
| 6 | distribute | aos-distribute | pending | | | |

Status vocabulary: `pending` · `in-progress` · `done` · `skipped` · `blocked`.
Result: the artifact path, the verdict, or the count — one line.

## Cycle summary

*(filled at Step 4 — close the cycle)*

- **Measured:** <what aos-measure read; FND ids emitted, or "skipped — first cycle">
- **Planned:** <gtm-plan.md path; REC ids emitted; horizon>
- **Drafted:** <content pieces drafted — paths>
- **Reviewed:** <PASS / REVISE / BLOCK per piece>
- **Shipped:** <pieces distributed; CATALOGUE status advanced>
- **Blocked:** <pieces that did not ship, and why>
- **Open after this turn:** <open FND count> findings · <open REC count> recs

## Next turn

- **Likely focus:** <open RECs not actioned this horizon; high-confidence open FNDs>
- **Carried over:** <any stage skipped / halted this turn>
```

## Notes

- **One row per stage**, even skipped ones — a `skipped` row with a reason is
  part of the honest record.
- **`cycle_status`** — `in-progress` while the cycle walks; `complete` when all
  non-skipped stages are `done`; `halted` if the user halted. `--resume` acts
  only on `in-progress` / `halted` files.
- **Stamp provenance** — `skill_version` and `aos_schema` are read at write
  time, never hard-coded (`docs/artifact-versioning.md` §1).
- The stage skills write their own artifacts (`gtm-plan.md`, the content pieces,
  `review-*.md`, `results.md`, the FND/REC files). `cycle-run.md` only links to
  them — it never duplicates their content.
