"use client";

import type { DateOption, LineupSlot, Trip, Venue } from "@/lib/trips";

// Flatten a venue's lineups into an ordered ticker-tape sequence:
// each candidate weekend becomes an "index" marker, followed by its acts
// (or a TBA tick when nothing is announced yet).
type Tick =
  | { kind: "week"; label: string }
  | { kind: "act"; slot: LineupSlot }
  | { kind: "tba" };

function toTicks(lineups: NonNullable<Venue["lineups"]>, options: DateOption[]): Tick[] {
  const ticks: Tick[] = [];
  for (const opt of options) {
    ticks.push({ kind: "week", label: opt.label });
    const slots = lineups[opt.id] ?? [];
    if (slots.length === 0) ticks.push({ kind: "tba" });
    else for (const slot of slots) ticks.push({ kind: "act", slot });
  }
  return ticks;
}

function Tape({ ticks }: { ticks: Tick[] }) {
  // Duration scales with content so scroll speed stays constant across venues.
  const duration = Math.max(ticks.length * 3.5, 16);
  const run = (aria: boolean) => (
    <span className="tape__run" aria-hidden={aria || undefined}>
      {ticks.map((t, i) => {
        if (t.kind === "week")
          return (
            <span key={i} className="tape__week">
              {t.label.replace(/\s*\(.*\)$/, "")}
            </span>
          );
        if (t.kind === "tba")
          return (
            <span key={i} className="tape__tba">
              TBA
            </span>
          );
        return (
          <span key={i} className="tape__act">
            <span className="tape__arrow">▲</span>{" "}
            <span className="tape__date">{t.slot.date}</span>{" "}
            <span className="tape__name">{t.slot.act}</span>
            {t.slot.note ? (
              <>
                {" "}
                <span className="tape__note">({t.slot.note})</span>
              </>
            ) : null}
          </span>
        );
      })}
    </span>
  );
  return (
    <div className="tape">
      <div className="tape__track" style={{ animationDuration: `${duration}s` }}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

export default function NightlifeTab({ trip }: { trip: Trip }) {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        {trip.nightlife.venues.map((v) => (
          <div key={v.name} className="rounded-2xl border border-card-border p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{v.name}</h3>
              <span className="shrink-0 text-sm text-muted">{v.cover}</span>
            </div>
            <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-muted">
              {v.where}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{v.vibe}</p>
            <p className="mt-1 text-sm text-muted">{v.notes}</p>

            {v.lineups && <Tape ticks={toTicks(v.lineups, trip.dateOptions)} />}
          </div>
        ))}
      </section>
      <section>
        <h2 className="display mb-4 text-xl font-semibold">Rules of engagement</h2>
        <ul className="space-y-2.5">
          {trip.nightlife.rules.map((r) => (
            <li key={r} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
              <span className="mt-[3px] shrink-0">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
