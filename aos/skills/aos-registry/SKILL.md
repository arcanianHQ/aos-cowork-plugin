---
name: aos-registry
description: "Maintain the client registry — the person + business-unit dictionary, the account map (which ActiveCampaign / Databox / ad accounts belong to the client), and the dashboard of system URLs and who has access. The Cowork-lite Access Dictionary. Trigger on 'build the registry', 'map the accounts', 'who has access to what', 'list the business units'."
scope: int-company
flavor: [company, advanced, internal]
class: reading
domain: discovery
layer: all
client-scope: single-client
version: 0.1.0
owner: arcanian
allowed-tools: [Read, Grep, Glob, Bash, Write, Edit]
args-hint: "(no args — operates on the granted folder; interactive where the harvest is thin)"
inputs:
  - client/CLIENT_CONFIG.md
  - client/DOMAIN_CHANNEL_MAP.yaml (domains + BUs)
  - client/REGISTRY.md (existing registry — refreshed in place)
  - AOS_CONFIG.md (connected zones)
  - .mcp.json (the connectors wired for this client — the account surfaces)
  - inbox/**/*.md (harvest — org docs, account references, access notes)
  - brand/BELIEF_PROFILE.md (named decision-makers — the person dictionary cross-reference)
outputs:
  - client/REGISTRY.md (the person + BU dictionary, account map, and access dashboard)
preflight:
  - client-config
ontology:
  consumes: []
  emits: []
privacy:
  enumerates-accounts: true
  cross-client-reads: false
safety:
  mode: mutates-state
  requires_confirmation: true
depends_on:
  - aos-onboard
tags: [registry, dictionary, accounts, access, reading, discovery]
---

## Data access

This skill's data lives in the **granted folder** — the folder Cowork was given access to, which **is** one client's folder. The granted-folder root is the working directory. Resolve zones (`client/`, `inbox/`, `brand/`, …) per `docs/data-access-router.md` and the `AOS_CONFIG.md` manifest. Never hard-code paths beyond the documented zone layout. Client identity is read from `client/CLIENT_CONFIG.md` and the `client` field of `AOS_CONFIG.md`.

## Language

Resolve `communication-language` from `AOS_CONFIG.md` (per `docs/language-context.md`) — never hard-code a language. Talk to the user in `communication-language`; the registry itself uses stable English field labels with values in whatever language the source uses.

## Purpose

`aos-registry` maintains the **client registry** — the single place that answers
*"who, which unit, which account, and where do I find it"* for the engagement.
It is the Cowork-lite **Access Dictionary**: three indexes in one file,
`client/REGISTRY.md`.

1. **Person + BU dictionary** — the people in the engagement (name, role,
   decision power) and the client's business units (slug, domain, what each is).
2. **Account map** — the external accounts that belong to the client:
   ActiveCampaign, Databox, ad accounts, the CRM — each with its name / ID and
   which BU it serves. This is what tells a skill *which* account is the client's.
3. **Access dashboard** — the system URLs and surfaces: where the website is
   hosted, where analytics live, the login URLs, and **who holds access** to each.

**Why it matters.** AOS skills repeatedly need to know "is this Databox account
the client's?", "which BU does this ad account belong to?", "where is the
website admin?". Without a registry every skill re-discovers it; with one, the
registry is read once and trusted.

**Anti-goal.** `aos-registry` is a `class: reading` index-builder — the sibling
of `aos-catalogue` (inbox/content) and `aos-index-ontology` (the FND/REC graph).
It indexes; it does not onboard (`aos-onboard`), connect accounts, or diagnose.

## Critical rule — no credentials

The registry records **pointers**, never **secrets**. Account names, account IDs,
URLs, and *who* has access — yes. Passwords, API keys, tokens, OAuth secrets —
**never**. A credential does not belong in a markdown file; if the user offers
one, decline it and record only the pointer (where the credential is held).

## Process

### Step 0 — Preflight

1. Confirm the working directory; read `AOS_CONFIG.md` for the zone manifest and `client` identity.
2. Verify `client/CLIENT_CONFIG.md` exists. If not — suggest `aos-onboard`.
3. **Pre-read `client/REGISTRY.md`** if it exists (the Write/Edit harness rule).

### Step 1 — Harvest

Gather what the granted folder already knows:

- **People** — `client/CLIENT_CONFIG.md`, `brand/BELIEF_PROFILE.md` (named
  decision-makers), `inbox/` org material.
- **BUs** — `client/DOMAIN_CHANNEL_MAP.yaml`, `content-system/*/` subfolders.
- **Accounts** — `.mcp.json` (the connectors wired), `AOS_CONFIG.md`, and any
  account references in `inbox/`.
- **Access / URLs** — domains, hosting, analytics, admin URLs mentioned anywhere.

### Step 2 — Fill the gaps interactively

Where the harvest is thin — an account with no ID, a system with no access owner,
a person with no role — **ask the user**. A registry of half-known entries is
worth less than a small complete one; mark a genuinely unknown field
*not yet known*, never guess an account ID or an access owner.

### Step 3 — Write the registry

Write / rewrite `client/REGISTRY.md` with three sections — person + BU
dictionary, account map, access dashboard — built to `reference/registry-template.md`.
Use `Edit` if the file pre-exists (Read first); `Write` only if genuinely new.
Present the registry to the user — Accept / Revise / Regenerate — before writing.

## Provenance

`client/REGISTRY.md` carries the **standard provenance block** in its frontmatter
— see `docs/artifact-versioning.md` §1 (`generated_by`, `skill_version`,
`generated_date`, `aos_schema`); never hard-code `skill_version` / `aos_schema`.
The file is `scope: int-confidential` — it enumerates the client's people and
accounts.

## Hard Rules

1. **No credentials, ever.** The registry holds pointers — names, IDs, URLs,
   access owners. Never a password, key, token, or secret.
2. **No guessed IDs.** An account ID, a BU domain, an access owner is recorded
   from the harvest or the user — an unknown field is marked *not yet known*.
3. **Confidential.** `client/REGISTRY.md` is `scope: int-confidential` — it
   enumerates people and accounts; it does not leave the granted folder
   unanonymised (see `aos-anonymize`).
4. **Index, don't act.** `aos-registry` reads and indexes — it does not connect
   an account, change access, or onboard.
5. **Single client.** Operate only within the granted folder. The account map is
   this client's accounts only — never another client's.
6. **Discovery, not pronouncement.** Present the registry for confirmation.

## Output Sections

- People + BUs indexed (counts)
- Accounts mapped (by platform, by BU)
- Access dashboard entries
- Gaps marked *not yet known*
- Registry path
- **What did we get wrong? What's missing?**

## Integration

- **Upstream:** `aos-onboard` (scaffolds `client/`); `.mcp.json` (the wired connectors); `aos-build-belief-profile` (named people); `aos-route-question` routes "map the accounts" / "who has access" here.
- **Downstream:** every connector-aware skill (`aos-measure`, the diagnostics, `aos-analyze-competition`) reads the account map to know which account is the client's; `aos-anonymize` is run before the registry is shared outside the engagement.
- **Sibling:** `aos-catalogue` (indexes `inbox/` + `content/`) and `aos-index-ontology` (indexes the FND/REC graph) — same `class: reading` index-builder pattern, applied to the client registry.

## Versioning

- **v0.1.0** — initial Cowork-plugin authoring (AOS-793, Milestone 4 feature wave). The Cowork-lite Access Dictionary — person/BU dictionary + account map + access dashboard. The full multi-client Access Dictionary is a Code-tier surface.

**What did we get wrong? What's missing?**
