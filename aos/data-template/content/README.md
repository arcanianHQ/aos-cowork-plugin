# content/ — produced content pieces, organised by series

The actual content the pipeline drafts, produced by the `aos-draft-content` skill.
`content/` is organised by **series**.

## The series model

A **series** is a container for a set of related content pieces — the natural
output unit of a **storytelling-framework run**. One run of a Level-1 storytelling
framework (`content-system/frameworks/storytelling/`) yields ~10–11 distinct pieces;
those pieces are one series. Full design: `docs/content-framework.md`.

A series:

- maps 1:1 to one storytelling-framework run (one Hero's Journey run → one series);
- **can span multiple platforms** — pieces of different content types (LinkedIn
  post, blog post, email) live under the same series, because a framework beat may
  be re-typed per piece;
- each piece carries its own content type / platform in its frontmatter.

## Layout

```
content/
├── CATALOGUE.md              index of every piece — BY SERIES (aos-catalogue)
├── <series-slug>/            one storytelling-framework run
│   ├── INDEX.md              the series manifest — framework, beats, pieces, status
│   ├── 01-<beat-slug>.md     piece 1 (beat 1) — carries its own content_type
│   ├── 02-<beat-slug>.md     piece 2 (beat 2)
│   └── …                     …through ~10–11 pieces
└── <bu>/                     multi-BU: series nest under the BU folder
    └── <series-slug>/…
```

For multi-BU clients, series nest under the BU folder: `content/<bu>/<series-slug>/`.

### Single-piece drafts

A single-piece draft (`aos-draft-content` single-piece mode — not a framework run)
is *not* a series. It writes one file directly under `content/` (or `content/<bu>/`)
with the legacy `content/<YYYY-MM-DD>-<type>-<topic-slug>.md` name. Series are for
framework runs; single pieces stay flat.

## A series INDEX.md

Each `<series-slug>/` carries an `INDEX.md` — the series manifest: which
storytelling framework produced it, the beat → piece → content-type → status map,
and the run date. `aos-draft-content` writes it; `aos-catalogue` reads it.

## Distinct from

- `content-system/` — the per-BU content *foundation* (pillars, messaging,
  products, distribution) **plus** the shared `frameworks/` library.
- `deliverables/` — reports, decks.

`content/` holds the publishable pieces themselves, grouped into series.

`CATALOGUE.md` — the index of every series and piece (built / refreshed by the
`aos-catalogue` skill).
