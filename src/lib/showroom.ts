import { neon } from "@neondatabase/serverless";

export type Item = {
  id: number;
  room: string;
  title: string;
  price: string | null;
  url: string;
  image_url: string | null;
  added_by: string;
  created_at: string;
};

export const ROOMS = [
  "거실",
  "침실",
  "주방",
  "식당",
  "욕실",
  "현관",
  "기타",
];

export const SHOWROOM_HEADER = "x-showroom-password";
export const STORAGE_PASSWORD = "showroom-password";
export const STORAGE_NAME = "showroom-name";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set — add it to .env.local");
  return neon(url);
}

// Group items by room: known ROOMS in canonical order first, then any
// unknown rooms alphabetically. Empty rooms are omitted.
export function groupByRoom(items: Item[]): [string, Item[]][] {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const list = groups.get(item.room) ?? [];
    list.push(item);
    groups.set(item.room, list);
  }
  const known = ROOMS.filter((r) => groups.has(r));
  const unknown = [...groups.keys()].filter((r) => !ROOMS.includes(r)).sort();
  return [...known, ...unknown].map((r) => [r, groups.get(r)!]);
}

export function checkPassword(req: Request): boolean {
  const expected = process.env.SHOWROOM_PASSWORD;
  if (!expected) return false;
  return req.headers.get(SHOWROOM_HEADER) === expected;
}
