---
name: aos-distribute
description: Ship a content piece — prepare a draft for its channel per the BU's content-system/<bu>/distribution.md, advance its status in content/CATALOGUE.md (draft → scheduled / published), and log the ship to CAPTAINS_LOG.md. The plugin cannot autonomously post to channels; this skill prepares the publish-ready, channel-formatted version and records the hand-off. Connector-aware where a channel connector exists.
scope: int-company
flavor: [company, advanced, internal]
class: content
domain: content
layer: [L6, L7]
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "--piece=<path-or-slug under content/> [--channel=<channel from distribution.md>] [--bu=<bu-slug>] — operates on the granted folder"
inputs:
  - client/CLIENT_CONFIG.md
  - content/ (the piece being shipped — a single piece or a series piece)
  - content/CATALOGUE.md (status is read and advanced here)
  - content-system/[<bu>/]distribution.md (the channel map — required)
  - content-system/[<bu>/]messaging.md (register check before ship)
  - brand/VOICE.md (channel-format pass must not break voice)
  - a channel connector's MCP tools (when one exists for the target channel — optional)
outputs:
  - content/[<bu>/].../<piece>-<channel>.md (the channel-formatted, publish-ready version)
  - content/CATALOGUE.md (piece status advanced — draft → scheduled / published)
  - CAPTAINS_LOG.md (the ship logged)
preflight:
  - client-config
connector:
  name: channel
  required: false
  degrades: true
ontology:
  consumes: [Content, Layer]
  emits: []
