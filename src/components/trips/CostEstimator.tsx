"use client";

import { useState } from "react";
import {
  costLinePerPerson,
  estimateCost,
  type SpendProfile,
  type Trip,
  type TripState,
} from "@/lib/trips";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const PROFILES: { id: SpendProfile; label: string; hint: string }[] = [
  { id: "conservative", label: "Conservative", hint: "low end of every range" },
  { id: "medium", label: "Medium", hint: "middle of every range" },
  { id: "aggressive", label: "Aggressive", hint: "high end of every range" },
];

// Nights out get inline on/off switches in the breakdown instead of a pill.
const NIGHTLIFE = new Set(["club-fri", "club-sat"]);

export default function CostEstimator({
  trip,
  state,
}: {
  trip: Trip;
  state: TripState | null;
}) {
  const [headcount, setHeadcount] = useState(trip.crew.length);
  const [profile, setProfile] = useState<SpendProfile>("medium");
  // Explicit chip toggles override the vote-derived default (id → on/off).
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  // A 👎 drops that activity's cost line by default; a manual toggle wins.
  const myVotes = state?.me?.votes;
  const isOn = (id: string) => overrides[id] ?? myVotes?.[id] !== "down";
  const off = trip.activities.filter((a) => !isOn(a.id)).map((a) => a.id);

  const { perPerson } = estimateCost(trip.costItems, headcount, off, profile);
  const activeHint = PROFILES.find((p) => p.id === profile)?.hint;
  const toggle = (id: string) =>
    setOverrides((prev) => ({ ...prev, [id]: !isOn(id) }));

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-card-border p-5 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          Your estimated damage
        </p>
        <p className="display mt-2 text-5xl font-semibold tabular-nums">
          {fmt(perPerson)}
        </p>
        <p className="mt-1 text-sm text-muted">per person, flights included</p>
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
          Spend level
        </p>
        <div className="flex rounded-full border border-card-border p-1">
          {PROFILES.map((p) => {
            const on = p.id === profile;
            return (
              <button
                key={p.id}
                onClick={() => setProfile(p.id)}
                aria-pressed={on}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  on ? "bg-foreground text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {activeHint && <p className="mt-2 text-xs text-muted">{activeHint}</p>}
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
          How many go
        </p>
        <div className="flex items-center justify-center gap-4">
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
            .filter(
              (a) =>
                !NIGHTLIFE.has(a.id) &&
                trip.costItems.some((c) => c.activityId === a.id)
            )
            .map((a) => {
              const on = isOn(a.id);
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
                  {a.emoji && <span className="mr-1">{a.emoji}</span>}
                  {a.title}
                </button>
              );
            })}
        </div>
        {myVotes && (
          <p className="mt-2 text-xs text-muted">
            Synced to your votes — a 👎 on the Activities tab drops that line.
          </p>
        )}
      </section>

      <section>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">
          The breakdown
        </p>
        <ul className="divide-y divide-card-border">
          {trip.costItems.map((item) => {
            const night = Boolean(item.activityId && NIGHTLIFE.has(item.activityId));
            const optional = Boolean(item.activityId);
            const on = !optional || isOn(item.activityId!);
            // Pill-toggled activities drop out of the breakdown when off;
            // nights out stay visible with an inline switch.
            if (!night && !on) return null;
            const pp = costLinePerPerson(item, headcount, profile);
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className={`text-[15px] ${on ? "" : "text-muted line-through"}`}>
                  {item.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-right">
                    <span
                      className={`tabular-nums font-medium ${
                        on ? "" : "text-muted line-through"
                      }`}
                    >
                      {fmt(pp)}
                    </span>
                    {item.rangeLabel && (
                      <span className="ml-2 text-xs text-muted">{item.rangeLabel}</span>
                    )}
                  </span>
                  {night && (
                    <button
                      role="switch"
                      aria-checked={on}
                      aria-label={`${on ? "Remove" : "Add"} ${item.label}`}
                      onClick={() => toggle(item.activityId!)}
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                        on
                          ? "border-foreground bg-foreground text-background"
                          : "border-card-border text-muted"
                      }`}
                    >
                      {on ? "On" : "Off"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
          <li className="flex items-baseline justify-between gap-3 py-3">
            <span className="font-semibold">Total</span>
            <span className="display font-semibold tabular-nums">{fmt(perPerson)}</span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted">
          Nights out toggle on the line; fixed costs (house, boat) split by headcount.
        </p>
      </section>
    </div>
  );
}
