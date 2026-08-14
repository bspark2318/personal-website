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

export type PlayerLog = {
  playerId: string;
  name: string;
  pos: string; // G / F / C / hybrids like G/F
  avgMinutes: number;
  last10: GameLine[];
  vsOpponent: GameLine[];
};

export type TeamTrend = {
  teamId: string;
  lastResults: ("W" | "L")[]; // most recent first, up to 5
  avgFor: number;
  avgAgainst: number;
  avgMargin: number;
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

// team schedule JSON → trend over last `n` completed games
export function teamTrend(schedule: any, teamId: string, n = 10): TeamTrend {
  const completed = (schedule?.events ?? [])
    .map((e: any) => e.competitions?.[0])
    .filter((c: any) => c?.status?.type?.completed)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, n);

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