privacy:
  enumerates-accounts: false
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-draft-content
tags: [distribute, content, publishing, channel, loop]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder (no per-client nesting). The granted-folder root is the working directory. Resolve zones (`client/`, `content/`, `content-system/`, `brand/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest at the granted-folder root. Never hard-code paths beyond the documented zone layout. Client identity (the client name / slug) is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md` — it is never a directory level. Business-unit subfolders (`content/<bu>/`, `content-system/<bu>/`) *are* a legitimate layout level for multi-BU clients. Bash + filesystem on the granted folder is the contract; the router is an optimization.

## Language

Resolve `communication-language` and `content-language` from `AOS_CONFIG.md` during context assembly (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; write client-facing artifacts in `content-language`.

## Purpose

`aos-distribute` is the **distribution stage of the AOS loop** — it sits between content and measurement:

```
onboard → catalogue → discover → brand → plan → content → DISTRIBUTE → measure → FND ↺
```

It ships **one content piece**: it reads the piece, reads its BU's
`content-system/<bu>/distribution.md` to learn where that content type ships,
**prepares a channel-formatted, publish-ready version** of the piece, **advances
the piece's status** in `content/CATALOGUE.md`, and **logs the ship** to
`CAPTAINS_LOG.md`.

**The plugin cannot autonomously post to channels.** The Cowork runtime has no
guaranteed posting authority for a brand's social / blog accounts, and silently
publishing on a client's behalf would be wrong even if it could. So `aos-distribute`
**prepares and hands off** — it produces the exact, channel-correct version a
human (or a connected scheduling tool) publishes, and records that the piece has
moved to `scheduled` / `published`. It is the ship *manifest*, not an autonomous
publisher.

**Anti-goal.** `aos-distribute` does not draft new content (that is
`aos-draft-content`) and does not measure results (that is `aos-measure`). It
takes an existing draft and makes it shippable.

## Posture

Discovery, not pronouncement. Present the channel-formatted version and the
proposed status change for the user to confirm before writing — never advance a
piece to `published` without explicit confirmation.

## Connector — channel connectors (graceful degradation)

`aos-distribute` is **connector-aware**, not connector-gated. A channel connector
exists for *some* channels (e.g. Slack for internal delivery; per-client
conditional connectors per `docs/connectors.md`) and not others. A connector
counts as connected **only if its MCP tools are present in the session**.

- **A channel connector is present** for the target channel → the skill may use
  it to *schedule* or *stage* the piece where the connector's capability allows,
  and records the connector action in the ship log. It still does not silently
  publish without user confirmation.
- **No channel connector** (the common case) → **degrade, do not fail.** Prepare
  the channel-formatted file, advance the catalogue status to `scheduled`, and
  hand the publish-ready file to the user with clear instructions for the manual
  post. The piece moves to `published` only after the user confirms it went live.

Never report a missing connector as a failure — manual hand-off is the normal
path, not a degraded one.

## Arguments

This skill operates on the **granted folder** — which is the client's folder.

- `--piece` (required) — the content piece to ship: a path or slug under
  `content/` (a single piece, or a piece inside a `<series-slug>/` folder).
- `--channel` (optional) — the target channel, a value from the BU's
  `distribution.md`. If omitted, the skill reads `distribution.md` for the
  piece's content type and uses the **primary channel**; it states which.
- `--bu` (required if the client uses per-BU content) — BU slug. If
  `content-system/` contains subfolders with their own `distribution.md`, the
  skill refuses to run without this flag.

## Process

### Step 0 — Preflight

1. Confirm the working directory is the granted-folder root. Read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. Detect per-BU layout — `ls content-system/*/distribution.md`. If any match, `--bu` is required; abort with the BU list if missing.
4. Resolve and Read the `--piece` file. Verify it exists and is a content draft (has content-piece frontmatter). If it is a stub or missing — abort with a clear message.
5. **Connector check** — determine whether a channel connector's MCP tools are present for the target channel. Record the result; it sets the ship mode (connector-assisted vs manual hand-off).

### Step 1 — Resolve the channel

1. Read the piece's `content_type` from its frontmatter.
2. Read the BU's `content-system/[<bu>/]distribution.md`. Find the row for that content type — its primary + secondary channels, cadence, image dimensions, hashtag policy.
3. If `--channel` was given, verify it appears in `distribution.md` for this content type; if not, warn and ask. If `--channel` was omitted, use the primary channel and state it.
4. If `distribution.md` is absent, fall back to own-blog only and tell the user (per the `aos-draft-content` distribution contract).

### Step 2 — Prepare the channel-formatted version

Produce the **publish-ready** version of the piece for the resolved channel — the channel-format rules (length, structure, hashtag, link, image-spec handling per channel) are in `reference/channel-formats.md`. The format pass must **not break brand voice**: run the `brand/VOICE.md` banned-words / register check on the formatted output, exactly as `aos-draft-content` does. Write the formatted version alongside the source piece — naming and placement rules in `reference/channel-formats.md`.

### Step 3 — Advance status + log

1. **Catalogue status.** Read `content/CATALOGUE.md`, find the piece's row, and advance its status: `draft → scheduled` (prepared, awaiting publish) or `scheduled → published` (confirmed live). Never downgrade a status; never skip straight to `published` without user confirmation that the piece went live. Rewrite the catalogue with `Edit`. The status-transition rules are in `reference/channel-formats.md`.
2. **Captain's log.** Append a ship entry to `CAPTAINS_LOG.md` (granted-folder root) — date, piece, channel, the status transition, connector-assisted or manual hand-off, and who/what publishes. The log-entry format is in `reference/channel-formats.md`.
3. Present the channel-formatted version + the proposed status change to the user — Accept / Revise / Regenerate — before writing.

## Output Sections

User-facing summary at end of run:

- Channel resolved + why (from `distribution.md`)
- Connector status — connector-assisted or manual hand-off
- The publish-ready file path
- Status transition applied in `content/CATALOGUE.md`
- For manual hand-off — the exact next step the human takes to publish
- **What did we get wrong? What's missing?**

## Provenance

The channel-formatted version this skill writes carries the **standard
provenance block** in its frontmatter — see `docs/artifact-versioning.md` §1.
Stamp all four fields:

```yaml
generated_by: <this skill's name>      # the name: frontmatter value
skill_version: <this skill's version>  # the version: frontmatter value
generated_date: <YYYY-MM-DD>           # the date written
aos_schema: <schema-version>           # read from AOS_CONFIG.md
```

`content/CATALOGUE.md` and `CAPTAINS_LOG.md` are running indexes / logs, not
generated artifacts — they are not stamped with the block; they are updated in
place.

## Hard Rules

1. **Never autonomously publish.** The skill prepares and hands off. A piece moves to `published` only on explicit user confirmation that it went live.
2. **Degrade, never fail, when no channel connector exists.** Manual hand-off is the normal path — prepare the file and instruct the user.
3. **Voice survives the format pass.** Run the `brand/VOICE.md` banned-words / register check on the channel-formatted output; rewrite any hit before write.
4. **Never downgrade a status.** `published` is terminal; `scheduled` never returns to `draft` via this skill.
5. **Channel comes from `distribution.md`.** Do not invent a channel the BU's `distribution.md` does not declare.
6. **Per BU.** For multi-BU clients, ship per BU — never mix a BU's piece onto another BU's channel.
7. **Single client.** Operate only within the granted folder; never reach outside it.
8. **Discovery, not pronouncement.** Present the formatted version + status change for confirmation before writing.

## Integration

- **Upstream:** `aos-draft-content` (produces the draft this ships); `aos-plan` (the plan that called for the content); `aos-route-question` routes "ship this" / "publish" / "get this out" requests here.
- **Downstream:** `aos-measure` reads results for pieces marked `published` here and emits FNDs; `aos-catalogue` re-indexes `content/` and preserves the `published` status this skill set.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring. The distribution stage of the AOS loop (architecture-gaps §1). Channel-format rules likely need refinement after first real runs; channel-connector integration is intentionally minimal until per-client connector endpoints are confirmed (AOS-724).

**What did we get wrong? What's missing?**
