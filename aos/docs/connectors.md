# AOS plugin — connectors

How the AOS Cowork plugin uses MCP connectors. Principle: **connectors reach
genuinely-remote data sources only — never AOS's own storage** (that's the
granted folder). The set is deliberately minimal and GTM-focused.

## Core — bundled in `.mcp.json`

Installed by default; the client authorises each via OAuth on first use.

| Connector | Endpoint | For |
|---|---|---|
| Databox | `https://mcp.databox.com/mcp` | analytics / metrics |
| HubSpot | `https://mcp.hubspot.com/anthropic` | CRM, leads, campaigns |
| Semrush | `https://mcp.semrush.com/v1/mcp` | SEO / competitive / keyword data |
| Google Ads | no vendor-hosted MCP — **gap** (see below) | paid-search data |
| GA4 | no vendor-hosted MCP — **gap** (see below) | web analytics |

**Google Ads / GA4 — documented gap (AOS-724).** As of 2026-05, Google ships no
official vendor-hosted MCP server for Google Ads or GA4. They are therefore
**not bundled**. Two follow-up paths, neither blocking the plugin: (a) adopt a
community / BYO MCP per client if one matures, added to that client's
`.mcp.json`; (b) until then, paid-search and web-analytics signal reaches the
plugin through **Databox** (which aggregates both) — so `aos-measure` and the
diagnostics are not blocked.

**Semrush — bundled.** Vendor-hosted streamable HTTP MCP per
[Semrush MCP docs](https://developer.semrush.com/api/introduction/semrush-mcp/).
OAuth or API-key auth depending on the client runtime.

## Conditional — per client (NOT bundled)

Kept as options — added to a specific client's `.mcp.json` **only if that client
uses the tool**. Not bundled by default (minimal-connector principle).

| Connector | Endpoint | Add when the client… |
|---|---|---|
| ActiveCampaign | `https://<account>.activehosted.com/api/agents/mcp/http` | uses ActiveCampaign for email / automation / CRM |
| Canva | `https://mcp.canva.com/mcp` | produces visual content assets |
| Slack | `https://mcp.slack.com/mcp` | wants briefs / reports delivered to Slack |
| Meta Ads | endpoint TBD | runs Meta advertising |

**ActiveCampaign — per-account, never bundled.** ActiveCampaign's Remote MCP is
**vendor-hosted per account** — each account is its own subdomain
(`https://<account>.activehosted.com/api/agents/mcp/http`; see
[ActiveCampaign Remote MCP](https://developers.activecampaign.com/page/mcp)).
There is **no universal endpoint**, so AC cannot ship in the bundled `.mcp.json`
— a placeholder host (`YOUR_ACCOUNT…`) is not even a valid URL and fails plugin
validation. Instead, **`aos-onboard` adds it per client**: if the client uses
ActiveCampaign, onboarding captures their account slug (e.g. `wellis14726` from
`wellis14726.activehosted.com`) and the user adds a custom remote-MCP connector
in Settings → Connectors with that account's URL. One AC account per install;
multi-account management is Code-only (`COWORK_FEATURE_CATALOGUE.md` §6).

## Excluded — not used

Out of AOS's GTM domain, or superseded by a decision:

- **QuickBooks · PayPal · Stripe · Square** — accounting / payments, out of domain.
- **DocuSign** — contracts, out of domain.
- **MS365 · Gmail · Google Calendar** — productivity, not GTM-core.
- **Google Drive** — superseded: storage is the granted folder, not a connector
  (`DECISIONS_2026-05-15_aos-cowork-no-control-layer.md` §7).

## The WebFetch provenance gate (Cowork)

`WebFetch` is not a connector, but it is how skills reach live web pages — and on
Cowork it carries a constraint worth flagging here. Cowork's `web_fetch` only
retrieves URLs that **appeared in a user message** (or in a prior `web_fetch`
result). A URL a skill derived itself — read from `DOMAIN_CHANNEL_MAP.yaml`, or
picked from an options list — is refused: *"URL not in provenance set."*

So any skill that harvests a live page (e.g. `aos-build-brand-system`'s website
harvest) must **ask the user to paste the URL into chat**, then fetch it in the
same turn. See `aos-build-brand-system` Step 2b. Tracked: AOS-746.

## Endpoint confirmation (AOS-724 / AOS-797)

- **Bundled, confirmed:** Databox (`https://mcp.databox.com/mcp`), HubSpot
  (`https://mcp.hubspot.com/anthropic`), Semrush (`https://mcp.semrush.com/v1/mcp`)
  — all vendor-hosted with a single universal endpoint, in `.mcp.json`.
- **Documented gap:** Google Ads, GA4 — no vendor-hosted MCP exists (see the
  Core table note above); Databox covers the signal in the interim.
- **Conditional, per-client:** **ActiveCampaign** — per-account, no universal
  endpoint, so not bundleable; `aos-onboard` adds it for a client that uses AC.
  Canva and Slack have vendor-hosted endpoints; Meta Ads stays unconfirmed — all
  added per-client only if and when the client needs them.
- **Excluded by architecture:** Supabase and Google Drive are *not* connectors —
  the plugin has no control layer and storage is the granted folder
  (`DECISIONS_2026-05-15_aos-cowork-no-control-layer.md` §7). The original
  AOS-724 scope predates that decision.

> **Remaining acceptance item:** live authentication of each bundled connector
> inside a real Cowork session (OAuth handshake + a data round-trip) is a manual
> QA step — it cannot be verified from Claude Code / a terminal.
