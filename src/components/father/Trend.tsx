"use client";

import { useState } from "react";
import { flag, shortDate, type Lab } from "@/lib/father/data";

const DOT = { hi: "#ef4444", lo: "#3b82f6", "": "#9ca3af" } as const;

export default function Trend({ lab, dates, compact = false }: { lab: Lab; dates: string[]; compact?: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 300, H = compact ? 56 : 130, px = compact ? 4 : 16, py = compact ? 6 : 16;
  const pts = lab.values.map((v, i) => ({ v, i })).filter((p): p is { v: number; i: number } => p.v != null);
  const vs = pts.map((p) => p.v);
  let lo = Math.min(...vs, lab.lo), hi = Math.max(...vs, lab.hi);
  if (lab.hi === 0) { lo = 0; hi = Math.max(...vs, 1); }
  if (lab.name === "eGFR") hi = Math.max(...vs, 60);
  const pad = (hi - lo) * 0.1 || 1;
  lo -= pad; hi += pad;
  const x = (i: number) => px + (i * (W - 2 * px)) / (dates.length - 1);
  const y = (v: number) => py + (H - 2 * py) * (1 - (v - lo) / (hi - lo));
  const bandTop = y(Math.min(lab.hi, hi)), bandBot = y(Math.max(lab.lo, lo));
  const d = pts.map((p, k) => `${k ? "L" : "M"}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const hp = hover != null ? pts.find((p) => p.i === hover) : undefined;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full overflow-visible" style={{ height: H }} onMouseLeave={() => setHover(null)}>
      <rect x={px} y={bandTop} width={W - 2 * px} height={Math.max(0, bandBot - bandTop)} className="fill-foreground/[0.06]" rx={2} />
      {!compact && hp && <line x1={x(hp.i)} x2={x(hp.i)} y1={py - 6} y2={H - py + 6} className="stroke-foreground/20" strokeDasharray="3 3" />}
      <path d={d} fill="none" className="stroke-foreground/70" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p) => (
        <g key={p.i}>
          {!compact && <rect x={x(p.i) - 22} y={0} width={44} height={H} fill="transparent" onMouseEnter={() => setHover(p.i)} />}
          <circle cx={x(p.i)} cy={y(p.v)} r={compact ? 2.5 : hover === p.i ? 6 : 4.5} fill={DOT[flag(p.v, lab.lo, lab.hi)]} className="stroke-background" strokeWidth={2} pointerEvents="none" />
        </g>
      ))}
      {!compact && (
        <>
          {hp ? (
            <g pointerEvents="none">
              <rect x={Math.min(Math.max(x(hp.i) - 44, 0), W - 88)} y={0} width={88} height={20} rx={5} className="fill-foreground" />
              <text x={Math.min(Math.max(x(hp.i), 44), W - 44)} y={14} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-background">
                {shortDate(dates[hp.i])} · {hp.v}
              </text>
            </g>
          ) : (
            <text x={x(last.i)} y={y(last.v) - 10} textAnchor="end" fontSize={12} fontWeight={700} className="fill-foreground">{last.v}</text>
          )}
          {dates.map((dt, i) => (
            <text key={dt} x={x(i)} y={H - 2} textAnchor="middle" fontSize={9.5} className="fill-muted">{shortDate(dt)}</text>
          ))}
        </>
      )}
    </svg>
  );
}
