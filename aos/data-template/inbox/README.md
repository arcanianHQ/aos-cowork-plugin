# inbox/ — drop zone for client material

Drop client material here for `build-brand-system` discovery to harvest into
`brand/HARVEST_INDEX.md`. Sort each item into the folder that best matches it —
the harvest uses the folder as a **bucket-affinity boost** when classifying
signals. Unsure? Use `strategy/` or the `inbox/` root; the harvest still scans it.

| Folder | Drop here | Harvest affinity |
|---|---|---|
| `strategy/` | strategic plans, OKRs, business-model & positioning docs | POSITIONING · 7LAYER · CONSTRAINT_MAP · REPAIR_ROADMAP |
| `transcripts/` | meeting & call transcripts, recordings | VOICE · BELIEF_PROFILE · ICP |
| `correspondence/` | founder emails, LinkedIn posts, written voice samples | VOICE · BELIEF_PROFILE |
| `research/` | competitor notes, market & audience research | COMPETITIVE_LANDSCAPE · ICP |
| `brand-material/` | existing marketing copy, brand assets, prior brand docs | VOICE · POSITIONING |

`_processed/` — items already harvested; excluded from re-harvest.

Run the **`catalogue`** skill to index everything here into `inbox/CATALOGUE.md`
before discovery — it records each item's type, status, and a one-line summary.

Everything in `inbox/` is **input material** — never a deliverable. The
folder → harvest-bucket mapping is consumed by `build-brand-system`'s
`reference/harvest-patterns.md` (wired in the AOS-725 pass).
