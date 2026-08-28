"use client";

import { useState } from "react";
import { boldify } from "@/components/trips/boldify";
import NeighborhoodPicker from "@/components/trips/NeighborhoodPicker";
import ParkPicker from "@/components/trips/ParkPicker";
import { toCelsiusLabel, type Trip } from "@/lib/trips";

export default function OverviewTab({ trip }: { trip: Trip }) {
  const [celsius, setCelsius] = useState(false);
  const hasTemps = trip.conditions.some((c) => c.value.includes("°F"));
  return (
    <div className="space-y-10">
      <section>
        <h2 className="display mb-4 text-xl font-semibold">Highlights</h2>
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* eslint-disable @next/next/no-img-element */}
          {trip.intro.map((h, i) => (
            <li
              key={h.text}
              className={`flex items-center gap-3 rounded-2xl border border-card-border bg-white p-2 ${
                i === 0 ? "sm:col-span-2" : ""
              }`}
            >
              <img
                src={h.photo.src}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
              <p className="text-[13px] leading-snug">{boldify(h.text)}</p>
            </li>
          ))}
          {/* eslint-enable @next/next/no-img-element */}
        </ul>
        <p className="mt-2 text-[10px] text-muted">
          Photos: {trip.intro.map((h) => h.photo.credit).join(" · ")}
        </p>
      </section>
      {trip.conditions.length > 0 && (
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="display text-xl font-semibold">Conditions, mid–late October</h2>
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
            Neighborhood options
          </h2>
          <NeighborhoodPicker neighborhoods={trip.neighborhoods} />
        </section>
      )}
      {trip.parks.length > 0 && (
        <section>
          <h2 className="display mb-4 text-xl font-semibold">
            Parks & wild places
          </h2>
          <ParkPicker parks={trip.parks} />
        </section>
      )}
      {trip.info.map((section) => (
        <section key={section.title}>
          <h2 className="display mb-4 text-xl font-semibold">{section.title}</h2>
          <ul className="space-y-2.5">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                <span className="mt-[3px] shrink-0">·</span>
                <span>{boldify(b)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
