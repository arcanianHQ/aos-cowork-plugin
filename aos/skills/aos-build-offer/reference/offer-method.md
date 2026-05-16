---
scope: int-company
---

# Offer method — designing an offer the Arcanian way

The methodology behind `aos-build-offer`. Built entirely on Arcanian's own
frameworks: the **L4 Offer layer** of the Marketing Control Framework and the
**value-proposition structure**. No external offer-guru methodology is used or
referenced here — AOS has its own offer language. Read this before drafting.

## Where the offer sits — L4

```
L6 Customer ── who they are, and the job they hire you for
L5 Channels ── where they meet the offer
L4 OFFER ───── how the product is packaged and priced  ◄── this skill
L3 Product ─── what you actually deliver
L2 Identity ── who you are, what you stand for
```

The offer is a **package layer**. It does not invent value — the product (L3)
holds the value. The offer **packages and prices** that value so a specific
customer (L6), under a specific identity (L2), says yes. This is why `OFFER.md`
depends on `ICP.md`, `POSITIONING.md`, and `BELIEF_PROFILE.md`: the offer is
only as coherent as the layers it rests on.

**L4 patterns that signal a broken offer** (from the 7-layer diagnostic):

| Symptom | What it means at L4 |
|---|---|
| "I'll think about it" | No genuine reason to act now |
| High abandonment / drop-off | Too much perceived risk — no risk reversal |
| Decision paralysis | Too many options in the package |
| Wrong customers buying | Price signals the wrong positioning |
| Constant discounting | No offer structure — every deal improvised |
| Marketing promise ≠ what's delivered | The offer and the product disagree |

## The value-proposition framework

The **core offer statement** is written from Arcanian's value-proposition shape:

```
For [TARGET CUSTOMER] who [PAIN],
[THE OFFER] provides [THE OUTCOME / KEY BENEFIT].
```

A fuller competitive form, when positioning calls for it:

```
For [TARGET CUSTOMER] who [PAIN],
[THE OFFER] provides [KEY BENEFIT]
unlike [THE ALTERNATIVE] because [WHY IT'S DIFFERENT].
```

Rules for the statement:
- It names a **real, specific customer** — the primary segment from `ICP.md`,
  not "businesses" or "everyone".
- It names an **outcome**, not a feature list. The customer buys the change in
  their situation, not the deliverables.
- It is **one sentence**. If it needs two, the offer is doing two jobs — split
  it into ladder rungs.

## The seven components of an Arcanian offer

Every `OFFER.md` is built from these. Components 1–5 and 7 are mandatory;
component 6 (the ladder) applies only to multi-offer businesses.

### 1. Core offer statement
The value-proposition sentence (above). One line. The whole offer compresses
into it.

### 2. The package
What is actually inside — concrete deliverables and scope, plus tiers if any.

**The trim rule.** A longer list is *not* a stronger offer. Every item in the
package must be genuinely valuable *to the named customer*. Padding — items
added to make the list look bigger — dilutes the offer and erodes trust. For
each item ask: *would the customer in `ICP.md` pay for this on its own, or at
least clearly want it?* If not, cut it. Trim to the high-value core.

### 3. Pricing
State three things:
- **The price** — the actual number, or the range with a reason for the range.
- **The pricing model** — one-off, retainer, %-of-spend, tiered, usage-based.
- **The 5-second readability test** — can the target customer understand what
  they pay and what they get within five seconds of seeing it? If not, the
  pricing is a conversion problem regardless of the number.

**Pricing signals identity.** Price is read as a claim about the L2 identity.
A premium identity priced cheaply reads as a contradiction ("if they're so
good, why so cheap?"). A value/accessible identity priced high reads as a
bluff. Check the price against the `POSITIONING.md` identity sentence — they
must agree.

A range is weaker than a fixed price: it invites comparison and signals
uncertainty about the offer's own worth. Use a range only when scope genuinely
varies, and say *why*.

### 4. Risk reversal
What the **client** does to absorb the **buyer's** perceived risk. Options:
- A guarantee (full or conditional refund).
- A staged commitment — a small first step before the big one.
- Proof-of-work — a free or low-cost diagnostic that de-risks the main offer.
- A pilot / trial period.

**Honourable only.** Propose only a risk reversal the client can and will
honour. A guarantee that won't be paid out when claimed destroys trust faster
than having no guarantee at all. A conditional guarantee ("if X doesn't happen,
you don't pay") is strong *and* honest when the condition is clear and the
client genuinely stands behind it. If no risk reversal fits the business, say
so and explain why — that is a valid, honest answer.

### 5. Reason to act now
Genuine urgency only. It must rest on one of:
- A **real capacity limit** — "we take N clients at a time" — when it is true.
- A **real cost of delay** — every week of the unsolved problem costs the buyer
  something specific and nameable.
- A **real seasonal / cyclical window** — a budget cycle, a season, a deadline
  that exists independently of the offer.

**Never a fake deadline and never fake scarcity.** Honest urgency names the cost
of *not* deciding; it does not invent a countdown clock or a "only 3 left"
where there is no real limit. If the business has no honest urgency, write
*"no genuine urgency — do not manufacture one"* and leave it. A manufactured
deadline that the customer sees through costs more trust than it buys sales.

### 6. The offer ladder (multi-offer businesses only)
When a business has more than one offer, sequence them: **entry → core →
premium**. Principles:
- Each rung names the rung above it — the buyer can see the next step.
- The buyer climbs by their **own pain or readiness**, not by pressure. A ladder
  is a path, not a funnel that pushes.
- Each rung is a complete, honest offer on its own — never a deliberately
  crippled version designed only to sell the next rung.
- A lower rung can also be a **proof-of-work** entry that de-risks the core
  offer (see component 4).

Single-offer businesses **skip this** — state explicitly in `OFFER.md` that the
business runs a single offer and a ladder is not applicable.

### 7. Objection map
List the **real objections** this offer raises — in the buyer's words, from
sales-call harvest where possible. For each objection, name the offer component
that answers it:

| Objection | Answered by |
|---|---|
| "How do I know it's worth it?" | Risk reversal (component 4) |
| "Why now? I'll wait." | Reason to act now (component 5) |
| "It's confusing / too many choices." | Package trim (component 2) + pricing (3) |
| "It's too expensive." | Core statement outcome (1) + pricing model (3) |

An objection with **no component answering it** is an **offer gap** — flag it
explicitly. The objection map is the offer's self-test.

## Coherence — the offer against the layers above

Before the offer is final, check it against the upstream brand files:

- **vs. POSITIONING (L2):** does the price and packaging *signal* the identity,
  or contradict it?
- **vs. ICP (L6):** does the package answer the JTBD of the named segment, or a
  different job?
- **vs. BELIEF_PROFILE (L0):** does the honest offer ask the decision-maker to
  act against a belief they hold ("we're not worth more", "charging is
  greedy")? If so, that collision is a **finding** — surface it and route it to
  belief work. Do not quietly design a timid offer around an unexamined belief.

Coherence gaps are among the most valuable outputs of this skill. Name them; do
not smooth them over.

## What this skill does NOT do

- It does not import any external offer methodology, value-equation, or branded
  "offer formula". The components above are Arcanian's own L4 model.
- It does not write campaign copy or landing pages — it designs the offer; copy
  skills consume `OFFER.md` downstream.
- It does not set the price *for* the client — it recommends, with the
  trade-offs visible, and the user decides.
