// Pure transforms over ESPN JSON. No fetching here — see wnba-api.ts.

export type TeamRef = {
  id: string;
  abbreviation: string;
  displayName: string;
  logo: string | null;
};

export type Game = {
  id: string;
  date: string; // ISO
  status: string; // e.g. STATUS_SCHEDULED
  home: TeamRef;
  away: TeamRef;
};

export type GameLine = {
  eventId: string;
  date: string; // ISO
  opponentId: string;
  opponentAbbr: string;
  result: "W" | "L";
  min: number;
  pts: number;
  reb: number;
  ast: number;
};

export type Flag = {
  type: "fatigue" | "hot" | "cold" | "injury";
  reason: string;
};

export type PlayerLog = {
  playerId: string;
  name: string;
  pos: string; // G / F / C / hybrids like G/F
  avgMinutes: number;
  last10: GameLine[];
  vsOpponent: GameLine[];
  flags?: Flag[];
};

export type TeamTrend = {
  teamId: string;
  lastResults: ("W" | "L")[]; // most recent first, up to 5
  avgFor: number;
  avgAgainst: number;
  avgMargin: number;
  restDays: number | null; // full days between last game and tipoff; null if unknown
  gamesLast7: number; // completed games in the 7 days before tipoff
};

export type MatchupSide = {
  team: TeamRef;
  starters: PlayerLog[];
  trend: TeamTrend;
};

export type Matchup = {
  game: Game;
  home: MatchupSide;
  away: MatchupSide;
};

