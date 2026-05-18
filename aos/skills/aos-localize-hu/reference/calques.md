---
scope: int-company
---

# Reference — calques, stuck English words, mirrored metaphors

> The calque-class catalogue: stuck English words, multi-word English phrases, mirrored English metaphors, calqued case-endings, and the deployment-context calques. Companion to `anti-patterns.md` (which holds error classes 1–14) and `idioms-and-voice.md`.

## Stuck English words (anti-pattern class 8)

The AI sometimes leaves raw English words in a Hungarian sentence. Not a translation — just English left behind.

| ❌ English left in | ✅ Hungarian |
|---|---|
| word-of-mouth | szájreklám |
| bottleneck | szűk keresztmetszet |
| lever (növekedési ~) | húzóerő |
| packaging | csomagolás |
| in-store | bolti |
| power (árazási ~) | erő |
| branding | márkaépítés |
| free-rider | potyautas |
| subscription | előfizetés |
| framework | módszer / keret / rendszer |
| deck | prezentáció / dia |
| tool | eszköz |
| backend | háttér / háttér-rendszer |
| onboarding | befogadás / átadás / átvétel (per context) |
| coworking | együtt-munka / együtt-dolgozás |
| friction | súrlódás |
| compound (verb) | gyűl / épül / összeér |
| team | csapat (or specifically: "a Ti csapatotok", "a BuenoSpa csapat") — exception: brand-name use ("Wellis team" as a company name) stays |

**Rule:** if the English word has an established Hungarian equivalent → it may not stay English. If there is no established Hungarian word (`marketing`, `TikTok`, `ChatGPT`, `Claude`, `AOS`) → English is fine.

### 8b. "agent" always in writing — never "ágens"

**In writing, "agent" is mandatory.** In speech László sometimes says *ágens* — that goes into the transcript as spoken. But every written surface uses **agent**: emails, memos, profiles, docs, manifestos, the book, skill/agent files.

| ❌ Forbidden in writing | ✅ Correct |
|---|---|
| ágensek | agent-ek |
| ágens szinten | agent szinten |
| ágens neve | agent neve |

### 8c. "ülés" → "egyeztetés" (default swap in written text)

"Ülés" has an anglicism flavour (session/meeting), too formal, deck-register. In spontaneous speech "találkozó"; in a written peer email "egyeztetés" is more natural.

| ❌ Anti-pattern | ✅ Instead |
|---|---|
| Tartsunk egy ülést | Egyeztessünk / Beszéljük át |
| egy 45 perces ülés Zsolttal | egy 45 perces egyeztetés Zsolttal — or drop it |
| KPI-tábla-ülés | KPI-tábla egyeztetés / végigmegyünk a KPI-táblákon |

**Exceptions:** spoken/script/video voice → "találkozó"; institutional sittings ("képviselőtestületi ülés", "igazgatósági ülés", "board ülés") → "ülés" stays. If László asks for something specific, his instruction wins.

### 8d. Multi-word English phrases in a Hungarian sentence — quote and/or translate

A single English word (see above) is easy to control. Multi-word English phrases often embed **unmarked** — as if they were established Hungarian. A typical AI / translation-Hungarian pattern.

| ❌ Embedded unmarked | Problem | ✅ Correct |
|---|---|---|
| A Top 5 this week listából 3 elem már megvan | "this week" embedded as if established HU | Az audit **'top 5 ezen a héten'** listájából… |
| A Skip the Trip kampány indul jövő héten | brand name, but unmarked | A **'Skip the Trip'** kampány indul jövő héten (quotes stay, brand name NOT translated) |
| Megnéztük a value for money-t | EN phrase with a Hungarian rag | Megnéztük az **ár-érték arányt** |
| factory direct árazás | EN concept pair, unmarked | **gyárból közvetlen** árazás / **'factory-direct'** árazás |
| Megcsináltuk a quick wins listát | EN plural + EN noun group | Megcsináltuk a **gyorsan elérhető** listát / a **'quick wins'** listát |

**Rule combination:**
1. **Brand or campaign name** (e.g. "Skip the Trip", "Memorial Day Sale", "Hot Tub Buyer's Guide") → stays in quotes, NOT translated.
2. **Generic EN concept** (e.g. "value for money", "top 5 this week", "factory direct", "quick wins") → translate it.
3. **Established technical term** (e.g. "ROAS", "GA4", "Shopify", "FAQ") → goes into a Hungarian sentence bare, inflected ("a ROAS-on", "a Shopify-ban", "az FAQ-on").

**Test:** if a Hungarian reader could underline the phrase ("explain this") and it is not clear on first sight → quote + parenthetical Hungarian explanation, or translate.

### 8e. PPC / ads domain — the recurring stuck English words

This skill polishes a lot of PPC / paid-media client correspondence. These domain words leak in most often — all have settled Hungarian equivalents:

