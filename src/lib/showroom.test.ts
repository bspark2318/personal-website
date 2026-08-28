import { afterEach, describe, expect, it } from "vitest";
import { checkPassword, groupByRoom, SHOWROOM_HEADER, type Item } from "./showroom";

function item(id: number, room: string): Item {
  return {
    id,
    room,
    title: `item-${id}`,
    price: null,
    url: "https://x.com",
    image_url: null,
    added_by: "t",
    created_at: null as unknown as string,
    status: "고민중",
  };
}

describe("groupByRoom", () => {
  it("orders known rooms canonically and unknown rooms alphabetically after", () => {
    const items = [
      item(1, "침실"),
      item(2, "거실"),
      item(3, "베란다"), // unknown
      item(4, "거실"),
      item(5, "다락방"), // unknown
    ];
    const result = groupByRoom(items).map(([room, its]) => [room, its.length]);
    expect(result).toEqual([
      ["거실", 2],
      ["침실", 1],
      ["다락방", 1], // unknown, alphabetical: 다 before 베
      ["베란다", 1],
    ]);
  });

  it("omits rooms with no items and returns [] for empty input", () => {
    expect(groupByRoom([])).toEqual([]);
  });
});

describe("checkPassword", () => {
  const original = process.env.SHOWROOM_PASSWORD;
  afterEach(() => {
    process.env.SHOWROOM_PASSWORD = original;
  });

  const req = (pw?: string) =>
    new Request("https://x.com", { headers: pw ? { [SHOWROOM_HEADER]: pw } : {} });

  it("returns false when SHOWROOM_PASSWORD is unset (fail closed)", () => {
    delete process.env.SHOWROOM_PASSWORD;
    expect(checkPassword(req("anything"))).toBe(false);
  });

  it("returns true for a matching header", () => {
    process.env.SHOWROOM_PASSWORD = "secret";
    expect(checkPassword(req("secret"))).toBe(true);
  });

  it("returns false for a wrong or missing header", () => {
    process.env.SHOWROOM_PASSWORD = "secret";
    expect(checkPassword(req("nope"))).toBe(false);
    expect(checkPassword(req())).toBe(false);
  });
});
