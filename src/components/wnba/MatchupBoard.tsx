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
          <div className="mb-6 flex flex-col gap-6 sm:flex-row">
            <MatchupCard side={matchup.away} />
            <MatchupCard side={matchup.home} />
          </div>
          <TeamTrends matchup={matchup} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
