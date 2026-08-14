# Plan: WNBA Player Flags

<!-- HOW. Needs approved spec. Obey constitution. Fewest words possible. -->

**Spec:** ./spec.md

## Approach

- Everything needed for load/streak flags is **already in the snapshot** (last10 has min+pts, PlayerLog has season avgMinutes, trend has restDays). Flags = pure function over existing data.
- Injuries: one extra ESPN call per team (`/teams/{id}/roster`, probed: `athletes[].injuries[].status`) during snapshot build → map athleteId → status.
- `computeFlags(player, trend)` in `src/lib/wnba.ts` with thresholds as one exported const; unit-tested. Called in `buildSnapshot`; flags stored on each starter.
- UI: flag rows (icon + reason with numbers) in `PlayerLogTable` under the stat lines.

## Architecture

```
buildSnapshot (wnba-api.ts)
  ├─ fetchRoster(teamId) → injuries map          [new fetch]
  └─ per starter: computeFlags(log, trend, injury) → PlayerLog.flags
PlayerLogTable → renders flags[] as icon+detail rows
```

Old snapshots without `flags` → render nothing (optional field).

## Alternatives

| Option | Rejected because |
|--------|------------------|
| Compute flags client-side at render | Duplicates logic outside tested lib; snapshot is the contract |
| Injury via separate injuries endpoint | Roster call already has status; one source |

## Stack & deps

- No new deps.

## Structure

```
src/
  lib/wnba.ts          # Flag type, THRESHOLDS, computeFlags()
  lib/wnba.test.ts     # flag unit tests
  lib/wnba-api.ts      # fetchRoster + wire into buildSnapshot
  components/wnba/PlayerLogTable.tsx  # flag rows
```

## Data & interfaces

```ts
Flag       { type: "fatigue"|"hot"|"cold"|"injury", reason: string }
PlayerLog  { ..., flags?: Flag[] }
THRESHOLDS { heavyLoadDelta: 4, climbDelta: 3, hotMult: 1.25, coldMult: 0.75, minPtsBase: 8, b2bRest: 1, minGames: 3 }
```

Reasons carry numbers: `"36.2 min L3 vs 31.5 season"`, `"L3 21.3 pts vs L10 14.8"`, `"B2B"`, `"Out (ESPN)"`.

## Risks

- **Injury feed staleness** — show status+date source only; never infer "healthy". Mitigation: omit row when absent.
- **Threshold noise** (flags everywhere or nowhere). Mitigation: single THRESHOLDS const, easy retune.

## Verification

- Unit tests per flag rule + <3-games skip (AC1–3, AC5) against synthetic fixtures.
- Rebuild snapshot on dev → inspect a flagged card; injury row visible for a listed player (AC4).
- Gates: `npm run test`, lint clean for touched files.
