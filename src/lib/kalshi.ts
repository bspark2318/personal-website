// Kalshi public market data — player points ladders. Isolated here; failure → null.

export type KalshiLine = {
  player: string; // display name from Kalshi
  threshold: number; // lowest rung, e.g. 15 (floor_strike 14.5)
  yesBid: number | null; // cents
  yesAsk: number | null;
  ticker: string;
};

export type KalshiPlayerLines = {
  pts?: KalshiLine;
  threes?: KalshiLine;
  reb?: KalshiLine;
  ast?: KalshiLine;
};

export type KalshiTotal = {
  title: string; // "Los Angeles vs New York: Total"
  threshold: number; // lowest Over rung, e.g. 173.5
  yesBid: number | null;
  yesAsk: number | null;
};

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

// game-total events → lowest Over rung per game title
export function parseTotals(data: any): KalshiTotal[] {
  const totals: KalshiTotal[] = [];
  for (const e of data?.events ?? []) {
    let best: KalshiTotal | null = null;
    for (const m of e.markets ?? []) {
      if (m.status !== "active" || m.floor_strike == null) continue;
      if (!best || m.floor_strike < best.threshold) {
        best = {
          title: e.title ?? "",
          threshold: m.floor_strike,
          yesBid: m.yes_bid ?? null,
          yesAsk: m.yes_ask ?? null,
        };
      }
    }
    if (best) totals.push(best);
  }
  return totals;
}

export type KalshiData = {
  players: Record<string, KalshiPlayerLines>; // key = normalized name
  totals: KalshiTotal[];
};

// Kalshi's WNBA per-game catalog: player pts/threes/reb/ast ladders + game totals.
export async function fetchKalshiLines(): Promise<KalshiData | null> {
  const [pts, threes, reb, ast, totalsRaw] = await Promise.all([
    fetchSeries("KXWNBAPTS"),
    fetchSeries("KXWNBA3PT"),
    fetchSeries("KXWNBAREB"),
    fetchSeries("KXWNBAAST"),
    (async () => {
      try {
        const res = await fetch(eventsUrl("KXWNBATOTAL"), { cache: "no-store" });
        return res.ok ? parseTotals(await res.json()) : [];
      } catch {
        return [];
      }
    })(),
  ]);
  if (!pts && !threes && !reb && !ast) return null;
  const players: Record<string, KalshiPlayerLines> = {};
  const merge = (map: Map<string, KalshiLine> | null, key: keyof KalshiPlayerLines) => {
    for (const [k, v] of map ?? []) players[k] = { ...players[k], [key]: v };
  };
  merge(pts, "pts");
  merge(threes, "threes");
  merge(reb, "reb");
  merge(ast, "ast");
  return { players, totals: totalsRaw };
}
