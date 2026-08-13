# Tasks: WNBA Kalshi Board

<!-- Ordered, ≤1h each, each verifiable. [P] = parallelizable. -->

**Plan:** ./plan.md

## Tasks

- [x] **T01** — Probe ESPN endpoints; capture real fixtures (scoreboard, league byathlete stats, athlete gamelog, team schedule) into `src/lib/__fixtures__/`. Note: no roster endpoint needed — `statistics/byathlete` (one league-wide call, sorted by avgMinutes, has teamId) covers starter selection.
  - Files: `src/lib/__fixtures__/*.json`
  - Verify: `curl` each endpoint returns 200; fixtures committed and parseable JSON. ✓
- [x] **T02** — Types + ESPN fetchers. (FR-001)
  - Files: `src/lib/wnba-api.ts`
  - Verify: temp script fetches today's scoreboard → logs games or empty list. ✓ (live vitest, 3 games)
- [x] **T03** [P] — Pure transforms + tests: last-10 slice, vs-opponent filter, team trends math, top-5-by-minutes starters. (FR-002/003/004/006, AC2)
  - Files: `src/lib/wnba.ts`, `src/lib/wnba.test.ts`
  - Verify: `npm run test` — transform tests pass against fixtures. ✓ (30 tests green)
- [x] **T04** — Neon table + read/write layer. Create `wnba_snapshots(date pk, data jsonb, created_at)`.
  - Files: `src/lib/wnba-db.ts`
  - Verify: script writes a fixture snapshot, reads it back identical.
- [x] **T05** — Snapshot route: fetch ESPN → transform → upsert Neon; secured for cron. (FR-007)
  - Files: `src/app/api/wnba/snapshot/route.ts`
  - Verify: `curl -X POST /api/wnba/snapshot` on dev → row in Neon with today's date.
- [x] **T06** — Vercel cron config, daily pre-game (ET morning).
  - Files: `vercel.json`
  - Verify: `vercel.json` schedule valid; deploy shows cron registered.
- [x] **T07** — `/wnba` page: read snapshot (build on demand if missing), game pill picker, loading/empty/error states. (FR-001/005, AC1, AC3)
  - Files: `src/app/wnba/page.tsx`, `src/components/wnba/NoGames.tsx`
  - Verify: game day → matchup pills + tipoffs render; mock empty scoreboard → "No games today".
- [x] **T08** — Matchup detail: starter columns + player cards (L10 avgs, sparkline, vs-opp line, expand to full log). (FR-002/003, AC2)
  - Files: `src/components/wnba/MatchupCard.tsx`, `src/components/wnba/PlayerLogTable.tsx`
  - Verify: card shows 10 rows on expand; vs-opp line matches fixture data.
- [x] **T09** [P] — Team trends strip (W/L dots, avg for/against, margin, combined total). (FR-004/006, AC2)
  - Files: `src/components/wnba/TeamTrends.tsx`
  - Verify: rendered numbers match hand-computed values from fixtures.
- [x] **T10** — Nav link + polish: framer-motion transitions, mobile layout, dark mode.
  - Files: `src/components/Nav.tsx`, wnba components
  - Verify: `/wnba` reachable from nav; mobile viewport stacks columns; `npm run lint` passes.
- [x] **T11** — Accuracy spot-check + gates. (AC4)
  - Files: —
  - Verify: 3 players' rendered L10 numbers match ESPN.com; `npm run test` + `npm run lint` green.

## Rules

1. One logical change per task.
2. Run the verify check before checking off.
3. Blocked >15 min → update spec/plan, re-derive.
