---
scope: int-company
---

# PII categories — detection and the keep / remove rules

Companion to `aos-anonymize/SKILL.md`. The personal-data categories to detect,
the locale-aware patterns, and the rule for deciding what is removed and what
stays.

---

## §1 — Detection categories

Scan for every category. Detect against the artifact's **actual language /
locale** — formats differ.

| Category | What to detect | Locale notes |
|---|---|---|
| **Person name** | Names of individuals — customers, contacts, named non-public people | Name order differs (HU: family name first — "Kovács János") |
| **Email address** | Any `name@domain` | universal |
| **Phone number** | Phone / mobile numbers | HU `+36 30 …` / `06 30 …`; international `+NN` |
| **Postal address** | Street + city + postcode of a private individual | HU order: postcode (4 digits) + city + street; US: street + city + state ZIP |
| **Account / customer ID** | Customer numbers, account IDs, order numbers, CRM record IDs | often `#`-prefixed or long digit strings |
| **Tax / national ID** | Tax numbers, national identity numbers, VAT of a sole trader (a person) | HU `adószám` (8-1-2 digits), `személyi szám`; EU VAT |
| **Date of birth** | A DOB tied to a named person | distinguish from generic dates |
| **Private financial data** | An individual's salary, individual deal value, personal bank / card details | not aggregate business figures |
| **Identifying handle / URL** | Personal social handles, profile URLs, a private individual's site | distinguish from the client's own brand handles |
| **Photo / media reference** | A reference to an image of an identifiable person | flag for the user — the skill handles text, not images |

Use `grep` for the structured categories (email, phone, IDs — they have
patterns). Person names, addresses, and free-text PII need a careful read of the
artifact, not only a pattern match.

---

## §2 — The keep / remove rule

The single decision: **third-party personal data is removed; the client's own
public identity stays.**

### Remove / anonymise — third-party personal data

- A **customer's** name, contact details, address, account ID.
- Any **private individual** named without evidence of consent to public use.
- A named **employee of a third party** (a partner, a vendor, a competitor's staff).
- Anyone's **email / phone / address / national ID / DOB / private financial data**,
  regardless of who they are — these are removed even for the client's own people
  (a founder's by-line stays; the founder's mobile number does not).

### Keep — the client's own public identity

- The **client's brand / company name** (it is the subject of the artifact).
- The client's **public** business address, switchboard, general contact email.
- The **founder / spokesperson's name when they appear publicly as the brand** —
  a by-lined post, a quote they give as the company. Their *private* contact
  details are still removed.

### Flag for the user — the ambiguous middle

Do **not** silently decide these — list them in the report for the user:

- A named person whose public/private status is unclear (is this customer quote
  attributed with consent?).
- A small-business client where the **owner's name is the brand** (a sole
  trader) — removing it may not be possible without breaking the artifact.
- A testimonial — quoting a real customer is the artifact's *point*; anonymising
  it changes its value. Flag it: the user decides consent vs anonymise vs cut.

---

## §3 — Anonymisation

### Pseudonymise (default)

Replace each removed item with a **consistent, readable** placeholder — the same
real value maps to the same placeholder throughout the artifact:

| Category | Placeholder pattern |
|---|---|
| Person name | `[Customer A]`, `[Customer B]`, `[Contact A]` — role + letter, consistent |
| Email | `[email]` |
| Phone | `[phone]` |
| Address | `[address]` or `[city]` if only the city need go |
| Account / tax / national ID | `[account-id]`, `[tax-id]` |
| Private financial figure | `[amount]` |

Consistency is the rule — if `Jane Doe` appears five times she becomes
`[Customer A]` all five times, so the anonymised text still reads coherently.

### Redact (`--mode=redact`)

Mask each removed item — `████` — when the user wants the data gone rather than
placeheld. Less readable; use when the user explicitly asks.

---

## §4 — Residual risk

The skill is detection-and-assist, not certified DLP. Always state, in the
report's residual-risk note, the limits of this run:

- **Quasi-identifiers** — a person can be re-identified from a *combination* of
  non-PII facts (role + city + a distinctive detail) even after direct
  identifiers are removed. Flag any passage where this is plausible.
- **Free-text leakage** — a name embedded in a narrative sentence is easier to
  miss than one in a structured field. The user must read the anonymised copy.
- **Locale coverage** — patterns cover EN + HU well; other locales less so.
- **Images** — this skill handles text only; a reference to an identifiable
  person's photo is flagged, not anonymised.
