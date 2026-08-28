"use client";

import type { Trip } from "@/lib/trips";

export default function OverviewTab({ trip }: { trip: Trip }) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="display mb-4 text-xl font-semibold">The highlights</h2>
        <ul className="space-y-2.5">
          {trip.intro.map((line) => (
            <li key={line} className="flex gap-2.5 text-[15px] leading-relaxed">
              <span className="mt-[3px] shrink-0 text-muted">◆</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
      {trip.conditions.length > 0 && (
        <section>
          <h2 className="display mb-4 text-xl font-semibold">Late October, Miami</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {trip.conditions.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-card-border p-4"
              >
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
                  {c.label}
                </p>
                <p className="display mt-1 text-2xl font-semibold tabular-nums">
                  {c.value}
                </p>
                {c.sub && <p className="mt-1 text-xs text-muted">{c.sub}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {trip.info.map((section) => (
        <section key={section.title}>
          <h2 className="display mb-4 text-xl font-semibold">{section.title}</h2>
          <ul className="space-y-2.5">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                <span className="mt-[3px] shrink-0">·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
