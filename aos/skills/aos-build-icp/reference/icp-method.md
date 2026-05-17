---
scope: int-company
---

# ICP method — harvesting, segmenting, and profiling the audience

Companion to `aos-build-icp/SKILL.md`. The deterministic procedure for the
harvest classification, the segment test, and the per-dimension prompts.

---

## §1 — Evidence classification

Classify each harvested item into one of the four streams. Tag every item with
its source `file:line`.

| Stream | What it is | Patterns to grep for |
|---|---|---|
| Customer-description | The founder / team describing who the customer is | "our customer is", "we work with", "target audience", "ideal client" |
| Voice-of-customer | The customer in their own words | testimonials, reviews, support threads, sales-call quotes, "I needed", "what I hate is", "I chose them because" |
| Behavioural | Who actually buys / engages | GA4 / analytics segments, purchase-pattern notes, "most of our revenue is" |
| Anti-customer | Who was a bad fit | refunds, churn notes, "this client was a nightmare", "we shouldn't have taken" |

Keep two confidences apart: **description confidence** (does the founder's
picture match the evidence?) and **behavioural confidence** (does who-actually-buys
match who-they-picture?). A gap between the two is itself worth surfacing.

---

## §2 — The segment test

A **segment** is a group that hires the product for the **same job** with the
**same buying behaviour**. Apply, in order:

1. **Same-job test.** Two groups that hire the product for the *same* JTBD are
   one segment — even if their demographics differ. Do not split a segment on a
   demographic difference that does not change the job.
2. **Different-job test.** Two groups with genuinely different JTBDs are
   different segments — even if they look demographically identical.
3. **The single-segment honesty rule.** If the evidence supports only one real
   segment, write one and justify it. A forced secondary segment dilutes every
   downstream skill — an honest single-segment ICP is stronger than a padded one.

### Primary vs secondary

- **Primary** — the segment the business is *built for*; the centre of gravity of
  revenue, of the product roadmap, of the founder's attention.
- **Secondary** — real, served, profitable enough to keep — but not the centre.
  Content and positioning lead with the primary; the secondary is addressed
  without distorting the primary's register.

---

## §3 — Per-dimension prompts

For each segment, complete the four dimensions. A dimension with no evidence is
marked *"not yet evidenced"* — never guessed.

### Demographic shell
The outer, locating facts. Ask: role / title · business type or life stage ·
scale (revenue, headcount, household) · geography · budget band. The shell tells
a content skill *where to find* the segment — it is not the reason they buy.

### Psychographic anchor
The disposition that drives the buy. Ask: what does this segment *believe* about
the problem? What do they *value* in a solution (and distrust)? What is their
relationship to the category — expert, anxious novice, burned-before sceptic?
This is the dimension voice and positioning lean on hardest.

### Job-to-be-done
The job they hire the product / service to do. Capture **both** layers:
- **Functional** — the practical outcome ("get a mix I can trust", "stop losing
  leads at the weekend").
- **Emotional / social** — what they want to *feel* or to *be seen as* ("look
  competent to my client", "stop feeling like an amateur").
Quote the customer's own words wherever the voice-of-customer harvest gives them.

### Awareness / buying stage
Where the segment is when they meet the brand — problem-unaware → problem-aware →
solution-aware → product-aware → most-aware (the five Stages of Awareness — Eugene
M. Schwartz, *Breakthrough Advertising*, 1966; see `NOTICE`) — and *how* they
research and decide (who they ask, how many touches, how long).

---

## §4 — The "not-for" boundary

Build the exclusion section from §1's anti-customer stream **and** the inverse of
the segment definitions. Name, specifically, the adjacent audiences the brand
will be tempted to chase:

- **Wrong-budget** — wants the outcome, cannot or will not pay the price.
- **Wrong-job** — looks like the ICP demographically but hires the product for a
  job it is not built to do.
- **High-support / low-value** — consumes disproportionate service for the
  revenue, or churns fast.

Each "not-for" line should be specific enough that a content or sales skill could
*act* on it — "not for hobbyists" is weak; "not for first-time buyers shopping on
price who have not yet hit the problem this solves" is usable.
