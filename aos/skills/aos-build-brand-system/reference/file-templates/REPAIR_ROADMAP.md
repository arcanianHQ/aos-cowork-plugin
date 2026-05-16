---
scope: int-confidential
client: <slug>
generated_by: aos-build-brand-system   # provenance block — see docs/artifact-versioning.md
skill_version: <skill-semver>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
sources_consulted:
  - <path>:L<line>
status: confirmed-by-user
needs_refresh_by: <YYYY-MM-DD + 90 days>
depends_on: CONSTRAINT_MAP.md
---

# Repair Roadmap — <Client Display Name>

> **What this is.** The ordered fix sequence — which layer first, what success looks like at each phase, and who owns it. Derived from the constraint map.

## Sequencing principle

<One paragraph on why this order — usually: fix the primary constraint first, even if other things look more urgent, because unfixing primary first wastes the work on secondary fixes.>

## Phase 1 — <label> (weeks 1–<N>)

**Addresses:** Primary constraint (<short label from CONSTRAINT_MAP>)
**Owner:** <person / role>
**What gets done:**
- <action item>
- <action item>

**Success signal:** <how we'll know this phase worked — observable, ideally measurable>
**Stop signal:** <what would tell us to halt and re-diagnose instead of pushing through>

## Phase 2 — <label> (weeks <N>–<M>)

**Addresses:** <secondary constraint>
**Owner:** <person / role>
**What gets done:**
- <action item>
- <action item>

**Success signal:** <...>

## Phase 3 — <label> (weeks <M>–<P>)

**Addresses:** <next constraint / leverage move once primary is unlocked>
**Owner:** <person / role>
**What gets done:**
- <action item>

**Success signal:** <...>

## What's NOT in the roadmap (yet)

<Initiatives stakeholders may want included that we're deliberately deferring. Naming these prevents re-litigation every two weeks.>

- <deferred item> — defer until <which phase / which signal>
- <deferred item> — defer until <...>

## Re-diagnosis triggers

<What would cause us to throw out this roadmap and re-run the 7-layer diagnostic?>

- <market shift>
- <team change>
- <metric anomaly>

---

**What did we get wrong? What's missing?**

<Where could this sequencing be wrong? What dependencies might we have missed?>
