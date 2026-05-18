---
scope: int-company
---

# Reference — the AI-magyar anti-pattern catalogue

> The 14 most common AI-Hungarian error classes. Each is a rewrite trigger. Faithfully ported from the Arcanian Stílusútmutató. Calqued metaphors, stuck English words and deck phrases are in `calques.md`; idioms, prose rhythm and Arcanian voice are in `idioms-and-voice.md`; letter register is in `letter-register.md`.

## How translated Hungarian betrays itself (even without anglicisms)

A native reader feels a translated text even when every word is correct. The tells:

- **Calqued clause structure** — e.g. "az, miből áll maga a rendszer, főnevek" (1:1 from *"what the system is made of — nouns"*). Hungarian breaks it differently.
- **"az, hogy…" / "az, ami…" chains** stacked mechanically — mirroring *"the thing that…"*.
- **Symmetric paragraph structure** — every paragraph declares → expands → closes. Native Hungarian prose is asymmetric, self-correcting, circles back.
- **Missing HU idioms** — no "benne van a pakliban", "eldőlt a kocka", "elment a kedvem", "megfordult a fejemben", "pont az van, hogy…", "na de most…".
- **Mechanical particle-scatter** — "tehát", "ugye", "viszont" used as AI filler instead of their natural positions.
- **English sentence-openings dressed in Hungarian** — *"Egy dolog, amire figyeljetek…"* (= *"One thing to watch for…"*). Native: "Na, olvasás közben…", "Amire kérlek figyeljetek…", or just dive in.
- **"Mint egy X: Y"** comparison — often a calque of *"Like an X: Y"*. Native: "Olyan, mintha…", "Képzeljétek el úgy, hogy…".

**How to compose in HU instead:** start in Hungarian (no internal EN draft); pick up a real voice's sentence rhythm, not the logical skeleton; read aloud (translated stumbles, native flows); confirm at least one native idiom or particle is present; vary sentence-openings. If after 2 attempts a passage is still translation-flavoured, use the escape hatch.

**Watch your own rewrites.** A nativeness pass can introduce a *fresh* calque while fixing an old one — most often an abstract noun + motion verb ("feladatkört visz") or a forced `Hogy …, …` purpose-clause. After every rewrite, read your *own* version aloud too, and run the propagation check (§7) on it.

---

## 1. "Meg lehet + főnévi igenév" (impersonal, robotic)

The single most characteristic symptom of AI-Hungarian. Avoid in every form.

| ❌ Avoid | ✅ Natural |
|---|---|
| A marketing mintázatát meg lehet térképezni | Feltérképezzük a marketinget |
| A problémákat be lehet azonosítani | Rátapintunk a problémákra |
| Az eredményeket ki lehet értékelni | Kiértékeljük az eredményeket |
| A rendszert meg lehet vizsgálni | Megvizsgáljuk a rendszert |

**Rule:** active subject + definite conjugation. First person plural ("mi") or second person singular ("te").

## 2. Nominalisation (-ás/-és nouns instead of verbs)

| ❌ Avoid | ✅ Natural |
|---|---|
| A probléma beazonosítása a diagnózis feladata | A diagnózis beazonosítja a problémát |
| A változás elindítása a legfontosabb | A legfontosabb, hogy elinduljon a változás |
| A döntések meghozatala nehézségekbe ütközik | Nehéz dönteni |
| Az ügyfelek elérése a fő cél | Az a cél, hogy elérjük az ügyfeleket |

**Rule:** if you would write an action as a noun, write it as a verb instead.

## 3. Mirroring English word order

Hungarian word order is flexible — but the AI tends to think in English.

| ❌ English mirror | ✅ Hungarian order |
|---|---|
| Ez a leggyakoribb mintázat, amit látunk | Ezt a mintázatot látjuk a leggyakrabban |
| Van egy probléma, ami mindent blokkol | Egy probléma blokkol mindent |
| Ez nem az, amit mi csinálunk | Mi nem ezt csináljuk |

**Rule:** what matters goes first. The Hungarian sentence carries its emphasis up front.

## 4. Unnecessary demonstrative pronouns

| ❌ Verbose | ✅ Tight |
|---|---|
| Ez az a dolog, ami | Ami… |
| Az a fajta helyzet, amikor | Amikor… |
| Ez egy olyan mintázat, ami | Egy mintázat, ami… |
| Azok az emberek, akik | Akik… |

## 5. Over-long compound sentences

