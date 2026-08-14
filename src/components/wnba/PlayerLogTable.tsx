"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { avg, type PlayerLog } from "@/lib/wnba";

// Last-10 pts as bars (oldest→newest) with a dashed line at the L10 average.
// scaleMax is shared across the matchup pair so the two charts are comparable.
function PtsBars({ log, scaleMax }: { log: PlayerLog; scaleMax: number }) {
  const games = [...log.last10].reverse();
  if (games.length === 0) return null;
  const w = 140;
  const h = 44;
  const pad = 2;
  const mean = avg(log.last10, "pts");
  const slot = (w - pad * 2) / 10; // fixed 10 slots so bar width is constant
  const bw = slot - 2; // 2px gap between bars
  const y = (v: number) => h - (v / scaleMax) * (h - 10); // top 10px for headroom
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-11 w-full max-w-[160px] text-foreground"
      role="img"
      aria-label={`Points per game, last ${games.length}; average ${mean}`}
    >
      {games.map((l, i) => (
        <g key={l.eventId}>
          <rect
            x={pad + i * slot}
            y={y(l.pts)}
            width={bw}
            height={Math.max(h - y(l.pts), 1)}
            rx="1.5"
            fill="currentColor"
            opacity="0.55"
          />
          <rect x={pad + i * slot} y={0} width={slot} height={h} fill="transparent">
            <title>{`${l.pts} pts · ${l.opponentAbbr}`}</title>
          </rect>
        </g>
      ))}
      <line
        x1={pad}
        x2={w - pad}
        y1={y(mean)}
        y2={y(mean)}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

export default function PlayerLogTable({
  player,
  scaleMax,
}: {
  player: PlayerLog;
  scaleMax?: number;
}) {
  const [open, setOpen] = useState(false);
  const vs = player.vsOpponent;
  const max = scaleMax ?? Math.max(...player.last10.map((l) => l.pts), 1);

  return (
    <div className="rounded-2xl border border-card-border bg-[image:linear-gradient(var(--card-from),transparent)] p-4 transition-colors hover:border-card-border-hover">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-col gap-1.5 text-left focus:outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-card-border-hover"
        aria-expanded={open}
      >
        <div className="flex w-full min-w-0 items-baseline gap-1.5">
          <p className="min-w-0 truncate text-sm font-semibold">{player.name}</p>
          <span className="shrink-0 rounded bg-card-from px-1 text-[10px] text-muted">
            {player.pos || "—"}
          </span>
        </div>
        <p className="text-xs text-muted">
          L10 · {avg(player.last10, "pts")}p · {avg(player.last10, "reb")}r ·{" "}
          {avg(player.last10, "ast")}a
        </p>
        <p className="text-xs text-muted">
          {vs.length > 0
            ? `vs opp: ${vs.slice(0, 5).map((l) => l.pts).join(", ")} pts`
            : "no games vs opp"}
        </p>
        <PtsBars log={player} scaleMax={max} />
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
