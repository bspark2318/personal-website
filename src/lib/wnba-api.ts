// Thin ESPN fetch layer. All unofficial endpoints — isolate breakage here.

import {
  computeFlags,
  excludeOut,
  lastN,
  parseGamelog,
  parseGames,
  teamTrend,
  topStarters,
  vsOpponent,
  type Matchup,
  type MatchupSide,
  type Snapshot,
  type TeamRef,
} from "./wnba";

const SITE = "https://site.api.espn.com/apis/site/v2/sports/basketball/wnba";
const WEB = "https://site.web.api.espn.com/apis/common/v3/sports/basketball/wnba";

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`ESPN ${res.status}: ${url}`);
  return res.json();
}

// date: YYYYMMDD (ET game day); omit for ESPN's "current" day
export function fetchScoreboard(date?: string) {
  return getJson(`${SITE}/scoreboard${date ? `?dates=${date}` : ""}`);
}

export function fetchByAthlete(season: number) {
  return getJson(
    `${WEB}/statistics/byathlete?region=us&lang=en&contentorigin=espn&limit=200&season=${season}&seasontype=2&isqualified=false&sort=general.avgMinutes:desc`
  );
}

export function fetchGamelog(athleteId: string, season?: number) {
  return getJson(
    `${WEB}/athletes/${athleteId}/gamelog${season ? `?season=${season}` : ""}`
  );
}

export function fetchTeamSchedule(teamId: string) {
  return getJson(`${SITE}/teams/${teamId}/schedule`);
}

export type RosterInfo = {
  injury?: string; // "Out", "Day-To-Day", …
  height?: string; // 6' 2"
  weight?: string; // 194 lbs
  age?: number;
};

// Latest injury entry wins; entries older than a week are treated as resolved.
const INJURY_STALE_MS = 7 * 86_400_000;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function currentInjury(injuries: any[]): string | undefined {
  const latest = (injuries ?? [])
    .filter((i) => i?.status)
    .sort((a, b) => (Date.parse(b?.date ?? "") || 0) - (Date.parse(a?.date ?? "") || 0))[0];
  if (!latest) return undefined;
  const ts = Date.parse(latest.date ?? "");
  if (ts && Date.now() - ts > INJURY_STALE_MS) return undefined;
  return latest.status;
}

// athleteId → injury + physical profile from the roster feed
export async function fetchRosterInfo(teamId: string): Promise<Map<string, RosterInfo>> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const roster = (await getJson(`${SITE}/teams/${teamId}/roster`)) as any;
  const map = new Map<string, RosterInfo>();
  for (const a of roster?.athletes ?? []) {
    map.set(String(a.id), {
      injury: currentInjury(a.injuries),
      height: a.displayHeight,
      weight: a.displayWeight,
      age: a.age,
    });
  }
  return map;
}

// Overlay fresh injury pills onto a cached snapshot at read time — the rest of
// the snapshot (gamelogs, trends) stays as built by the cron.
export async function refreshInjuries(snapshot: Snapshot): Promise<Snapshot> {
  const teamIds = new Set(
    snapshot.matchups.flatMap((m) => [m.home.team.id, m.away.team.id])
  );
  const rosters = new Map(
    await Promise.all(
      [...teamIds].map(async (id) =>
        [id, await fetchRosterInfo(id).catch(() => null)] as const
      )
    )
  );
  const withFresh = (side: MatchupSide): MatchupSide => {
    const roster = rosters.get(side.team.id);
    if (!roster) return side; // fetch failed — keep snapshot-time pills
    return {
      ...side,
      starters: side.starters.map((p) => {
        const injury = roster.get(p.playerId)?.injury;
        const flags = p.flags?.filter((f) => f.type !== "injury") ?? [];
        if (injury) flags.unshift({ type: "injury", reason: `${injury} (ESPN)` });
        return { ...p, flags };
      }),
    };
  };
  return {
    ...snapshot,
    matchups: snapshot.matchups.map((m) => ({
      ...m,
      home: withFresh(m.home),
      away: withFresh(m.away),
    })),
  };
}

// Fetch everything for today's games and assemble the day's snapshot.
export async function buildSnapshot(): Promise<Snapshot> {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date()); // YYYY-MM-DD, ET game day

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const scoreboard = (await fetchScoreboard(date.replaceAll("-", ""))) as any;
  const games = parseGames(scoreboard);
  if (games.length === 0) return { date, matchups: [] };

  const season: number =
    scoreboard?.leagues?.[0]?.season?.year ?? new Date().getFullYear();
  const byathlete = await fetchByAthlete(season);

  const side = async (
    team: TeamRef,
    opponent: TeamRef,
    gameDate: string
  ): Promise<MatchupSide> => {
    const [schedule, roster] = await Promise.all([
      fetchTeamSchedule(team.id),
      fetchRosterInfo(team.id).catch(() => new Map<string, RosterInfo>()),
    ]);
    const trend = teamTrend(schedule, team.id, gameDate);
    const pool = excludeOut(
      topStarters(byathlete, team.id, 10),
      (id) => roster.get(id)?.injury
    );
    const starters = await Promise.all(
      pool.map(async (s) => {
        // current + previous season, merged, for deeper head-to-head history
        const [cur, prev] = await Promise.all([
          fetchGamelog(s.id),
          fetchGamelog(s.id, season - 1).catch(() => null),
        ]);
        const seen = new Set<string>();
        const lines = [...parseGamelog(cur), ...parseGamelog(prev)]
          .filter((l) => !seen.has(l.eventId) && (seen.add(l.eventId), true))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const info = roster.get(s.id);
        const player = {
          playerId: s.id,
          name: s.name,
          pos: s.pos,
          avgMinutes: s.avgMinutes,
          height: info?.height,
          weight: info?.weight,
          age: info?.age,
          last10: lastN(lines),
          vsOpponent: vsOpponent(lines, opponent.id),
        };
        return { ...player, flags: computeFlags(player, trend, info?.injury) };
      })
    );
    return { team, starters, trend };
  };

  const matchups: Matchup[] = [];
  for (const game of games) {
    matchups.push({
      game,
      home: await side(game.home, game.away, game.date),
      away: await side(game.away, game.home, game.date),
    });
  }
  return { date, matchups };
}
