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
- **Apply the language pack to whichever language it covers** — see below.

## Nativeness applies to BOTH languages

A language pack (`docs/language-packs.md`) is not only for delivered artifacts.
When a pack exists for a language, its rules apply to **every output in that
language** — whichever of the two settings selected it:

- `content-language: <lang>` → the pack runs as the **artifact pass** over each
  deliverable (read → scan → diff → confirm → write).
- `communication-language: <lang>` → the pack's **Core rules** apply to every
  **chat reply, summary, recommendation and working note** sent to the user.
  This is the **conversational pass** — self-apply the Core rules to your own
  draft before sending: no file, no diff, no confirmation.

**Standing rule.** When `communication-language: hu` — or the user simply writes
to you in Hungarian, expects a Hungarian answer, or asks for Hungarian output —
every Hungarian reply for the rest of the session passes the `aos-localize-hu`
Core rules before it leaves. It is **on by default** the moment the conversation
turns Hungarian; the user does not have to ask for it. The base system reaches
*correct* Hungarian on its own — the pack is what makes it *native*.

## Changeable mid-session

The choice is **not locked at onboarding.** The user may say, mid-work,
e.g. *"switch the content language to Hungarian."* `aos-route-question` (the
front door) recognises a language-change request, updates the field in
`AOS_CONFIG.md`, and confirms — the change takes effect for **all subsequent
skill output immediately**. `AOS_CONFIG.md` is the durable source of truth.

## Relation

- `aos-onboard` captures both (AOS-750).
- `aos-localize-hu` (AOS-749) is the Hungarian nativeness pass — it polishes
  AI-Hungarian into native Hungarian, in two modes: the **artifact pass**
  (`content-language: hu`) and the **conversational pass**
  (`communication-language: hu`, or any Hungarian conversation). See "Nativeness
  applies to BOTH languages" above.
- Pluggable — the language framework (AOS-749) adds languages; this context just
  carries the chosen pair.
