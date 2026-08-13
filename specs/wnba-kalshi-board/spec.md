# Spec: WNBA Kalshi Board

<!-- WHAT & WHY. No tech — that's plan.md. Unknowns → [NEEDS CLARIFICATION: q]. Fewest words possible. -->

**Status:** approved

## Problem

Researching WNBA player props on Kalshi means bouncing across stats sites. Need one page that shows today's matchups with the exact player/team numbers that inform bets.

## User stories

- [ ] I want to open the site on game day and see today's games as matchups.
- [ ] I want, per matchup, each key player's recent form (last N games), head-to-head vs today's opponent, and team trends — without clicking around.
- [ ] I want the stats framed around the markets I trade: player points, rebounds/assists, game totals/spread.

## Functional requirements

- **FR-001:** MUST list today's WNBA games (matchups + tip-off times).
- **FR-002:** MUST show, per matchup, each starter's game log for their last 10 games (points, rebounds, assists at minimum).
- **FR-003:** MUST show starter performance vs today's specific opponent (head-to-head history).
- **FR-004:** MUST show team-level trends (recent W/L form, scoring totals, margins).
- **FR-005:** MUST show a "no games today" message when none are scheduled.
- **FR-006:** MUST surface stats relevant to totals/spread markets (combined scores, margins).
- **FR-007:** Stats are a pre-game snapshot, current as of that day. No live in-game updates.

## Key entities

- **Game:** two teams, date, tip-off time.
- **Matchup view:** a game + its players' stat panels.
- **Player game log:** per-game points/rebounds/assists rows.
- **Team trend:** team's recent results, totals, margins.

## Acceptance criteria

1. Given games today, when I open the site, then each game appears with both teams and tip-off time.
2. Given a matchup, when I view it, then I see each starter's last-10 log, vs-opponent history, and both teams' trends on one screen.
3. Given no games today, then a "no games today" message shows and nothing else game-related.
4. All displayed stats match the official source for that date.

## Edge cases

- Season off-days / offseason (no games for months).
- Player with no history vs opponent (rookie, new team).
- Postponed/cancelled games.
- Doubleheaders / many games in one day.

## Out of scope

- Placing or tracking Kalshi bets; any Kalshi integration.
- Predictions, projections, betting advice.
- Live play-by-play.
- Accounts/auth — open to you + friends.
- Non-WNBA leagues.
- Bench/full-roster stats — starters only.
- Live in-game updates.

## Open questions

<!-- None. -->
