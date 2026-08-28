"use client";

import { useState } from "react";
import { estimateCost, type Trip } from "@/lib/trips";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function CostEstimator({ trip }: { trip: Trip }) {
  const [headcount, setHeadcount] = useState(trip.crew.length);
  const [off, setOff] = useState<string[]>([]);

  const { perPerson, lines } = estimateCost(trip.costItems, headcount, off);
  const toggle = (id: string) =>
    setOff((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-card-border p-5 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          Your estimated damage
        </p>
        <p className="display mt-2 text-5xl font-semibold tabular-nums">
          {fmt(perPerson)}
        </p>
        <p className="mt-1 text-sm text-muted">per person + flights</p>
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
          How many go
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setHeadcount((h) => Math.max(2, h - 1))}
            className="h-11 w-11 rounded-full border border-card-border text-xl hover:border-card-border-hover"
            aria-label="Fewer people"
          >
            −
          </button>
          <span className="display w-16 text-center text-2xl font-semibold tabular-nums">
            {headcount}
          </span>
          <button
            onClick={() => setHeadcount((h) => Math.min(trip.crew.length, h + 1))}
            className="h-11 w-11 rounded-full border border-card-border text-xl hover:border-card-border-hover"
            aria-label="More people"
          >
            +
          </button>
        </div>
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
          What we do
        </p>
        <div className="flex flex-wrap gap-2">
          {trip.activities
            .filter((a) => trip.costItems.some((c) => c.activityId === a.id))
            .map((a) => {
              const on = !off.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    on
                      ? "border-foreground bg-foreground text-background"
                      : "border-card-border text-muted line-through"
                  }`}
                >
                  {a.title}
                </button>
              );
            })}
        </div>
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
          The breakdown
        </p>
        <ul className="divide-y divide-card-border">
          {lines.map((line) => (
            <li key={line.id} className="flex items-baseline justify-between gap-3 py-2.5">
              <span className="text-[15px]">{line.label}</span>
              <span className="text-right">
                <span className="tabular-nums font-medium">{fmt(line.perPerson)}</span>
                {line.rangeLabel && (
                  <span className="ml-2 text-xs text-muted">{line.rangeLabel}</span>
                )}
              </span>
            </li>
          ))}
          <li className="flex items-baseline justify-between gap-3 py-3">
            <span className="font-semibold">Total</span>
            <span className="display font-semibold tabular-nums">{fmt(perPerson)}</span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted">
          Fixed costs (house, boat) split by headcount — fewer people, pricier for everyone.
        </p>
      </section>
    </div>
  );
}
