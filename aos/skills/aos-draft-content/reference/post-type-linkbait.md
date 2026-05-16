---
scope: int-company
---

# Post type — Linkbait (external blog platform)

> **What it is.** A post published on an external host (blog.hu, Medium, Substack, etc.) — NOT the brand's own site. Goal is reach + backlinks + audience discovery, not direct conversion.

## Goal

Get read by people who don't know the brand yet. Earn a click back to the brand site. Build domain-authority signal via natural backlinks from the external host.

**Linkbait ≠ clickbait.** Linkbait offers genuine value packaged as a hook the algorithm and the human both reward. Clickbait promises and underdelivers. The line is: would the reader feel respected after reading?

## What makes a piece work as linkbait

Pick one or combine two:

1. **Contrarian POV** — "Most people think X. Here's why X is wrong." Earns argument-driven shares.
2. **Counter-intuitive specific** — "We measured Y across 50 builds. Here's what we found." Earns curiosity-driven shares.
3. **Insider revelation** — "What [insider role] knows that buyers don't." Earns insight-driven shares.
4. **Pattern naming** — "There's a thing nobody talks about. We're naming it." Vocabulary creation builds long-term authority.

**What doesn't work as linkbait:**
- "Top 10 tips for X" (commodity)
- Product-page rehash with a softer headline (transparent)
- Industry news commentary (low half-life)
- Personal essays without an insight payoff

## Structure (800–1400 words)

1. **Hook paragraph (50–100 words)** — the *whole* claim in compressed form. The hook earns the read. If a reader stops after the hook, they should still have walked away with something — that's how shares happen.
2. **Setup (150–250 words)** — what made you / the brand notice this. The story angle. NOT "I am a writer at X company"; closer to "I spent six winters watching what breaks first."
3. **The payoff (400–700 words)** — the actual insight. Be specific. Numbers. Named patterns. Real examples (anonymized if needed). This is where most linkbait fails — the setup over-promises and the payoff is thin.
4. **Counter-argument acknowledgment (100–200 words)** — name the strongest objection. Engage with it. Refusing to acknowledge counter-arguments reads as weakness in linkbait register.
5. **Soft close (50–100 words)** — no CTA, or near-zero CTA. The link back to the brand site is in the byline / author bio, NOT in the post body. Aggressive in-body CTAs read as ad and kill share velocity.

## Voice register

**Peer-conversational, hook-driven.** Slightly looser than own-blog register. Personality is allowed. Opinions are required.

**For HU clients posting on blog.hu specifically:** match the platform's native register — informal, opinion-forward, paragraph-breaks every 2–3 sentences for readability. Long unbroken paragraphs underperform on blog.hu.

**Allowed in linkbait that's banned in own-blog:**
- Stronger opinions
- Sentence fragments. For emphasis.
- Direct address to the reader ("You probably think...")
- Mild controversy on industry practices

**Still banned (even in linkbait):**
- Banned words from brand `VOICE.md`
- Naming specific competitors negatively (legal + reputation risk)
- Discount / urgency language
- "Insider secrets they don't want you to know" — that crosses the line into clickbait

## Anti-patterns (specific to linkbait)

| ❌ Don't | ✅ Do |
|---|---|
| Bury the lede in setup | Hook IS the lede. Setup follows. |
| Soft fence-sitting ("there are good points on both sides") | Pick a side. Be wrong specifically rather than right vaguely. |
| End with "what do you think? Comment below!" | End with the strongest line. Let the post speak. |
| Strong CTA at end ("contact us at...") | Author bio carries the link. Body is value-only. |
| Generic stock-photo header | Genuine photo or no photo — generic visuals signal "this is an ad" |

## Distribution mechanics

- **Cross-link from own blog** — link to the linkbait piece from a related own-blog post (the linkbait flows audience inward, the own-blog post flows authority outward)
- **Author bio carries the conversion link** — bio mentions the brand once with a single link
- **No syndication for ≥30 days** — if you syndicate the same piece elsewhere too fast, you cannibalize the linkbait's reach
- **Track inbound links manually** — backlink analysis tools find them eventually; periodic manual check finds them sooner

## When NOT to write linkbait

- The brand isn't ready for inbound traffic (slow site, no landing page that matches the topic)
- The contrarian POV would alienate the actual ICP
- The "insider revelation" angle would damage relationships in the industry — short-term reach isn't worth that
- The brand voice can't sustain peer-conversational register without sliding into AI-generic — better to keep to own-blog

## Frequency

Lower than own-blog. **1 linkbait piece per 6–8 weeks** for most brands. Each piece is a small bet on reaching new audiences; the bets need to be deliberate, not constant.

## Same topic, different output (vs. blog post)

| Aspect | Own blog post | Linkbait |
|---|---|---|
| Title | "How to choose X" | "Most people choosing X get it backwards" |
| Opening | Reader's problem | A claim that earns the read |
| Tone | Mentor-practitioner | Peer-opinion |
| CTA | Soft in-body + footer | Bio link only |
| Length | 1200–2500 | 800–1400 |
| Internal links | 2+ (topic graph) | 0–1 max (keep it host-native) |
| Lifespan | Years (refresh periodically) | Weeks to months |

The skill can be invoked twice on the same `--topic`: once with `--type=blog`, once with `--type=linkbait`, producing two genuinely different pieces.

## Output skeleton

```markdown
# <Hook-shaped title>

<!-- HOOK -->
<50–100 words: the whole claim in compressed form>

<!-- SETUP -->
<150–250 words: what made this noticeable>

<!-- THE PAYOFF -->
<400–700 words: the actual insight, specific and numerical>

<!-- COUNTER-ARGUMENT -->
<100–200 words: strongest objection + how it's addressed>

<!-- SOFT CLOSE -->
<50–100 words: the strongest line. No CTA.>

---

**Author bio:** <one-line bio with single link to brand site>

**What did we get wrong? What's missing?**
```