| ❌ English left in | ✅ Hungarian |
|---|---|
| ad copy | hirdetésszöveg |
| landing page (copy) | céloldal (-szöveg) |
| read-only | csak olvasási jog / olvasási hozzáférés |
| trial | próbaidőszak |
| review (havi ~) | áttekintő / értékelő |
| account (Google Ads / Meta ~) | fiók |
| margin / marginok | árrés / fedezet |
| measurement-audit | mérési audit |
| performance | teljesítmény |
| scope of work | feladatkör / a munka tartalma |
| output / outputs | eredmény / amit a rendszer ad |

**Exception — established technical terms stay, inflected:** ROAS, CPC, CTR, CAC, ICP, PPC, GA4, GSC ("a ROAS-on", "a CAC-ot").

---

## 6a-bis. Deployment / web-context calques ("kint van" anti-pattern)

In a web/server-deployment context, the English *"what's out there"* / *"what's live"* / *"what's deployed"* gets calqued as "kint van" — a common AI-Hungarian / translation-Hungarian error. "Kint" in Hungarian means physical outdoor space (parking lot, street, garden). Web/server context: **fent van** or **élesben van** or **élő**.

| ❌ Anglicism | From | ✅ Natural Hungarian |
|---|---|---|
| Mi van kint a site-on? | what's out there | Mi van **fent** az oldalon? / Mi **szerepel** az oldalon? |
| Mi van valóban kint és mi nincs már | what's actually out there | **Mi szerepel valójában az oldalon és mi nem** (prose, letter register) / Mi van fent ténylegesen és mi nincs (shorter, deploy-slang) |
| Még nincs kint | not yet deployed | Még nincs **fent** / Még nincs **élesben** |
| Ez már kint van élesben | (already redundant) | Ez már **fent van** / Ez már **élesben van** |
| Tegnap raktuk ki | put it out yesterday | Tegnap **raktuk fel** / Tegnap **élesítettük** |
| Levesszük a frontról | take it down from the front | **Levesszük** / **Kivesszük** (élesből) |
| A team szépen lerakta őket | the team shipped/landed them | **A csapat megcsinálta őket** / **A csapat időközben elintézte** |
| Letették már | landed it / shipped it | **Megcsinálták már** / **Élesítették már** / **Fent van már** |

**Logical-tension test:** if "nincs élesben" + "lerakta" stand together in one sentence → contradiction. "Leraktak/letettek vmit" in Hungarian = physically put down, or "place out" → contradicts "nincs élesben". Use instead: "megcsinálta", "elintézte", "lefejlesztette" — these imply no deployment direction.

**Test:** if swapping "kint" → "fent" reads naturally → "kint" was an anglicism. If "fent" sounds odd (e.g. "kint a parkolóban" → "fent a parkolóban" ❌) → "kint" is legitimate, keep it.

**Deployment-context vocab:** **fent van** = deployed, live (general); **élesben van** / **élesen** = production, post-launch (more formal); **élő** = currently active ("az élő verzió"); **élesíteni** = to ship / to deploy; **levenni / kivenni** = to take down / remove from production.

---

## 6b. Mirrored English metaphors

One of the most dangerous errors — grammatically correct, but the image does not exist in Hungarian.

| ❌ English metaphor in HU | Why wrong | ✅ Natural Hungarian |
|---|---|---|
| A rendszer a helyén tartja a problémát (holds in place) | In Hungarian a problem has no "place" and does not "move" — it is an effect, not an object | A rendszer miatt nem változik a helyzet / Emiatt nem változik semmi |
| Kirakni az asztalra (put on the table) | Only if there is a real table | Kimondani / Szóba hozni |
| Egy szintre hozni (bring to the same level) | Forced | Összehangolni / Egyeztetni |
| A probléma ezen a rétegen él (lives on this layer) | In Hungarian a problem does not "live" somewhere — it is there, or found there | A probléma ezen a rétegen van / itt található |
| Előre vinni a beszélgetést (move the conversation forward) | In English a conversation "moves", in Hungarian it does not | Továbblépni / Mélyebbre menni |
| A helyére tenni a dolgokat (put things in place) | Sometimes OK, but often a calque | Rendet tenni / Tisztázni |
| Zöld jel / "ha green light" | "green light" calque — accepted in HU biz-slang but still a calque | Ha rendben van / Ha mehet / Ha jóváhagyjátok |
| Time-bound / "real time-bound holiday sale-ek" | EN compound + HU rag stacked | Időablakos (ünnepi akciók) / lejárati idejű / megszámlált végdátummal |
| Real X / "real holiday sale" | "valódi/igazi X" calqued straight from EN | Valódi X (often a concrete description is better: "lejárati dátummal", "megszámlált") |
| Everyday low pricing | EN biz concept | Folyamatos alacsony árazás (OK in quotes if you genuinely cite the industry term) |
| Jövök rá részletesen / "jövök vissza rá" | "I'll come back to it" calque | Visszatérek vele / Részletes anyagot küldök / Részletek a héten |
| Kalibrálni | "calibrate" anglicism | Hozzáigazítani / Át kell írni / Át kell gondolni / Rendezni |
| Head-be / fejlécbe in EN context | "head" as HTML/page header with a HU rag | "az oldal élére" / "az [oldal]-ra" — if genuinely HTML head, then "fejléc" |
| A/B slash enumeration ("Hungary/Wellis történet") | EN-style per-slash enumeration | "a Wellis-Magyarország-történet" / "Te és Gábor szempontja" (in HU "/" marks only an alternative, not a connector) |
| Next pass / "a következő pass-on" | EN consulting slang | "A következő körben" / "Legközelebb" (often unnecessary — cut if it carries nothing) |
| Revenue-impact alapján priorizálni | EN biz-slang stacked | "Valódi mérőszámok alapján rangsorolni" / "a tényleges hatás alapján sorrendet állítani" |
| Szivárog a teljesítmény (performance leaks) | Performance is not a fluid in Hungarian — it does not "leak" | Hol **folyik el** az eredmény / hol **veszít** a kampány |
| A feladatkört a részletekig visz (carry the scope to the details) | Abstract noun + motion verb — a "feladatkör" cannot be carried anywhere | Drop the bridge and just start; or name a concrete action |

