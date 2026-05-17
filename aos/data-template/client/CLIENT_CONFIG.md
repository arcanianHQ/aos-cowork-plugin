# CLIENT_CONFIG — <client name>

The client profile. Read during preflight and context assembly.

## Identity
- **name**:
- **slug**:
- **business-units**:        # [] for single-BU; else the BU slugs
- **bu-model**:              # single-brand (one brand/) | distinct-brand (brand/<bu>/) — see docs/data-folder-spec.md "Multi-BU resolution". Leave blank / single-brand for a single-BU client.

## Engagement
- **aos-stage**:        # AOS productization stage (1 / 2 / 3)
- **phase**:
- **start-date**:

## Connectors

The connectors and paid overlays this client needs. `aos-onboard` reads this
block and wires exactly this set. It is the per-client connector definition —
and because it lives in the granted folder, every operator working this client
reads the same definition. See `docs/connectors.md`.

- **required**:        # connectors aos-onboard MUST wire — e.g. databox, hubspot
- **optional**:        # wire only if the client uses them — e.g. activecampaign
- **overlays**:        # paid product overlays this client is entitled to — e.g. aos-todoist-overlay

## Notes

<free-form context the workflows should know about this client>
