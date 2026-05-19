---
name: aos-localize-hu
description: "Hungarian nativeness pass — rewrites AI-Hungarian into natural, native Hungarian. NOT a translator: input is already Hungarian, output is better Hungarian. Two modes — (1) artifact pass: the final quality pass over HU deliverables when content-language is hu; (2) conversational pass: the core rules self-applied to your own Hungarian chat reply before sending. Trigger on 'make the Hungarian sound native', 'fix the AI-magyar', 'nativeness pass', automatically before delivering any Hungarian artifact, AND whenever you reply in Hungarian — the user writes in Hungarian, expects a Hungarian answer, asks for Hungarian output, or communication-language is hu."
scope: int-company
flavor: [company, advanced, internal]
class: content
domain: content
layer: [L6, L7]
client-scope: single-client
version: 0.3.0
owner: arcanian
allowed-tools: [Read, Edit, Write, Glob, Grep]
args-hint: "[<path-to-HU-artifact>] — the Hungarian file to polish; default = the artifact just produced this session"
preflight:
  - client-config
ontology:
  consumes: [Content, Deliverable]
  emits: [Content, Deliverable]
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-draft-content (typical upstream producer of the HU artifact)
tags: [content, hungarian, localization, language-pack, quality-pass, nativeness]
language-pack: hu
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`content/`, `deliverables/`, `brand/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout.

## This is a NATIVENESS PASS — NOT a translator

The AOS system **already produces Hungarian** whenever `content-language: hu`. This skill does **not** translate. It takes that AI-Hungarian output and rewrites it into natural, native Hungarian.

- **Input** = a Hungarian artifact (often AI-Hungarian — grammatically correct but reads as translated).
- **Output** = the *same* artifact, in **better** Hungarian — native rhythm, native idiom, no calques.
- **Never** translate from English. If you catch yourself producing an English draft to "check meaning," stop. The meaning is already settled; only the *Hungarian* is the work here.

The single most important rule, from which everything else follows:

> **Compose in Hungarian — do not translate from English.**
> The cognitive path is `HU thought → HU sentence → HU text`, never `EN thought → HU translation`. A native reader *feels* a translated text even when every word is correct — the sentence rhythm, the clause structure, the missing idioms give it away. When a sentence reads as translated, **rewrite it from a Hungarian thought**, do not patch it word by word.

## When this runs — two modes

**Mode 1 — artifact pass** (the full Process below: read file → scan → diff → confirm → write):
- **Automatically** as the **final quality pass** over any Hungarian artifact, when `content-language: hu` is resolved from `AOS_CONFIG.md` (see `docs/language-context.md`). Every HU deliverable passes through here before it is declared done.
- **On request** — "make the Hungarian native", "fix the AI-magyar", "nézd át magyarul", "magyarul hangozzon természetesen".

**Mode 2 — conversational pass** (lightweight: no file, no diff, no confirmation):
- Whenever **you reply to the user in Hungarian** — chat replies, summaries, recommendations, working notes. This fires when the user **writes to you in Hungarian**, **expects a Hungarian answer**, **asks for Hungarian output**, or `communication-language: hu` is resolved from `AOS_CONFIG.md`.
- You do **not** invoke the full Process or present diffs for a chat reply. You **self-apply the Core rules** (below) to your own draft *before sending it*: compose the reply, run it against the Core rules, fix it in place, send. The `reference/` catalogues are the depth for the artifact pass; the Core rules are the conversational layer — light enough to hold in working memory every turn.
- This is a **standing rule**, not a one-off — every Hungarian turn, for the whole session, not only when explicitly asked. See `docs/language-context.md`.

Resolve both language values from `AOS_CONFIG.md` during context assembly — never assume. If neither `content-language` nor `communication-language` is `hu` and the user is not writing Hungarian, this skill does not apply.

## Process — the artifact pass (Mode 1)

> For the **conversational pass (Mode 2)** skip this Process entirely: compose your Hungarian reply, run it against the **Core rules** below, fix it in place, send it. No file, no diff, no confirmation.

1. **Read the artifact.** Default target = the file just produced this session; otherwise the path argument. Read `brand/VOICE.md` if present — register (tegező/magázó), banned words, and sentence rhythm override anything here.
2. **Read aloud (mentally).** A translated text stumbles when read aloud; a native one flows. This is the primary detector. If a passage stumbles, it is a rewrite candidate.
3. **Run the anti-pattern scan.** Walk the text against the catalogues in `reference/anti-patterns.md` (the 14 AI-magyar error classes) and `reference/calques.md` (calqued metaphors, stuck English words, business-deck phrases). Mark every hit.
4. **Idiom check.** Does the text contain at least one HU-native idiom or particle ("na", "hát", "pont az van, hogy…", "szóval")? Zero idioms + only logical connectives ("tehát", "viszont") = translated. Reach for `reference/idioms-and-voice.md`.
5. **Rewrite from a Hungarian thought.** For each marked passage, do not patch — re-compose the sentence as a Hungarian speaker would. Apply the prose-rhythm rules (short-long-short, one thought = one sentence) from `reference/idioms-and-voice.md`. **Then read your own rewrite aloud** — a nativeness pass can introduce a fresh calque (abstract noun + motion verb, a forced `Hogy …, …` purpose-clause). If your own rewrite stumbles, rewrite it again.
6. **Letter register** — if the artifact is a letter / email between colleagues, apply the letter-register rules in `reference/letter-register.md` (definite articles before time spans, an opening anchor phrase, no meta-pitch, no `+`/`/` deck headers, comma sign-off, no internal-draft references).
7. **Propagation check.** When you fix a calqued case-ending or construction once, scan the *whole* text for the same structure — if it was wrong once it is usually wrong elsewhere.
8. **Run the publish checklist** in `reference/checklist.md` end to end.
9. **Present diffs for confirmation.** Show the before→after for each rewrite with a one-line reason. Do not write until the user accepts (`safety.requires_confirmation: true`).

## Core rules (the rest live in `reference/`)

These are the rules to hold in working memory; the depth — full catalogues, tables, examples — is in `reference/`.

1. **Compose in HU, never translate.** (Above. The rule above all rules.)
2. **No "meg lehet + főnévi igenév"** and no nominalisation-stacking — use an active subject + definite conjugation. `A problémákat be lehet azonosítani` → `Rátapintunk a problémákra`.
3. **No English word order.** What matters goes to the front of the Hungarian sentence.
4. **No stuck English words** when an established Hungarian word exists (`bottleneck` → `szűk keresztmetszet`, `framework` → `módszer/keret`). Exception: brand/platform names and terms with no HU equivalent (`marketing`, `TikTok`, `AOS`).
5. **No HU suffix on an English noun** (`compoundolódnak`, `frictionök`, `deploy-olom`) — the single most instantly-revealing AI-HU tell. Replace the *whole* word, not just the suffix.
6. **Max one negation-affirmation** ("nem X, hanem Y") per deliverable, and only for a real, sharp contrast — the clearest LLM tell when over-used.
7. **No AI-marketing openers / connectors** ("A mai gyors tempójú világban…", "Nem véletlen, hogy…", "Fontos megjegyezni, hogy…", rhetorical-question-then-answer, synonym triplets).
8. **No calqued metaphors, idioms or word-senses.** If the image is visual in English but not in Hungarian, find a Hungarian image or drop it. Also catch calqued *idioms* ("ez a ti hívásotok" = "your call") and calqued *word-senses* ("oldal" = "side", "élő" = "live access", "olvasás" = "reading data") — see `reference/calques.md` §6d–6e.
9. **"agent" in writing — never "ágens".** Web/server context: "kint van" → "fent van" / "élesben van" / "szerepel". "ülés" → "egyeztetés" (except institutional).
10. **Conditional mood:** intransitive verb → `-na/-ne`; transitive → `-ná/-né`.
11. **Hungarian prose rhythm** — short-long-short; one thought = one sentence; break thought-units onto their own lines for LinkedIn/Substack.
12. **Arcanian voice** — active verbs (rátapintunk, feltérképezzük, végigvezetjük); never "őszintén" / "nem felülről" / "segítek"; include a self-diagnostic beat.

## Escape hatch

If a passage still reads as translated after two rewrite attempts, **stop**. Ask the user (in `communication-language`) for 2–3 opening sentences in their own Hungarian voice, and continue from those. Do not ship a passage you could not make native.

## Output (artifact pass)

The artifact pass ends with a user-facing summary in `communication-language` — the conversational pass produces no summary, it just sends the polished reply:

- File polished + whether it was confirmed and written.
- Count of rewrites by anti-pattern class (which `reference/` catalogue entry each hit).
- Any passages sent to the escape hatch.
- Checklist result — every item pass/fail.
- **What did we get wrong? What's missing?**

## Hard rules

1. **Never translate.** Input is Hungarian; output is Hungarian. An English draft is never produced.
2. **Faithful meaning.** A nativeness pass changes *form*, never *facts* — never add, drop, or alter a claim.
3. **`VOICE.md` wins.** Where `brand/VOICE.md` sets register, banned words, or address form, it overrides this skill's defaults.
4. **Confirm before write.** Present diffs; write only on accept.
5. **Language gate.** Run only when `content-language: hu`. Otherwise stop and tell the user.

## The language-pack pattern

`aos-localize-hu` is the **first language pack**. A language pack is a per-language nativeness-pass skill named `aos-localize-<lang>`, all built to this same shape. Adding a language later = creating `aos-localize-<lang>` to this template — no change to the system core. The pattern (skill shape, frontmatter contract, how the language context selects a pack) is documented in **`aos/docs/language-packs.md`**.

## Versioning

- **v0.1.0** — first language pack. Full port of the Arcanian Hungarian style guide via progressive disclosure.
- **v0.2.0** — calibration from a live client letter: added calqued idioms (`calques.md` §6d), calqued word-senses (§6e), the PPC-domain stuck-word table (§8e); extended letter-register with the forced-purpose-clause rule (Rule 3) and the "×" connector (Rule 4); added the self-introduced-calque guard (re-run read-aloud on your own rewrite).
- **v0.3.0** — conversational mode. The pack is no longer artifact-only: added Mode 2, the conversational pass — the Core rules self-applied to every Hungarian chat reply (no file, no diff, no confirmation). Broadened the trigger to "you reply in Hungarian / `communication-language: hu`". The standing rule lives in `docs/language-context.md`.
- **v1.0.0** — promotion criterion: 30+ HU artifacts shipped through this pass across 3+ clients with positive native-speaker feedback.

**What did we get wrong? What's missing?**
