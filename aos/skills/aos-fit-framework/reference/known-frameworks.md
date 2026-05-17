---
scope: int-company
---

# Known frameworks — built-in mappings + the adapter shell

Companion to `aos-fit-framework/SKILL.md`. The built-in concept maps and the
shell for `client/OPERATING_FRAMEWORK.md`. These are **starting points** — how a
given client actually runs their framework overrides the template.

---

## §1 — EOS (Entrepreneurial Operating System)

EOS — Rocks, the Level-10 meeting, the Scorecard, the Issues list, the V/TO.

| AOS concept | EOS concept | Notes |
|---|---|---|
| A prioritised plan move / `REC` | **Rock** | A quarterly priority. `aos-plan`'s shortlist maps to the quarter's marketing Rocks. |
| An open `FND` / process gap | **Issue** | Goes on the Issues list; resolved via IDS (Identify, Discuss, Solve). `aos-map-jtbd`'s process gaps are Issues. |
| `aos-measure` results / KPIs | **Scorecard** | Weekly measurables. `aos-measure`'s metrics feed the marketing rows of the Scorecard. |
| The brand profile / GTM strategy | **V/TO** (marketing strategy section) | The Vision/Traction Organizer's marketing strategy. |
| `aos-map-jtbd` role map | **Accountability Chart** | Roles, seats, who-owns-what. |
| `aos-daily` + cadence | fits around the **L10** | The weekly Level-10 meeting is the rhythm; `aos-daily` runs daily within it; `aos-plan` aligns to quarterly Rock-setting. |

Vocabulary: say **Rock**, **Issue**, **Scorecard**, **L10** — not
"recommendation", "finding", "metrics dashboard".

## §2 — Scaling Up (Rockefeller Habits)

| AOS concept | Scaling Up concept |
|---|---|
| A prioritised plan move | **Priority** (the quarterly/annual Top 5, the #1 priority) |
| An open `FND` / gap | an **Issue** (the Issues list) |
| `aos-measure` KPIs | **KPIs / the metrics** on the One-Page Strategic Plan |
| Cadence | the **daily huddle / weekly meeting** rhythm |
| The brand / GTM strategy | the marketing section of the **One-Page Strategic Plan (OPSP)** |

## §3 — OKRs

| AOS concept | OKR concept |
|---|---|
| A campaign / plan objective | an **Objective** |
| A KPI / measurable target | a **Key Result** |
| A plan move / `REC` | an **initiative** under a Key Result |
| `aos-measure` | the **OKR check-in / scoring** (0.0–1.0) |
| Cadence | the **quarterly OKR cycle** + weekly check-ins |

## §4 — A client-supplied framework

When `--framework` names a client's own file, extract and map four things:

1. **Cadence** — the meeting rhythm (daily / weekly / monthly / quarterly).
2. **Artifacts** — the documents the framework runs on.
3. **Vocabulary** — the framework's terms for priority, problem, metric.
4. **Roles** — how the framework names accountability.

Then build the concept map against AOS the same way §1–§3 do.

---

## The adapter shell — `client/OPERATING_FRAMEWORK.md`

```markdown
---
scope: int-confidential
client: <slug>
generated_by: aos-fit-framework
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
framework: <eos | scaling-up | okr | custom:<name> | none>
status: confirmed-by-user
---

# Operating framework adapter — <Client Display Name>

> **What this is.** How AOS fits the operating framework <client> already runs.
> Downstream skills read this to speak the client's language and rhythm.

## The framework

<Named framework + how this client runs it / where they diverge from the standard.>

## Concept map — AOS ↔ <framework>

| AOS concept | <framework> concept |
|---|---|
| … | … |

## Cadence alignment

<How AOS's loop beats sit against the framework's meeting rhythm — where
aos-daily, aos-plan, aos-measure land.>

## Vocabulary

<The terms downstream skills should use when talking to this client.>

**What did we get wrong? What's missing?**
```
