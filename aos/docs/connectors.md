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
| Google Ads | endpoint TBD — confirm in AOS-724 | paid-search data |
| GA4 | endpoint TBD — confirm in AOS-724 | web analytics |

## Conditional — per client (NOT bundled)

Kept as options — added to a specific client's `.mcp.json` **only if that client
uses the tool**. Not bundled by default (minimal-connector principle).

| Connector | Endpoint | Add when the client… |
|---|---|---|
| Canva | `https://mcp.canva.com/mcp` | produces visual content assets |
| Slack | `https://mcp.slack.com/mcp` | wants briefs / reports delivered to Slack |
| Meta Ads | endpoint TBD | runs Meta advertising |
| Semrush | endpoint TBD | wants SEO / competitive data |
| ActiveCampaign | endpoint TBD | runs email marketing / automation on ActiveCampaign |
| Todoist | endpoint TBD | manages tasks in Todoist (sync with `TASKS.md`) |

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

## Endpoint confirmation

The Google Ads, GA4, Meta Ads, Semrush, ActiveCampaign and Todoist MCP endpoints
are not yet confirmed — finalising them (and whether each is a vendor-hosted or community
MCP) is **AOS-724**.
