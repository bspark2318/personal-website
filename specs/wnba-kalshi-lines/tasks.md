# Tasks: WNBA Kalshi Lines

<!-- Ordered, ≤1h each, each verifiable. [P] = parallelizable. -->

**Plan:** ./plan.md

## Tasks

- [x] **T01** — Capture trimmed Kalshi events fixture; `kalshi.ts` (normalizeName, lowest-rung transform, fetchKalshiLines) + tests. (FR-001/006, AC3)
  - Files: `src/lib/kalshi.ts`, `src/lib/kalshi.test.ts`, `src/lib/__fixtures__/kalshi-events.json`
  - Verify: `npm run test` green incl. A'ja-style normalization + min-strike pick.
- [x] **T02** — Page fetches lines in parallel; thread map through MatchupBoard to cards; render expanded-bottom row. (FR-002/004/005, AC1)
  - Files: `src/app/wnba/page.tsx`, `src/components/wnba/MatchupBoard.tsx`, `src/components/wnba/PlayerLogTable.tsx`
  - Verify: dev page expanded card shows `Kalshi 15+ · yes …` for a matched player; no rec language.
- [x] **T03** — Failure path + gates + push. (AC2)
  - Files: —
  - Verify: fetch forced to fail → page renders identical; test + tsc + lint green; pushed.

## Rules

1. One logical change per task.
2. Run the verify check before checking off.
3. Blocked >15 min → update spec/plan, re-derive.
