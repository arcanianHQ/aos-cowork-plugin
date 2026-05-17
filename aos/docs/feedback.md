# AOS plugin — the feedback mechanism

How feedback travels from a tester inside the plugin to actionable, managed work.
Capture is `aos-feedback`; this doc is the **whole pipeline** — the design
(AOS-773 + AOS-774).

## The principle — one item, two representations

A feedback item is **one logical object**. It has two representations because of
one hard architectural constraint: the plugin has **no backend**, and a tester's
install has **no Linear access** — so feedback cannot be *born* as a Linear
ticket.

| Representation | Where | Role |
|---|---|---|
| `feedback/FB-NNN-*.md` | the tester's granted folder | the **capture edge** — ticket-like from birth (`FB-NNN` id + status lifecycle) |
| a Linear ticket | the **Cohort 1 Feedback** project | the **managed form** — Linear's real lifecycle, priority, assignment |

They sync: the `FB-NNN` record carries the `linear:` id, the Linear ticket carries
the `FB-NNN` id, and the record's `status` mirrors the ticket — so a tester can
check *"FB-007 → AOS-812, In Progress"*.

## The pipeline

```
aos-feedback        →  email            →  #aos-support      →  auto-triage     →  Linear
(capture edge,         (transport —         Slack channel        (anonymise,        (Cohort 1
 a FB-NNN record)      aos-support@          — the COMMON         classify, dedup,    Feedback —
                       arcanian.ai)         DENOMINATOR)         create ticket)      the managed form)
                                                                       ↑
                                                                  human override
```

### 1 — Capture (`aos-feedback`, in the plugin)

`aos-feedback` captures the item into `feedback/FB-NNN-*.md` and formats it as an
email. Pure markdown skill — **no code, no connector, no backend**. See the skill.

### 2 — Transport (email now)

The user emails the record to **`aos-support@arcanian.ai`**. Email is the v1
transport: universal, zero-infra, works in Cowork and Claude Code alike. The
subject is machine-parseable: `[AOS Feedback] FB-NNN | <type> | <severity> | <client-slug>`.

### 3 — The common denominator: the `#aos-support` Slack channel

`aos-support@arcanian.ai` routes into the Arcanian **`#aos-support` Slack
channel**. This is the **convergence point** — and it is deliberately
transport-agnostic: the transport *in* will change (email now, a dedicated
feedback MCP server later), but every generation lands in the **same Slack
channel**. The team sees feedback live there; nothing depends on remembering to
sweep folders.

### 4 — Auto-triage (Arcanian side — framework automation)

Auto-triage reads `#aos-support` and, **automatically**:

1. **Anonymises** — runs the record through `aos-anonymize` (a feedback record
   may carry a transcript excerpt / PII) before anything is filed.
2. **Classifies** — maps the record's fields to Linear:

   | Feedback field | → Linear |
   |---|---|
   | `severity: blocker` | priority **Urgent** |
   | `severity: major` | priority **High** |
   | `severity: minor` | priority **Medium** |
   | `severity: note` | priority **Low** |
   | `type: bug` | label `bug` |
   | `type: missing` | label `feature` |
   | `type: confusion` | label `docs` / `ux` |
   | `type: praise` | **not a ticket** — logged in `feedback/INDEX.md` as a keep |

3. **Dedups** — several testers, one issue → **one** Linear ticket referencing
   every `FB-NNN`.
4. **Creates the Linear ticket** in the **Cohort 1 Feedback** project, with the
   `FB-NNN` id(s) backlinked.

This is the auto step — it fires without a human gate. Triage automation lives
**framework-side** (`_aos_dev_framework/scripts/`, TypeScript) — **never in the
plugin**. The plugin stays pure markdown.

### 5 — Human override

A human can **override** any auto-triage decision — re-prioritise, merge dupes,
reject a non-actionable item, reclassify. Override, not approve-first: the
default is the item flows; the human corrects. (This honours the AOS rule that a
human owns the judgement — here as a veto, not a gate.)

### 6 — Status sync-back

The Linear ticket's lifecycle (`Todo → In Progress → Done`) mirrors back into the
`FB-NNN` record's `status` and the `feedback/INDEX.md` row — so a tester's report
is never silently dropped, and they can see it move.

## Roadmap

- **v1 — email transport.** Shipped with `aos-feedback` v0.2.0.
- **Later — a dedicated feedback MCP server.** Bundled in `.mcp.json`, it pushes
  the record straight into `#aos-support`, replacing the manual email step. The
  capture edge and the record format do not change — only step 2 does.

## The `feedback/` zone

`feedback/` sits at the granted-folder root: `FB-NNN-*.md` records + `INDEX.md`.
`aos-feedback` creates it on first use — feedback capture is never gated on
onboarding.
