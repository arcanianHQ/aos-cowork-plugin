---
scope: int-company
---

# Post type — Blog post (own blog, educational)

> **What it is.** A long-form educational piece on the brand's own blog. Goal is SEO + topical authority + nurture — make the brand the obvious expert on the topic.

## Goal

Own a topic in the category. A prospect researching the topic should find this post, learn something useful, and walk away with the brand as the default name they associate with that topic.

**Secondary:** ranking on long-tail queries; building an internal link graph that makes the topic-cluster strategy compound.

## Structure (1200–2500 words)

1. **Hook + problem framing (150–250 words)** — name the problem the reader has, in their register. Validate that the problem is real and not trivial. If the reader thinks "this is just a low-stakes choice", they won't read.
2. **Why this matters now (100–200 words)** — what's at stake, why getting this wrong costs them. Not fear-mongering; honest accounting.
3. **The framework / categories (the spine — 400–800 words)** — the brand's POV on how to think about this topic. Name the categories or decision axes. **This is where the brand earns authority** — by giving structure, not just facts.
4. **Applied / examples (300–600 words)** — work the framework through 2–4 real cases. Cite product-system facts from `content-system/products.md` where relevant. NOT all cases need to be this brand's projects — using public examples adds credibility.
5. **Common mistakes / what to avoid (150–300 words)** — name the failure modes. Be specific. Generic mistakes ("not planning enough") read as filler.
6. **What to do next (100–200 words)** — practical next step for the reader. Soft CTA. Internal link to a related pillar post.

## Voice register

**Mentor-practitioner.** Not "we are experts and you should listen". Closer to "we've done this hundreds of times and here's what we noticed". Self-aware, willing to name uncertainty.

**Specifically for HU clients:** adult-to-adult register. Not pedagogical ("figyelj!"), not peer-confessional ("én is hibáztam"). Measured grown-up statements. Cross-reference `core/brand/arcanian/VOICE.md` "Adult-to-adult register" section even though that's Arcanian's — the principle is general.

## Anti-patterns (specific to blog type)

| ❌ Don't | ✅ Do |
|---|---|
| List of 10 tips without a framework | Framework first, examples within it |
| "In this post, I will explain..." | Open with the reader's problem, not the post's intent |
| Closing with "I hope this helped!" | Closing with the next concrete decision the reader needs to make |
| Vague abstractions ("quality matters") | Specific, contestable claims ("under €X/m² you're getting a 5-year structure, not a 25-year one") |
| Linking only to own product pages | Mix: own pages + external authoritative sources (the "linkable expert" signal) |

## SEO discipline

- **One primary keyword** (from pillar sub-topics in `content-system/pillars.md`). Target it in title, H1, first paragraph, one H2, and meta description.
- **3–5 secondary keywords** distributed naturally through subheadings.
- **Title** — keyword-anchored but not robotic. Target 50–60 chars.
- **Meta description** — 150–160 chars, ends with a soft CTA cue.
- **H1 = title**, then H2s structure the post, H3s within sections.
- **Internal links** — at least 2 to other pillar posts. Builds the topic graph.
- **External links** — at least 1 to an authoritative source on the topic. Citation builds trust + the link itself signals quality to ranking algos.
- **Schema markup** — recommend Article or BlogPosting schema (the publishing pipeline / SEO skill handles implementation).

## When NOT to write a blog post

- Topic isn't on any pillar in `content-system/pillars.md` — drifts the brand
- The "framework" you'd offer is generic — write nothing rather than a thin post
- The brand has zero unique angle on the topic — don't compete on commodity content
- Same topic was published in the last 60 days — refresh the existing post instead of creating a duplicate

## Frequency

For most physical-product brands: 1 blog post every 2–4 weeks. Quality beats quantity on own-blog content. A pillar topic might get 4–8 posts over a year, each deepening a sub-topic.

## Length calibration

| Topic depth | Target length |
|---|---|
| Decision-helper (which-X-should-I-pick) | 1200–1500 words |
| Educational deep-dive | 1800–2500 words |
| Process / how-to | 1500–2000 words |
| Industry commentary | 800–1200 words |

Going longer than 2500 usually doesn't help — fewer people finish, and the focus blurs. If a topic genuinely needs more, split into 2 posts and cross-link.

## Output skeleton

```markdown
# <SEO-anchored title (50–60 chars)>

> Meta description: <150–160 char hook ending with soft CTA cue>

<!-- HOOK + PROBLEM FRAMING -->
<150–250 words placing the reader's problem in their register>

## <Why this matters now>
<100–200 words on what's at stake>

## <The framework>
<400–800 words — the brand's POV on how to think about this topic>

### <Category / axis 1>
<...>

### <Category / axis 2>
<...>

## <Applied examples>
<300–600 words — work the framework through 2–4 cases>

## <Common mistakes>
<150–300 words — failure modes>

## <What to do next>
<100–200 words — soft CTA + internal link to pillar post>

---

**Internal links inserted:**
- <link to other pillar post>
- <link to other pillar post>

**External links inserted:**
- <authoritative source>

**What did we get wrong? What's missing?**
```
