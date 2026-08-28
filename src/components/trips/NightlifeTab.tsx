"use client";

import type { Trip } from "@/lib/trips";

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
