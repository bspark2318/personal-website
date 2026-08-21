import { describe, expect, it } from "vitest";
import scoreboard from "./__fixtures__/scoreboard.json";
import byathlete from "./__fixtures__/byathlete.json";
import gamelog from "./__fixtures__/gamelog.json";
import schedule from "./__fixtures__/schedule.json";
import {
  avg,
  computeFlags,
  excludeOut,
  hitRate,
  lastN,
  pairStarters,
  parseGamelog,
  parseGames,
  teamTrend,
  topStarters,
  vsOpponent,
} from "./wnba";

describe("parseGames", () => {
  it("extracts games with home/away and tipoff", () => {
    const games = parseGames(scoreboard);
    expect(games.length).toBeGreaterThan(0);
    for (const g of games) {
      expect(g.id).toBeTruthy();
      expect(g.date).toMatch(/^\d{4}-/);
      expect(g.home.abbreviation).toBeTruthy();
      expect(g.away.abbreviation).toBeTruthy();
      expect(g.home.id).not.toBe(g.away.id);
    }
  });

  it("returns [] for empty scoreboard", () => {
    expect(parseGames({ events: [] })).toEqual([]);
  });
});

describe("topStarters", () => {
  it("returns top 5 by avg minutes, descending", () => {
    const teamId = String(
      (byathlete as unknown as { athletes: { athlete: { teamId: number } }[] })
        .athletes[0].athlete.teamId
    );
    const starters = topStarters(byathlete, teamId);
    expect(starters).toHaveLength(5);
    for (let i = 1; i < starters.length; i++) {
      expect(starters[i - 1].avgMinutes).toBeGreaterThanOrEqual(
        starters[i].avgMinutes
      );
    }
  });

  it("unknown team → empty", () => {
    expect(topStarters(byathlete, "nope")).toEqual([]);
  });
});

