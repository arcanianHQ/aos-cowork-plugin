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

## Notes

<free-form context the workflows should know about this client>
