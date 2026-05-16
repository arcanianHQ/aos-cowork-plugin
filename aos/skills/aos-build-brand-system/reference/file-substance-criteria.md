---
scope: int-company
---

# Substance criteria — per intelligence file

The threshold each `brand/<FILE>.md` must clear to count as **FILLED**. Used by `scripts/survey.mjs` and the orchestrator's hard gate.

Every file must also have valid frontmatter (`scope`, `client`, `status`) and a footer line: *"What did we get wrong? What's missing?"*.

## Website source preference (per-file)

The orchestrator's Step 2b website-harvest gate uses this to decide which files require live-site signal before drafting can complete.

| File | Website source preference | Why |
|---|---|---|
| 7LAYER_DIAGNOSTIC.md | OPTIONAL | Internal diagnostic — local sources sufficient |
| CONSTRAINT_MAP.md | OPTIONAL | Derives from 7LAYER + local strategic docs |
| REPAIR_ROADMAP.md | OPTIONAL | Derives from CONSTRAINT_MAP + local OKR/plan docs |
| BELIEF_PROFILE.md | OPTIONAL | Founder-internal; rarely on the website |
| ICP.md | STRONGLY_PREFERRED | Testimonials, FAQ, case-study customer descriptions are gold |
| POSITIONING.md | STRONGLY_PREFERRED | Homepage H1 + hero subhead is the L2 identity sentence compressed |
| VOICE.md | **REQUIRED** | Voice samples in the wild ARE the voice — descriptions of voice are not |
| COMPETITIVE_LANDSCAPE.md | **REQUIRED** | Competitor homepages must be scraped (1 page each, depth 0) for credible mapping |

Behavior:
- **REQUIRED** without website signal → orchestrator MUST prompt for scrape / waiver / defer (see SKILL.md Step 2b).
- **STRONGLY_PREFERRED** without website signal → single-confirmation skip allowed.
- **OPTIONAL** → no special handling.

---

## 7LAYER_DIAGNOSTIC.md

Minimum-FILLED requires all of:

- ≥2500 bytes
- H2 sections for at least 5 of the 7 layers (L0 Source, L1 Identity, L2 Vision, L3 Capabilities, L4 Behavior, L5 Environment, L6 Audience, L7 Market) — explicit "not applicable" or "not yet diagnosed" notes count as present
- At least one named **primary constraint layer** (e.g., *"Primary constraint: L2 → L5"*)
- At least one cited source (session log, transcript, OKR doc, etc.)

Harvest signal patterns:
- Mentions of "L0 / L1 / L2..." through "L7" in adjacent docs
- Strategic plan with phrases like "the real problem is identity / vision / capability..."
- Founder/team quotes diagnosing where the system breaks
- OKR BLUF documents (often contain L2/L5 thinking)

If harvest yields < 3 layer signals → route to `/7layer` instead of drafting.

---

## CONSTRAINT_MAP.md

Minimum-FILLED requires all of:

- ≥1500 bytes
- Names the **primary constraint** (the one thing that, if fixed, unlocks everything else)
- Names ≥2 **secondary constraints** with classification (Hard / Soft / Inferred — per `core/methodology/UNVERIFIED_ASSUMPTIONS_RULE.md`)
- Explicit reasoning chain: "constraint X causes symptom Y in metric Z"
- At least one cited source

Harvest signal patterns:
- Phrases: "bottleneck", "blocker", "stuck on", "can't move past", "the real problem", "everything else depends on"
- Strategic plan obstacle sections
- Meeting recordings where the founder describes what's holding the business back

Depends on: 7LAYER_DIAGNOSTIC.md being FILLED.

---

## REPAIR_ROADMAP.md

Minimum-FILLED requires all of:

- ≥1500 bytes
- Ordered fix sequence (Phase 1, Phase 2, Phase 3...) — first phase always addresses the primary constraint
- For each phase: what's fixed, who owns it, rough time horizon (weeks, not specific dates), success signal
- Cites both CONSTRAINT_MAP.md and at least one external source

Harvest signal patterns:
- Q1/Q2/Q3 plans with sequenced initiatives
- OKR documents with phased objectives
- Strategic plans with "first we..., then we..., finally..." structure

Depends on: CONSTRAINT_MAP.md being FILLED.

---

## BELIEF_PROFILE.md

Minimum-FILLED requires all of:

