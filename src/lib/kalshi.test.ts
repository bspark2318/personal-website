import { describe, expect, it } from "vitest";
import events from "./__fixtures__/kalshi-events.json";
import threes from "./__fixtures__/kalshi-threes.json";
import { normalizeName, parseLines } from "./kalshi";

describe("normalizeName", () => {
  it("strips apostrophes, accents, case", () => {
    expect(normalizeName("A'ja Wilson")).toBe("aja wilson");
    expect(normalizeName("Leïla Lacan")).toBe("leila lacan");
    expect(normalizeName("  Angel  Reese ")).toBe("angel reese");
  });
});

describe("parseLines", () => {
  const lines = parseLines(events);

  it("keys by normalized name", () => {
    expect(lines.size).toBeGreaterThan(0);
    for (const key of lines.keys()) expect(key).toBe(normalizeName(key));
  });

  it("keeps only the lowest rung per player, with dollar prices as cents", () => {
    // derive expectation from the fixture itself (contents shift day to day)
    const fx = events as unknown as {
      events: { markets: { yes_sub_title: string; status: string }[] }[];
    };
    const rungs = new Map<string, number>();
    for (const e of fx.events)
      for (const m of e.markets) {
        const match = /^(.+?):\s*(\d+)\+$/.exec(m.yes_sub_title ?? "");
        if (!match || m.status !== "active") continue;
        const key = normalizeName(match[1]);
        rungs.set(key, Math.min(rungs.get(key) ?? Infinity, Number(match[2])));
      }
    expect(rungs.size).toBeGreaterThan(0);
    for (const [key, minRung] of rungs) {
      expect(lines.get(key)?.threshold).toBe(minRung);
    }
    const priced = [...lines.values()].filter((l) => l.yesAsk != null);
    expect(priced.length).toBeGreaterThan(0);
    for (const l of priced) {
      expect(l.yesAsk).toBeGreaterThan(0);
      expect(l.yesAsk).toBeLessThanOrEqual(100);
    }
  });

  it("parses threes ladders too", () => {
    const t = parseLines(threes);
    expect(t.size).toBeGreaterThan(0);
    for (const line of t.values()) expect(line.threshold).toBeGreaterThan(0);
  });

  it("empty/garbage input → empty map", () => {
    expect(parseLines(null).size).toBe(0);
    expect(parseLines({ events: [{ markets: [{ yes_sub_title: "???" }] }] }).size).toBe(0);
  });
});
