# Releasing the AOS plugin

Cowork caches an installed plugin at the **repo level** — a new tag, branch,
GitHub Release or ZIP on the *same* repo does **not** make Cowork pull the
update; it keeps serving the cached version. The only thing that works is a
**completely new repo**.

So the distribution model is: **one new repo per version, with the version in
the repo name.**

## The method

`arcanianHQ/aos-cowork-plugin` is the **dev / source** repo — all development,
PRs and history live here. Each released version also gets its own
**install-snapshot repo**:

```
arcanianHQ/aos-cowork-<major>-<minor>-<patch>
```

e.g. `aos-cowork-0-42-0` for v0.42.0. The version is in the repo name, so the
marketplace URL is new every release and Cowork's repo cache is bypassed.

The snapshot repos are install artifacts only — **never develop on them.**

## Steps

1. **Dev repo** — bump `aos/.claude-plugin/plugin.json`, add a `CHANGELOG.md`
   entry, open a PR, merge to `main`.
2. **Tag** — `git tag -a vX.Y.Z -m "…"` then `git push origin vX.Y.Z`.
3. **Snapshot repo** — create it and push `main` + the tag via a temporary
   remote:
   ```
   gh repo create arcanianHQ/aos-cowork-<x>-<y>-<z> --public \
     --description "AOS GTM Cowork plugin vX.Y.Z — Cowork install snapshot. Canonical dev repo: arcanianHQ/aos-cowork-plugin"
   git remote add dist https://github.com/arcanianHQ/aos-cowork-<x>-<y>-<z>.git
   git push dist main && git push dist vX.Y.Z
   git remote remove dist
   ```
4. **Hand out** the new repo URL. Users add it in Cowork → Plugins → Add
   marketplace, install `aos`, and **start a fresh session** — skills index at
   session start, so a changed skill surfaces only in a new session.

## The real fix

This per-version-repo dance disappears with an **org / Team marketplace** or the
Anthropic plugin directory, where auto-update works and no URL ever changes.
Move there when the cohort size makes the manual dance too costly.
