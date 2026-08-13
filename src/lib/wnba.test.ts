import { describe, expect, it } from "vitest";
import scoreboard from "./__fixtures__/scoreboard.json";
import byathlete from "./__fixtures__/byathlete.json";
import gamelog from "./__fixtures__/gamelog.json";
import schedule from "./__fixtures__/schedule.json";
import {
  avg,
  lastN,
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
      (byathlete as { athletes: { athlete: { teamId: number } }[] }).athletes[0]
        .athlete.teamId
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
