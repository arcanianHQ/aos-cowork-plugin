# The AOS loop

AOS is a Go-To-Market **operating system** — and an operating system is a loop,
not a one-way pipeline. This doc describes the loop the plugin's skills form, and
the **feedback edge** that closes it.

This is the build of architecture-gaps §1 (close the pipeline → operating system)
and §2 (operationalise the ontology). Companion to `architecture-gaps.md` and
`aos-cowork-merged-architecture.md` (ADF repo).

## From pipeline to loop

The scaffold's flow was one-way and stopped:

```
onboard → catalogue → discover → brand → content → ✗ stop
```

The loop adds the missing stages — `plan`, `distribute`, `measure` — and the
**feedback edge** from `measure` back to `discover` / `plan`:

```
  onboard → catalogue → discover → brand → plan → content → distribute → measure
                            ▲                                              │
                            └──────────────── FND feedback edge ───────────┘
```

Read as a loop: each turn through it leaves the engagement knowing more than the
last, because `measure` writes down what was learned and `plan` reads it back.

## The stages and their skills

| Stage | Skill(s) | Class | Produces |
|-------|----------|-------|----------|
| onboard | `aos-onboard` | system | the granted folder, `AOS_CONFIG.md` |
| catalogue | `aos-catalogue` | reading | `inbox/` + `content/` `CATALOGUE.md` |
| discover | `aos-build-brand-system`, `aos-diagnose-*`, `aos-analyze-gtm` | intelligence | the diagnosed picture; FND / REC |
| brand | `aos-build-brand-system` (+ `aos-build-brand`, `aos-build-offer`, `aos-build-belief-profile`) | intelligence | the 9-file `brand/` profile |
| **plan** | **`aos-plan`** | intelligence | `deliverables/<YYYY-MM>/gtm-plan.md`; **REC** artifacts |
| content | `aos-draft-content` | content | content pieces / series in `content/` |
| **distribute** | **`aos-distribute`** | content | channel-formatted publish-ready pieces; `CATALOGUE.md` status advanced |
| **measure** | **`aos-measure`** | intelligence | `deliverables/<YYYY-MM>/results.md`; **FND** artifacts |

The ontology graph is maintained across all of it by **`aos-index-ontology`**
(`class: reading`) — the §2 mechanism (below).

## The feedback edge — how the loop closes

The loop is closed by a concrete chain of artifacts in the `ontology/` zone — not
by hooks (Cowork has none) and not by a runtime, but by skills reading and
writing files:

1. **`aos-measure` emits findings.** After content / campaigns ship, `aos-measure`
   reads the results and writes `FND-NNN-*.md` artifacts into `ontology/findings/`.
   Each FND carries a **forward signal** — a plain statement of what the next
   cycle should do with it — and an open `emits: []` edge (a *leaf*: nothing
   consumes it yet).

2. **`aos-index-ontology` makes the edge visible.** It walks the `consumes` /
   `emits` edges and writes `ontology/INDEX.md`, which surfaces the
   **unactioned-findings list** — every open FND that no REC consumes yet. That
   list is the planner's in-tray; it is how a measured learning is *seen*.

3. **`aos-plan` reads the findings back.** On its next run, `aos-plan` treats open
   FNDs in `ontology/findings/` as a **first-class planning input** (its
   "finding-first" candidate lens). A measured under-performance becomes a
   prioritised move. The REC `aos-plan` emits `consumes:` the FND — which closes
   the edge: the leaf now has a parent, and `INDEX.md` moves the finding from
   *unactioned* to *actioned*.

4. **`discover` also consumes findings.** A finding that points at a structural
   problem (a cross-layer suspicion) feeds the next round of diagnosis —
   `aos-diagnose-7layer` / `aos-diagnose-funnel` / `aos-diagnose-lifecycle`.

```
aos-measure ──emits──▶ ontology/findings/FND-NNN
                              │
        aos-index-ontology walks the edge ──▶ INDEX.md: "unactioned finding"
                              │
        aos-plan reads it ──▶ REC-NNN (consumes: FND-NNN) ──▶ TASKS.md ──▶ next cycle
```

That is the whole feedback edge. It is files, read in a defined order, by skills
whose frontmatter declares the `ontology: consumes/emits` contract.

## §2 — operationalising the ontology

Skills declare `ontology: consumes/emits`, and the artifact-emitting skills write
FND / REC / GOT artifacts as an explicit step (pipeline band F — deliverable +
emit; convention in `ontology/README.md`). But the *graph* of those artifacts —
the `consumes` / `emits` edges — needs maintaining, and the operator world did it
with hooks, which are dead in Cowork.

So the graph is maintained **in-skill**: `aos-index-ontology` (sibling of
`aos-catalogue`) scans `ontology/findings/` + `ontology/recommendations/` +
`ontology/gotchas/`, walks the edges, and writes `ontology/INDEX.md`. Re-run it
after artifacts change. The index is what carries learning around the §1 loop —
without it, an FND would sit in a folder unread.

## Running the loop

The loop is not run end-to-end in one invocation — each stage is a routed skill,
and `aos-route-question` is the front door. A typical turn through the loop:

1. `aos-plan` — what should we do this month? → a prioritised plan + RECs.
2. `aos-draft-content` — draft the content the plan calls for.
3. `aos-distribute` — ship each piece to its channel; advance `CATALOGUE.md`.
4. *(time passes — the content runs)*
5. `aos-measure` — read the results; emit FNDs.
6. `aos-index-ontology` — rebuild `INDEX.md`; see the new unactioned findings.
7. back to `aos-plan` — now reading the findings from step 5.

Each loop closes a little tighter than the last. That is the difference between a
pipeline and an operating system.
