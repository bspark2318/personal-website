// Kalshi public market data — player points ladders. Isolated here; failure → null.

export type KalshiLine = {
  player: string; // display name from Kalshi
  threshold: number; // lowest rung, e.g. 15 (floor_strike 14.5)
  yesBid: number | null; // cents
  yesAsk: number | null;
  ticker: string;
};

const EVENTS_URL =
  "https://api.elections.kalshi.com/trade-api/v2/events?limit=50&status=open&series_ticker=KXWNBAPTS&with_nested_markets=true";

// "A'ja Wilson" → "aja wilson"; strips accents, punctuation, extra space
export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// events JSON → normalized-name → lowest-rung line
export function parseLines(data: any): Map<string, KalshiLine> {
  const lines = new Map<string, KalshiLine>();
  for (const e of data?.events ?? []) {
    for (const m of e.markets ?? []) {
      const match = /^(.+?):\s*(\d+)\+$/.exec(m.yes_sub_title ?? "");
      if (!match || m.status !== "active") continue;
      const [, player, rung] = match;
      const key = normalizeName(player);
      const threshold = Number(rung);
      const existing = lines.get(key);
      if (!existing || threshold < existing.threshold) {
        lines.set(key, {
          player,
          threshold,
          yesBid: m.yes_bid ?? null,
          yesAsk: m.yes_ask ?? null,
          ticker: m.ticker,
        });
      }
    }
  }
  return lines;
}

export async function fetchKalshiLines(): Promise<Map<string, KalshiLine> | null> {
  try {
    const res = await fetch(EVENTS_URL, { cache: "no-store" });
    if (!res.ok) return null;
    return parseLines(await res.json());
  } catch {
    return null;
  }
}
