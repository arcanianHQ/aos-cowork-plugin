# Deliverable writing — the rules a reader can hold us to

The rules every client-facing **summary, report and proposal** follows — an
executive summary, a period review, a results read, a diagnostic, a plan, a
campaign brief, a pitch, an offer. Skills point here instead of restating the
rules; each skill names only the one or two lines that bite hardest on its own
output. `aos-review` checks a deliverable against this doc (its checklist §4).

They come from an external review of real deliverables. Each rule closes a gap
where a careful reader could not tell what a sentence claimed, what it was
compared against, or what to do with it.

## §1 — Summaries and reports: the seven writing rules

Applies to anything that reports where things stand: executive summaries, period
reviews, measurement reads (`results.md`), diagnostics, GTM analyses.

1. **Every comparison names its base.** Write *"12% more leads than the same 60
   days of last year"*, never *"above last year"* or *"up 12%"*. The base is the
   period, the segment and the metric being compared against.
2. **One comparison per sentence — and the "why" explains the same one.** The
   sentence that says *where we are* and the sentence that says *why it changed*
   are about the same comparison (same metric, same base). If the explanation
   switches to a different comparison, say so explicitly (*"Against the previous
   month instead, …"*).
3. **A corrected figure first states what was claimed, and where.** *"The March
   report gave 140 leads; the CRM export shows 118 — the 140 counted duplicates."*
   Never silently replace a number the reader has already seen.
4. **Every platform term names its platform.** *Google Ads conversions* or *GA4
   conversions*, never bare *conversions*; *Meta Ads leads* or *CRM leads*, never
   bare *leads* when more than one system counts them. The same word means
   different things in different systems.
5. **Every label is defined at first use, in the same document.** A budget level
   (*"base / push / max"*), a segment name, a scorecard grade — defined where it
   first appears, not in another file the reader does not have.
6. **Our own deliberate change is not "what went wrong" until a check shows it
   hurt.** A change we made on purpose (a bid strategy switch, a paused campaign,
   a new landing page) goes under **"to check"**, with the deciding check named:
   *"To check: whether the bid-strategy switch on 3 May lowered lead volume —
   decided by comparing lead volume in the two weeks either side, same
   campaigns."*
7. **Process failures say who did what.** *"Handed to sales on 4 June; closed
   lost on 20 June; no reason recorded by sales"* — never *"the lead was lost"*.
   Name the role (sales, the agency, the client's marketing team), not a person.

## §2 — Proposals and plans: keep the goal and the context

Applies to anything that recommends: a GTM plan, a campaign brief, a pitch
response, an offer design, a promotion proposal.

1. **Open with the goal and the situation** — two or three sentences: what the
   client is trying to achieve, and where they stand now (the constraint, the
   period's result, the occasion). A reader who sees only this paragraph knows
   why the document exists.
2. **Each recommendation states which goal it serves and what evidence it rests
   on.** *"Serves: more qualified demo requests. Rests on: FND-012 (demo
   requests from paid search fell 30% against the same quarter last year) —
   `[DATA]`, moderate."*
3. **Never compress a recommendation to a single detail.** *"Raise the discount
   to 15%"* is a detail; the recommendation is *"win back lapsed buyers before
   the season ends — by raising the discount to 15% for the lapsed-buyer
   segment"*. If the overall goal is lost, the detail cannot be judged.

## §3 — Grading evidence

Applies wherever a deliverable grades its evidence (`[DATA]` / `[OBSERVED]` /
`[STATED]` / `[INFERRED]`, data vs causal confidence, strong / moderate / weak).

1. **One day or a single-digit sample is never "strong".** A one-day spike, or
   a result built on fewer than ten events (orders, leads, conversions), is at
   most *weak*, whatever its source. Say the sample size.
2. **An unknown deciding fact makes the claim open.** If the claim turns on a
   fact nobody has checked, it is *"open — decided by <the fact / the check>"*,
   not a graded finding.
3. **No lessons from an event without known dates and content.** A promotion,
   send or launch whose dates and content (offer, audience, channels) are not
   known yields no lesson — only the request for those facts.
4. **A conversion-rate order between channels is attribution, not a lever.**
   *"Email converts better than paid social"* describes how each platform
   attributes the conversions it saw. It does not show that moving budget
   between them would change the result — do not present it as a lever.

## §4 — Source of record for purchases and revenue

1. **Purchases and revenue come from the shop's order export** (or the order /
   billing system) — the source of record.
2. **GA4 is reconciled against it, never the only source.** State the gap
   (*"GA4 recorded 212 purchases; the order export 240 — GA4 misses 12%"*) and
   draw count and revenue conclusions from the order export.
3. **No order export → say so and stop.** If the order export is missing, the
   deliverable says so plainly and draws **no** count or revenue conclusions;
   GA4 figures may be shown only as an unreconciled indicator, labelled as such.

## Where this is enforced

`aos-review` §4 of its checklist runs these rules as a check on any deliverable
it is pointed at. The producing skills point here from their own steps. Which
skills point here is **not guarded** — grep `docs/deliverable-writing.md` for
the current list rather than trusting one written down.
