# AOS plugin — architecture: open gaps & developed designs

The Cowork-plugin scaffold is structurally sound but incomplete. This document
**develops** each open architecture gap into a design — the approach, the
mechanism, the owning ticket. Companion to `aos-cowork-merged-architecture.md`.

---

## 1. Close the loop — pipeline → operating system

**Gap.** The flow is one-way: onboard → catalogue → discover → brand → content →
*stop*. AOS is a GTM *operating system* — which is a loop.

**Developed design.** Add the missing stages + the feedback edge:

- **`plan`** (workflow) — between brand docs and content: turns the brand profile
  + content-system into a prioritised plan, emitting `REC`s.
- **`distribute`** (workflow) — ships a content piece per its BU's
  `content-system/<bu>/distribution.md`; updates `content/CATALOGUE.md` status.
- **`measure`** (workflow) — reads results from Databox for shipped content /
  campaigns and **emits `FND`** (findings).
- **Feedback edge** — `measure`'s findings land in `ontology/findings/` and feed
  the next `discover` / `plan` cycle.

Developed pipeline:
`onboard → catalogue → discover → brand → plan → content → distribute → measure → FND ↺`

**Owner:** new workflows under AOS-728; the loop is the through-line.

---

## 2. Operationalise the ontology

**Gap.** Skills declare `ontology: consumes/emits` but nothing maintains the
FND/REC graph; the operator world used hooks, dead in Cowork.

**Developed design.** Maintain the graph **in-skill**:

- **Emission** is an explicit pipeline band-F step — a skill that `emits` an
  FND/REC writes the artifact (convention: `ontology/README.md`).
- An **`ontology` maintenance skill** (sibling of `aos-catalogue`) scans
  `findings/` + `recommendations/`, walks the edges, writes `ontology/INDEX.md`.

This is the mechanism that carries learning around the §1 loop.

**Owner:** new skill — file under AOS-721.

---

## 3. Fill the workflow tier

**Gap.** Router ✓ and building-blocks ✓, but ~0 `class: workflow` skills.

**Developed design.** Build the initial workflow set: one per active 7+1 layer,
the cross-layer **diagnostic** workflow, and the pipeline-stage workflows from §1
(`plan`, `distribute`, `measure`). Each chains building blocks with declarative
`safety.requires_confirmation` gates (the `run-campaign` pattern).

**Owner:** AOS-728.

**Status — CLOSED (Milestone 1).** Reconciled honestly: §3 was written before the
loop and the diagnostics existed. The workflow tier is now complete **via the
loop + orchestrators** — `aos-plan` / `aos-draft-content` / `aos-review` /
`aos-distribute` / `aos-measure` (loop stages), `aos-build-brand-system`
(discover/brand), `aos-diagnose-7layer` / `aos-analyze-gtm` / `aos-diagnose-funnel`
/ `aos-diagnose-lifecycle` (the cross-layer + focused diagnostics), and
`aos-catalogue` / `aos-index-ontology` / `aos-migrate` (maintenance). The
"one workflow per active layer" ask is satisfied by routing each layer's work
through the loop stage that owns it — no standalone per-layer workflows were
added (they would duplicate the loop). The only genuine net-new workflow §3 still
needed was the quality gate — `aos-review` (§7). See `docs/the-loop.md` →
"The workflow tier".

---

## 4. Cadence / recurring architecture

**Gap.** AOS does recurring work (briefings, catalogue + discovery refreshes);
the plugin has no scheduled-workflow design.

**Developed design.** A `schedules.md` in the data folder (or an `AOS_CONFIG`
block) lists `workflow: cadence` pairs — e.g. `monday-brief: weekly`,
`catalogue: weekly`, `discover-refresh: monthly`. Cowork's `/schedule` runs them
**while the desktop app is open**; any unattended-critical job is flagged as
needing a server-side runner (it won't fire reliably in Cowork).

**Owner:** AOS-735.

**Status — CLOSED (Milestone 1).** Built as a `schedules:` block in
`AOS_CONFIG.md` (not a separate `schedules.md` — a standalone file would compete
with `AOS_CONFIG.md` as a second source of install config). `aos-onboard` seeds
the block commented-out; the user uncomments the rows they want. Cadence
vocabulary: `daily`/`weekly`/`monthly`/`quarterly`. Cowork's `/schedule` fires
them while the app is open; unattended-critical jobs carry `runner: server` —
a documented escalation, since the client-run plugin has no backend. No skill was
added (the mechanism is config + the runtime's own scheduler). See
`docs/cadence.md`.

---

## 5. Data-folder migration

**Gap.** The plugin versions forward (we've added `inbox/` typing, `content/`,
catalogues, `TASKS.md`); an existing granted folder doesn't get the new structure.

**Developed design.** `AOS_CONFIG.md` carries a `data-schema-version`. Band-C
preflight compares it to the plugin's; if behind, route to a **`migrate` skill**
that applies the structural diff **non-destructively** — add new dirs/files,
never delete or overwrite client data. Each plugin release ships its schema delta.

**Owner:** new skill — file under AOS-721.

---

## 6. Multi-BU model

**Gap.** `content-system/<bu>/` and `content/<bu>/` are per-BU; `brand/`,
`dictionaries/`, `ontology/` are unresolved.

**Developed design — the resolution rule:**

- **Per-BU nesting** (`<bu>/`) applies to `content-system/`, `content/`, and
  `brand/` — but `brand/<bu>/` **only when BUs are genuinely distinct brands**
  (the Deluxe case); a single-brand multi-BU client keeps one `brand/`.
- **Per-client** for `dictionaries/` and `ontology/` — entries carry a
  `business_unit` field instead of nesting.
- `client/CLIENT_CONFIG.md` declares the BU model (single-brand vs distinct-brand).

**Owner:** a `data-folder-spec.md` amendment.

---

## 7. Verification / QA layer

**Gap.** Outputs have approval gates but no quality check.

**Developed design.** A **`review` workflow** — before an artifact moves
`draft → in-review / published`, it is checked against: the brand profile
(voice + positioning adherence), the `content-system` contract, and completeness.
The plugin analogue of the ADF verification gate.

**Owner:** AOS-738.

**Status — CLOSED (Milestone 1).** Built as `aos-review` (`class: intelligence`,
`domain: quality`) — the loop's quality gate, sitting between `content` and
`distribute`. It checks one artifact against the three contracts and issues a
`PASS` / `REVISE` / `BLOCK` verdict with a review report in
`deliverables/<YYYY-MM>/`. Wired into `aos-route-question`'s routing table;
`aos-distribute` Step 0 now requires a `PASS` review before it ships a piece.
See `skills/aos-review/`.

---

## 8. Stage 1→3 data-migration seam

**Gap.** No defined path for a client's data moving operator-run → client-run
(data-flow map §6, seam #1).

**Developed design.** A **`graduate`** path: on the operator surface, export the
client's data into a granted-folder-shaped bundle; the client's `aos-onboard`
detects the bundle and imports it instead of instantiating an empty template.
Extends `finalize-engagement`.

**Owner:** data-flow-map §6 seam #1 — file under AOS-721.

---

## Ticket summary

| Gap | Owner |
|---|---|
| 1 Loop · 3 Workflow tier · 7 Review | AOS-728 |
| 2 Ontology · 4 Cadence · 5 Migration · 8 Graduate | new tickets under AOS-721 |
| 6 Multi-BU | `data-folder-spec.md` amendment |
