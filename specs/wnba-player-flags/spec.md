# Spec: WNBA Player Flags

<!-- WHAT & WHY. No tech — that's plan.md. Unknowns → [NEEDS CLARIFICATION: q]. Fewest words possible. -->

**Status:** approved

## Problem

The board shows raw form but doesn't call out conditions that swing props: fatigue, hot/cold streaks, injuries. Reading them off the tables is manual.

## User stories

- [ ] I want a tired-looking player flagged so I can fade her props.
- [ ] I want hot/cold streaks flagged so I don't have to eyeball the bars.
- [ ] I want to know if a starter is injured/questionable before trusting her numbers.

## Functional requirements

Defaults below are starting thresholds — tunable in one place.

- **FR-001:** MUST flag **Fatigue** when any of: (a) heavy recent load — L3 avg minutes ≥ season avg + 4; (b) team on B2B (rest ≤ 1 day); (c) minutes climbing — L3 avg minutes ≥ L10 avg + 3.
- **FR-002:** MUST flag **Hot** when L3 avg pts ≥ 1.25 × L10 avg (min 8 pts L10 avg); **Cold** when L3 ≤ 0.75 × L10 avg.
- **FR-003:** MUST show **injury status** (e.g. Out, Day-to-Day) with short note when the data source reports one for a starter.
- **FR-004:** Flags render as an **icon + detail row** in the player card, with the triggering numbers (e.g. "Fatigue — 36.2 min L3 vs 31.5 season").
- **FR-005:** Flags are computed in the daily snapshot (pre-game, same freshness as the rest of the board).

## Key entities

- **Flag:** type (fatigue | hot | cold | injury), reason text with numbers.
- **PlayerLog:** gains flags + season avg minutes + injury status.

## Acceptance criteria

1. Given a starter whose L3 minutes exceed her season avg by ≥4, her card shows a Fatigue row with both numbers.
2. Given a team on a B2B, all its starters show the B2B fatigue reason.
3. Given L3 pts ≥ 1.25× L10, a Hot row shows; ≤ 0.75×, a Cold row shows.
4. Given a starter listed as injured by the source, her card shows status + note.
5. Flag math is unit-tested against fixtures.

## Edge cases

- Fewer than 3 recent games (early season, return from injury) — skip load/streak flags rather than mislead.
- Multiple flags at once — stack rows.
- Injury data missing/stale from source — show nothing rather than "healthy".

## Out of scope

- Predictions/probabilities from flags; betting advice.
- Menstrual-cycle or other non-public health inference.
- Practice reports, beat-writer news — structured source data only.

## Open questions

<!-- None. -->
