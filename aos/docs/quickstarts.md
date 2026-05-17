# AOS plugin — per-skill quickstarts

One quickstart per skill: **what it does · the trigger phrase · what you get.**
Skills are grouped by where they sit in the GTM loop. You rarely call a skill by
name — say what you need in plain English and `aos-route-question` routes you.

The loop: `onboard → catalogue → discover → brand → plan → content → review → distribute → measure → FND ↺`

---

## Setup & maintenance

**`aos-onboard`** — first-run setup. *"set me up" / "get started".* → a granted
folder scaffolded (or a graduate bundle imported), `AOS_CONFIG.md`, connectors, cadence.

**`aos-route-question`** — the front door. *Any open-ended GTM question, or "what
can you do".* → routes you to the right skill, indexed by the 7+1 Layer Framework.

**`aos-migrate`** — upgrade a granted folder behind the plugin's schema. *Run when
onboard/route flags the folder is behind.* → ordered, non-destructive migration.

**`aos-registry`** — the person/BU dictionary + account map + access dashboard.
*"who has access to what", "map the accounts".* → `client/REGISTRY.md`.

**`aos-discovery-package`** — assemble a loop-ready folder from a client's existing
material + a fresh intake. *"build the discovery package".* → a populated `inbox/` +
a readiness check.

## Discovery & cataloguing

**`aos-catalogue`** — index `inbox/` material + `content/`. *"catalogue the inbox".*
→ `CATALOGUE.md` files with type + status per item.

**`aos-ingest-meeting`** — a meeting transcript → tasks. *"process this meeting",
"turn these notes into tasks".* → decisions + action items in `TASKS.md`, a notes record.

**`aos-map-jtbd`** — survey the GTM team, map input→output per role. *"map the
team", "who does what", "find the process gaps".* → a team JTBD map + gap findings.

## Brand intelligence — the 9-file Client Intelligence Profile

**`aos-build-brand-system`** — orchestrate the whole 9-file brand profile.
*"build the brand profile".* → `brand/` — 9 files, hard-gated on completeness.

**`aos-build-belief-profile`** — the decision-makers' beliefs / fears / JTBD.
*"profile the founder", "what does the client believe".* → `brand/BELIEF_PROFILE.md`.

**`aos-build-icp`** — the Ideal Customer Profile. *"who is the customer", "build
the persona".* → `brand/ICP.md` — named segments + a "who this is NOT for".

**`aos-build-offer`** — the offer design. *"design the offer", "what should we
sell".* → `brand/OFFER.md`.

**`aos-analyze-competition`** — the competitive field, per BU. *"who are our
competitors", "competitor map".* → `brand/competitors/` profiles + catalogue +
`COMPETITIVE_LANDSCAPE.md`.

**`aos-build-brand`** — brand strategy: associations, growth, a pivot. *"grow the
brand", "should we reposition".* → a brand-strategy deliverable.

## Diagnostics

**`aos-diagnose-7layer`** — the L0–L7 Marketing Control Framework diagnostic.
*"diagnose the whole funnel", a diffuse "why" question.* → a layer-by-layer read.

**`aos-diagnose-funnel`** — an L4 conversion / funnel diagnostic. *"why aren't we
converting".* → a funnel diagnostic + FND/REC. (Databox.)

**`aos-diagnose-lifecycle`** — an L5 lifecycle / CRM / retention diagnostic.
*"why do customers churn".* → a lifecycle diagnostic + FND/REC. (HubSpot.)

**`aos-analyze-gtm`** — the 6 Core GTM Decisions gap analysis. *"analyse our
go-to-market".* → a GTM gap analysis.

**`aos-set-baseline`** — a seasonality-aware performance baseline before a
campaign. *"what's normal for this metric", "baseline before we start".* → a
baseline band record. (Databox.)

## Planning

**`aos-plan`** — turn the brand profile + content-system into a prioritised GTM
plan. *"what should we do next".* → `deliverables/.../gtm-plan.md` + `REC`s.

**`aos-plan-campaign`** — a campaign brief (dealer / retail / brand). *"plan the
<occasion> campaign", "brief the promotion".* → a campaign brief.

**`aos-prep-pitch`** — analyse a tender / RFP, prep the response. *"prep this
pitch", "should we bid".* → a pitch-prep analysis + a bid/no-bid call.

## Content

**`aos-write`** — draft one content piece fast, light context, no brand-profile
gate (the mid-level writer). *"write a post", "draft content".* → one publishable draft.

**`aos-draft-content`** — draft content on a complete brand profile — a single
piece or a multi-piece series (the advanced tier). *"draft the series".* → content
in `content/`.

**`aos-build-patterns`** — the client's content pattern library + a dialect tone
layer. *"build the pattern library", "add a regional tone".* → `content-system/patterns.md`.

**`aos-localize-hu`** — a Hungarian nativeness pass over content. *Auto-applied
when `content-language` is `hu`.* → native-quality HU output.

## The loop — review, ship, measure, learn

**`aos-review`** — the quality gate. *"review this", "is this ready to publish".*
→ a PASS / REVISE / BLOCK verdict + report.

**`aos-distribute`** — ship a content piece to its channel. *"ship this", "publish
the post".* → a channel-formatted publish-ready file + status advanced.

**`aos-measure`** — measure shipped content / campaigns. *"how did it do".* → a
results read + `FND`s. (Databox.)

**`aos-index-ontology`** — index the FND/REC/GOT graph. *"what have we learned",
"rebuild the ontology".* → `ontology/INDEX.md` + the unactioned-findings list.

## Quality & governance

**`aos-back-statements`** — tag statements with evidence classes. *"back these
statements", "what's unsourced".* → a provenance report (`[DATA]`/`[STATED]`/…).

**`aos-anonymize`** — the privacy gate. *"anonymise this", "scrub the PII", "safe
to share".* → an anonymised copy + a PII report. Run before anything leaves the folder.

**`aos-coach-am`** — red-team a plan / brief / deliverable before the client sees
it. *"pressure-test this", "what am I missing".* → a coaching / red-team report.

## Cadence & operations

**`aos-daily`** — the morning briefing / end-of-day wrap. *"start my day", "wrap
up the day".* → a focus brief / a logged day.

**`aos-fit-framework`** — fit AOS to the client's operating framework (EOS, OKR…).
*"we run EOS", "use our meeting format".* → `client/OPERATING_FRAMEWORK.md`.

## Feedback

**`aos-feedback`** — report a bug / confusion / missing feature / praise from
inside the plugin. *"report feedback", "this is broken", "feature request".* → a
feedback record + an email to the AOS support intake.

---

*36 skills. Full behaviour for any one of them is in its `SKILL.md`. The routing
map by 7+1 layer is in `aos-route-question`.*
