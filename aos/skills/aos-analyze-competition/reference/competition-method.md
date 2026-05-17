---
scope: int-company
---

# Competition method — sourcing, evidencing, and gap-reading the field

Companion to `aos-analyze-competition/SKILL.md`. The deterministic procedure for
sourcing candidate competitors, gathering observed evidence, and reading the map
for positioning gaps.

---

## §1 — Candidate-sourcing lenses

Run all three lenses; each surfaces competitors the others miss.

1. **Positioning lens** — `brand/POSITIONING.md`: the category landscape, the
   "direct competitors" table, and the **anti-claims** (a position the brand has
   rejected is a position some competitor *holds* — name them).
2. **JTBD lens** — `brand/ICP.md`: the **indirect** alternatives. The customer
   hires *something* for the job; competitors are not only same-category brands —
   a substitute, an in-house build, a different category, or "do nothing" all
   compete for the same JTBD.
3. **Harvest lens** — `inbox/`: competitor-research docs, SEO/SEM analyses, and
   founder observations ("they are doing X better than us", "we keep losing to").

### Direct vs indirect

- **Direct** — same category, same customer, same JTBD. The map needs ≥3.
- **Indirect** — different category or form, **same JTBD**. Name the strongest;
  an indirect alternative the founder underrates is often the real threat.

---

## §2 — Gathering observed evidence

A competitor profile is **observed, not asserted**. Three evidence sources, each
with its class tag:

| Source | How | Evidence class |
|---|---|---|
| Homepage scrape (depth 0, one page) | `WebFetch` — **provenance-gated on Cowork**, see below | `[OBSERVED]` |
| SEMrush (if connected) | keyword overlap, traffic estimate, top pages, via the SEMrush MCP tools | `[DATA]` |
| `inbox/` research | competitor docs already gathered | `[OBSERVED]` / `[STATED]` |
| Founder observation | "they do X well" — unverified | `[STATED]` |

Only `[DATA]` and `[OBSERVED]` carry a claim. A `[STATED]` strength is recorded
as the founder's view, flagged unverified.

### ⚠ The WebFetch provenance gate (Cowork)

On Cowork, `WebFetch` only retrieves URLs that appeared in a **user message** (or
a prior `WebFetch` result). A competitor URL the skill read from `POSITIONING.md`
or `inbox/` is **not** in the provenance set. Procedure:

1. State the competitor domains you intend to fetch.
2. Ask the user to **paste those URLs into chat**.
3. `WebFetch` the pasted URLs in the **very next step** (the provenance window is
   the immediately-prior user message).
4. If the user declines, build that competitor's profile from `inbox/` research +
   founder observation, and note the homepage was not scraped.

Never report this as a failure — it is a runtime rule. See `docs/connectors.md`.

---

## §3 — Profiling fields

For each competitor:

- **Primary positioning** — quote the position from their *own* homepage words
  (H1 + hero subhead are the compressed positioning). Do not paraphrase into
  what you think they mean.
- **Key strengths** — what they genuinely do well, each tied to observed
  evidence. A strength with no evidence is dropped, not softened.
- **Observable weaknesses** — what the site / data *shows* they do not do, do
  badly, or leave uncovered. A weakness is an observation ("no pricing on site",
  "no measurement / proof content", "thin on the SMB segment") — not a wish
  ("they're probably expensive").
- **Monitored pages / keyword clusters** — ≥3 URLs or keyword clusters per
  competitor for the ongoing watch (the pages most worth re-checking next cadence).

---

## §4 — Reading the positioning gaps

The map exists to find the **gap** — this is §4 of the skill and the file's
payoff. For each candidate gap, test all three:

1. **Open** — no competitor in the field credibly holds this position (check the
   profiles — if two competitors both claim it, it is not open).
2. **Reachable** — `brand/POSITIONING.md` + `brand/ICP.md` say the client *could*
   credibly hold it (it fits the client's identity and audience — not a
   land-grab into a position the brand cannot back).
3. **Worth holding** — the gap maps to something the ICP actually values; an
   open position no customer cares about is not a gap, it is empty space.

A gap that passes all three and is high-confidence is emitted as an `FND` into
`ontology/findings/` for `aos-plan`. A vague aspiration ("be more premium", "own
quality") is **not** a gap — it names no position and no evidence. Only a
specific, evidenced, reachable open position is written as a finding.
