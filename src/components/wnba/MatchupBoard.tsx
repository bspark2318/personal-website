"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { avg, pairStarters, type PlayerLog, type Snapshot } from "@/lib/wnba";
import { normalizeName, type KalshiData, type KalshiTotal } from "@/lib/kalshi";
import PlayerLogTable from "./PlayerLogTable";
import TeamTrends from "./TeamTrends";

// team-leader badges by L10 average: PTS / REB / AST
function leaderBadges(starters: PlayerLog[]): Map<string, string[]> {
  const badges = new Map<string, string[]>();
  for (const stat of ["pts", "reb", "ast"] as const) {
    const best = starters.reduce((a, b) =>
      avg(b.last10, stat) > avg(a.last10, stat) ? b : a
    );
    if (avg(best.last10, stat) > 0) {
      badges.set(best.playerId, [
        ...(badges.get(best.playerId) ?? []),
        stat.toUpperCase(),
      ]);
    }
  }
  return badges;
}

function tipoff(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
}

// "New York Liberty" → "new york"; match a totals title naming both cities
function totalForMatchup(
  totals: KalshiTotal[] | undefined,
  away: string,
  home: string
): KalshiTotal | undefined {
  const city = (dn: string) => dn.toLowerCase().split(" ").slice(0, -1).join(" ");
  return totals?.find((t) => {
    const title = t.title.toLowerCase();
    return title.includes(city(away)) && title.includes(city(home));
  });
}

export default function MatchupBoard({
  snapshot,
  kalshi,
}: {
  snapshot: Snapshot;
  kalshi: KalshiData | null;
}) {
  const lineFor = (p: PlayerLog) => kalshi?.players[normalizeName(p.name)];
  const [selected, setSelected] = useState(0);
  const [side, setSide] = useState<"away" | "home">("away");
  const matchup = snapshot.matchups[selected];
  const total = totalForMatchup(
    kalshi?.totals,
    matchup.away.team.displayName,
    matchup.home.team.displayName
  );
  const pairs = pairStarters(matchup.away.starters, matchup.home.starters);
  const badges = new Map([
    ...leaderBadges(matchup.away.starters),
    ...leaderBadges(matchup.home.starters),
  ]);

  return (
    <div>
      {/* game pills */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {snapshot.matchups.map((m, i) => (
          <button
            key={m.game.id}
            onClick={() => setSelected(i)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              i === selected ? "text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {i === selected && (
              <motion.span
                layoutId="pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className="relative">
              {m.game.away.abbreviation} @ {m.game.home.abbreviation} ·{" "}
              {tipoff(m.game.date)}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={matchup.game.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6">
            <TeamTrends matchup={matchup} kalshiTotal={total} />
          </div>

          <p className="mb-3 text-center text-[11px] text-muted">
            projected starters (by minutes), paired by position
          </p>

          {/* mobile: one team at a time, full-width cards */}
          <div className="sm:hidden">
            <div className="mb-4 grid grid-cols-2 rounded-full border border-card-border p-1 text-sm">
              {(["away", "home"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`relative rounded-full py-2.5 font-medium transition-colors ${
                    side === s ? "text-background" : "text-muted"
                  }`}
                >
                  {side === s && (
                    <motion.span
                      layoutId="side"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative">{matchup[s].team.abbreviation}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {pairs.map(([a, h]) => {
                const p = side === "away" ? a : h;
                return (
                  <PlayerLogTable
                    key={p.playerId}
                    player={p}
                    badges={badges.get(p.playerId)}
                    kalshi={lineFor(p)}
                  />
                );
              })}
            </div>
          </div>

          {/* sm+: positional player-vs-player columns */}
          <div className="hidden sm:block">
            <div className="mb-2 grid grid-cols-2 gap-3 text-center text-xs uppercase tracking-[0.2em] text-muted">
              <p>{matchup.away.team.abbreviation}</p>
              <p>{matchup.home.team.abbreviation}</p>
            </div>
            <div className="flex flex-col gap-3">
              {pairs.map(([a, h]) => {
                const scaleMax = Math.max(
                  ...a.last10.map((l) => l.pts),
                  ...h.last10.map((l) => l.pts),
                  1
                );
                return (
                  <div key={a.playerId} className="grid grid-cols-2 items-start gap-3">
                    <PlayerLogTable player={a} scaleMax={scaleMax} badges={badges.get(a.playerId)} kalshi={lineFor(a)} />
                    <PlayerLogTable player={h} scaleMax={scaleMax} badges={badges.get(h.playerId)} kalshi={lineFor(h)} />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
