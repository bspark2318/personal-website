"use client";

import { useState } from "react";
import NeighborhoodPicker from "@/components/trips/NeighborhoodPicker";
import { toCelsiusLabel, type Trip } from "@/lib/trips";

export default function OverviewTab({ trip }: { trip: Trip }) {
  const [celsius, setCelsius] = useState(false);
  const hasTemps = trip.conditions.some((c) => c.value.includes("°F"));
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
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="display text-xl font-semibold">Mid–late October, Miami</h2>
            {hasTemps && (
              <div className="flex overflow-hidden rounded-full border border-card-border text-xs font-medium">
                {(["F", "C"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setCelsius(u === "C")}
                    className={`px-2.5 py-1 ${
                      (u === "C") === celsius
                        ? "bg-foreground text-background"
                        : "text-muted"
                    }`}
                  >
                    °{u}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trip.conditions.map((c) => (
              <div
                key={c.label}
                className={`flex flex-col justify-end rounded-2xl border border-card-border p-4 ${
                  c.span === "big"
                    ? "col-span-2 row-span-2 bg-gradient-to-br from-sky-100 to-emerald-50"
                    : c.span === "wide"
                      ? "col-span-2 bg-gradient-to-br from-amber-50 to-orange-50"
                      : ""
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
                  {c.label}
                </p>
                <p
                  className={`display mt-1 font-semibold tabular-nums ${
                    c.span === "big" ? "text-4xl" : "text-2xl"
                  }`}
                >
                  {celsius ? toCelsiusLabel(c.value) : c.value}
                </p>
                {c.sub && <p className="mt-1 text-xs text-muted">{c.sub}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {trip.neighborhoods.length > 0 && (
        <section>
          <h2 className="display mb-4 text-xl font-semibold">
            Where we stay — pick a lane
          </h2>
          <NeighborhoodPicker neighborhoods={trip.neighborhoods} />
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
