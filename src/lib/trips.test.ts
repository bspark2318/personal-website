import { describe, expect, it } from "vitest";
import {
  estimateCost,
  shapeState,
  toCelsiusLabel,
  type CostItem,
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

describe("miami-2026 data shape", () => {
  it("every highlight has a photo with src + credit", () => {
    expect(miami.intro.length).toBeGreaterThan(0);
    for (const h of miami.intro) {
      expect(h.photo.src).toBeTruthy();
      expect(h.photo.credit).toBeTruthy();
    }
  });

  it("every park has a unique id and at least one credited photo", () => {
    const ids = miami.parks.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const park of miami.parks) {
      // ParkPicker indexes photos[0] unconditionally.
      expect(park.photos.length).toBeGreaterThanOrEqual(1);
      for (const photo of park.photos) {
        expect(photo.src).toBeTruthy();
        expect(photo.credit).toBeTruthy();
      }
    }
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

  it("names only the ins; out/maybe are counts", () => {
    const state = shapeState(rsvps, votes, null);
    expect(state.ins).toEqual(["Shai", "Guest 2"]);
    expect(state.maybeCount).toBe(1);
    expect(state.outCount).toBe(1);
  });

  it("vote tallies are anonymous counts", () => {
    const state = shapeState(rsvps, votes, null);
    expect(state.votes).toEqual({
      boat: { up: 2, down: 0 },
      "club-fri": { up: 0, down: 1 },
    });
    expect(JSON.stringify(state.votes)).not.toContain("Shai");
  });

  it("payload never leaks non-in names anywhere", () => {
    const json = JSON.stringify(shapeState(rsvps, votes, null));
    expect(json).not.toContain("Guest 3");
    expect(json).not.toContain("Guest 4");
  });

  it("includes the caller's own rsvp and votes", () => {
    const state = shapeState(rsvps, votes, "Guest 3");
    expect(state.me).toEqual({
      rsvp: "maybe",
      votes: { boat: "up" },
    });
  });

  it("caller with no rows gets an empty me block", () => {
    const state = shapeState(rsvps, votes, "Guest 8");
    expect(state.me).toEqual({ rsvp: null, votes: {} });
  });
});
