---
name: build-brand-system
description: Orchestrate the 7-file Client Intelligence Profile end-to-end. Harvests scattered intelligence from a client's directory, drafts each missing brand/ file with citations, confirms each draft with the user, and hard-gates on 7/7 complete before downstream content/strategy work runs.
scope: int-company
flavor: [company, internal]
class: execute
domain: strategy
layer: [L0, L1, L2, L3]
client-scope: single-client
version: 0.2.1
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit, WebFetch]
args-hint: "[client-slug] [--mode=auto|stepwise|batch] [--skip-website] — slug resolves from CWD if omitted"
inputs:
  - clients-cloud/<slug>/CLIENT_CONFIG.md
  - clients-cloud/<slug>/DOMAIN_CHANNEL_MAP.md (source of client + competitor URLs to scrape)
  - clients-cloud/<slug>/brand/* (existing state)
  - clients-cloud/<slug>/**/*.md (local harvest pool — root, inbox, recordings, session logs, audit docs)
  - Live website pages — primary client domain(s) + any competitor URLs found locally (web harvest — tiered, WebFetch by default; see Step 2b)
outputs:
  - clients-cloud/<slug>/brand/7LAYER_DIAGNOSTIC.md
  - clients-cloud/<slug>/brand/CONSTRAINT_MAP.md
  - clients-cloud/<slug>/brand/REPAIR_ROADMAP.md
  - clients-cloud/<slug>/brand/BELIEF_PROFILE.md
  - clients-cloud/<slug>/brand/ICP.md
  - clients-cloud/<slug>/brand/POSITIONING.md
  - clients-cloud/<slug>/brand/VOICE.md
  - clients-cloud/<slug>/brand/COMPETITIVE_LANDSCAPE.md
  - clients-cloud/<slug>/brand/PROFILE_SCORECARD.md (completeness scorecard, emitted at end)
preflight:
  - client-config
  - working-directory-is-client
ontology:
  consumes: [Layer, FND, Belief]
  emits: [Goal, REC, Layer]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - 7layer
  - belief-profile
  - build-brand
  - craft-offer
  - analyze-gtm
tags: [orchestrator, brand, intelligence, onboarding, profile]
---

## Purpose

Most clients have a `brand/` directory scaffolded with 7 standard files — and 5+ of them are empty stubs while the actual intelligence sits scattered in strategic plans, session logs, OKR docs, belief-profile working files at the root. This skill **consolidates the scatter into the standard**.

It is an **orchestrator**, not a thinker. The thinking belongs to the sub-skills (`/7layer`, `/belief-profile`, `/build-brand`, `/craft-offer`, `/analyze-gtm`). This skill's job is:

1. Find what's already known.
2. Surface it per intelligence file.
3. Draft each missing file.
4. Get user confirmation.
5. Hard-gate on 7/7 before downstream work runs.

**Anti-goal:** This skill does NOT replace the sub-skills. If a file is missing rich diagnostic work (e.g., no 7-layer has ever been run), the orchestrator routes the user to run that sub-skill first rather than fake the output.

## Posture

Discovery, not pronouncement. Every draft is presented with sources and the question *"what did we get wrong? what's missing?"* before write. See `core/methodology/DISCOVERY_NOT_PRONOUNCEMENT.md`.

## Arguments

- **Client slug** (optional) — resolved from CWD if running inside `clients-cloud/<slug>/`. If hub session, ask user (do not enumerate; user types the slug per `.claude/rules/skill-privacy.md`).

## Process

### Step 0 — Preflight

1. Resolve client slug from CWD or argument. If neither resolves, ask user (no enumeration).
2. Verify `clients-cloud/<slug>/` exists. If not, abort with clear message.
3. Verify `clients-cloud/<slug>/CLIENT_CONFIG.md` exists. If not, suggest `/add-client`.
4. Read `core/methodology/CLIENT_INTELLIGENCE_PROFILE.md` — confirm the 7-file list hasn't drifted from this skill's expectations.
5. **Pre-read all 8 target brand/ files** — including stubs. This is non-negotiable. The Claude Code Write tool refuses to overwrite a file that hasn't been Read in-conversation, so batch-write attempts fail mid-run if you don't pre-read. Issue a single parallel batch of Read calls covering all 8 files (or however many exist). Stubs return their TODO placeholder; that's fine — the Read satisfies the harness rule. Source incident: 2026-05-14 Deluxe dogfood, POSITIONING + VOICE Write failed mid-batch.

