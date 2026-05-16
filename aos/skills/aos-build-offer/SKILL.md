---
name: aos-build-offer
description: Design the client's offer — how the product is packaged, priced, risk-reversed, and made urgent at L4 of the Marketing Control Framework. Produces brand/OFFER.md, a profile slot in the Client Intelligence Profile.
scope: int-company
flavor: [company, advanced, internal]
class: intelligence
domain: strategy
layer: [L2, L3, L4]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write]
args-hint: "(no args — operates on the granted folder)"
inputs:
  - client/CLIENT_CONFIG.md
  - brand/OFFER.md (existing state — stub or filled)
  - brand/ICP.md (who the offer is for — the JTBD it answers)
  - brand/POSITIONING.md (the L2 identity the offer must stay true to)
  - brand/BELIEF_PROFILE.md (the value beliefs and fears that bound what the offer can claim)
  - brand/7LAYER_DIAGNOSTIC.md (read the L4 finding if present)
  - inbox/**/*.md (harvest pool — strategy docs, pricing notes, sales-call material)
outputs:
  - brand/OFFER.md (canonical profile slot consumed by aos-build-brand-system)
preflight:
  - client-config
ontology:
  consumes: [Layer, FND, Goal]
  emits: [REC, Goal]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
tags: [intelligence, offer, L4, brand, onboarding]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `brand/`, `inbox/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

Design the client's **offer** — the L4 layer of the Arcanian Marketing Control Framework. The offer is **how the product (L3) is packaged and priced** for a customer (L6) under an identity (L2). It is the layer where *"how is it packaged and priced?"* gets answered: the package, the price, the risk reversal, the reason to act now.

**What an offer is — and is not.**

> The product is what you deliver. The offer is how you package, price, and frame it so the right customer says yes. — Arcanian L4

An offer is not a discount and not a slogan. It is the structured answer to four questions the buyer is silently asking: *What exactly do I get? What does it cost — and can I understand that in five seconds? What happens if it doesn't work? Why should I act now instead of next month?*

**The Arcanian framing — Arcanian's own offer language.** This skill builds the offer doc from Arcanian's own frameworks: the **L4 Offer layer**, the **value-proposition structure**, and the **L2↔L6 identity bridge**. It deliberately uses **no external "offer guru" lineage** — no imported value-equation, no "irresistible offer" formula, no proprietary third-party offer methodology. AOS has its own offer language; this skill speaks it. If a source consulted during harvest carries an external offer framework's terminology, the substance may be useful but the *framing and vocabulary do not carry into `OFFER.md`* — restate it in Arcanian L4 terms.

**Posture:** Discovery, not pronouncement. The offer design is presented as a draft with sources and trade-offs for the user to correct — never as a verdict on how the client should price.

## The Arcanian offer model (L4)

An `OFFER.md` is built from these components. They are Arcanian's own — grounded in the L4 layer and the value-proposition framework.

1. **The core offer statement** — one sentence: *who it is for, what they get, and the outcome.* Built from the value-proposition shape `For [customer] who [pain], [the offer] provides [the outcome].`
2. **The package** — what is actually inside. The concrete deliverables, scope, and any tiers. Trim to what is genuinely valuable; a longer list is not a stronger offer.
3. **Pricing** — the price, the pricing *model* (one-off, retainer, %-of-spend, tiered), and the **price-readability test**: can the buyer understand it in five seconds? Pricing must signal the L2 identity — a premium identity priced low reads as a contradiction, and a value identity priced high reads as a bluff.
4. **Risk reversal** — what the client does to absorb the buyer's perceived risk (guarantee, conditional refund, staged commitment, proof-of-work). The risk reversal must be **real and honourable** — a guarantee the client cannot or will not honour destroys trust faster than no guarantee.
5. **Reason to act now** — genuine urgency: a real capacity limit, a real cost-of-delay, a real seasonal window. **Never a fake deadline.** Honest urgency names the cost of *not* deciding; it does not invent a countdown.
6. **The offer ladder** (if applicable) — the entry → core → premium sequence, where each rung names the rung above and the buyer steps up by their own pain, not by pressure. Single-offer businesses skip this — say so explicitly.
7. **Objection map** — the real objections this offer raises, and how each component answers one. An objection with no component answering it is an offer gap.

The full method, the value-proposition framework, and the price-readability and trim rules are in **`reference/offer-method.md`** — read it before drafting.

## Output contract

This skill writes exactly one file: `brand/OFFER.md`, built to **`reference/output-template.md`**. It must clear the **FILLED** threshold defined in `aos-build-brand-system/reference/file-substance-criteria.md` → OFFER.md:

- ≥1500 bytes
- A one-sentence **core offer statement** (the L4 value-proposition sentence)
- The **package** — what is inside, with scope
- **Pricing** — price + model + the 5-second readability check
- A **risk-reversal** mechanism, or an explicit, reasoned statement that there is none
- A **reason-to-act-now** that is genuine (never a fake deadline)
- An **objection map** — ≥3 real objections, each answered by a named offer component
- Cited sources for pricing claims and customer-language claims

## Arguments

This skill operates on the **granted folder** — which is the client's folder. There is no client-slug argument: the granted-folder root is the working directory and client identity is read from `client/CLIENT_CONFIG.md` / `AOS_CONFIG.md`.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not, the folder hasn't been onboarded — suggest running `aos-onboard`.
3. **Pre-read `brand/OFFER.md`** — even if it is a stub. The Write tool refuses to overwrite a file that hasn't been Read in-conversation. A stub returns its TODO placeholder; the Read satisfies the harness rule.
4. Read the upstream brand files that bound the offer: `brand/ICP.md` (who the offer is for), `brand/POSITIONING.md` (the L2 identity the offer must not contradict), `brand/BELIEF_PROFILE.md` (the decision-maker's value beliefs and fears — these cap what the client will *let* an offer claim or charge). If `brand/7LAYER_DIAGNOSTIC.md` is FILLED, read its L4 finding.

### Step 1 — Establish the foundation the offer sits on

An offer is downstream of identity, product, and customer. Before designing it, confirm three things from the upstream files:

- **The customer and their job (from ICP).** An offer answers a specific JTBD for a specific segment. If `ICP.md` is a stub, surface that — the offer will be weak without it, and route the user to `aos-build-brand-system` / the ICP work first.
- **The identity the offer must stay true to (from POSITIONING).** The price and packaging must signal the L2 identity. Note the identity sentence so the offer can be checked against it in Step 4.
- **What the client will allow (from BELIEF_PROFILE).** If the decision-maker holds a "we're not worth more" or "charging more is greedy" belief, the *honest* offer recommendation may collide with it. Name the collision — do not quietly design a timid offer around an unexamined belief. Flag it for belief work.

If the upstream files are all stubs, tell the user the offer can still be drafted but will rest on thin foundations, and recommend running the profile build first.

### Step 2 — Harvest offer evidence

Scan the `inbox/` zone (`inbox/**/*.md`, excluding `inbox/_processed/`) plus any pricing or sales material elsewhere in the granted folder. Look for:

- Current pricing, packages, and tiers — and any history of discounting.
- Sales-call notes and objections — the real objections in the buyer's words.
- Guarantee / refund / trial language already in use.
- Capacity statements ("we can take N clients"), seasonal patterns, cost-of-delay language.
- The current core-offer statement, if one exists, on the website or in strategy docs.

Tag each finding with its source `file:line`. **If a source carries external "offer formula" vocabulary, extract the underlying fact and restate it in Arcanian L4 terms — do not copy the framing.**

### Step 3 — Design the offer

Work through the seven components of the Arcanian offer model (above), using `reference/offer-method.md`. For each component:

- **Core offer statement** — write the value-proposition sentence; check it names a real customer and a real outcome, not a feature list.
- **Package** — list what is inside; apply the **trim rule** (every item must be genuinely valuable to the named customer; cut padding).
- **Pricing** — state price + model; run the **5-second readability test**; check it signals the L2 identity.
- **Risk reversal** — propose a mechanism the client can honestly honour; if none is appropriate, say so and explain why.
- **Reason to act now** — derive it from a real constraint; if there is no honest urgency, write *"no genuine urgency — do not manufacture one."*
- **Offer ladder** — sequence the rungs if the business has more than one offer; otherwise state it is a single-offer business.
- **Objection map** — list the real objections; map each to the component that answers it; flag any objection nothing answers.

### Step 4 — Coherence check

Before surfacing, check the designed offer against the upstream files:

- Does the price **signal** the L2 identity (POSITIONING), or contradict it?
- Does the package answer the **JTBD** named in ICP, or a different job?
- Does the offer ask the decision-maker to act *against* a belief named in BELIEF_PROFILE? If so, that is a finding, not a flaw to hide.

Note any contradiction explicitly in the draft — coherence gaps are the most useful output of this skill.

### Step 5 — Surface as a draft, then write

Present the full draft offer to the user with the three options:

- **Accept** — write to `brand/OFFER.md`
- **Revise** — user edits inline before write
- **Regenerate** — user supplies a correction direction, redraft

Only on Accept (or post-Revise) write the file, with the frontmatter block from `reference/output-template.md` (`scope`, `client`, `generated_by`, `generated_date`, `sources_consulted`, `status`, `needs_refresh_by` = generated_date + 90 days, `depends_on: ICP.md, POSITIONING.md, BELIEF_PROFILE.md`). End the file with the mandatory footer line: *"What did we get wrong? What's missing?"*

## Hard rules

1. **No external offer-guru lineage.** Build the offer doc from Arcanian's own L4 framework and value-proposition language only. Do not import a third-party value-equation, "irresistible/grand offer" formula, or branded offer methodology — not its structure, not its terminology. If harvested material carries that framing, restate the substance in Arcanian L4 terms.
2. **Honest urgency only.** A reason to act now must rest on a real capacity limit, real cost-of-delay, or real seasonal window. Never a fabricated deadline or fake scarcity.
3. **Honourable risk reversal.** Only propose a guarantee the client can and will honour. A guarantee that won't be honoured is worse than none.
4. **Cite pricing and customer claims.** Price points, discount history, and objection language carry a source citation. No invented numbers.
5. **The offer serves identity, not the reverse.** If the offer contradicts the L2 positioning or asks the decision-maker to act against an evidenced belief, name the contradiction — do not paper over it.
6. **User confirms the draft.** No silent write — Accept / Revise / Regenerate is mandatory.
7. **Single client.** Operate only within the granted folder. Never reach outside it for "comparable" offers.

## Output Sections

Final user-facing output:

- **Foundation summary** — customer/JTBD, identity, belief constraints read from upstream files
- **Harvest summary** — pricing, objections, guarantee language found, with sources
- **Designed offer** (draft) — the seven components
- **Coherence check** — contradictions with positioning / ICP / beliefs
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` (scaffolds the granted folder); `aos-build-brand-system` (orchestrates this as a profile slot); `aos-diagnose-7layer` (its L4 finding seeds this); `aos-build-belief-profile` (its value-belief findings bound the offer).
- **Downstream:** `aos-build-brand-system` consumes `brand/OFFER.md` as a profile slot; `aos-analyze-gtm` reads the offer when checking GTM alignment; content and campaign skills consume the offer as the thing they are selling.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring. Built on the Arcanian L4 Offer layer and value-proposition framework; no external offer methodology. Component model and trim/readability rules likely need refinement after first real runs.
- **v1.0.0** — promotion criterion: 3 clients with an `OFFER.md` built end-to-end, each producing an offer that materially improves conversion or pricing confidence downstream.

**What did we get wrong? What's missing?**
