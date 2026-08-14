"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { avg, type PlayerLog } from "@/lib/wnba";

// Chronological left→right pts sparkline; 2px line, hover titles per point.
function Sparkline({ log }: { log: PlayerLog }) {
  const pts = [...log.last10].reverse();
  if (pts.length < 2) return null;
  const w = 120;
  const h = 32;
  const max = Math.max(...pts.map((l) => l.pts), 1);
  const x = (i: number) => (i / (pts.length - 1)) * (w - 8) + 4;
  const y = (v: number) => h - 4 - (v / max) * (h - 8);
  const d = pts.map((l, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(l.pts)}`).join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-8 w-[120px] text-foreground"
      role="img"
      aria-label={`Points, last ${pts.length} games`}
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {pts.map((l, i) => (
        <circle key={l.eventId} cx={x(i)} cy={y(l.pts)} r="4" fill="transparent">
          <title>{`${l.pts} pts · ${l.opponentAbbr}`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function PlayerLogTable({ player }: { player: PlayerLog }) {
  const [open, setOpen] = useState(false);
  const vs = player.vsOpponent;

  return (
    <div className="rounded-2xl border border-card-border bg-[image:linear-gradient(var(--card-from),transparent)] p-4 transition-colors hover:border-card-border-hover">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{player.name}</p>
          <p className="mt-0.5 text-xs text-muted">
            L10 · {avg(player.last10, "pts")} pts · {avg(player.last10, "reb")} reb ·{" "}
            {avg(player.last10, "ast")} ast
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {vs.length > 0
              ? `vs opp: ${vs.slice(0, 5).map((l) => l.pts).join(", ")} pts`
              : "no games vs opp"}
          </p>
        </div>
        <Sparkline log={player} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
            <table className="mt-3 w-full min-w-[320px] text-xs">
              <thead className="text-muted">
                <tr className="text-left">
                  <th className="py-1 pr-2 font-normal">Date</th>
                  <th className="py-1 pr-2 font-normal">Opp</th>
                  <th className="py-1 pr-2 font-normal">Res</th>
                  <th className="py-1 pr-2 text-right font-normal">MIN</th>
                  <th className="py-1 pr-2 text-right font-normal">PTS</th>
                  <th className="py-1 pr-2 text-right font-normal">REB</th>
                  <th className="py-1 text-right font-normal">AST</th>
                </tr>
              </thead>
              <tbody>
                {player.last10.map((l) => (
                  <tr key={l.eventId} className="border-t border-card-border">
                    <td className="py-1 pr-2 text-muted">
                      {new Date(l.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: "America/New_York",
                      })}
                    </td>
                    <td className="py-1 pr-2">{l.opponentAbbr}</td>
                    <td className="py-1 pr-2">{l.result}</td>
                    <td className="py-1 pr-2 text-right">{l.min}</td>
                    <td className="py-1 pr-2 text-right font-medium">{l.pts}</td>
                    <td className="py-1 pr-2 text-right">{l.reb}</td>
                    <td className="py-1 text-right">{l.ast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
