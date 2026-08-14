# Plan: WNBA Kalshi Lines

<!-- HOW. Needs approved spec. Obey constitution. Fewest words possible. -->

**Spec:** ./spec.md

## Approach

- New `src/lib/kalshi.ts`: thin fetch (Kalshi public API, no auth) + pure transform, tested.
- Fetch **server-side in the page** (already `force-dynamic`) in parallel with the snapshot read — lines are live per load; failure → `null`, board unchanged.
- One API call: `GET /trade-api/v2/events?series_ticker=KXWNBAPTS&status=open&with_nested_markets=true` → per player, take the rung with **min `floor_strike`**, price from `yes_bid`/`yes_ask` cents.
- Match by normalized name (lowercase, strip accents/apostrophes/punct) from `yes_sub_title` "Name: 20+" ↔ snapshot player name.
- UI: one muted row at the **bottom of the expanded card**: `Kalshi 15+ · yes 78¢ · L10 21.3`. No rec language.

## Architecture

```
/wnba page ─┬─ readSnapshot (Neon, daily)
            └─ fetchKalshiLines() → Map<normName, KalshiLine>   [live, no-store]
                  ↓ props
MatchupBoard → PlayerLogTable (expanded bottom row)
```

## Alternatives

| Option | Rejected because |
|--------|------------------|
| Store lines in snapshot | Stale by tip-off; spec wants live |
| Client-side fetch from browser | CORS risk, exposes call pattern; server fetch is one hop |
| Orderbook endpoint for depth | Only need one price; events call is one request |

## Stack & deps

- No new deps.

## Structure

```
src/
  lib/kalshi.ts        # fetchKalshiLines + normalizeName + pickLowestRung (tested)
  lib/kalshi.test.ts
  lib/__fixtures__/kalshi-events.json
  app/wnba/page.tsx    # parallel fetch, pass lines map
  components/wnba/MatchupBoard.tsx      # thread lines to cards
  components/wnba/PlayerLogTable.tsx    # expanded bottom row
```

## Data & interfaces

```ts
KalshiLine { player: string, threshold: number,   // floor_strike rounded up (15)
             yesBid: number|null, yesAsk: number|null, ticker: string }
fetchKalshiLines(): Promise<Map<string, KalshiLine> | null>  // key = normalized name
normalizeName("A'ja Wilson") === "aja wilson"
```

## Risks

- **Ticker/series rename** (unofficial-ish stability). Mitigation: isolated in kalshi.ts; null on failure.
- **Prices null pre-trading** (probed). Mitigation: show threshold without price (`yes —`).
- **Name mismatch edge** (Jr., diacritics). Mitigation: normalize both sides; unmatched → row absent (spec FR-005).

## Verification

- Unit tests: normalizeName, lowest-rung pick, transform on captured fixture (AC3).
- Dev page: expanded card shows Kalshi row for matched player (AC1); simulate fetch failure → identical board (AC2).
- Grep UI strings: no rec language (AC4). Gates: test + tsc + lint (touched files).
