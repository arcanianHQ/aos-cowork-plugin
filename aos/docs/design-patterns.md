# AOS plugin — design patterns

The patterns the AOS plugin follows, distilled from Anthropic's `small-business`
plugin cluster (`anthropics/knowledge-work-plugins`, dissected in
`docs/cowork-plugin-anatomy.md`, ADF repo) and adapted to AOS. Every skill or
workflow added under AOS-725 / AOS-728 should follow these.

## 1. Three-layer skill architecture

Router → workflow → building-block. The **router** maps a request to one
workflow; a **workflow** chains **building-block** skills. AOS adds a shared
**7+1 layer index** that the router, workflows, and building blocks all key off.
(`small-business`: smb-router → 15 commands → 15 skills.)

## 2. The router does no work

`aos-route-question` routes only — it never pulls data or drafts output. It recommends
**one** thing with a one-line why, asks to confirm, never dumps a menu. Overviews
are grouped by the 7+1 layers, not an ad-hoc list.

## 3. Approval gates between steps

A workflow chains building blocks with an explicit **gate** between each step —
never auto-progress past a checkpoint. `small-business` does this in prose
("wait for explicit approval"); AOS does it **declaratively** via
`safety.requires_confirmation` in frontmatter. Anything mutating external state
confirms first.

## 4. Hard gates on prerequisites

Beyond step gates, a workflow hard-gates on prerequisites. `aos-build-brand-system`
will not let downstream content run until the brand profile is 7/7 complete. In
AOS this is **preflight** (`preflight:` frontmatter, pipeline band C) — check
client config, the data structure, and required connectors *before* doing work.

## 5. Progressive disclosure via `reference/`

Keep `SKILL.md` lean — the procedure only. Push depth into `reference/`:
`gotchas.md`, `examples/`, integration docs, file-templates. Loaded on demand,
not into every context. (Seen across `small-business` skills and the ported
`aos-build-brand-system` / `aos-draft-content`.)

## 6. Connector-aware graceful degradation

Before routing into or running a workflow, check the connectors it needs
(`.mcp.json`). Never half-fail silently — if a connector is missing, say so up
front and offer a degraded fallback if one exists.

## 7. A dedicated onboarding skill

First-run setup is its own skill (`aos-onboard`, cf. `smb-onboard`): connect
tools, instantiate the data structure, capture client/BU/domain/channel context,
set a cadence. Onboarding is a routed destination, never assumed.

## 8. Generic skill + per-client customization

Skills ship **generic**. Per-client specialization is **config and data**, never
forked skill logic. The client's granted folder (`CLIENT_CONFIG.md`,
`DOMAIN_CHANNEL_MAP.yaml`, `brand/`, `content-system/`) carries the
specialization; the skill stays one. (AOS rule: no per-client scripts.)

## 9. Frontmatter / provenance discipline

Every skill declares `name`, `description`, `owner`, `scope`, `class`, `domain`,
`allowed-tools` plus the AOS superset (`ontology`, `safety`, `preflight`,
`flavor`, `layer`). The official Anthropic loader reads what it needs and ignores
the rest — one skill file, valid on every surface.

---

Upstream reference: the cluster lives at `~/Sites/knowledge-work-plugins/`;
`docs/cowork-plugin-anatomy.md` (ADF repo) is the full dissection.