### Step 1 — Survey existing state

Run `node scripts/survey.mjs <slug>`. Output:

```
Brand intelligence profile — <slug>
┌─────────────────────────┬────────┬─────────┐
│ File                    │ Bytes  │ Status  │
├─────────────────────────┼────────┼─────────┤
│ 7LAYER_DIAGNOSTIC.md    │ 11238  │ FILLED  │
│ BELIEF_PROFILE.md       │ 53449  │ FILLED  │
│ CONSTRAINT_MAP.md       │    73  │ STUB    │
│ ICP.md                  │    62  │ STUB    │
│ POSITIONING.md          │    70  │ STUB    │
│ REPAIR_ROADMAP.md       │    73  │ STUB    │
│ VOICE.md                │    64  │ STUB    │
│ COMPETITIVE_LANDSCAPE   │   ---  │ MISSING │
└─────────────────────────┴────────┴─────────┘
Completeness: 2/7 (29%)
```

Substance thresholds (per `reference/file-substance-criteria.md`):
- **FILLED**: ≥1500 bytes AND has ≥3 H2/H3 headings AND has ≥1 evidence tag or cited source
- **STUB**: file exists but <500 bytes, or has fewer than 2 headings
- **PARTIAL**: between the two — gets treated as STUB for the gap pass but flagged for user review
- **MISSING**: file does not exist on disk

### Step 1.5 — Harvest-richness scoring (gates mode selection)

For each of the 8 target files, estimate the **harvest richness** *before* drafting. This determines the recommended execution mode and the website-scrape decision.

Inventory two things in parallel:

1. **Source-document inventory** — `ls` the client root + `inbox/` + `correspondence/` + adjacent dirs by file size. Documents >2KB are candidate sources. Count how many fall into each bucket (use the keyword patterns in `reference/harvest-patterns.md`).
2. **Dependency state** — for each STUB/MISSING file, check whether its `depends_on:` upstream files are FILLED (from Step 1).

Score each STUB/MISSING file:

| Signal | Points |
|---|---|
| 3+ candidate source documents matching the bucket | +3 |
| 1-2 candidate source documents | +1 |
| All `depends_on:` upstream files are FILLED | +2 |
| File is website-REQUIRED (VOICE, COMPETITIVE_LANDSCAPE) and web harvest is skipped | -3 |
| File has a pre-existing user-written reference file in client root (e.g., `kocsibeallo-belief-profile.md`) | +2 |

**Confidence levels:**
- **High** (score ≥4): batch-mode candidate
- **Medium** (score 2-3): stepwise recommended
- **Low** (score <2): route to sub-skill (`/7layer`, `/belief-profile`, etc.) — don't fake-draft

Surface the score table to the user before mode selection. Example:

```
Harvest-richness preview — deluxe

File                       Sources  Deps  Website  Score  Confidence
─────────────────────────────────────────────────────────────────────
CONSTRAINT_MAP.md            3+      ✓     opt      5      HIGH
REPAIR_ROADMAP.md            3+      ✓     opt      5      HIGH
ICP.md                       3+      ✓     pref     5      HIGH
POSITIONING.md               2       ✓     STRONG   3      MEDIUM ← scrape recommended
VOICE.md                     2       ✓     REQ      0      LOW    ← scrape REQUIRED or waiver
COMPETITIVE_LANDSCAPE.md     2       —     REQ      -1     LOW    ← scrape REQUIRED or waiver

Recommended: stepwise for VOICE + COMPETITIVE_LANDSCAPE (or scrape first).
              batch for CONSTRAINT_MAP + REPAIR_ROADMAP + ICP.
```

### Step 2 — Harvest (local files + live website)

The harvest has two passes. Both feed the same per-bucket index.

