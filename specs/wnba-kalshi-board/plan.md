# Plan: WNBA Kalshi Board

<!-- HOW. Needs approved spec. Obey constitution. Fewest words possible. -->

**Spec:** ./spec.md

## Approach

- New route `/wnba` in the existing Next.js app (same repo, same deploy).
- Data from **ESPN's unofficial public JSON API** (scoreboard, rosters, athlete game logs). Free, no key, no scraping.
- **Snapshot engine, in-app:** daily cron-triggered route fetches ESPN once pre-game, writes snapshot to **Neon**. Page reads DB only — fast, and survives ESPN mid-day breakage.
- Pure logic (log filtering, vs-opponent filter, team trends, starter selection) in `src/lib/wnba.ts` with Vitest coverage; fetch layer thin and separate.
- Starters proxied as **top 5 by season avg minutes** per team (ESPN has no pre-game starter feed).

## Architecture

```
Vercel cron (daily, pre-game)
  └─ /api/wnba/snapshot  — lib/wnba-api.ts fetches ESPN (scoreboard → rosters → gamelogs)
                           → lib/wnba.ts transforms → INSERT snapshot (Neon)
/wnba page (server component)
  └─ SELECT today's snapshot → components/wnba/ (MatchupCard, PlayerLogTable, TeamTrends, NoGames)
```

Page never calls ESPN. Missing snapshot → on-demand build once, then serve from DB.

## Page design

**Layout: game tabs + detail** (one game at a time).

- **Top:** horizontal pill picker of today's games (`NYL @ LVA · 7:00`); first game selected by default. Animated selection (framer-motion), swipe/scroll on mobile.
- **Detail:** trends strip on top. Mobile: away/home segmented tabs, one team's five full-width starter cards at a time (position order). sm+: five player-vs-player rows, starters zipped into positional pairs (away | home). Pairing is approximate (minutes-proxy starters, hybrid positions).
- **Player card:** name, L10 averages (pts/reb/ast), pts sparkline for last 10, vs-opponent line ("vs LVA: 24, 19, 27"). Tap → expands to full 10-row log table.
- **Bottom strip:** team trends side-by-side — last-5 W/L dots, avg for/against, avg margin, implied combined total.
- **States:** skeleton while loading; "No games today" empty state; error card if snapshot missing/failed.
- Style: existing site's Apple-ish look — Tailwind, restrained motion, dark-mode aware.

## Alternatives

| Option | Rejected because |
|--------|------------------|
| stats.wnba.com official API | Aggressive bot-blocking, brittle headers |
| Paid API (sportsdata.io etc.) | Costs money for a personal tool |
| Cache-only, no DB | Cold-cache = slow ~100-fetch page load; no resilience/history |
| Separate snapshot microservice | Second deploy + auth for a daily 100-call fetch; no benefit |
| Vercel Blob JSON instead of Neon | Viable, but Neon already wired; SQL enables history queries |
| Scrape HTML | Fragile vs stable JSON endpoints |

## Stack & deps

- **No new deps.** Next 16 / React 19 / Tailwind 4 / framer-motion already present.

## Structure

```
src/
  app/wnba/page.tsx            # server page, reads snapshot from Neon
  app/api/wnba/snapshot/route.ts  # cron target: fetch ESPN → transform → store
  lib/wnba-api.ts              # ESPN fetchers
  lib/wnba.ts                  # pure transforms (tested)
  lib/wnba.test.ts
  lib/wnba-db.ts               # Neon read/write
  components/wnba/MatchupCard.tsx
  components/wnba/PlayerLogTable.tsx
  components/wnba/TeamTrends.tsx
  components/Nav.tsx           # add /wnba link
vercel.json                    # cron schedule
```

## Data & interfaces

```ts
Game       { id, home: TeamRef, away: TeamRef, tipoff: string, status }
PlayerLog  { playerId, name, games: GameLine[] }        // last 10
GameLine   { date, opponent, pts, reb, ast, min }
TeamTrend  { teamId, lastResults: ('W'|'L')[], avgFor, avgAgainst, avgMargin }
Matchup    { game, home/away: { starters: PlayerLog[], trend: TeamTrend, vsOpp: GameLine[][] } }
```

DB: one table `wnba_snapshots(date pk, data jsonb, created_at)` — whole day's matchups as one JSON blob. No relational schema until history queries need it.

vs-opponent = filter full-season gamelog by today's opponent (no extra endpoint).

## Risks

- **ESPN API is unofficial** — shape can change. Mitigation: thin fetch layer, typed parse in one file, page degrades to error state.
- **Starter proxy wrong** (injuries, lineup changes). Mitigation: label as "projected starters (by minutes)".
- **Cron misses / snapshot absent.** Mitigation: page falls back to building snapshot on demand, then serves from DB.

## Verification

- AC1/AC3: visit `/wnba` on a game day (matchups + tipoffs) and off day ("no games today") — mock scoreboard fixtures in tests.
- AC2: Vitest on `wnba.ts` transforms with fixture gamelogs (last-10 slice, vs-opp filter, trends math, top-5-minutes).
- AC4: spot-check rendered numbers vs ESPN.com.
- Gates: `npm run test`, `npm run lint`. Read `node_modules/next/dist/docs/` before implementing.
