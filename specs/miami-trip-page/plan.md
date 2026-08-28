# Plan: Miami Trip Itinerary Page

<!-- HOW. Needs approved spec. Obey constitution. Fewest words possible. -->

**Spec:** ./spec.md

## Approach

- Clone the **show-room pattern**: client page, env passcode sent as header, localStorage for passcode+name, Neon tables keyed by name.
- **Reusable from day one:** generic `/trips/[slug]` route + `trip_slug` column in tables; Miami is just the first entry in a trip registry. Content-in-DB is a later migration, not now.
- Itinerary content = static typed data module (`trips-data.ts`, keyed by slug) — organizer edits via code, no CMS.
- All logic (cost math, tally/anonymity filtering) in `src/lib/trips.ts` → Vitest per constitution.
- Tabs as client-side state (no sub-routes) — one page, phone-first, framer-motion transitions.
- Cost estimator is pure client computation over static cost items; no persistence.

## Architecture

```
/trips/[slug] (client page, tabs: Overview|Days|Food|Nightlife|Costs|RSVP)
  ├─ trip content: TRIPS registry in trips-data.ts, slug "miami-2026"
  ├─ localStorage: passcode, my-name (keyed per slug)
  ├─ GET  /api/trips/[slug]/state  ← rsvps (names only if "in") + vote counts + my votes
  ├─ POST /api/trips/[slug]/rsvp   ← {name, status: in|out|maybe}
  └─ POST /api/trips/[slug]/vote   ← {name, activityId, vote: up|down|null}
        all routes: x-trip-password header → passcode from trip registry env lookup
DB: trip_rsvps(trip_slug, name, status; PK(trip_slug,name))
    trip_votes(trip_slug, activity_id, name, vote; PK(trip_slug,activity_id,name))
```

- **Anonymity enforced server-side:** `state` returns in-names, anonymous out/maybe counts, per-activity counts, plus caller's own rows (caller name via header/query).

## Alternatives

| Option | Rejected because |
|--------|------------------|
| Server components + cookies auth | Show-room's client+header pattern already works; less new surface |
| One `state` route doing GET+mutations | Separate tiny routes match show-room convention, simpler handlers |
| Sub-routes per tab (`/miami/costs`) | Client tab state is simpler; no shareable-deep-link requirement |
| Content in DB (per user's hunch) | Only votes/RSVPs need shared writes; content-in-code = zero admin UI |

## Stack & deps

- Existing only: Next 16 app router, React 19, Tailwind 4, framer-motion, `@neondatabase/serverless`, Vitest. **No new deps.**

## Structure

```
src/
  lib/trips-data.ts            # TRIPS registry: typed itinerary content, activities, cost items (miami-2026 first)
  lib/trips.ts                 # cost estimator math, tally/anonymity shaping, types
  lib/trips.test.ts            # Vitest: cost math, anonymity filter, vote tallies
  lib/trips-db.ts              # neon: ensure tables, rsvp/vote upserts, state read (all slug-scoped)
  app/trips/[slug]/page.tsx    # client page: passcode gate → tabs; 404 unknown slug
  components/trips/*.tsx       # Tabs, DayCard, CostEstimator, RsvpPanel, VoteButton…
  app/api/trips/[slug]/state/route.ts
  app/api/trips/[slug]/rsvp/route.ts
  app/api/trips/[slug]/vote/route.ts
```

## Data & interfaces

- `Activity { id, day, title, votable }` · `CostItem { id, label, amount, kind: "fixed-split" | "per-person", activityId? }`
- `estimateCost(headcount, offActivityIds) → { perPerson, lines }` — fixed-split ÷ headcount + per-person items; club nights toggle independently.
- `State { ins: string[], outCount, maybeCount, votes: Record<activityId, {up, down}>, me?: {rsvp, votes} }`
- Ranged costs (e.g., clubs $300–450) → store midpoint, show range label. `[keep simple]`
- `Trip { slug, title, passcodeEnvKey, crew: string[], days, sections, activities, costItems }` — the registry shape future trips fill in.
- **Future migration (not now):** move `Trip` content from `trips-data.ts` into a `trips` JSONB table; API/page shapes already slug-scoped so only the read source changes.

## Risks

- **Next 16 breaking changes** → read `node_modules/next/dist/docs/` route-handler + client-component pages before coding (constitution mandate).
- **Content volume** (9 sections → data module) → biggest task is transcription, not code; keep prose as markdown-ish strings, don't over-model.
- **Name spoofing/collisions** → accepted in spec (8 friends, low stakes).

## Verification

- Vitest: estimator math (8pp ≈ $1,000–1,250; headcount 6 raises fixed splits; club toggle drops total), anonymity shaping (no out/maybe/vote names in payload), vote toggle idempotence.
- Manual: wrong passcode → gate only; two browsers → cross-device tally; iPhone-width DevTools → no horizontal scroll on any tab.
- `npm run test` + `npm run lint` green.