**2a — Local file harvest.** Recursively scan `clients-cloud/<slug>/**/*.md` (excluding `brand/`, `_archive/`, `recordings/audio/`, `inbox/_processed/`) for adjacent intelligence. Use the keyword patterns in `reference/harvest-patterns.md` to classify each found paragraph into one of the 8 buckets.

**2b — Website harvest.** The client's live website is often the **highest-signal source** for voice, positioning, and ICP — local files describe the brand; the website *is* the brand.

**Discovery tiers — start cheap, escalate only when needed:**

- **Tier 0 — `WebFetch` (default).** Fetch the client's key pages directly (homepage, about, services, a few posts) → markdown. No connector, no cost. Sufficient for single-client brand discovery — the signal lives in ~8–12 key pages, not a full crawl. URL discovery at Tier 0: `WebFetch` the homepage + `/sitemap.xml`, extract candidate links, score with the path-priority table in `reference/harvest-patterns.md`. **On Claude Cowork, `WebFetch` is provenance-gated — read the box below before relying on Tier 0.**
- **Tier 1 — `Claude in Chrome`.** Escalate to the browser connector when WebFetch returns thin content (heavy JS rendering).
- **Tier 2 — Firecrawl (optional).** For full-site `map` crawls, large competitor sweeps, or anti-bot-heavy domains. Requires the Firecrawl MCP connector (per-client, paid) added to `allowed-tools` + `.mcp.json`. Not bundled by default.

**⚠ Cowork — the `WebFetch` provenance gate.** On the Claude Cowork runtime, `WebFetch` only retrieves URLs that **appeared in a user message** (or in a prior `WebFetch` result). A URL the skill read from `CLIENT_CONFIG.md` / `DOMAIN_CHANNEL_MAP.md`, or that the user picked from an options list, is **not** in the provenance set — `WebFetch` refuses it with *"URL not in provenance set."* This is a Cowork runtime rule, not a harvest failure. So at Tier 0, before any config-derived fetch:

1. **Ask the user to paste the site URL(s) into chat — then fetch in the same turn.** State exactly which domain(s) you intend to harvest (from `CLIENT_CONFIG.md` / `DOMAIN_CHANNEL_MAP.md`) and ask the user to paste them back. The provenance window may be only the **immediately-prior** user message — so `WebFetch` the pasted URLs *in the very next step*, before doing anything else. If other turns have intervened since the paste, treat the URL as possibly aged out of the provenance set and **re-ask** rather than assume it is still fetchable. A URL only the *skill* mentioned (in its own prior response) is never provenance-eligible.
2. After the homepage is fetched, links **discovered inside that fetched page** are themselves in the provenance set — so sitemap-/homepage-discovered sub-pages can be `WebFetch`-ed normally without a second paste.
3. If the user declines to paste, treat website harvest as unavailable and fall through to the website-required gate below (waiver / defer) — exactly as for missing Firecrawl auth. Never report a harvest as "failed" when it was never provenance-eligible.

Outside Cowork (terminal / Claude Code) `WebFetch` has no provenance restriction and Tier 0 fetches config URLs directly. When in doubt, do the paste step — it is harmless off-Cowork and mandatory on it.

The scrape plan below applies at any tier — the `firecrawl_map` / `firecrawl_scrape` calls named in it are the **Tier-2** form; at Tier 0 substitute `WebFetch`.

**Website-required gate** (per `reference/file-substance-criteria.md` "Website source preference" field):

- **REQUIRED files** — `VOICE.md`, `COMPETITIVE_LANDSCAPE.md`. If website harvest hasn't run for these (no cached scrape, Firecrawl unavailable, or `--skip-website` flag), the orchestrator MUST prompt the user before drafting:
  - **Harvest now** → run web harvest on the configured domains (Tier 0 `WebFetch` by default; **on Cowork, first ask the user to paste the site URL(s) into chat** — see the provenance-gate box above)
  - **Explicit waiver** → user types reason (e.g., "no Firecrawl auth", "internal-test run"); recorded in `sources_consulted:` frontmatter as `website-harvest: waived ({reason})`
  - **Defer this file** → keep the file as STUB, mark in PROFILE_SCORECARD as blocked-on-website-harvest, proceed to others