- ≥3000 bytes
- Profile for at least the **primary decision-maker** (founder, CMO, GM, depending on engagement)
- Each profiled person has: identity beliefs, capability beliefs, value beliefs, fears, what they hire decisions/marketing to do (JTBD register)
- If Kolbe A / Wealth Dynamics / similar psychometric data exists in harvest → integrated
- Cites concrete quotes from session logs, meetings, written correspondence

Harvest signal patterns:
- Existing `<person>-belief-profile.md` files at root or in `analysis/`
- Session log founder quotes ("I believe...", "I think...", "what bothers me is...")
- Meeting transcripts with self-diagnostic moments
- Profile documents in `analyses/` or `team/profiles/`

If harvest yields < 5 direct founder/decision-maker quotes → route to `/belief-profile` instead of drafting.

---

## ICP.md

Minimum-FILLED requires all of:

- ≥2000 bytes
- ≥1 named primary segment, ≥1 named secondary segment OR an explicit single-segment justification
- Per segment: demographic shell + psychographic anchor + JTBD (the job they hire the product/service to do) + awareness/buying stage
- "Who this is NOT for" section — even one paragraph
- Cites sources (analytics segments, support tickets, sales call notes, founder quotes)

Harvest signal patterns:
- Strategic plan "target audience" sections
- Sales/support docs describing customer types
- GA4 / analytics audience segments
- Phrases: "our customer is", "they care about", "they hate when", "they buy because"

If harvest yields < 1 substantive segment description → route to `/jtbd-map` instead of drafting.

---

## POSITIONING.md

Minimum-FILLED requires all of:

- ≥1500 bytes
- The **L2 identity sentence** (per `core/methodology/CLIENT_INTELLIGENCE_PROFILE.md`)
- Named ≥2 direct competitors and ≥1 indirect alternative
- Per-competitor: positioning axis, what they own that we don't, what we own that they don't
- The "I am the only one who..." statement
- Cites sources (competitor research, market analysis, founder strategic thinking)

Harvest signal patterns:
- Strategic plan competitive analysis sections
- Phrases: "vs <competitor>", "unlike <competitor>", "we're the only one", "we're not <competitor>"
- Market positioning documents

Depends on: ICP.md being FILLED.

---

## VOICE.md

Minimum-FILLED requires all of:

- ≥2000 bytes
- Register definition (formal / peer / mentor / etc. — pick one with rationale)
- Banned words list (≥3 specific words/phrases this brand does not use)
- Preferred constructions list (≥3 specific phrasings this brand defaults to)
- Sentence-rhythm rules (cadence, length, paragraph density)
- Voice samples (≥3 short snippets pulled from harvest that exemplify the voice)
- Anti-pattern examples (≥2 things this voice avoids — with rewrites)
- For non-EN clients: language-specific rules (e.g., HU register notes per `core/skills/magyar-szoveg.md`)

Harvest signal patterns:
- Founder-written correspondence (the gold standard — actual voice in the wild)
- LinkedIn posts / public-facing copy
- Session transcripts (capture spoken voice)
- Existing newsletter / blog drafts

Depends on: BELIEF_PROFILE.md (the why-they-talk-this-way) and ICP.md (the audience-register fit) being FILLED.

---

## COMPETITIVE_LANDSCAPE.md

Minimum-FILLED requires all of:

- ≥1500 bytes
- ≥3 competitors named with: domain, primary positioning, key strengths, observable weaknesses
- ≥3 monitored pages or keyword clusters per competitor (URLs / keywords for ongoing watch)
- Cadence statement (how often this gets refreshed)
- Cites sources (SEMrush data, manual research, Ahrefs, etc.)

Harvest signal patterns:
- Competitor research docs anywhere in the client tree
- SEO/SEM analyses with competitor mentions
- Founder mentions of "they are doing X better than us"

Depends on: POSITIONING.md being FILLED (positioning frames who counts as a competitor).

---

## Notes

These thresholds are **minimums for the hard gate** — not aspirational quality bars. A client passing all 8 thresholds may still have a thin profile; richer is always better. The orchestrator's PROFILE_SCORECARD.md output should rate each file on a 0-5 scale beyond just FILLED/STUB so practitioners know what to deepen first.

**Future v0.2:** Add automated voice-sample extraction for VOICE.md and segment-volume estimation for ICP.md.
