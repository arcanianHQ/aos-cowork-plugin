---
scope: int-company
---

# Survey method — surveying GTM roles and finding process gaps

Companion to `aos-map-jtbd/SKILL.md`. The interactive survey question set and the
deterministic process-gap taxonomy.

---

## §1 — The survey, role by role

`aos-map-jtbd` is an **interactive survey** — it asks the user about each role
and records the answers. Survey one role at a time; do not batch all questions
into one wall of text. Where `inbox/` already answers a question, present the
found answer and ask the user to confirm or correct it rather than re-asking.

For each role, capture:

### The job (one line)
*"In one sentence — what is this role hired to accomplish in go-to-market?"*
Not a title, not a task list — the outcome the role exists to produce.

### Inputs — and who supplies each
*"What does this role need before it can do its job — and who (which role) gives
it each input?"* An input with no named supplier is a candidate **missing input**
(§2). Capture briefs, data, approvals, assets, decisions.

### Outputs — and who consumes each
*"What does this role produce — and who (which role) receives each output?"* An
output with no named consumer is a candidate **orphan output** (§2).

### Cadence
*"How often is the role's core output produced — daily, weekly, per-campaign,
ad hoc?"* Cadence mismatches between a producer and consumer are a hand-off risk.

### Tools / surfaces
*"Where does this work happen — which channels, tools, documents?"* This locates
the role in the operating environment and surfaces tool-handoff friction.

### Hand-off health (the role's own view)
*"Where does work most often get stuck coming into, or going out of, this role?"*
The team's own answer is the strongest signal for §2 — record it verbatim.

---

## §2 — The process-gap taxonomy

After surveying every role, assemble the **input → role → output** chain and walk
it for gaps. Each gap is stated as an observation naming the two roles it sits
between — never as a person's failure.

| Gap type | Definition | How it shows up in the survey |
|---|---|---|
| **Orphan output** | A role produces something **no role consumes** | An output with no named consumer |
| **Missing input** | A role needs an input **no role supplies** | An input with no named supplier |
| **Unowned job** | A job both roles think the other owns — or neither does | Two roles' answers disagree on who produces an output |
| **Bottleneck** | One role is the **single input source** for many others | One role named as supplier across many roles' inputs |
| **Broken hand-off** | An output exists but reaches its consumer **late, in the wrong form, or not at all** | A consumer's "where work gets stuck" answer names an upstream output |
| **Cadence mismatch** | A producer's cadence and a consumer's need do not line up | Producer cadence ≠ the rate the consumer needs the input |

A gap the team already **knows about and actively manages** is recorded in the
map as a known, managed gap — it is **not** emitted as an FND. Only a real,
**unaddressed** gap becomes a finding (SKILL.md Step 4).

---

## §3 — Severity

Rank each unaddressed gap, so the emitted FNDs carry a signal `aos-plan` can sort on:

- **High** — the gap blocks a core GTM output entirely (work cannot ship).
- **Medium** — the gap delays or degrades a core output (work ships late or thin).
- **Low** — friction, but the output still lands acceptably.

State the severity and the evidence for it (which survey answers) on each gap.