- **STRONGLY_PREFERRED files** — `POSITIONING.md`, `ICP.md`. Recommend scrape, but skip with single user confirmation rather than enforced waiver.
- **OPTIONAL files** — others. Local-only is fine.

The `--skip-website` flag is a global waiver for the entire run. Logged once at the start, applies to all REQUIRED files. Use only when website harvest is genuinely infeasible (no auth, broken DNS, etc.).

URLs to scrape come from (in priority order):

1. `clients-cloud/<slug>/CLIENT_CONFIG.md` — primary domain
2. `clients-cloud/<slug>/DOMAIN_CHANNEL_MAP.md` — all domains owned by the client (multi-domain clients have several)
3. Competitor URLs found during local harvest (any external domain mentioned in strategic / competitor docs)

Per-domain scrape plan:

- Enumerate top URLs — **Tier 0:** `WebFetch` `/sitemap.xml` or extract links from the homepage; **Tier 2:** `mcp__firecrawl__firecrawl_map` (limit ≤30 to control cost)
- Score discovered URLs by path-keyword priority. **High priority:** `/`, `/about*`, `/rolunk`, `/who-we-are`, `/team`, `/services*`, `/szolgaltatasok`, `/products*`, `/termekek`, `/case-stud*`, `/esettanulmany*`, `/testimonial*`, `/velemenyek`, `/blog*`, `/hirek*`, `/manifesto`, `/kuldetes`. **Skip:** `/contact*`, `/legal*`, `/privacy*`, `/cookie*`, `/sitemap*`, `/login*`, `/admin*`, anything with `?utm_`, file-extension `.pdf|.jpg|.png|.zip`.
- Fetch the top 8–12 URLs per primary domain — **Tier 0:** `WebFetch` each (markdown); **Tier 2:** `mcp__firecrawl__firecrawl_scrape` (markdown, main content only)
- Cache the scraped markdown under `clients-cloud/<slug>/.cache/website-harvest/<domain>/<slugified-path>.md` with frontmatter recording `scraped_at`, `url`, `status_code`. Subsequent runs reuse the cache if newer than 14 days.
- For each cached scrape: apply the same harvest-pattern classification as local files, but with **website-specific bucket boosts** (per `reference/harvest-patterns.md` "Website harvest patterns"). Example: H1 + H2 of homepage count as strong POSITIONING signal; testimonial sections count as strong ICP signal.
- For competitor URLs found during local harvest: scrape only their landing page (depth 0, one URL each). These feed only the COMPETITIVE_LANDSCAPE bucket.

**Failure modes for website harvest (do not crash the orchestrator):**

- `WebFetch` refuses with *"URL not in provenance set"* (Cowork provenance gate) → **not a harvest failure.** Ask the user to paste the site URL into chat, then retry the fetch. Only if they decline does this fall through to local-only harvest. See the provenance-gate box in Step 2b.
- Firecrawl unavailable / no auth → log it, continue with local-only harvest, flag the affected files (VOICE, POSITIONING, ICP especially) as drawing from local-only signal.
- Domain returns 4xx/5xx → record in scorecard as a gap; ask user to verify URL in CLIENT_CONFIG.md.
- Domain returns mostly JS-rendered shell with no usable content → Firecrawl handles this internally; if extracted content < 500 chars per page, treat the domain as low-signal and warn user.
- Multilingual sites (e.g., Deluxe Hungarian + English variants) → scrape the language matching the brand's primary register (per CLIENT_CONFIG.md `primary_language` field if present; otherwise ask).

**2c — Output: harvest index.** Combined index keyed by intelligence file, with source-type labels:

