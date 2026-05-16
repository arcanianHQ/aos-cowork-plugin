---
scope: int-company
---

# Harvest patterns — finding scattered intelligence

When the orchestrator scans the `inbox/` zone (`inbox/**/*.md`, excluding `inbox/_processed/`) and any markdown elsewhere in the granted folder outside `brand/`, it classifies paragraphs into 8 buckets matching the 7 intelligence files. These are the keyword + structural patterns used.

**Rule:** match the **paragraph** containing the keyword, plus 1 paragraph before and after for context. Always record `<path>:L<line>` for citation.

**Scoring:** weak match = 1 keyword. Strong match = ≥3 keywords OR a structural cue (e.g., H2 heading "ICP" or "Target Customers"). Strong matches drive the draft; weak matches surface in the harvest index only.

---

## Bucket 1 — 7LAYER_DIAGNOSTIC.md

**Direct cues** (any of these = strong):
- `^#+ .*L[0-7]` (heading mentions a layer)
- `L0|L1|L2|L3|L4|L5|L6|L7` followed by `Source|Identity|Vision|Capabilities|Behavior|Environment|Audience|Market`
- "primary constraint", "constraint layer", "the layer that's broken"
- "7-layer", "seven layer", "seven-layer diagnostic"

**Indirect cues** (any 2 = weak):
- "identity crisis", "vision misalignment", "capability gap"
- "the real problem isn't X, it's Y"
- "we keep trying to fix Y but the issue is Z"

**Exclude:** generic mentions of "level" or "layer" in technical/data contexts (database layer, abstraction layer).

---

## Bucket 2 — CONSTRAINT_MAP.md

**Direct cues:**
- "bottleneck", "blocker", "blocked by", "stuck on"
- "constraint", "the one thing"
- "everything else depends on", "until we fix X we can't"
- "primary blocker", "secondary blocker"

**Indirect cues** (any 2):
- "we've tried X and Y but the problem persists"
- "the same issue keeps coming back"
- "no matter what we do, X stays broken"

---

## Bucket 3 — REPAIR_ROADMAP.md

**Direct cues:**
- Sequence markers: "Phase 1", "Phase 2", "Q1", "Q2", "Q3", "Q4", "Step 1", "Step 2"
- "first we...", "then we...", "finally we..."
- "roadmap", "fix sequence", "plan of attack"
- "milestone", "phase plan"

**Indirect cues** (any 2):
- Ordered lists in strategic docs
- Date-anchored objectives ("by end of month X, we will...")
- OKR documents (file names containing `OKR`, `BLUF`, `Q[1-4]`)

---

## Bucket 4 — BELIEF_PROFILE.md

**Direct cues:**
- "I believe", "I think", "I feel", "I'm convinced"
- "what bothers me", "what worries me", "what scares me"
- Filename patterns: `*belief-profile*`, `*-profile*`, `PROFILE_*`
- "Kolbe", "Wealth Dynamics", "MBTI", "Enneagram", "Big Five"
- "fear of", "afraid that", "concerned that"

**Indirect cues** (any 2):
- First-person founder/decision-maker quotes
- Self-diagnostic moments ("I see this in myself too")
- Patterns of behavior the person notices in themselves

**Special:** If a file named `*belief-profile*.md` exists at root or in `analysis/`, treat as **strong match** — pre-existing belief work. Cite the whole file, not individual paragraphs.

---

## Bucket 5 — ICP.md

**Direct cues:**
- "ICP", "ideal customer", "target audience", "target customer"
- "persona", "segment", "buyer persona"
- "our customer is", "the customer wants", "the customer hates"
- "JTBD", "job to be done", "they hire us to"
- "who this is for", "who this is NOT for"

**Indirect cues** (any 2):
- Demographic descriptions (age, income, location, role)
- Psychographic anchors (values, fears, aspirations)
- Awareness/buying stage language ("not yet aware", "evaluating", "ready to buy")
- Industry/segment vocabulary specific to the client

---

## Bucket 6 — POSITIONING.md

**Direct cues:**
- "positioning", "position vs", "differentiator"
- "vs <competitor>", "unlike <competitor>"
- "we're the only one who", "we're not <competitor>"
- "L2 identity", "identity sentence", "what we ARE"
- "premium vs standard", "high-end vs low-end"

**Indirect cues** (any 2):
- Competitive comparison tables
- Pricing positioning discussions
- "Up market / down market / adjacent" pivot language
- Brand archetype mentions

---

## Bucket 7 — VOICE.md

**Direct cues:**
- "voice", "register", "tone", "tone of voice"
- "we sound like", "we don't sound like"
- "banned words", "preferred words", "anti-patterns"

