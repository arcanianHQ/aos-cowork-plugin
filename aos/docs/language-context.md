# Language context

AOS GTM separates **two** languages — both are per-client config, both are
honored system-wide, and both are changeable mid-session. Design for AOS-751
(capture: AOS-750).

## The two settings

- **`communication-language`** — the language skills *talk to the user* in:
  questions, summaries, recommendations, working notes.
- **`content-language`** — the language *created / delivered client artifacts*
  are written in: brand docs, content pieces, deliverables.

They are **independent**. A common case: communicate with Cowork in English,
deliver client content in Hungarian.

## Where they live

`AOS_CONFIG.md` at the granted-folder root — two fields, written by
`aos-onboard` (AOS-750), alongside the rest of the install config. If the user
does not specify, default both to their Cowork UI language.

## How skills consume them

A **standing rule for every skill** — read both values from `AOS_CONFIG.md`
during context assembly (the same way zones are resolved via the data-access
router); never hard-code a language:

- **Talk to the user** in `communication-language`.
- **Write client-facing artifacts** in `content-language`.
- Internal / working notes follow `communication-language`.

## Changeable mid-session

The choice is **not locked at onboarding.** The user may say, mid-work,
e.g. *"switch the content language to Hungarian."* `aos-route-question` (the
front door) recognises a language-change request, updates the field in
`AOS_CONFIG.md`, and confirms — the change takes effect for **all subsequent
skill output immediately**. `AOS_CONFIG.md` is the durable source of truth.

## Relation

- `aos-onboard` captures both (AOS-750).
- `aos-localize-hu` (AOS-749) is a content-language *quality* pass — it polishes
  AI-Hungarian into native Hungarian; the language context tells it when to run
  (`content-language: hu`).
- Pluggable — the language framework (AOS-749) adds languages; this context just
  carries the chosen pair.
