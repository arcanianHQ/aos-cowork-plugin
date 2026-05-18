# AOS client folder

This folder is one **AOS GTM client engagement** — the granted folder for a
Claude Cowork project. The `aos` plugin's skills operate on it.

## Session-start health check — do this FIRST

**Before running any AOS skill, run this check and surface anything off.**
Cowork has no session-start hook — this checklist is the guard.

1. **Schema currency (the gate).** Read `AOS_CONFIG.md` → `schema-version`. The
   plugin's schema version is the literal stated in `aos-migrate` /
   `aos-onboard`. If the folder's `schema-version` is **lower than the plugin's**
   → **STOP. Tell the user: "this folder is schema N, the plugin is M — run
   `aos-migrate` before anything else."** Do not run loop skills on a behind
   folder — they degrade silently (missing zones, stale config, drift). If the
   folder is *higher* than the plugin → advise updating the plugin.
2. **Plugin-version stamp.** Note `AOS_CONFIG.md` `plugin-version` vs the
   installed plugin; `aos-onboard` / `aos-migrate` refresh it.
3. **Connectors.** `client/CLIENT_CONFIG.md`'s `## Connectors` block lists the
   `required` connectors + paid `overlays`. Check they are actually connected
   (the MCP tools are present in the session) / installed. Flag any gap.
4. **Structure.** The `AOS_CONFIG.md` Zones manifest should list every zone
   folder present on disk. Flag drift.

If everything passes, proceed normally. If anything is off, surface it **before**
doing the work the user asked for — see `docs/preflight.md`.

## What this folder is

One client's AOS data. Resolve zones via the `AOS_CONFIG.md` Zones manifest;
client identity from `client/CLIENT_CONFIG.md` and the `client` field of
`AOS_CONFIG.md`. Never hard-code paths beyond the documented zone layout. Full
layout: the `aos` plugin's `docs/data-folder-spec.md`.
