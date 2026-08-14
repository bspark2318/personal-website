"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Snapshot } from "@/lib/wnba";
import MatchupCard from "./MatchupCard";
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
  const [side, setSide] = useState<"away" | "home">("away");
  const matchup = snapshot.matchups[selected];

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

          {/* mobile: one team at a time via segmented control; sm+: both columns */}
          <div className="mb-4 grid grid-cols-2 rounded-full border border-card-border p-1 text-sm sm:hidden">
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

          <div className="flex flex-col gap-6 sm:flex-row">
            <div className={`${side === "away" ? "" : "hidden"} flex-1 sm:block`}>
              <MatchupCard side={matchup.away} />
            </div>
            <div className={`${side === "home" ? "" : "hidden"} flex-1 sm:block`}>
              <MatchupCard side={matchup.home} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
