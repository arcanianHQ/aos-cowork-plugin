# Data-source readiness check — method

Step 4 of `aos-plan-databoards`. Turns the suite's *required-connector list*
(Step 3) into a verified `✓ / ✗ / ⚠` readiness table by checking the live
Databox account. Empirical only — Hard Rule 2.

## Databox present

1. **Pull connected sources.** Call the Databox MCP `list_data_sources`
   (read-only). It returns the data sources connected to the account, each with a
   vendor name and type.
2. **Normalise names.** `list_data_sources` returns *vendor* names; the
   required-connector list uses the *connector vocabulary* of
   `metric-source-map.md`. Normalise before diffing — common mappings:

   | Databox returns (vendor name) | Connector vocabulary |
   |---|---|
   | Google Analytics 4 / GA4 | GA4 |
   | Google Ads / AdWords | Google Ads |
   | Google Search Console | Google Search Console |
   | Facebook Ads / Meta Ads | Meta Ads |
   | LinkedIn Ads / LinkedIn Company Pages | LinkedIn Ads |
   | HubSpot CRM / HubSpot Marketing | HubSpot |
   | Stripe | Stripe |
   | ActiveCampaign | ActiveCampaign |
   | Mailchimp | Mailchimp |
   | Facebook Pages / Instagram / YouTube | Social |

   Match case-insensitively and on substring; a vendor name not in the table is
   carried through verbatim and matched directly.
3. **Diff** required vs connected:
   - **`✓ connected`** — the required connector is present in the normalised list.
   - **`✗ missing`** — required, not present.
   - **`⚠ partial`** — present, but with a caveat the planner can see: connected
     for only some of the accounts / properties / channels the suite needs (e.g.
     Google Ads connected for one of two ad accounts), or the source exists but
     the brand intelligence / session flags its data as stale or untrusted
     (e.g. broken conversion tracking — see `metric-source-map.md` caveats).
4. **Action item per `✗`.** State how to close it: connect it via `aos-onboard`,
   or add it in the Databox UI (Data Sources → New Connection). For Google Ads /
   GA4 specifically, note these have no vendor MCP — Databox *is* the integration
   path (`docs/connectors.md`).

## Databox absent

Degrade — Hard Rule 3. Do **not** call the MCP and do **not** emit `✓`/`✗`
statuses. Instead:

- Emit the required-connector list as an **unverified requirement** — "the suite
  needs: GA4, Google Ads, HubSpot …".
- Add the **"Data gap — Databox not connected"** callout to the plan.
- Recommend connecting Databox via `aos-onboard`, then re-running for a verified
  readiness table.

## Output shape

Feeds the *Data-source readiness* section of `DATABOARD_PLAN.md`
(`plan-template.md`):

```
| Connector | Status | Needed by | Action |
|-----------|--------|-----------|--------|
| GA4       | ✓ connected | Exec Overview, Channel Mix | — |
| Google Ads| ✓ connected | Paid Acquisition | — |
| HubSpot   | ✗ missing   | Funnel Health | Connect via aos-onboard |
| Meta Ads  | ⚠ partial   | Paid Acquisition | 1 of 2 ad accounts linked — add the second in Databox |
```
