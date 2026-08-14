# Tasks: WNBA Player Flags

<!-- Ordered, ≤1h each, each verifiable. [P] = parallelizable. -->

**Plan:** ./plan.md

## Tasks

- [x] **T01** — Flag type + THRESHOLDS + `computeFlags()` (fatigue: heavy load / B2B / climbing; hot; cold; injury passthrough; skip when <3 games) with unit tests. (FR-001/002, AC1–3, AC5)
  - Files: `src/lib/wnba.ts`, `src/lib/wnba.test.ts`
  - Verify: `npm run test` — new flag tests green.
- [x] **T02** — `fetchRoster(teamId)` + injuries map; wire `computeFlags` into `buildSnapshot`. (FR-003/005)
  - Files: `src/lib/wnba-api.ts`
  - Verify: rebuild snapshot on dev → stored starters carry `flags`; a listed injury appears.
- [x] **T03** — Flag rows in player card: icon + reason, stacked, color per type. (FR-004)
  - Files: `src/components/wnba/PlayerLogTable.tsx`
  - Verify: flagged card renders icon + numbers; unflagged/legacy snapshot renders nothing.
- [x] **T04** — Rebuild prod-shape snapshot, eyeball `/wnba`, gates, push.
  - Files: —
  - Verify: `npm run test` + lint (touched files) green; flag rows visible on dev page; pushed.

## Rules

1. One logical change per task.
2. Run the verify check before checking off.
3. Blocked >15 min → update spec/plan, re-derive.
