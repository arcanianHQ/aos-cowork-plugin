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
depends_on: 7LAYER_DIAGNOSTIC.md
---

# Constraint Map — <Client Display Name>

> **What this is.** The named bottlenecks that keep this business's marketing system from functioning. Derived from the 7-layer diagnostic — the primary constraint anchors everything else.

## Primary constraint

**Name:** <short, memorable label — e.g., "Founder = bottleneck for all positioning decisions">
**Layer:** L<n>
**Classification:** <Hard / Soft / Inferred> — per UNVERIFIED_ASSUMPTIONS_RULE
**Evidence:**
- [SRC: <citation>] <quoted observation>
- [SRC: <citation>] <quoted observation>

**Why this is THE one:** <one paragraph explaining why fixing this unlocks the cascade>

**If we fixed only this:** <what we'd expect to see change in 30/60/90 days>

## Secondary constraints

### Constraint 2 — <label>

**Layer:** L<n>
**Classification:** <Hard / Soft / Inferred>
**Evidence:** [SRC: <citation>]
**Dependency on primary:** <does fixing primary auto-fix this? Or does this also need direct attention?>

### Constraint 3 — <label>

**Layer:** L<n>
**Classification:** <Hard / Soft / Inferred>
**Evidence:** [SRC: <citation>]
**Dependency on primary:** <...>

## Reasoning chain

<For each constraint: constraint X → symptom Y → measurable metric Z. Make the logic explicit so it can be challenged.>

## What is NOT the constraint

<Items the team or stakeholders sometimes blame that are actually downstream symptoms. Naming these explicitly saves repeated debates.>

- <symptom often blamed> — actually downstream of <real constraint>
- <symptom often blamed> — actually downstream of <real constraint>

---

**What did we get wrong? What's missing?**

<Where could this map be incomplete? Which voices on the team haven't weighed in yet?>