describe("parseGamelog", () => {
  const lines = parseGamelog(gamelog);

  it("parses lines sorted most-recent-first", () => {
    expect(lines.length).toBeGreaterThan(0);
    for (let i = 1; i < lines.length; i++) {
      expect(new Date(lines[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(lines[i].date).getTime()
      );
    }
  });

  it("maps stat columns via labels", () => {
    for (const l of lines) {
      expect(l.opponentId).toBeTruthy();
      expect(["W", "L"]).toContain(l.result);
      expect(Number.isFinite(l.pts)).toBe(true);
      expect(Number.isFinite(l.reb)).toBe(true);
      expect(Number.isFinite(l.ast)).toBe(true);
    }
  });

  it("lastN caps at 10", () => {
    expect(lastN(lines).length).toBeLessThanOrEqual(10);
  });

  it("vsOpponent filters by opponent id", () => {
    const opp = lines[0].opponentId;
    const vs = vsOpponent(lines, opp);
    expect(vs.length).toBeGreaterThan(0);
    expect(vs.every((l) => l.opponentId === opp)).toBe(true);
  });
});

describe("teamTrend", () => {
  it("computes W/L, averages, margin over last 10 completed", () => {
    const t = teamTrend(schedule, "8");
    expect(t.lastResults.length).toBeGreaterThan(0);
    expect(t.lastResults.length).toBeLessThanOrEqual(5);
    expect(t.avgFor).toBeGreaterThan(0);
    expect(t.avgAgainst).toBeGreaterThan(0);
    expect(t.avgMargin).toBeCloseTo(t.avgFor - t.avgAgainst, 1);
    expect(t.restDays).toBeNull(); // no gameDate given
  });

  it("computes rest days and 7-day density from a tipoff date", () => {
    const events = (schedule as { events: { competitions: { date: string }[] }[] })
      .events;
    const lastDate = events
      .map((e) => e.competitions[0])
      .filter((c) => (c as { status?: { type?: { completed?: boolean } } }).status?.type?.completed)
      .map((c) => new Date(c.date).getTime())
      .sort((a, b) => b - a)[0];
    const tip = new Date(lastDate + 2 * 86_400_000).toISOString();
    const t = teamTrend(schedule, "8", tip);
    expect(t.restDays).toBe(2);
    expect(t.gamesLast7).toBeGreaterThan(0);
  });
});

describe("pairStarters", () => {
  const mk = (name: string, pos: string, avgMinutes: number) =>
    ({ playerId: name, name, pos, avgMinutes, last10: [], vsOpponent: [] });

  it("pairs by position rank G→C, minutes tiebreak", () => {
    const away = [mk("aC", "C", 30), mk("aG1", "G", 35), mk("aF", "F", 32), mk("aG2", "G", 28), mk("aGF", "G/F", 33)];
    const home = [mk("hG1", "G", 34), mk("hG2", "G", 30), mk("hF1", "F", 33), mk("hF2", "F", 29), mk("hC", "C", 31)];
    const pairs = pairStarters(away, home);
    expect(pairs.map(([a, h]) => [a.name, h.name])).toEqual([
      ["aG1", "hG1"],
      ["aG2", "hG2"],
      ["aGF", "hF1"],
      ["aF", "hF2"],
      ["aC", "hC"],
    ]);
  });

  it("uneven lists → pairs up to the shorter side", () => {
    expect(pairStarters([mk("a", "G", 30)], [])).toEqual([]);
  });
});

describe("excludeOut", () => {
  it("drops Out players and promotes next, keeping 5", () => {
    const pool = ["a", "b", "c", "d", "e", "f", "g"].map((id) => ({ id }));
    const out = new Map([["b", "Out"], ["x", "Day-To-Day"]]);
    expect(excludeOut(pool, (id) => out.get(id)).map((p) => p.id)).toEqual([
      "a", "c", "d", "e", "f",
    ]);
  });
});

describe("computeFlags", () => {
  const line = (pts: number, min: number, i: number) =>
    ({ eventId: `e${i}`, date: `2026-08-0${(i % 9) + 1}`, opponentId: "1", opponentAbbr: "X", result: "W", min, pts, reb: 0, ast: 0 }) as const;
  const logs = (games: [number, number][]) =>
    games.map(([pts, min], i) => line(pts, min, i));
  const rested = { restDays: 3 };

  it("minutes spike: last game ≥ 2σ above prior avg", () => {
    const p = { last10: logs([[10, 40], ...Array.from({ length: 9 }, () => [10, 28] as [number, number])]), avgMinutes: 29 };
    const f = computeFlags(p, rested);
    expect(f.some((x) => x.type === "fatigue" && x.reason.includes("40"))).toBe(true);
  });

  it("high but within-noise minutes don't flag", () => {
    // prior avg 30, σ = 6 → threshold 42; 38 is inside normal variance
    const prior = Array.from({ length: 8 }, (_, i) => [10, i % 2 ? 24 : 36] as [number, number]);
    const p = { last10: logs([[10, 38], ...prior]), avgMinutes: 30 };
    expect(computeFlags(p, rested).some((x) => x.type === "fatigue")).toBe(false);
  });

  it("B2B flags regardless of minutes", () => {
    const p = { last10: logs([[10, 20], [10, 20], [10, 20]]), avgMinutes: 20 };
    expect(computeFlags(p, { restDays: 1 }).some((x) => x.reason.includes("B2B"))).toBe(true);
  });

  it("stable heavy minutes after a role change are not fatigue", () => {
    const p = { last10: logs(Array.from({ length: 10 }, () => [10, 33] as [number, number])), avgMinutes: 25 };
    expect(computeFlags(p, rested).some((x) => x.type === "fatigue")).toBe(false);
  });

  it("hot and cold streaks around L10 avg", () => {
    const hot = { last10: logs([[20, 30], [20, 30], [20, 30], [10, 30], [10, 30], [10, 30], [10, 30], [10, 30], [10, 30], [10, 30]]), avgMinutes: 30 };
    expect(computeFlags(hot, rested).some((x) => x.type === "hot")).toBe(true);
    const cold = { last10: logs([[5, 30], [5, 30], [5, 30], [15, 30], [15, 30], [15, 30], [15, 30], [15, 30], [15, 30], [15, 30]]), avgMinutes: 30 };
    expect(computeFlags(cold, rested).some((x) => x.type === "cold")).toBe(true);
  });

  it("skips load/streak flags under 3 games; injury still passes through", () => {
    const p = { last10: logs([[30, 40], [30, 40]]), avgMinutes: 20 };
    const f = computeFlags(p, rested, "Out");
    expect(f).toEqual([{ type: "injury", reason: "Out (ESPN)" }]);
  });

  it("no flags for a rested, normal player", () => {
    const p = { last10: logs(Array.from({ length: 10 }, () => [12, 28] as [number, number])), avgMinutes: 28 };
    expect(computeFlags(p, rested)).toEqual([]);
  });
});

describe("avg", () => {
  it("averages a stat to 1 decimal", () => {
    const mk = (pts: number) =>
      ({ pts, reb: 0, ast: 0, min: 0 }) as Parameters<typeof avg>[0][number];
    expect(avg([mk(10), mk(21)], "pts")).toBe(15.5);
    expect(avg([], "pts")).toBe(0);
  });
});

describe("hitRate", () => {
  it("counts games clearing the threshold", () => {
    const mk = (pts: number, i: number) =>
      ({ eventId: `h${i}`, date: "2026-08-01", opponentId: "1", opponentAbbr: "X", result: "W" as const, min: 30, pts, reb: 0, ast: 0 });
    const lines = [22, 18, 25, 9, 20].map(mk);
    expect(hitRate(lines, "pts", 20)).toEqual({ hits: 3, n: 5 });
    expect(hitRate([], "pts", 20)).toEqual({ hits: 0, n: 0 });
  });
});
