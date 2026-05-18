---
scope: int-company
---

# Reference — letter register (colleague-to-colleague correspondence)

> Apply these rules when the Hungarian artifact is a **letter / email** between colleagues (Arcanian + clients). Skip for posts, decks and standalone documents. Companion to `anti-patterns.md`, `calques.md`, `idioms-and-voice.md`.

**A Hungarian letter is not a deck, not a standalone document.** It continues a conversation or shared work. The language must signal this — otherwise every letter becomes deck-like, even when grammatically perfect.

## Rule 1 — Definite article before time spans

In Hungarian, a noun phrase referring to a time period takes a mandatory definite article when it is concrete and shared knowledge. AI / translation-Hungarian often drops it.

| ❌ Raw (deck-like) | ✅ Natural Hungarian |
|---|---|
| Következő négy hét összefoglalója. | **A** következő négy hét terve. |
| Múlt heti eredmények. | **A** múlt hét eredményei. |
| Jövő heti teendők. | **A** jövő heti teendők. |
| Idei akció. | **Az** idei akció. |

**Test:** if the time period is referred to concretely (the recipient knows the time window too) — use the article.

## Rule 2 — A connector phrase in the opening

The first line of the letter must **anchor** in the shared past. Without it, the recipient reads it as a cold pitch.

| ❌ Standalone (deck) | ✅ Connected (letter) |
|---|---|
| A következő négy hét terve. | A következő négy hét terve, **ahogyan beszéltük**. |
| Itt a státusz. | A státusz, **ahogy ígértem**. |
| Heti összefoglaló. | A heti összefoglaló, **ahogy minden hétfőn**. |

**Optional connector phrases (pick one that is genuinely true):** "ahogyan beszéltük", "ahogy hétfőn megbeszéltük", "amit a múltkor említettem", "a múlt heti egyeztetésünk után", "ahogy ígértem", "ahogy szóba került".

**If there is no real shared past — do not invent one.** Then reconsider: is this really a letter, or just a memo / brief? A letter rests on the shared past.

## Rule 3 — No meta-pitch about the document itself

The letter delivers the content, it does not advertise its structure.

| ❌ Meta-pitch (deck) | ✅ Direct (letter) |
|---|---|
| Csak a fő pontok — ha valamelyikbe mélyebben mennél, szólj. | (just write the main points — no need to say this) |
| Itt egy átfogó összefoglaló a következőkről. | (deliver the content; "átfogó" is about you) |
| Az alábbiakban részletezem a stratégiát. | A stratégia: … |

**Rule:** if you tell the recipient WHAT THEY WOULD GET IF THEY ASKED, you are writing a deck-pitch, not a letter.

**Extension — forced `Hogy …, …` purpose-clause bridges.** A clause that explains *why you are about to say the next thing* is meta-pitch in disguise — it narrates your own message-structure instead of just delivering it. English throat-clearing; Hungarian just starts.

| ❌ Forced purpose-bridge | ✅ Just start |
|---|---|
| Hogy gyorsabban a részletekig jussunk, kezdem azzal, mit csinál a rendszer. | Pár szó arról, mit csinál a rendszer. |
| Hogy a képet teljessé tegyem, hozzáteszem, hogy… | (just add the fact) |
| Hogy a feladatkört pontosan fókuszáljuk, egy kérdés: … | Egy kérdés, mielőtt összeállítom a csomagot: … (a real temporal anchor is fine; a justification is not) |

**Test:** if a sentence's only job is to justify the *next* sentence's existence → cut it, keep the next sentence. A genuine temporal/logical anchor ("mielőtt elküldöm", "ahogy beszéltük") is fine — a justification of why you are speaking is not.

## Rule 4 — Category headers in prose, not deck-style

| ❌ Deck-style header | ✅ Letter header |
|---|---|
| ## Mérés + infra (önálló munka, FYI) | ## Mérés és infra (saját feladat) |
| ## Vásárlói data + AC | ## Vásárlói adatok és AC |
| ## Stratégiai (W19 alatt csak terv) | ## Stratégiai munkák |
| ## Naptár | ## Időpontok |

**Rule:** avoid "+", "/", "( … csak … )" constructions — these are deck captions.

**Extension — this also holds inside a sentence.** "+" as a connector between two concepts → deck pattern, never in a letter.

