---
scope: int-company
---

# Channel formats — preparing a piece for ship

Companion to `SKILL.md`. The channel-format rules, the file naming / placement
convention, the status-transition rules, and the captain's-log entry format.

## The principle

`aos-draft-content` produces a piece in a content type (LinkedIn post, blog post,
email, or a legacy reference / blog / linkbait single piece). `aos-distribute`
takes that piece and produces the **publish-ready** version for one specific
channel — the version a human pastes into the channel with no further editing.

The channel-format pass is **mechanical reshaping, not rewriting**. It trims to
the channel's attention budget, applies the channel's structural conventions, and
attaches channel metadata (hashtags, link placement, image specs). It does **not**
change the argument, the angle, or the voice.

## Channel-format rules

Read the piece's content type, then the target channel's row in the BU's
`content-system/[<bu>/]distribution.md` — that row carries the channel's cadence,
image dimensions, and hashtag policy. Apply the matching rule below.

| Channel | Format rules |
|---------|--------------|
| Own blog | Full piece, headings intact. Add the SEO title + meta description if absent. Image placeholders kept with the `distribution.md` dimensions. |
| LinkedIn | Trim to a tight hook in the first 2 lines (the "see more" fold). ~1300-char sweet spot. No markdown headings — line breaks instead. Hashtags per `distribution.md` policy, end of post. One link, in the first comment if the channel penalises in-body links. |
| Facebook | ~150-char caption. Link preview does the heavy lifting — caption is the hook only. Hashtags sparing. |
| Instagram | Caption 200–400 chars (hard cap 2200). Hashtags per `distribution.md`. "Link in bio" — no in-caption URL. |
| Pinterest | Per pin: title ≤100 chars, description ≤500 chars, destination URL, image-direction note. A reference piece may ship 3–5 pins. |
| Email | Subject line + preheader + body. One clear CTA. Plain, scannable; no markdown headings — short paragraphs. |
| External host (blog.hu / Medium) | Full piece. Bio-link only — no client-domain backlinks in body beyond what the host allows. |

If a channel is not in this table, follow the conventions stated in the BU's
`distribution.md` for that channel; if neither has guidance, prepare a faithful
full-text version and flag to the user that no channel-specific rule was applied.

**Voice gate.** After formatting, run `brand/VOICE.md`'s banned-words list and
register check (tegező/magázó for HU, tu/vous for FR, etc.) over the formatted
output. A trim or reshape can surface a banned construction — rewrite any hit
before write. The format pass never gets a voice exemption.

## File naming + placement

The channel-formatted version is written **alongside the source piece**, so the
source draft and its shipped versions stay together:

- Single piece — source `content/[<bu>/]<YYYY-MM-DD>-<type>-<slug>.md` →
  formatted `content/[<bu>/]<YYYY-MM-DD>-<type>-<slug>-<channel>.md`.
- Series piece — source `content/[<bu>/]<series-slug>/NN-<beat>.md` →
  formatted `content/[<bu>/]<series-slug>/NN-<beat>-<channel>.md`.

`<channel>` is the channel slug (`linkedin`, `facebook`, `instagram`,
`pinterest`, `email`, `blog`, the external-host name). One piece may be shipped
to several channels — each gets its own `-<channel>` file. The formatted file
carries the standard provenance block plus a `shipped_channel:` and
`source_piece:` field pointing back at the draft.

## Status-transition rules

`aos-distribute` advances the piece's status in `content/CATALOGUE.md`. The
status ladder (shared with `aos-catalogue` and `aos-draft-content`):

```
draft → in-review → scheduled → published
```

`aos-distribute` operates the last two transitions:

| From | To | When |
|------|----|----|
| `draft` / `in-review` | `scheduled` | The channel-formatted version is prepared and handed off — the piece is publish-ready but not yet confirmed live. |
| `scheduled` | `published` | The user confirms the piece went live (manual post done, or the channel connector confirmed it). |

Rules:

- **Never downgrade.** `published` is terminal. `scheduled` never returns to
  `draft` through this skill. `aos-catalogue` likewise preserves `published`.
- **Never skip to `published` unconfirmed.** A first ship of a `draft` piece
  goes to `scheduled`. It reaches `published` only on a later run, or in the same
  run only if the user explicitly confirms it is already live.
- Update the piece's own frontmatter `status:` field to match the catalogue, so
  the two never disagree.
- Rewrite `content/CATALOGUE.md` with `Edit` (it pre-exists — Read it first).

## Captain's-log entry

Append to `CAPTAINS_LOG.md` at the granted-folder root:

```markdown
### <YYYY-MM-DD> — ship: <piece slug> → <channel>

- Piece: <path>
- Channel: <channel> (primary / secondary, per distribution.md)
- Status: <from> → <to>
- Mode: connector-assisted (<connector>) | manual hand-off
- Publishes: <who / what posts it — the user, a scheduling tool, the connector>
- Publish-ready file: <path of the -<channel> file>
```

The log is the engagement's running ship record — `aos-measure` reads it to know
what shipped, when, and where, so it knows what to measure.
