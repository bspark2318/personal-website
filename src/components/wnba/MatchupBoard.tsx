"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { pairStarters, type Snapshot } from "@/lib/wnba";
import PlayerLogTable from "./PlayerLogTable";
import TeamTrends from "./TeamTrends";

function tipoff(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
}

export default function MatchupBoard({ snapshot }: { snapshot: Snapshot }) {
  const [selected, setSelected] = useState(0);
  const matchup = snapshot.matchups[selected];
  const pairs = pairStarters(matchup.away.starters, matchup.home.starters);

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
            <TeamTrends matchup={matchup} />
          </div>

          {/* positional player-vs-player rows */}
          <div className="mb-2 grid grid-cols-2 gap-2 text-center text-xs uppercase tracking-[0.2em] text-muted">
            <p>{matchup.away.team.abbreviation}</p>
            <p>{matchup.home.team.abbreviation}</p>
          </div>
          <p className="mb-3 text-center text-[11px] text-muted">
            projected starters (by minutes), paired by position
          </p>
          <div className="flex flex-col gap-3">
            {pairs.map(([a, h]) => {
              const scaleMax = Math.max(
                ...a.last10.map((l) => l.pts),
                ...h.last10.map((l) => l.pts),
                1
              );
              return (
                <div key={a.playerId} className="grid grid-cols-2 items-start gap-2 sm:gap-3">
                  <PlayerLogTable player={a} scaleMax={scaleMax} />
                  <PlayerLogTable player={h} scaleMax={scaleMax} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
