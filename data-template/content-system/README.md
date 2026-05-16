# content-system/ — per-business-unit content foundation

One folder per business unit, each holding the 4-file content foundation:

- `pillars.md` — the 3–5 topics the BU should own
- `messaging.md` — the BU's messaging / voice register
- `products.md` — the BU's product & service catalog
- `distribution.md` — where each content type ships, per channel

This is what the `content-draft` skill composes from. The layout contract is
`skills/content-draft/reference/content-system-contract.md`.

Populated by the content pipeline: `build-brand-system` (brand docs) →
`content-draft` (content). For a multi-BU client, each BU gets its own folder.
