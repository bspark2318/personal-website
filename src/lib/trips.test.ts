import { describe, expect, it } from "vitest";
import {
  estimateCost,
  shapeState,
  toCelsiusLabel,
  type CostItem,
  type DatePrefRow,
  type RsvpRow,
  type VoteRow,
} from "./trips";
import { TRIPS } from "./trips-data";

const miami = TRIPS["miami-2026"];

describe("estimateCost", () => {
  it("miami at 8 with everything on lands in the doc's $1,000–1,250 range", () => {
    const { perPerson } = estimateCost(miami.costItems, 8, []);
    expect(perPerson).toBeGreaterThanOrEqual(1000);
    expect(perPerson).toBeLessThanOrEqual(1250);
  });

  it("dropping headcount raises fixed-split lines, leaves per-person lines alone", () => {
    const at8 = estimateCost(miami.costItems, 8, []);
    const at6 = estimateCost(miami.costItems, 6, []);
    const house8 = at8.lines.find((l) => l.id === "house")!;
    const house6 = at6.lines.find((l) => l.id === "house")!;
    const boat8 = at8.lines.find((l) => l.id === "boat")!;
    const boat6 = at6.lines.find((l) => l.id === "boat")!;
    const food8 = at8.lines.find((l) => l.id === "food")!;
    const food6 = at6.lines.find((l) => l.id === "food")!;
    expect(house6.perPerson).toBeGreaterThan(house8.perPerson);
    expect(boat6.perPerson).toBeGreaterThan(boat8.perPerson);
    expect(food6.perPerson).toBe(food8.perPerson);
  });

  it("toggling both club nights off drops the total by exactly those lines", () => {
    const on = estimateCost(miami.costItems, 8, []);
    const off = estimateCost(miami.costItems, 8, ["club-fri", "club-sat"]);
    const clubTotal = on.lines
      .filter((l) => l.id.startsWith("club-"))
      .reduce((sum, l) => sum + l.perPerson, 0);
    expect(clubTotal).toBeGreaterThan(0);
    expect(off.perPerson).toBeCloseTo(on.perPerson - clubTotal, 5);
    expect(off.lines.find((l) => l.id.startsWith("club-"))).toBeUndefined();
  });

  it("splits fixed costs by headcount with no floor", () => {
    const items: CostItem[] = [
      { id: "villa", label: "Villa", amount: 1000, kind: "fixed-split" },
    ];
    expect(estimateCost(items, 2, []).perPerson).toBe(500);
  });
});

describe("toCelsiusLabel", () => {
  it("converts single temps and ranges, passes through non-temps", () => {
    expect(toCelsiusLabel("83°F")).toBe("28°C");
    expect(toCelsiusLabel("84–87°F")).toBe("29–31°C");
    expect(toCelsiusLabel("30–40%")).toBe("30–40%");
    expect(toCelsiusLabel("~6:45 PM")).toBe("~6:45 PM");
  });
});

describe("shapeState", () => {
  const rsvps: RsvpRow[] = [
    { name: "Shai", status: "in" },
    { name: "Guest 2", status: "in" },
    { name: "Guest 3", status: "maybe" },
    { name: "Guest 4", status: "out" },
  ];
  const votes: VoteRow[] = [
    { activityId: "boat", name: "Shai", vote: "up" },
    { activityId: "boat", name: "Guest 3", vote: "up" },
    { activityId: "club-fri", name: "Guest 4", vote: "down" },
  ];
  const datePrefs: DatePrefRow[] = [
    { optionId: "oct-8", name: "Shai" },
    { optionId: "oct-8", name: "Guest 2" },
    { optionId: "oct-22", name: "Shai" },
  ];

  it("names only the ins; out/maybe are counts", () => {
    const state = shapeState(rsvps, votes, datePrefs, null);
    expect(state.ins).toEqual(["Shai", "Guest 2"]);
    expect(state.maybeCount).toBe(1);
    expect(state.outCount).toBe(1);
  });

  it("vote tallies are anonymous counts", () => {
    const state = shapeState(rsvps, votes, datePrefs, null);
    expect(state.votes).toEqual({
      boat: { up: 2, down: 0 },
      "club-fri": { up: 0, down: 1 },
    });
    expect(JSON.stringify(state.votes)).not.toContain("Shai");
  });

  it("rsvp/vote data never leaks non-in names", () => {
    const json = JSON.stringify(shapeState(rsvps, votes, [], null));
    expect(json).not.toContain("Guest 3");
    expect(json).not.toContain("Guest 4");
  });

  it("groups date prefs by option with names", () => {
    const state = shapeState(rsvps, votes, datePrefs, null);
    expect(state.datePrefs).toEqual({
      "oct-8": ["Shai", "Guest 2"],
      "oct-22": ["Shai"],
    });
  });

  it("includes the caller's own rsvp, votes, and dates", () => {
    const state = shapeState(rsvps, votes, datePrefs, "Guest 3");
    expect(state.me).toEqual({
      rsvp: "maybe",
      votes: { boat: "up" },
      dates: [],
    });
  });

  it("caller with no rows gets an empty me block", () => {
    const state = shapeState(rsvps, votes, datePrefs, "Guest 8");
    expect(state.me).toEqual({ rsvp: null, votes: {}, dates: [] });
  });
});
