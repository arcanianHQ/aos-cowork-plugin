---
scope: int-confidential
client: <slug>
generated_by: aos-analyze-competition   # provenance block — see docs/artifact-versioning.md
skill_version: <skill-semver>
generated_date: <YYYY-MM-DD>
aos_schema: <schema-version from AOS_CONFIG.md>
sources_consulted:
  - <path>:L<line>
  - semrush:<dashboard-or-metric>        # only when connected
connector_status: <semrush-connected | degraded-no-semrush>
status: confirmed-by-user
needs_refresh_by: <YYYY-MM-DD — per the cadence statement>
---

# Competitive landscape — <Client Display Name>

> **What this is.** The competitive field — who else competes for this client's
> customer, how each is positioned, what each does well and badly, and the
> positioning gaps the client can own. This is the same
> `brand/COMPETITIVE_LANDSCAPE.md` slot the `aos-build-brand-system` profile
> expects.

## Connector status

<SEMrush connected — keyword / traffic figures are [DATA].>
— or —
> **Data gap — SEMrush not connected.** Keyword / traffic figures could not be
> pulled. This map rests on scraped pages + manual research; keyword clusters are
> what manual research supports. Connect SEMrush for a metrics-grounded refresh.

---

## Competitor 1 — <name>  ·  DIRECT

- **Domain:** <domain>
- **Primary positioning:** <the position they hold — in their own homepage words>. [SRC: <citation>]
- **Key strengths:** <what they genuinely do well — observed>. [SRC: <citation>]
- **Observable weaknesses:** <gaps the site / data shows — not wishful thinking>. [SRC: <citation>]
- **Watch list:** <≥3 monitored pages or keyword clusters — URLs / keywords>.

## Competitor 2 — <name>  ·  DIRECT

<same structure>

## Competitor 3 — <name>  ·  DIRECT / INDIRECT

<same structure>

> Indirect alternatives — what else the customer hires for the same JTBD (a
> different category, a substitute, "do nothing") — listed with the same fields
> at whatever depth the evidence supports.

---

## Positioning gaps — the space the client can own

<The payoff. Positions no competitor in the field credibly holds, that the
client's POSITIONING.md + ICP.md say the client could hold. Each gap: the open
position, the evidence the field has left it open, and why the client can take
it. A sharp, high-confidence gap is also emitted as an FND for `aos-plan`.>

- **Gap:** <the open position> — <evidence none of the field holds it> — <why the client can>. [SRC: <citation>]

## Refresh cadence

<How often this file should be rebuilt — typically quarterly, or on a visible
competitor repositioning. Sets `needs_refresh_by`.>

---

**What did we get wrong? What's missing?**

<Which competitors are thinly evidenced? Where would SEMrush data change the
read? Which gap needs validation before it is planned against?>