**Indirect cues** — the actual voice samples (highest value):
- Founder-written email correspondence (files in `correspondence/`)
- Founder LinkedIn posts (often pasted into inbox)
- Public-facing copy (newsletter drafts, landing page content)
- Session transcripts containing founder spoken voice

**Special harvest rule:** For VOICE.md, the **content of founder-written material itself** is the harvest, not just descriptions of voice. Extract 200-400 word samples from the strongest examples.

---

## Bucket 8 — COMPETITIVE_LANDSCAPE.md

**Direct cues:**
- "competitor", "competition", "competitive landscape"
- "<competitor domain>" — any URL pattern that's not the client's own domain
- "SEMrush", "Ahrefs", "SimilarWeb" — tooling indicates research
- "they're doing X better"

**Indirect cues** (any 2):
- Domain mentions in market/industry context
- Comparative analysis of features, pricing, positioning

---

## Files to exclude from harvest

Always exclude:
- `brand/` (already in target — circular)
- `_archive/**` (intentionally retired material)
- `recordings/audio/**` (binary)
- `inbox/_processed/**` (already routed elsewhere)
- `data/**` (machine-generated metrics)
- `node_modules/**`, `.git/**` (housekeeping)
- Files with frontmatter `status: archived` or `status: retired`

Always include (priority sources):
- Root-level `.md` files (often the highest-signal strategic docs)
- `inbox/` (recent, unprocessed)
- `correspondence/**`
- `analysis/**` and `analyses/**`
- `recordings/*.md` (transcripts)
- Session logs (`SESSION_LOG_*.md`)
- OKR / BLUF / strategic plan files

---

## Match scoring

For each candidate paragraph:

```
score = (direct_cue_count * 3) + (indirect_cue_count * 1) + (structural_cue_bonus)
structural_cue_bonus = 5 if the paragraph is under an H2/H3 heading that itself matches the bucket keywords
```

In the harvest index, sort by score descending. The orchestrator drafts using only the top 5-10 matches per bucket (avoid drowning in noise).

---

## Website harvest patterns

The live website is often the highest-signal source. The patterns below run *after* a page is fetched to markdown — via `WebFetch` at Tier 0, or `firecrawl_scrape` at Tier 2 (see `SKILL.md` Step 2b). They run *in addition to* the bucket keyword patterns above — a homepage paragraph mentioning "ideal customer" still hits the ICP bucket via keyword match; the website-specific patterns just add structural boosts.

### URL-path priority (which pages get scraped)

**HIGH priority — always scrape if discovered:**

| Path pattern | Strongest bucket | Why |
|---|---|---|
| `/` (homepage) | POSITIONING, VOICE | H1 + hero subhead is usually the L2 identity sentence in compressed form |
| `/about*`, `/about-us`, `/rolunk`, `/cegunkrol`, `/who-we-are`, `/our-story` | POSITIONING, BELIEF_PROFILE, VOICE | Founder origin story = belief signal; positioning statements appear here in long form |
| `/manifesto`, `/kuldetes`, `/mission`, `/values`, `/ertekek` | POSITIONING, BELIEF_PROFILE | Explicit value/identity claims |
| `/team`, `/csapat`, `/people` | BELIEF_PROFILE | Decision-maker bios, sometimes founder quotes |
| `/services*`, `/szolgaltatasok`, `/megoldasok`, `/products*`, `/termekek` | POSITIONING, ICP | Service-page copy carries strong positioning + reveals which customer the offer targets |
| `/case-stud*`, `/esettanulmany*`, `/portfolio`, `/projects*`, `/projektek`, `/munkaink` | ICP | Featured customers = literal ICP examples |
| `/testimonial*`, `/velemenyek`, `/reviews`, `/ertekel*` | ICP, VOICE | Customer language in their own words = JTBD + emotional triggers |
| `/blog*`, `/hirek*`, `/news*`, `/insights*`, `/tudasbazis` | VOICE | Long-form brand writing = strongest voice sample |
| `/pricing*`, `/arak`, `/csomagok` | POSITIONING, ICP | Pricing language reveals positioning tier (premium / mass / budget) + target segment |
| `/faq*`, `/gyakori-kerdesek` | ICP, CONSTRAINT_MAP | What customers ask reveals their objections + perceived blockers |

**LOW priority — skip unless URL pool is thin:**

`/contact*`, `/kapcsolat`, `/legal*`, `/privacy*`, `/adatvedelem`, `/cookie*`, `/sutik`, `/sitemap*`, `/login*`, `/admin*`, `/career*`, `/karrier`, `/jobs*`, `/munka`. These rarely contain brand-intelligence signal worth the scrape cost.

**ALWAYS skip:**

- URLs with query params `?utm_*`, `?fbclid`, `?gclid`, `?ref=`
- File extensions: `.pdf`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.zip`, `.mp4`, `.mp3`, `.svg`, `.ico`
- Pagination URLs (`?page=2`, `/page/3`)
- Tag/category archive URLs (these duplicate blog post content)
- Anchor-only URLs (`#section`)

