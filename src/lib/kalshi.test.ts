import { describe, expect, it } from "vitest";
import events from "./__fixtures__/kalshi-events.json";
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

  it("keeps only the lowest rung per player", () => {
    const gray = lines.get("allisha gray");
    expect(gray?.threshold).toBe(15); // fixture rungs: 15/20/25
    const reese = lines.get("angel reese");
    expect(reese?.threshold).toBe(10);
  });

  it("empty/garbage input → empty map", () => {
    expect(parseLines(null).size).toBe(0);
    expect(parseLines({ events: [{ markets: [{ yes_sub_title: "???" }] }] }).size).toBe(0);
  });
});
