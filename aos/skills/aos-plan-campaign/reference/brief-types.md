---
scope: int-company
---

# Brief types — dealer, retail, brand

Companion to `aos-plan-campaign/SKILL.md`. The three campaign-brief types, the
emphasis each one carries, and the frame-capture question set.

---

## The frame-capture question set (all types)

Capture interactively, in order. Do not invent an answer — an unanswered field is
asked, not filled.

1. **Occasion / trigger** — *"What is the campaign tied to, and why now?"*
2. **Objective** — *"What is the one outcome this campaign exists to produce?"*
   Push for a single objective; a campaign with three objectives has none.
3. **Offer / hook** — *"What does the audience actually get or see?"* Cross-check
   against `brand/OFFER.md` / `content-system/products.md` — it must be real.
4. **Timeframe** — *"Start date, end date, key dates in between?"*
5. **Budget band** — *"Is there a budget, and roughly what?"* (optional).
6. **Plan linkage** — *"Does this campaign serve a move in the standing GTM plan,
   or an open recommendation?"* Check `deliverables/<YYYY-MM>/gtm-plan.md` and
   `ontology/recommendations/`.

---

## §1 — brand brief

**For:** end customers. **Intent:** build the brand itself — awareness,
positioning, association — not a bounded sales spike.

- **Lead with:** the `brand/POSITIONING.md` identity and the association the
  campaign is meant to strengthen. The campaign is a positioning act.
- **Audience:** the `brand/ICP.md` primary segment, broadly.
- **KPI:** awareness / reach / brand-search / share-of-voice proxies — a brand
  brief's objective is usually soft; name an honest proxy signal and a window,
  do not fake a hard conversion KPI.
- **Deliverables emphasis:** identity-carrying content — reference pieces, founder
  voice, the series formats.
- **Watch-out:** a brand campaign that drifts into a discount push has become a
  retail campaign — name it as one or hold the line.

## §2 — retail brief

**For:** end customers. **Intent:** a bounded sales push — a promotion, a
seasonal moment, a launch with a deadline.

- **Lead with:** the **offer** and the **reason to act now**. Urgency is
  legitimate here (a real deadline, real stock) — manufactured scarcity is not.
- **Audience:** the `brand/ICP.md` segment most ready to buy — solution- and
  product-aware stages.
- **KPI:** a hard conversion metric — sales, revenue, leads, redemptions — with a
  target band and the campaign window as the measurement period.
- **Deliverables emphasis:** conversion content — offer-led posts, the campaign
  email, the landing surface; channel plan front-loaded to the window.
- **Watch-out:** the offer must be accurate to `products.md` / `OFFER.md` — a
  retail brief is where an invented discount does real damage.

## §3 — dealer brief

**For:** the **dealer / partner / reseller network** — equipping them to market
locally. A B2B2C campaign: the brand markets *through* its dealers.

- **Lead with:** **enablement** — what the dealer is given to run the campaign in
  their own market, and how brand consistency is held across many local executions.
- **Audience:** two layers — the **dealer** (who must adopt and run the kit) and
  the **dealer's end customer** (whom the kit ultimately reaches). The brief
  addresses both.
- **KPI:** dealer adoption / activation (how many dealers ran it) **and** the
  downstream end-customer metric — both, because a dealer campaign fails either
  if dealers do not adopt it or if it does not convert when they do.
- **Deliverables emphasis:** a **co-marketing kit** — templated, localisable
  assets the dealer can run with minimal change; clear usage guidance; the brand
  guardrails that keep local executions on-brand.
- **Watch-out:** a dealer brief that produces only finished brand content (not
  adaptable templates) is unusable by dealers — the deliverable must be a *kit*.

---

## Type selection

If `--type` is omitted, infer from the occasion and **confirm with the user**:
a deadline-bearing promotion → `retail`; a network / "for our dealers" framing →
`dealer`; an awareness / identity push → `brand`. When genuinely unclear, ask.
