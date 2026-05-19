# AOS plugin — install & first run

How to install the AOS GTM plugin, run first-time setup, connect data sources,
and what to do when something looks wrong.

## Install

The repo is a **single-plugin marketplace** — root `.claude-plugin/marketplace.json`
lists the `aos` plugin (in `aos/`).

### Claude Code (terminal)

```
claude plugin marketplace add arcanianHQ/aos-cowork-plugin
claude plugin install aos@aos-cowork
```

### Claude Cowork (desktop)

Cowork → **Plugins** → **`+`** → **Add marketplace** → the repo URL, then
install **`aos`**. Works on the **Pro** plan. Use the **latest versioned repo**
— `github.com/arcanianHQ/aos-cowork-<major>-<minor>-<patch>` (e.g.
`aos-cowork-0-42-0`), not the `aos-cowork-plugin` dev repo. Why a versioned
repo: see `docs/releasing.md` and the update note in Troubleshooting.

### Local dev / testing

```
claude --plugin-dir <path>/aos-cowork-plugin/aos
```

After install, confirm: `claude plugin validate <path>/aos-cowork-plugin/aos`
should report **Validation passed**.

## First run — `aos-onboard`

Say *"set me up"* (or run `aos-onboard`). It will:

1. **Locate the granted folder** — grant Cowork a folder for AOS, ideally inside
   your Google Drive for Desktop directory so it is cloud-synced and backed up.
2. **Choose the storage layout** — by default every data zone lives in the
   granted folder; accept this unless you have a reason not to.
3. **Instantiate** the data structure + write `AOS_CONFIG.md` — or, if you have
   an operator-exported **graduate bundle**, import it instead (Stage 1→3).
4. **Capture client context** + the communication / content languages.
5. **Connect Databox** and set the recurring-work cadence.

The granted folder is the **system of record** — plain files, one client per
folder. Layout: `docs/data-folder-spec.md`.

## Connectors

Bundled in `.mcp.json`: **Databox**, **HubSpot**, **SEMrush**, **ActiveCampaign**
(single connection). Authorise each via OAuth in Cowork → Settings → Connectors
on first use. A connector counts as connected only if its MCP tools are present
in the session — skills degrade gracefully when one is absent. Full model:
`docs/connectors.md`.

## Verify it works

- *"what can you do"* → `aos-route-question` gives the layer-indexed overview.
- `docs/quickstarts.md` → a quickstart for every skill.

## Troubleshooting — known gotchas

**The plugin won't update after a push.** A plugin installed from a *personal*
marketplace in Cowork (Pro / individual) does **not** auto-update — the "Update"
button stays inactive. And Cowork caches an installed plugin at the **repo
level**: a new tag, branch, GitHub Release or ZIP on the **same repo** does not
refresh it. **Each version must ship as its own new repo**, with the version in
the repo name — `arcanianHQ/aos-cowork-<major>-<minor>-<patch>` (e.g.
`aos-cowork-0-42-0` for v0.42.0). Add that new repo URL as a marketplace,
install `aos`, and **start a new Cowork session** — skills index at session
start, so a changed skill surfaces only in a fresh session. The full release
procedure is in `docs/releasing.md`. Reliable *auto*-update (no repo change at
all) needs an **org marketplace** (Team/Enterprise) or the Anthropic directory.

**A skill says "URL not in provenance set."** Cowork's `web_fetch` only retrieves
URLs that appeared in a **user message**. A skill that harvests a live page
(e.g. `aos-build-brand-system`'s website pass) will **ask you to paste the URL
into chat** — paste it, and it fetches in the same turn. This is a Cowork runtime
rule, not an error. See `docs/connectors.md`.

**A scheduled job didn't run.** Cowork's `/schedule` fires a job **only while the
desktop app is open**. Unattended-critical jobs cannot be guaranteed by the
client-run plugin — see `docs/cadence.md`.

**A skill refuses with "folder not onboarded" / "brand profile incomplete."**
That is a deliberate gate, not a bug — run `aos-onboard`, or
`aos-build-brand-system` to complete the 9-file profile, as the message says.

**The data folder predates the plugin.** `aos-onboard` / `aos-route-question`
detect a folder behind the plugin's schema and route you to `aos-migrate` — run
it before other workflows.

**Reporting anything else.** Use `aos-feedback` (*"report feedback"*) — it
captures a structured report and formats the email to `aos-support@arcanian.ai`.
See `docs/feedback.md`.
