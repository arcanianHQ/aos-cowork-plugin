---
scope: int-company
---

# The autonomous revision micro-loop

Companion to `SKILL.md`. The detailed procedure for the **reject door's**
autonomous draft↔review iteration — the F2 behaviour (AOS-848, milestone
*13. Agentic behaviour*).

Before F2, a `REVISE` verdict handed the piece back and stopped — the human
re-invoked `aos-draft-content`, then re-invoked `aos-review`. The micro-loop
removes that plumbing: on a `REVISE` whose issues are **piece-local**,
`aos-review` re-drafts and re-reviews itself, looping until `PASS`, a structural
`BLOCK`, the iteration cap, or a no-progress break — and presents the **final**
outcome with the full iteration log, not each intermediate turn.

It does **not** remove the human from the calibration loop: foundation edits
still gate (Hard Rule 10 stands), and a `BLOCK` always escalates.

## The two issue classes

Every `REVISE` issue is one of:

- **Piece-local** — the foundation is *correct*; this draft simply failed to
  honour it. A banned word that *is* in `brand/VOICE.md`'s list but slipped
  through; a section the content-type structure calls for that is missing; an
  off-register passage where the register in `messaging.md` is right. Fixable by
  **re-drafting from the unchanged foundation**. The micro-loop owns these.
- **Foundation-level** — the foundation itself is wrong or incomplete. A banned
  phrasing that keeps appearing because `VOICE.md` never names it; a register
  the draft keeps missing because `messaging.md` describes it loosely. Fixable
  only by **editing the foundation** — which gates to the user (the reject door's
  classify → propose → confirm flow). The micro-loop does **not** auto-apply
  these.

The micro-loop does not pre-label every issue. It uses a **repeat detector**:
an issue assumed piece-local on one turn that *survives a re-draft* is, by
evidence, foundation-level — the foundation did not constrain it well enough.

## The loop

```
REVISE (iteration i)
   │
   ├─ BLOCK at any point? ──────────────▶ stop · escalate to user immediately
   │
   ├─ i ≥ max-iterations? ──────────────▶ stop · escalate (best draft + persistent issues)
   │
   ├─ any issue repeats from i−1? ──────▶ stop autonomous loop ·
   │                                       run the reject-door foundation flow
   │                                       (classify → propose → user-confirm) ·
   │                                       then resume the loop from the re-draft
   │
   └─ all issues fresh & piece-local ──▶ re-draft from the current foundation
                                          (invoke aos-draft-content with the
                                           issue list as revision input) ·
                                          re-review · i++
PASS ─────────────────────────────────▶ exit loop · present final verdict + log
```

### Step by step

1. **Iteration 1.** A `REVISE` verdict with no prior iteration to compare
   against. Treat all issues as piece-local: re-draft from the current
   foundation, re-review. (A `BLOCK` here escalates immediately — never
   auto-fixed.)
2. **Iteration 2+.** Before re-drafting, diff this turn's issue list against the
   previous turn's:
   - **A repeated issue** (same contract line failed again) → that issue is
     foundation-level by evidence. Stop the autonomous loop. Run the reject
     door's classify → propose → **user-confirm** foundation flow for the
     repeated issue(s). Once the user confirms the foundation edit, resume the
     loop with a re-draft from the *corrected* foundation.
   - **Only fresh issues** (new, or the prior ones resolved) → still
     piece-local; re-draft and re-review again.
3. **The cap.** `--max-iterations` (default **3**) bounds the autonomous turns.
   At the cap with a `REVISE` still standing, stop and escalate: present the
   best draft so far, the persistent issues, and the iteration log — the human
   decides (accept-with-note, manual edit, or send to the foundation flow).
4. **No-progress break.** If a re-draft does not reduce the issue count *and*
   introduces no resolved issues, do not spend the remaining iterations — break
   early and escalate. A loop that is not converging is a foundation problem.

## What the user sees

The micro-loop is autonomous *between* turns, not *through* the gates:

- **Intermediate iterations are not presented** — they run; their reviews are
  logged, not gated. This is the autonomy F2 buys.
- **The final outcome is always presented** — `PASS`, cap-reached, no-progress,
  `BLOCK`, or a foundation-edit gate — with the **iteration log**: per
  iteration, the verdict, the issues, what the re-draft changed.
- **Every foundation edit still gates.** Hard Rule 10 is not weakened — the
  micro-loop simply detects *when* a foundation edit is needed (the repeat
  detector) instead of asking the human to notice it.
- **`--no-auto-revise`** disables the loop entirely — a `REVISE` then behaves
  as in v0.2.0 (hand back, stop). Use it when the operator wants to drive each
  revision by hand.

## The iteration log

Appended to the review report (`review-report-template.md` carries the
section). One row per iteration:

| Iter | Verdict | Issues | Re-draft change | Outcome |
|------|---------|--------|-----------------|---------|
| 1 | REVISE | 3 (2 voice, 1 completeness) | re-drafted from VOICE.md + structure | → iter 2 |
| 2 | REVISE | 1 (voice — repeated) | — | repeated → foundation gate |
| 3 | PASS | 0 | re-drafted from corrected VOICE.md | cleared |

The log is the honest record of how the verdict was reached — never collapse it
to just the final verdict.

## Guardrails

- **`BLOCK` is never auto-fixed.** A structural fault (off-positioning, an
  inaccurate product claim, material incompleteness) escalates the moment it
  appears — the micro-loop is for `REVISE` only.
- **The cap is hard.** Never exceed `--max-iterations`. An un-converged loop is
  escalated, not extended.
- **Foundation edits gate — always.** The repeat detector decides *when* to
  propose a foundation edit; the user still decides whether to *apply* it.
- **The accept door is unaffected.** A `client-accepted` piece runs the accept
  door (Step 5) — the micro-loop is a reject-door mechanism only.
- **One client.** Every iteration stays within the granted folder.
