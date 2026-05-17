---
scope: int-company
---

# Evidence classes — statement backing (lite)

Companion to `SKILL.md`. Tag definitions, the decision tree, and in-place
format. Aligns with `aos-measure/reference/measurement-method.md` § Evidence
classes; adds **`[NARRATIVE]`** for arbitrary prose.

## Tag definitions

| Tag | Use when | Carries a factual claim? | Typical source |
|---|---|---|---|
| `[DATA]` | A number, rate, rank, or metric you can point to | yes | Databox/SEMrush export in `inbox/`, analytics screenshot, cited table |
| `[STATED]` | Someone said it — client, founder, sales call, survey | yes (as their words) | Transcript, email, session note — tag the speaker |
| `[INFERRED]` | You reasoned there from indirect signal | no (until verified) | Pattern across docs, weak analogy, "likely" |
| `[NARRATIVE]` | Institutional story — prior doc, CAPTAINS_LOG, "we noted before" | no (repetition ≠ verification) | Earlier markdown in the tree; cite the doc, not "common knowledge" |

**`[OBSERVED]`** (optional, metrics context): directly seen in session —
screenshot, live UI, comment count you watched happen. `aos-measure` uses this
for degraded measurement; prose skills may use it instead of `[DATA]` when
there is no export file. Do not use `[OBSERVED]` for hearsay.

## Decision tree

```
Is it a number/metric from a verifiable source in-folder or session?
  yes → [DATA] (cite source)
  no ↓
Did a specific person/org state it (quote or paraphrase)?
  yes → [STATED] (cite who + where)
  no ↓
Is it mainly repeating an earlier internal doc or log?
  yes → [NARRATIVE] (cite prior doc)
  no ↓
Is it your conclusion from indirect evidence?
  yes → [INFERRED]
  no → UNSOURCED (flag in report; do not fake a tag)
```

## Material statements

Tag sentences that would embarrass you if wrong in front of the client:

- Numbers, percentages, market sizes, benchmarks
- "Our customers…", "the market…", competitor claims
- Causal sentences: because, due to, caused, drives, led to
- Recommendations presented as fact ("everyone knows", "clearly")
- Comparisons without a cited benchmark

Do **not** tag: section titles, template placeholders, the closing
*"What did we get wrong?"* prompt, or pure opinion clearly framed as opinion.

## Causal overreach

Flag (in the report, not necessarily with a fifth tag) when:

- `[INFERRED]` or `[NARRATIVE]` backs a sentence that states causation as settled
- A single-channel metric (e.g. GA4-only) supports a multi-channel conclusion
- Confidence language ("clearly", "proves", "definitely") outruns the tag

## In-place format

Default: tag at the **start of the sentence** or paragraph:

```markdown
[DATA] Conversion rose 12% week-on-week (source: inbox/2026-05-export.csv).
```

For bullets, one tag per bullet. Do not stack multiple tags; pick the **weakest
honest** class (if both DATA and STATED apply, DATA only when the number is
verified — otherwise STATED).

## Unsourced claims

When a sentence asserts fact but no class applies:

- List as **UNSOURCED** in the report
- Recommend: cut, soften to `[INFERRED]`, or add material to `inbox/` and re-run
- Never default UNSOURCED to `[DATA]`

## Load-bearing risks

Call out statements that, if wrong, would invert the doc's recommendation —
even if tagged. One `[NARRATIVE]` market-size figure driving a budget ask is a
load-bearing risk.