```
Harvest index — <slug>
ICP signals (18 matches — 12 local, 6 website):
  [LOCAL]    2026-05-03_kocsibeallo-master-plan.md:L42 — "Premium garage segment, age 35-55..."
  [LOCAL]    DELUXE_STRATEGIC_PLAN_Q1_Q2_2026.md:L88 — "Two distinct customer types..."
  [WEBSITE]  kocsibeallo.hu/rolunk — testimonial section: "Mi 20 éve építjük..."
  [WEBSITE]  kocsibeallo.hu/galeria — repeated customer profile language
  ...

VOICE signals (11 matches — 4 local, 7 website):
  [WEBSITE]  kocsibeallo.hu/ — homepage H1 + subhead (strongest voice sample)
  [WEBSITE]  kocsibeallo.hu/szolgaltatasok — service descriptions
  [LOCAL]    2026-05-08_PETER_VALASZ_STRATEGIAI_KERDESEKRE.md:L23 — peer-email voice sample
  [LOCAL]    SESSION_LOG_2026_01_20.md:L102 — Péter spoken pattern
  ...

POSITIONING signals (14 matches — 8 local, 6 website):
  [WEBSITE]  kocsibeallo.hu/ — "Magyarország prémium kocsibeálló-építője"
  [LOCAL]    DELUXE_STRATEGIC_PLAN_Q1_Q2_2026.md:L120 — "Premium vs Standard pole..."
  ...

COMPETITIVE_LANDSCAPE signals (5 matches — 2 local, 3 competitor-website):
  [WEBSITE]  <competitor-a>.hu/ (scraped from positioning doc reference)
  ...
```

Surface this to the user — they should see **what already exists** before any drafting. The user can drop URLs that look low-signal or add URLs auto-discovery missed.

### Step 3 — Per-file pass (mode-aware, dependency order)

**Step 3.0 — Mode selection.** Based on `--mode` argument:

- **`auto` (default)** — use Step 1.5 scoring to split files into HIGH-confidence (batch) and MEDIUM/LOW-confidence (stepwise). Present the split to the user; they can override before execution.
- **`stepwise`** — every STUB/MISSING file gets accept/revise/regenerate individually (original v0.1 behavior). Best for thin-material clients or first engagements.
- **`batch`** — draft all needing files in one pass, present at end as a batch for collective accept/revise. Refuses if ANY file scored LOW in Step 1.5 (forces user to either scrape or explicitly waive).

Surface the chosen mode to the user before drafting begins. Mode auto-recommendations should err toward stepwise on borderline cases — batch is the optimization, not the default.

**Step 3.1 — Per-file procedure.** Process STUB/PARTIAL/MISSING files in dependency order. Skip files marked FILLED.

**Order (do not change without updating downstream skills):**

1. `7LAYER_DIAGNOSTIC.md` — foundation; everything else depends on layer findings
2. `CONSTRAINT_MAP.md` — derives from 7-layer
3. `REPAIR_ROADMAP.md` — derives from constraints
4. `BELIEF_PROFILE.md` — independent but feeds VOICE
5. `ICP.md` — independent but feeds POSITIONING + VOICE
6. `POSITIONING.md` — depends on ICP + 7-layer
7. `VOICE.md` — depends on BELIEF_PROFILE + ICP
8. `COMPETITIVE_LANDSCAPE.md` — depends on POSITIONING

**Per-file procedure:**

1. **Check harvest sufficiency.** Read `reference/file-substance-criteria.md` for the minimum-substance criteria of this file. If harvest matches < minimum:
   - Route user to run the appropriate sub-skill first: e.g., *"No 7-layer signals found in harvest. Run `/7layer` before this orchestrator can draft 7LAYER_DIAGNOSTIC.md."*
   - Skip this file for now; continue to next file (but track as blocked at end).
2. **Draft.** Synthesize a draft from harvested material, using `reference/file-templates/<FILE>.md` as the skeleton. Every claim cites its source file:line.
3. **Surface to user** (stepwise mode) or **defer to end of batch** (batch mode). When surfacing, show three options:
   - **Accept** — write to `brand/<FILE>.md`
   - **Revise** — user edits inline before write
   - **Regenerate** — user provides correction direction, redraft
4. **Write.** Only on Accept (or post-Revise). The file gets a frontmatter block:

   ```yaml
   ---
   scope: int-confidential
   client: <slug>
   generated_by: build-brand-system v0.1
   generated_date: YYYY-MM-DD
   sources_consulted:
     - <path>:L<line>
     - <path>:L<line>
   status: confirmed-by-user
   needs_refresh_by: <YYYY-MM-DD + 90 days>
   ---
   ```