| ❌ Deck pattern in a sentence | ✅ Letter-style |
|---|---|
| Footer + FAQ markdown — mindkettő javítva | A footer **és** a FAQ markdown — mindkettőt javították |
| GA4 + GSC + Shopify dashboard read access | GA4-, GSC- **és** Shopify-dashboard read access |
| Mérés + tracking + email-flow | Mérés, tracking **és** email-flow |
| Wellis-naming + MSRP-stratégia | A Wellis-naming **és** az MSRP-stratégia |
| 3 ügyfél × több ország × több termékfókusz | A három ügyfél, a több ország **és** a több termékfókusz |

**Test:** a "+" **or "×"** sign in a sentence → 95% a deck/spreadsheet construction. Swap for "és", a comma, or a separate sentence. The signs only stay for a genuinely mathematical/calculation context ("$5,997 + szállítás"). The "×" cross is the strongest tell — it comes straight from a planning matrix and never belongs in a letter.

## Rule 5 — Closing formula with a comma

| ❌ | ✅ |
|---|---|
| Üdv: | Üdv, |
| Üdvözlettel: | Üdvözlettel, |
| Köszi: | Köszi, |

A colon NEVER closes a signature — close with a comma. A list header takes a colon; a signature line takes a comma.

## Rule 6 — Never reference an internal draft iteration

The recipient **only sees the letter that was sent**, not the internal v1/v2/v3 draft history. NEVER reference a previous internal version as if it were shared knowledge — trust-corrosive.

| ❌ Forbidden phrasing | Why | ✅ Instead |
|---|---|---|
| "A tegnap körvonalazott kétutas változat…" (if it did NOT go to them) | the recipient never saw it — information-asymmetry feeling | just state the conclusion, don't reference an internal iteration |
| "A korábban vázolt N-utas változat…" (if internal) | same | simply state what you think now, and why |
| "Ahogy korábban már jeleztem…" (if you only flagged it to yourself) | the "korábban" only exists in your draft | drop it, or: "szerintem…" |
| "Miután átdolgoztam a v3-at v4-re…" | the fact of versions only matters to you | does not exist for the recipient, drop it |

**Positive pattern:** state the conclusion — *"Utánajártam X-nek, az nálunk nem járható, Y a megoldás."* — no date, no internal-iteration reference, just the result. If information genuinely went to the recipient earlier (in an email, a meeting), referencing that is OK: *"A csütörtöki meetingen említettem X-et — annak alapján…"*

## Rule 7 — Internal disambiguation / internal reasoning must never leak into the body

**The body may contain only text the recipient immediately understands, from their own context.** Any signal that is only interpretable from the drafter's internal thinking / draft-organisation / routing rule — must be cut or moved to an appendix.

| ❌ Internal → body leak | Problem | ✅ Instead |
|---|---|---|
| "Petinek külön email-ben küldöm a részletes ticket-et **(László → Peti közvetlen)**" | the "László → Peti közvetlen" routing-arrow notation comes from the drafter's internal ruleset; the recipient never saw it | cut the parenthetical; if needed, put it in the appendix |
| "Wellis USA-n belüli árazási döntés, **nem kell hozzá központi jóváhagyás**" | "doesn't need HQ alignment" is your internal disambiguation; telling the Wellis USA CEO this suggests you think he doesn't know his own authority | cut the clause entirely |
| "**BLUF.** A 3 elem már nincs élesben…" | the "BLUF" label is part of your draft-structure; the recipient does not know the frame | cut the "BLUF." prefix, keep only the sentence content |
| "minden javítás konkrét sor a DOM-ban" | "DOM-ban" is a verification-methodology signal from your workflow; the recipient (especially non-dev) does not get it | cut, or rephrase: "minden javítás könnyen visszakereshető" |
| "## Tier 1, ## Tier 2, ## Tier 3" headers | the tier system is your categorisation; if not introduced to the recipient as shared vocab → internal signal | OK if you introduce it in 1–2 sentences, OR use prose headers ("## Mi mehet azonnal", "## Mi várhat néhány napot", "## Mi igényel előbb döntést") |
| "ahogy a [internal SOP X] szerint…" | internal SOP reference | cut; if the reasoning comes from the SOP, summarise the logic in Hungarian |

**Test:** read the body from the recipient's point of view. At any sentence where you find yourself needing to separately explain "why this clause / parenthetical is here" → cut it or move it to the appendix.
