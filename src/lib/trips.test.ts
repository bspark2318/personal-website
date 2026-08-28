import { describe, expect, it } from "vitest";
import {
  estimateCost,
  firstNameOf,
  matchCrew,
  parseRich,
  shapeState,
  toCelsiusLabel,
  type CostItem,
  type CrewMember,
  type DatePrefRow,
  type RsvpRow,
  type VoteRow,
} from "./trips";
import { TRIPS } from "./trips-data";

const miami = TRIPS["miami-2026"];

describe("estimateCost", () => {
  it("miami core plan at 8 (skydive + fishing off) lands in the doc's $1,000–1,250 range", () => {
    // Skydiving (~$400/pp) and fishing (an alternative to the boat day) are
    // add-ons; the doc's budget is the core plan with the boat.
    const { perPerson } = estimateCost(miami.costItems, 8, ["skydive", "fishing"]);
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

  it("toggling a linked activity drops exactly its line; unlinked lines stay fixed", () => {
    const on = estimateCost(miami.costItems, 8, []);
    const off = estimateCost(miami.costItems, 8, ["oleta"]);
    const oletaLine = on.lines.find((l) => l.id === "oleta")!;
    expect(oletaLine.perPerson).toBeGreaterThan(0);
    expect(off.perPerson).toBeCloseTo(on.perPerson - oletaLine.perPerson, 5);
    expect(off.lines.find((l) => l.id === "oleta")).toBeUndefined();
    // Lines with no linked activity (house, cars, food, ubers) can't toggle off.
    const fixed = estimateCost(miami.costItems, 8, ["house", "cars", "food", "ubers"]);
    expect(fixed.lines.find((l) => l.id === "food")).toBeDefined();
    expect(fixed.lines.find((l) => l.id === "cars")).toBeDefined();
  });

  it("splits fixed costs by headcount with no floor", () => {
    const items: CostItem[] = [
      { id: "villa", label: "Villa", amount: 1000, kind: "fixed-split" },
    ];
    expect(estimateCost(items, 2, []).perPerson).toBe(500);
  });
});

describe("cost data integrity", () => {
  it("every cost item's activityId points at a real activity", () => {
    const ids = new Set(miami.activities.map((a) => a.id));
    const dangling = miami.costItems
      .filter((c) => c.activityId)
      .filter((c) => !ids.has(c.activityId!))
      .map((c) => c.id);
    expect(dangling).toEqual([]);
  });
});

describe("parseRich", () => {
  it("returns a single text segment for plain prose", () => {
    expect(parseRich("just words")).toEqual([{ kind: "text", value: "just words" }]);
  });

  it("isolates **bold** spans from surrounding text", () => {
    expect(parseRich("a **b** c")).toEqual([
      { kind: "text", value: "a " },
      { kind: "bold", value: "b" },
      { kind: "text", value: " c" },
    ]);
  });

  it("prefixes bare domains with https and keeps http(s) urls as-is", () => {
    expect(parseRich("book at sharkvalleytramtours.com today")).toEqual([
      { kind: "text", value: "book at " },
      { kind: "link", value: "sharkvalleytramtours.com", href: "https://sharkvalleytramtours.com" },
      { kind: "text", value: " today" },
    ]);
    const [seg] = parseRich("https://11miami.com");
    expect(seg).toEqual({ kind: "link", value: "https://11miami.com", href: "https://11miami.com" });
  });

  it("does not over-match a TLD embedded in a longer word", () => {
    // "company" must not linkify as "com" + stray "pany"
    expect(parseRich("the company picnic")).toEqual([
      { kind: "text", value: "the company picnic" },
    ]);
  });

  it("linkifies multiple domains in one string", () => {
    const segs = parseRich("11miami.com / clubspace.com");
    expect(segs.filter((s) => s.kind === "link").map((s) => s.value)).toEqual([
      "11miami.com",
      "clubspace.com",
    ]);
  });

  it("leaves a lone ** marker as literal text", () => {
    expect(parseRich("2 ** 3 = 8")).toEqual([{ kind: "text", value: "2 ** 3 = 8" }]);
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

describe("matchCrew", () => {
  const crew: CrewMember[] = [
    { first: "BumSu", last: "Park" },
    { first: "Mike", last: "Smith" },
    { first: "Mike", last: "Jones" },
  ];

  it("exact match returns the full-name key", () => {
    expect(matchCrew("BumSu", "Park", crew)).toBe("BumSu Park");
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(matchCrew("  bumsu ", " PARK ", crew)).toBe("BumSu Park");
  });

  it("empty first or last name never matches", () => {
    expect(matchCrew("", "Park", crew)).toBeNull();
    expect(matchCrew("BumSu", "   ", crew)).toBeNull();
  });

  it("right first + wrong last is rejected", () => {
    expect(matchCrew("BumSu", "Kim", crew)).toBeNull();
  });

  it("duplicate first names disambiguate by last name", () => {
    expect(matchCrew("Mike", "Jones", crew)).toBe("Mike Jones");
    expect(matchCrew("Mike", "Smith", crew)).toBe("Mike Smith");
  });
});

describe("firstNameOf", () => {
  const crew: CrewMember[] = [{ first: "BumSu", last: "Park" }];

  it("maps a full-name key to the first name", () => {
    expect(firstNameOf("BumSu Park", crew)).toBe("BumSu");
  });

  it("falls back to the key when not in the crew", () => {
    expect(firstNameOf("Old Key", crew)).toBe("Old Key");
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
