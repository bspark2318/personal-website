# Spec: WNBA Kalshi Lines

<!-- WHAT & WHY. No tech — that's plan.md. Unknowns → [NEEDS CLARIFICATION: q]. Fewest words possible. -->

**Status:** approved

## Problem

Comparing the board's stats to Kalshi's lines means flipping between tabs. Show the live lines next to the numbers they should be judged against.

## User stories

- [ ] I want each starter's points (and reb/ast if listed) O/U line on her card, next to her averages.
- [ ] I want the game-total line next to the board's implied total.
- [ ] I want the raw differential (line vs L10 avg) computed for me — judgment stays mine.

## Functional requirements

- **FR-001:** MUST fetch Kalshi WNBA player-points markets live on page load; stats remain the daily snapshot. (Probed: only points ladders exist — no reb/ast or game-total markets; winner markets out of scope.)
- **FR-002:** MUST show only the LOWEST rung of each player's ladder (e.g. `15+ · yes 78¢`) with her L10 avg beside it, rendered at the BOTTOM of the expanded player card (collapsed card unchanged).
- **FR-004:** MUST NOT recommend bets — no "+EV"/"take this" labels; differentials are neutral numbers.
- **FR-005:** Unmatched player or absent market → show nothing for it; Kalshi API failure → board renders unchanged (lines are additive).
- **FR-006:** Player↔market matching by name from `yes_sub_title` (probed format: "Allisha Gray: 20+"), tolerant of accents/apostrophes (A'ja Wilson).

## Key entities

- **MarketLine:** market type (pts | reb | ast | total), subject (player or game), line value, yes/no prices, ticker.
- **CardLine:** MarketLine + differential vs the relevant stat.

## Acceptance criteria

1. Game day with Kalshi markets live: starter cards show the lowest-rung line with price next to L10 avg.
2. Kalshi down/empty → page identical to today's (no errors, no gaps).
3. Differential math unit-tested.
4. No recommendation language anywhere.

## Edge cases

- Player listed on Kalshi but not a projected starter (or vice versa).
- Ladder thresholds vary per player; always take the lowest rung.
- Off-day: no market fetch at all.

## Out of scope

- Placing/tracking bets; account linking; prices beyond the line + last price.
- Any EV/probability modeling or bet recommendations.
- Non-WNBA markets.

## Open questions

<!-- None. Probed 2026-08-13: series KXWNBAPTS, events per game, markets per player-threshold with floor_strike; prices via yes_bid/yes_ask (last_price null pre-trading). -->
