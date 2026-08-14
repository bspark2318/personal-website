// Kalshi public market data — player points ladders. Isolated here; failure → null.

export type KalshiLine = {
  player: string; // display name from Kalshi
  threshold: number; // lowest rung, e.g. 15 (floor_strike 14.5)
  yesBid: number | null; // cents
  yesAsk: number | null;
  ticker: string;
};

export type KalshiPlayerLines = { pts?: KalshiLine; threes?: KalshiLine };

const eventsUrl = (series: string) =>
  `https://api.elections.kalshi.com/trade-api/v2/events?limit=50&status=open&series_ticker=${series}&with_nested_markets=true`;

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

async function fetchSeries(series: string): Promise<Map<string, KalshiLine> | null> {
  try {
    const res = await fetch(eventsUrl(series), { cache: "no-store" });
    if (!res.ok) return null;
    return parseLines(await res.json());
  } catch {
    return null;
  }
}

// Kalshi's WNBA player catalog: points + threes ladders.
export async function fetchKalshiLines(): Promise<Map<string, KalshiPlayerLines> | null> {
  const [pts, threes] = await Promise.all([
    fetchSeries("KXWNBAPTS"),
    fetchSeries("KXWNBA3PT"),
  ]);
  if (!pts && !threes) return null;
  const out = new Map<string, KalshiPlayerLines>();
  for (const [k, v] of pts ?? []) out.set(k, { pts: v });
  for (const [k, v] of threes ?? []) out.set(k, { ...out.get(k), threes: v });
  return out;
}