export type Snapshot = {
  date: string; // YYYY-MM-DD
  matchups: Matchup[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */

// scoreboard JSON → today's games
export function parseGames(scoreboard: any): Game[] {
  const events: any[] = scoreboard?.events ?? [];
  return events.map((e) => {
    const comp = e.competitions[0];
    const side = (homeAway: string): TeamRef => {
      const c = comp.competitors.find((x: any) => x.homeAway === homeAway);
      return {
        id: String(c.team.id),
        abbreviation: c.team.abbreviation,
        displayName: c.team.displayName,
        logo: c.team.logo ?? null,
      };
    };
    return {
      id: String(e.id),
      date: e.date,
      status: e.status?.type?.name ?? "STATUS_SCHEDULED",
      home: side("home"),
      away: side("away"),
    };
  });
}

// byathlete JSON → top-N players of a team by avg minutes
export function topStarters(
  byathlete: any,
  teamId: string,
  n = 5
): { id: string; name: string; pos: string; avgMinutes: number }[] {
  const catNames: string[] =
    byathlete?.categories?.find((c: any) => c.name === "general")?.names ?? [];
  const minIdx = catNames.indexOf("avgMinutes");
  const players = (byathlete?.athletes ?? [])
    .filter((a: any) => String(a.athlete.teamId) === teamId)
    .map((a: any) => {
      const general = a.categories?.find((c: any) => c.name === "general");
      return {
        id: String(a.athlete.id),
        name: a.athlete.displayName,
        pos: a.athlete.position?.abbreviation ?? "",
        avgMinutes: minIdx >= 0 ? general?.values?.[minIdx] ?? 0 : 0,
      };
    });
  players.sort((a: any, b: any) => b.avgMinutes - a.avgMinutes);
  return players.slice(0, n);
}

// gamelog JSON → completed game lines, most recent first
export function parseGamelog(gamelog: any): GameLine[] {
  const labels: string[] = gamelog?.labels ?? [];
  const idx = {
    min: labels.indexOf("MIN"),
    pts: labels.indexOf("PTS"),
    reb: labels.indexOf("REB"),
    ast: labels.indexOf("AST"),
  };
  const meta: Record<string, any> = gamelog?.events ?? {};
  const lines = new Map<string, GameLine>();
  for (const st of gamelog?.seasonTypes ?? []) {
    if (/preseason/i.test(st.displayName ?? "")) continue;
    for (const cat of st.categories ?? []) {
      for (const ev of cat.events ?? []) {
        const m = meta[ev.eventId];
        if (!m || lines.has(ev.eventId)) continue;
        const num = (i: number) => (i >= 0 ? Number(ev.stats[i]) || 0 : 0);
        lines.set(ev.eventId, {
          eventId: String(ev.eventId),
          date: m.gameDate,
          opponentId: String(m.opponent?.id ?? ""),
          opponentAbbr: m.opponent?.abbreviation ?? "",
          result: m.gameResult === "W" ? "W" : "L",
          min: num(idx.min),
          pts: num(idx.pts),
          reb: num(idx.reb),
          ast: num(idx.ast),
        });
      }
    }
  }
  return [...lines.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function lastN(lines: GameLine[], n = 10): GameLine[] {
  return lines.slice(0, n);
}

export function vsOpponent(lines: GameLine[], opponentId: string): GameLine[] {
  return lines.filter((l) => l.opponentId === opponentId);
}

// team schedule JSON → trend over last `n` completed games.
// gameDate (tipoff ISO) enables rest-day / schedule-density stats.
export function teamTrend(
  schedule: any,
  teamId: string,
  gameDate?: string,
  n = 10
): TeamTrend {
  const allCompleted = (schedule?.events ?? [])
    .map((e: any) => e.competitions?.[0])
    .filter((c: any) => c?.status?.type?.completed)
    .filter(
      (c: any) => !gameDate || new Date(c.date) < new Date(gameDate)
    )
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  const completed = allCompleted.slice(0, n);

  const DAY = 86_400_000;
  const tip = gameDate ? new Date(gameDate).getTime() : null;
  const lastGame = allCompleted[0] ? new Date(allCompleted[0].date).getTime() : null;
  const restDays =
    tip !== null && lastGame !== null ? Math.floor((tip - lastGame) / DAY) : null;
  const gamesLast7 =
    tip === null
      ? 0
      : allCompleted.filter((c: any) => tip - new Date(c.date).getTime() <= 7 * DAY)
          .length;

  let sumFor = 0;
  let sumAgainst = 0;
  const results: ("W" | "L")[] = [];
  for (const c of completed) {
    const us = c.competitors.find((x: any) => String(x.team.id) === teamId);
    const them = c.competitors.find((x: any) => String(x.team.id) !== teamId);
    const f = Number(us?.score?.value ?? us?.score?.displayValue ?? 0);
    const a = Number(them?.score?.value ?? them?.score?.displayValue ?? 0);
    sumFor += f;
    sumAgainst += a;
    results.push(us?.winner ? "W" : "L");
  }
  const games = completed.length || 1;
  const round1 = (x: number) => Math.round(x * 10) / 10;
  return {
    teamId,
    lastResults: results.slice(0, 5),
    avgFor: round1(sumFor / games),
    avgAgainst: round1(sumAgainst / games),
    avgMargin: round1((sumFor - sumAgainst) / games),
    restDays,
    gamesLast7,
  };
}

// Zip two starter lists into positional pairs: guards vs guards, bigs vs bigs.
// Sort key: position rank (G→C), minutes as tiebreak — approximate by design.
const POS_RANK: Record<string, number> = { G: 0, "G/F": 1, F: 2, "F/C": 3, C: 4 };

export function pairStarters(
  away: PlayerLog[],
  home: PlayerLog[]
): [PlayerLog, PlayerLog][] {
  const byPos = (list: PlayerLog[]) =>
    [...list].sort(
      (a, b) =>
        (POS_RANK[a.pos] ?? 2) - (POS_RANK[b.pos] ?? 2) ||
        b.avgMinutes - a.avgMinutes
    );
  const a = byPos(away);
  const h = byPos(home);
  return a.slice(0, Math.min(a.length, h.length)).map((p, i) => [p, h[i]]);
}

export function avg(lines: GameLine[], key: "pts" | "reb" | "ast" | "min"): number {
  if (lines.length === 0) return 0;
  return Math.round((lines.reduce((s, l) => s + l[key], 0) / lines.length) * 10) / 10;
}

export const THRESHOLDS = {
  heavyLoadDelta: 4, // L3 min ≥ season avg + this
  climbDelta: 3, // L3 min ≥ L10 min avg + this
  hotMult: 1.25,
  coldMult: 0.75,
  minPtsBase: 8, // streak flags only for players averaging ≥ this
  b2bRest: 1,
  minGames: 3, // skip load/streak flags below this many recent games
};

// Pre-game condition flags for one starter. injuryStatus comes from the roster feed.
export function computeFlags(
  player: Pick<PlayerLog, "last10" | "avgMinutes">,
  trend: Pick<TeamTrend, "restDays">,
  injuryStatus?: string
): Flag[] {
  const T = THRESHOLDS;
  const flags: Flag[] = [];
  const l3 = player.last10.slice(0, 3);

  if (injuryStatus) {
    flags.push({ type: "injury", reason: `${injuryStatus} (ESPN)` });
  }

  if (trend.restDays !== null && trend.restDays <= T.b2bRest) {
    flags.push({ type: "fatigue", reason: "B2B — playing on ≤1 day rest" });
  }

  if (player.last10.length >= T.minGames) {
    const l3min = avg(l3, "min");
    const l10min = avg(player.last10, "min");
    if (player.avgMinutes > 0 && l3min >= player.avgMinutes + T.heavyLoadDelta) {
      flags.push({
        type: "fatigue",
        reason: `${l3min} min L3 vs ${Math.round(player.avgMinutes * 10) / 10} season`,
      });
    } else if (l3min >= l10min + T.climbDelta) {
      flags.push({ type: "fatigue", reason: `minutes climbing — ${l3min} L3 vs ${l10min} L10` });
    }

    const l3pts = avg(l3, "pts");
    const l10pts = avg(player.last10, "pts");
    if (l10pts >= T.minPtsBase) {
      if (l3pts >= l10pts * T.hotMult) {
        flags.push({ type: "hot", reason: `${l3pts} pts L3 vs ${l10pts} L10` });
      } else if (l3pts <= l10pts * T.coldMult) {
        flags.push({ type: "cold", reason: `${l3pts} pts L3 vs ${l10pts} L10` });
      }
    }
  }

  return flags;
}