The AI loves to cram everything into one sentence. Hungarian prose rhythm is short-long-short.

❌ "A marketing problémáinak diagnózisa során feltárt mintázatok alapján meghatározott prioritások a rendszer mélyebb rétegeiben gyökereznek, és ezek a rétegek miatt nem változik a helyzet, amihez a változás érdekében hozzá kell nyúlni."

✅ "A diagnózis feltárja a mintázatokat. A prioritások a mélyebb rétegekből jönnek. Emiatt nem változik semmi. Ha változást akarsz, itt kell elkezdeni."

**Rule:** one thought — one sentence. If you drown in subordination, cut it in two.

## 6. Translation-flavoured expressions

| ❌ Translation | ✅ Natural |
|---|---|
| A nap végén (at the end of the day) | Végső soron / Lényegében |
| Értéket szállítani (deliver value) | Értéket adni / Értékeset nyújtani |
| Akciótervet implementálni | Megvalósítani a tervet |
| Szignifikáns változás | Érdemi változás |
| Releváns | Ide illő / Fontos / Lényeges |
| Proaktívan | Előre lépve / Időben |
| Generikus válaszok | Sablonos válaszok |
| Narratíva | Történet / Szál |
| Prioritizálni | Fontossági sorrendet felállítani / Rangsorolni |

> Calqued metaphors (6b), deployment-context calques (6a-bis), case-ending errors (6c) — see `calques.md`.

## 7. Overuse of "amely/amelyek"

| ❌ Officialese | ✅ Spoken |
|---|---|
| A szokások, amelyek a rendszert működtetik | A szokások, amik hajtják a rendszert |
| Az eredmények, amelyeket elértünk | Az eredmények, amiket elértünk |
| A probléma, amelyre rávilágítottunk | A probléma, amire rávilágítottunk |

**Rule:** "amely" → "ami/amik" — unless it is a formal document.

## 8. Stuck English words

> The full stuck-English-word table, multi-word English phrases (8d), and the "agent"/"ülés" rules (8b/8c) are in `calques.md` — they are calque-class issues.

## 9. Non-existent verbs invented from English

| ❌ Invented verb | Why wrong | ✅ Existing Hungarian |
|---|---|---|
| kaszkádol | "cascade" does not become a HU verb | következik / végighullámzik |
| targetál | Forced anglicism | megcéloz / célba vesz |
| diszruptál | Not a Hungarian word | felborít / szétszed |

**Rule:** if you have never heard it spoken — it is not a verb. Test: would you say it to a client? If not → rewrite.

## 10. Conditional mood errors

| ❌ Wrong form | Why | ✅ Correct |
|---|---|---|
| felrobbanná | intransitive → -na/-ne | felrobbanna |
| megváltozná | intransitive → -na | megváltozna |
| elindulná | intransitive → -na | elindulna |

**Rule:** intransitive verb (no object) → **-na/-ne**. Transitive verb (has object) → **-ná/-né**. The AI mixes the indefinite conjugation with the definite one.

## 11. Negation-affirmation ("Nem … hanem …") — the clearest LLM tell

This structure instantly reveals AI authorship. The LLM over-bred it on the Hungarian marketing corpus.

| ❌ AI-marketing template | ✅ Direct |
|---|---|
| Nem csak egy eszköz, hanem egy rendszer | Egy rendszer. Nem egyszerűen eszköz. |
| Ez nem csupán egy termék, hanem egy élmény | Ez egy élmény — a terméken túl. |
| Nem az a kérdés, hogy mikor, hanem hogy hogyan | A kérdés a hogyan. A mikor mindegy. |
| Nem egy szokás, hanem egy életforma | Életforma. |

**Rule:** max 1 negation-affirmation per deliverable, and only for a real, sharp contrast. **Test:** remove the "nem X, hanem" part and leave Y alone. If Y is as strong or stronger → the structure was unnecessary. If weaker → check whether X is a real counter-point or just a straw man.

## 12. HU suffix on an English noun (AI-slang pattern)

Putting a Hungarian verbal/inflectional suffix on an English noun — the **most instantly-revealing** AI-HU pattern.