**Rule:** if the metaphor is visual in English and not in Hungarian — find a Hungarian image, or write without a metaphor.

**Abstract noun + motion verb is its own trap.** "feladatkört visz", "a beszélgetést előre visz", "a kérdést az asztalra teszi", "a fókuszt egy szintre hozza" — an abstract noun (scope, conversation, question, focus) does not physically move. Watch this **especially in your own rewrites**: a nativeness pass often swaps the English word for a Hungarian one but keeps the English motion-metaphor underneath.

---

## 6c. Case-ending errors (verb government carried from English)

English prepositions ("in", "on", "at") do NOT map one-to-one to Hungarian case endings. The **Hungarian verb's government** always decides.

| ❌ EN government mirrored | Why wrong | ✅ Hungarian government |
|---|---|---|
| Csatornákban költeni (spend in channels) | Spend *on* something, not *in* something | Csatornák**ra** költeni |
| Rétegen élni (live on a layer) | A problem *is* somewhere, it does not "live" | Réteg**ben** lenni |
| Pozicionáláson dolgozni (work on positioning) | Work *on* OR *in* something — context-dependent | Pozicionálás**ban** / pozicionálás**on** |
| 14 napban (within 14 days) | "in 14 days" → "-ban" mirrored; a duration window takes "alatt" | 14 nap **alatt** |

**Rule:** after a fix, ALWAYS scan the whole text for the same structure. If government is wrong once, it is probably wrong elsewhere. If a native reader would feel "this comes from English" — rewrite it.

---

## 6d. Calqued English idioms — whole-phrase calques

Grammatically perfect Hungarian, every word correct — but the *idiom* is English. The most invisible calque class, because nothing is misspelled.

| ❌ Calqued idiom | From | ✅ Hungarian |
|---|---|---|
| Ez a ti hívásotok | your call | Ezt ti döntitek el / Rátok bízom / A ti döntésetek |
| (A legnagyobb) különbséget hozni | (to) make a difference | Itt javít a legtöbbet / Itt látszik a legtöbb / Itt számít a legtöbbet |
| A nap végén | at the end of the day | Végső soron / Lényegében |
| Kirakni az asztalra | put it on the table | Szóba hozni / Kimondani |
| A labda a ti térfeleteken van | the ball is in your court | Rajtatok a sor / Tőletek függ |

**Test:** back-translate the phrase into English word by word. If you get a fluent English idiom — it was a calque. A genuine Hungarian thought rarely back-translates into a clean English idiom.

## 6e. Calqued word-senses — the right word, the wrong meaning

The Hungarian word exists and is common — but here it carries an English sense it does not have in Hungarian.

| ❌ Word in an EN sense | From | ✅ Hungarian |
|---|---|---|
| a jogi **oldalon** | the legal *side* | a jogi **kérdésekben** / **téren** / jogilag |
| **élő** hozzáférés | *live* access | (csak) hozzáférés — az "élő" itt fölösleges calque |
| az adat **olvasása** / teljesítmény-**olvasás** | *reading* the data | az adat **elemzése** / **kiértékelése** / **kiolvassuk** az adatból |
| **kimenet / kimenetek** (amit a rendszer ad) | *output(s)* | az **eredmény(ek)** / amit a rendszer **ad** |

- **"olvasás"** stays correct for actual text — "elolvastam a leveled". It is a calque only for *data / metrics / performance*: those you analyse, you do not "read".
- **"élő"** stays correct for deployment — "az élő verzió" (see 6a-bis). It is a calque in "élő hozzáférés / élő adat", where it only mirrors English "live".

**Test:** would a Hungarian who never spoke a word of English use this word here? If the sense only lands once you know the English word behind it — calque.
