# Tasks: Miami Trip Itinerary Page

<!-- Ordered, ≤1h each, each verifiable. [P] = parallelizable. -->

**Plan:** ./plan.md

## Tasks

- [x] **T01** — Read Next 16 docs: route handlers, dynamic `[slug]` params, client components (constitution mandate)
  - Files: `node_modules/next/dist/docs/01-app/…` (read only)
  - Verify: state in one paragraph what differs from trained knowledge (e.g., `params` as Promise)

- [x] **T02** — Types + trip registry skeleton: `Trip`, `Activity`, `CostItem`, `TRIPS` with `miami-2026` stub (crew names, empty sections) (FR-003)
  - Files: `src/lib/trips.ts`, `src/lib/trips-data.ts`
  - Verify: `npx tsc --noEmit` passes; `TRIPS["miami-2026"].crew.length === 8`

- [x] **T03** — Cost estimator math, TDD: tests first for `estimateCost(headcount, offActivityIds)` — 8pp all-on ≈ $1,000–1,250; headcount 6 raises fixed-split lines; clubs off drops total (FR-009, FR-010; AC-6, AC-7)
  - Files: `src/lib/trips.test.ts`, `src/lib/trips.ts`
  - Verify: `npm run test` green, incl. the three named cases

- [x] **T04** [P] — Anonymity/tally shaping, TDD: `shapeState(rsvps, votes, me)` → in-names only, out/maybe counts, per-activity counts, `me` block; vote toggle idempotent (FR-006; AC-3, AC-4, AC-5)
  - Files: `src/lib/trips.test.ts`, `src/lib/trips.ts`
  - Verify: `npm run test` green; test asserts no out/maybe/vote names in payload

- [x] **T05** — Full Miami content transcription into `trips-data.ts`: 9 sections, days, food list, activities (votable: boat, Everglades, Joe's, Oleta, 2 club nights), cost items with fixed-split/per-person kinds (FR-001)
  - Files: `src/lib/trips-data.ts`
  - Verify: `npx tsc --noEmit`; cost items sum matches budget table §7

- [x] **T06** — DB layer: ensure `trip_rsvps` + `trip_votes` (slug-scoped PKs), upsert/delete helpers, state read (FR-007)
  - Files: `src/lib/trips-db.ts`
  - Verify: scratch script against dev DATABASE_URL: upsert rsvp+vote, read back, toggle vote to null deletes row

- [x] **T07** — API routes: `GET state`, `POST rsvp`, `POST vote` under `/api/trips/[slug]/`, passcode header check, input validation, 404 unknown slug (FR-002, FR-004, FR-005)
  - Files: `src/app/api/trips/[slug]/{state,rsvp,vote}/route.ts`
  - Verify: `curl` matrix: no/wrong passcode → 401; bad slug → 404; bad body → 400; happy path mutates then `state` reflects it

- [x] **T08** — Page shell: `/trips/[slug]` client page — passcode gate (localStorage, showroom pattern), name picker, tab bar, framer-motion transitions; loading/empty/error states (FR-001a, FR-002, FR-003, FR-008; AC-1, AC-2)
  - Files: `src/app/trips/[slug]/page.tsx`, `src/components/trips/{PasscodeGate,NamePicker,TabBar}.tsx`
  - Verify: dev server — wrong passcode shows gate only; correct passcode + name persist across reload; tabs switch

- [x] **T09** — Content tabs: Overview / Days / Food / Nightlife rendering from trip data, Apple-style, mobile-first (FR-001, FR-008; AC-8)
  - Files: `src/components/trips/{OverviewTab,DaysTab,FoodTab,NightlifeTab,DayCard}.tsx`
  - Verify: iPhone-width DevTools — every tab readable, zero horizontal scroll

- [x] **T10** — RSVP tab: in/out/maybe buttons wired to API, tally display (in-names, anonymous counts), optimistic update (FR-004, FR-006; AC-3, AC-4)
  - Files: `src/components/trips/RsvpPanel.tsx`, page wiring
  - Verify: two browsers — browser A RSVPs "in" → name appears in B; A switches to "maybe" → B shows count only

- [x] **T11** [P] — Vote buttons on activities (Days tab): 👍/👎 toggle, anonymous counts, own vote highlighted (FR-005, FR-006; AC-5)
  - Files: `src/components/trips/VoteButton.tsx`, `DayCard.tsx`
  - Verify: two browsers — vote in A increments count in B with no name; re-tap removes vote, count decrements

- [x] **T12** [P] — Costs tab: estimator UI — headcount stepper, activity toggles, live per-person total + line breakdown, range labels (FR-009, FR-010; AC-6, AC-7)
  - Files: `src/components/trips/CostEstimator.tsx`
  - Verify: dev server — defaults show ~$1,000–1,250/pp; drop to 6 → house/boat lines rise; clubs off → total drops

- [x] **T13** — DB-unavailable degradation: state fetch fails → content tabs still render, RSVP/vote disabled with notice (edge case)
  - Files: `src/app/trips/[slug]/page.tsx`
  - Verify: dev server with DATABASE_URL unset — itinerary renders, voting UI shows disabled notice

- [x] **T14** — Quality gates + deploy: lint, tests, Vercel env (`TRIP_PASSWORD_MIAMI_2026`), smoke test prod link on phone
  - Files: none new
  - Verify: `npm run test` + `npm run lint` green; prod URL gated, RSVP round-trips on phone

## Rules

1. One logical change per task.
2. Run the verify check before checking off.
3. Blocked >15 min → update spec/plan, re-derive.