5. **Lock awareness.** Brand intelligence files are NOT in `.gitattributes` lockable list today. The orchestrator does not lock. If the user is editing the file concurrently in another session, last-write-wins — flag this as a caveat in the user-facing summary.

### Step 4 — Hard gate

After the per-file pass, re-run `node scripts/survey.mjs`. If completeness < 7/7:

```
⚠️ HARD GATE — incomplete profile

Blocked files (need sub-skill runs first):
  - 7LAYER_DIAGNOSTIC.md → run /7layer
  - VOICE.md → run /build-brand (this is the existing thinking skill for associations)

User skipped:
  - POSITIONING.md (regenerate requested but not provided)

Status: 4/7 complete. /build-content-system will NOT run until 7/7.
```

Do NOT mark the profile complete. Emit a `PROFILE_SCORECARD.md` showing what's done, what's blocked, what's user-skipped, and what to do next.

### Step 5 — Completion

When 7/7 is reached:

1. Write `brand/PROFILE_SCORECARD.md` with the final state, sources used per file, and unblock-signal for `/build-content-system`.
2. Append entry to `clients-cloud/<slug>/CAPTAINS_LOG.md`: "Client intelligence profile completed via /build-brand-system v0.1 — 7/7 files filled."
3. Surface to user: profile complete, content-system unblocked, suggest next step.

## Hard rules

1. **Cite every claim.** Every drafted paragraph in every file must have a source citation (file:line) from the harvest. No invented intelligence. If no source exists, the file gets routed to a sub-skill, not faked.
2. **User confirms each draft.** No silent writes. Accept / Revise / Regenerate is mandatory per file.
3. **Hard gate stands.** Do not announce profile complete with <7 substantive files. The gate exists to keep downstream skills from generating thin content on thin intelligence.
4. **Single client.** Operate only within the resolved client's tree. Do not read other clients' brand files for "inspiration" — that's a cross-client leak per `.claude/rules/cross-client-confidentiality.md`.
5. **Do not enumerate.** If slug resolution fails, ask the user to type the slug. Never list available clients per `.claude/rules/skill-privacy.md`.
6. **Idempotent.** Re-running this skill on a 7/7 client should: re-survey, report "already complete", offer a refresh path (per-file regeneration). Never overwrite without confirmation.
7. **Discovery, not pronouncement.** Every draft ends with *"What did we get wrong? What's missing?"* before user accepts.

## Output sections

Final user-facing output:

- **Survey summary** (before-state)
- **Harvest summary** (what we found and where)
- **Per-file outcomes** (drafted / blocked / user-skipped)
- **Final completeness** (X/7)
- **Profile scorecard path** (where the user can find it)
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `/add-client` (sets up the client tree); `/7layer`, `/belief-profile`, `/build-brand`, `/craft-offer`, `/analyze-gtm`, `/competitor-monitor` (the diagnostic sub-skills this orchestrates)
- **Downstream:** `/build-content-system` (gated on 7/7 from this skill); `/blog-draft` and other content skills (consume the filled brand intelligence)
- **Related:** `core/methodology/CLIENT_INTELLIGENCE_PROFILE.md` (the canonical 7-file standard this skill enforces)

## Versioning

- **v0.1.0** — initial dogfood version. Harvest patterns, file templates, and substance criteria likely need refinement after first real runs.
- **v0.2.0 planned** — harvest pattern improvements based on Deluxe dogfood; richer template scaffolds for each file.
- **v1.0.0** — promotion criterion: 3 clients onboarded through this skill end-to-end, each producing a complete profile that materially improves downstream content/strategy output.

## Notes for the practitioner

This skill is **most valuable on existing clients with scattered material** (Deluxe, Wellis, Damanhur). On a brand-new client with empty everything, the experience is "run /7layer first, then this." That's fine — the orchestrator's job is consolidation; on a clean-slate it just enforces ordering.

The harvest step is the hardest to get right. Expect to refine `reference/harvest-patterns.md` after each dogfood run.

**What did we get wrong? What's missing?**
