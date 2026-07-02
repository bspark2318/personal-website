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

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set — add it to .env.local");
  return neon(url);
}

export function checkPassword(req: Request): boolean {
  const expected = process.env.SHOWROOM_PASSWORD;
  if (!expected) return false;
  return req.headers.get("x-showroom-password") === expected;
}