### Per-bucket website-specific boosts

When the scraped markdown is classified, apply these structural boosts to the score:

| Bucket | Structural cue (+score bonus) |
|---|---|
| POSITIONING | H1 of homepage (+10), hero subhead of homepage (+8), `<meta description>` tag if scraped (+5) |
| VOICE | Any paragraph >100 words from blog/news pages (+5); H1 + first paragraph of homepage (+8) |
| BELIEF_PROFILE | Any first-person paragraph (`Én`, `Mi`, `I`, `We`) from `/about`, `/manifesto`, `/team` (+5); founder name + direct quote (+8) |
| ICP | Testimonial blockquotes (+8 each); case study customer descriptions (+5 each); FAQ questions (+3 each — these reveal what ICP doesn't yet understand) |
| COMPETITIVE_LANDSCAPE | Any external domain mentioned on the client's site (+5) — sometimes the client names competitors directly |
| 7LAYER_DIAGNOSTIC | Usually low signal on a website; skip boost |
| CONSTRAINT_MAP | Usually low signal on a website; skip boost |
| REPAIR_ROADMAP | Zero signal on a website (it's internal); never scrape *for* this bucket |

### Caching

Website scrapes are expensive and slow. Cache rules:

- Cache path: `.aos/cache/website-harvest/<domain>/<url-slug>.md` (the `.aos/` runtime zone, rebuildable)
- Cache TTL: 14 days. Re-runs within 14 days reuse cache. Re-runs after 14 days trigger fresh scrape.
- User can force refresh: orchestrator accepts a `--refresh-website` flag (v0.2).
- Cache files have frontmatter: `url`, `scraped_at`, `status_code`, `language_detected`, `content_chars`.
- `.cache/` directory must be added to `.gitignore` per the data-rules pattern (avoid committing scraped third-party content + reduces repo bloat).

### Multilingual website handling

If the client's site has multiple language variants (`/en/`, `/hu/`, `/de/`), scrape only the **primary brand language**:

1. Check `CLIENT_CONFIG.md` for `primary_language` field
2. If missing: detect from CLIENT_CONFIG `country` (HU → hu, US → en, DE → de, etc.)
3. If still ambiguous: ask the user (do not enumerate — let them type the language code)

For voice extraction specifically, **never mix languages in samples** — a HU client's VOICE.md draws only from HU pages. EN variants of the same site are often agency-translated and don't reflect the founder's actual voice register.

### Competitor scraping (the COMPETITIVE_LANDSCAPE special case)

Competitor URLs are discovered during local harvest (mentioned in strategic docs, audit notes, positioning files). When found:

- Scrape only the competitor's homepage (single URL, depth 0)
- Classify *only* into COMPETITIVE_LANDSCAPE bucket — never let competitor copy bleed into the client's VOICE or POSITIONING harvest (that's how voice contamination happens)
- Cache competitor scrapes separately: `.cache/website-harvest/_competitors/<domain>.md`

### Failure handling

The orchestrator must never crash because website harvest failed. Failures:

- Firecrawl auth missing → log, skip website pass entirely, flag affected buckets as "local-only" in the harvest index
- **`WebFetch` "URL not in provenance set" (Cowork provenance gate)** → not a failure. The Cowork runtime only fetches URLs that appeared in a user message. Ask the user to paste the site URL(s) into chat, then retry; only on decline fall through to local-only. See `SKILL.md` Step 2b "Cowork — the `WebFetch` provenance gate".
- Domain returns 4xx → record in scorecard, ask user to verify the URL in CLIENT_CONFIG.md
- Domain returns 5xx → retry once after 5s, then give up for this run
- Empty/JS-shell content (<500 chars extracted) → mark domain as low-signal, recommend manual review

---

## Notes for v0.2

- Multilingual: these patterns are EN-biased. For HU clients (Deluxe, Wellis, etc.), add HU equivalents — "I believe" → "úgy gondolom / azt hiszem", "constraint" → "korlát / szűk keresztmetszet", "ideal customer" → "ideális vevő / célközönség".
- Match patterns currently live in this reference doc as keyword lists. The Node-based `scripts/survey.mjs` handles substance scoring; pattern matching for harvest itself is done by the orchestrator AI consuming these patterns. v0.2 could add a `scripts/harvest.mjs` that pre-processes match candidates from local files + cached website scrapes into a structured JSON index, so the orchestrator only consumes the top-N matches per bucket rather than re-scanning the tree.
- Website harvest currently relies on Firecrawl MCP. v0.2 could add a fallback to a basic curl+pandoc path for ultra-cheap rescrapes when only homepage refresh is needed.
