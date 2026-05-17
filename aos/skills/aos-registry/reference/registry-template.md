---
scope: int-company
---

# Registry template

Companion to `aos-registry/SKILL.md`. The shell for `client/REGISTRY.md`.

```markdown
---
scope: int-confidential
client: <slug>
generated_by: aos-registry
skill_version: <this skill's version>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
status: confirmed-by-user
---

# Registry — <Client Display Name>

> **What this is.** The engagement's directory — the people, the business units,
> the accounts, and where the systems live. Pointers only — **never credentials**.
> Built by `aos-registry`; re-run to refresh.

## People

| Name | Role | Decision power | BU(s) | Notes |
|------|------|----------------|-------|-------|
| … | … | primary / approver / influencer / contributor | … | … |

## Business units

| BU slug | Domain | What it is | ICP / pole | Notes |
|---------|--------|------------|------------|-------|
| … | … | … | … | … |

_(Single-BU client: one row — the brand itself is the unit.)_

## Account map

The external accounts that belong to the client. Account **name / ID** only —
no credentials.

| Platform | Account name / ID | Serves BU | Connector wired? | Notes |
|----------|-------------------|-----------|------------------|-------|
| Databox | … | … | yes / no (`.mcp.json`) | … |
| ActiveCampaign | … | … | … | single AC connection (Cowork) |
| Google Ads | … | … | … | … |
| HubSpot | … | … | … | … |
| … | … | … | … | … |

## Access dashboard

Where the systems live and who holds access. URLs and owners only — **no
passwords, keys, or tokens.**

| System | URL / surface | Access held by | Notes |
|--------|---------------|----------------|-------|
| Website (live) | … | … | … |
| Website admin / CMS | … | … | … |
| Analytics | … | … | … |
| Email / automation | … | … | … |
| Ad platforms | … | … | … |
| Where credentials are held | <e.g. a password manager — name it, not its contents> | … | the pointer, never the secret |

---
Last registered: <YYYY-MM-DD>  ·  <N> people  ·  <N> BUs  ·  <N> accounts

**What did we get wrong? What's missing?**

<Which accounts have no ID yet? Which systems have no access owner? Mark every
unknown field "not yet known" — never guess an ID or an owner.>
```

## Notes

- The **account map** is what connector-aware skills read to answer "is this the
  client's account?" — keep the account name / ID accurate and current.
- The **"Where credentials are held"** row names the *vault* (a password manager,
  a 1Password vault) — it never holds the credential itself.
- Re-run `aos-registry` whenever a connector is added, a BU changes, or a person
  joins / leaves the engagement.