| ❌ HU suffix on EN noun | ✅ Hungarian word |
|---|---|
| compoundolódnak | gyűlnek / épülnek / összeérnek |
| frictionök | súrlódások |
| onboardingotok | befogadás / átadás / átvétel |
| subscription-je | előfizetése |
| fire-ol (modal/popup fire-ol) | nem ugrik fel / nem jelenik meg / nem aktiválódik |
| checkoltam / checkolja | ellenőriztem / megnéztem / átfutottam |
| page-en (5 page-en) | oldalon (5 oldalon) |
| deploy-olom / deployoltam | kirakom / élesítem / felteszem |
| scrollolj le | görgess le |
| fixeljük / fixoltam | javítjuk / kijavítottam (the noun-abbrev "fix" stays OK: "Tier 1 fix lista") |
| shipping-eljük | kiszállítjuk / elküldjük / élesítjük |
| launch-oljuk | indítjuk / elindítjuk |
| sale-ek / sale-ekkel | akciók / akciókkal |
| decision / pricing-decision | döntés / árazási döntés |
| alignment / HQ alignment | egyeztetés / jóváhagyás / központi jóváhagyás |
| direction / marketing-direction | irány / vezetői látásmód / marketing-irány |
| policy / brand-policy | szabályzat / márka-szempont / márkapolitika |
| perception / buyer-perception-ben | megítélés / vevői megítélésben |
| kommerciális (kérdés / döntés) | üzleti / kereskedelmi / piaci |
| compliance / FTC-compliance | megfelelőség / szabályozási megfelelőség |

**Rule:** if the HU suffix is on an English noun, replace the *whole* word (not just the suffix). Exception: established brand/platform names keep the Hungarian rag ("LinkedIn-en", "Shopify-on", "Databoxon").

## 13. Consulting-deck phrases

AI-HU stock phrases leaked in from LinkedIn marketing blogs. (László: *"I would never say this."*)

| ❌ Forbidden deck phrase | ✅ Instead |
|---|---|
| kézzelfoghatóvá tenni | konkrétan megmutatni / megfogni |
| differenciálást építeni | megkülönböztetni / sajátosat csinálni |
| értékké fogyasztható | használható / hasznos |
| minőségi kapu | ami elválasztja a jót a rossztól |
| DNS-e kódolt formában | ami jellemzi / amitől az |
| northern star / északi csillag | a fő cél / amerre tartunk |
| pillérek | tartóoszlopok / alapok / részek |
| kapaszkodót kinyit | ad egy fogódzót / segítséget |

**Rule:** if the phrase sounds cut from a LinkedIn blog — drop it. Hungarian prose lives on physical/biological metaphors (orchestra + sheet music, iron vs mercury, ping-pong match), not abstract management-stock tropes.

### 13b. Never write the "BLUF" label

The BLUF (Bottom Line Up Front) **principle** stays — the conclusion is the first sentence/paragraph. But the **label** spelled out — "**BLUF.**" as a sentence-opener or "## BLUF" header — is an anglicism + military/consulting-deck slang. Never write it.

| ❌ Label written out | ✅ Instead |
|---|---|
| **BLUF.** A 3 elem már nincs élesben… | A 3 elem már nincs élesben… (the sentence itself is the conclusion) |
| ## BLUF | ## Összefoglaló / ## A lényeg / ## A végeredmény (or no header — just the first paragraph) |
| BLUF: az audit ~85% sound | Az audit ~85% sound. |

## 14. AI-marketing openers and connectors

Automatic intros and transitions carrying zero information — the LLM fills "paragraph-starts" with these.

| ❌ AI opener / connector | Why wrong | ✅ Instead |
|---|---|---|
| A mai gyors tempójú világban… | Empty cliché, asserts nothing | Start with the concrete fact |
| Nem véletlen, hogy… | Pseudo-reasoning transition | Write the connection directly |
| Képzeld el, hogy… / Gondolj bele… | Forced engagement hook | Start with the situation, not the command |
| Fontos megjegyezni, hogy… | SEO paragraph-filler | If it matters, assert it. If not, delete it. |
| A lényeg, hogy… (as transition) | Filler | State the point, don't announce it |
| Valódi áttörés / Egyszerűen zseniális / Forradalmi | Superlative with no substance | Concrete measurable effect |
| Rhetorical question + immediate self-answer: *"Mit jelent ez a gyakorlatban? Azt, hogy…"* | AI-sermon rhythm | Assert; don't quiz yourself |
| Three-part synonym list: *"gyors, hatékony és eredményes"* | Says the same thing three times | One precise word |

**Read-aloud test:** read it aloud. If it has the feel of a LinkedIn post or SEO article — not of explaining something to a colleague in person — drop it, and **start over in Hungarian** (don't translate from EN).
