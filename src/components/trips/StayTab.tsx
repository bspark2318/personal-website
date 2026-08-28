"use client";

import type { Trip } from "@/lib/trips";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function StayTab({ trip }: { trip: Trip }) {
  const heads = trip.crew.length;
  return (
    <div className="space-y-6">
      {trip.stays.map((s) => (
        <div key={s.id} className="overflow-hidden rounded-2xl border border-card-border">
          {s.images.length > 0 && (
            <div className="flex snap-x snap-mandatory gap-1 overflow-x-auto">
              {s.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={s.name}
                  loading="lazy"
                  className="h-52 w-72 shrink-0 snap-start object-cover"
                />
              ))}
            </div>
          )}
          <div className="p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{s.name}</h3>
              <span className="shrink-0 text-sm text-muted">
                {s.layout} · sleeps {s.sleeps}
              </span>
            </div>
            <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-muted">
              {s.neighborhood}
            </p>
            <p className="mt-3 text-[15px]">
              <span className="display text-xl font-semibold tabular-nums">{fmt(s.total)}</span>
              <span className="text-muted"> total · {fmt(s.perNight)}/night · </span>
              <span className="font-medium tabular-nums">{fmt(Math.round(s.total / heads))}</span>
              <span className="text-muted">/person at {heads}</span>
            </p>
            {s.notes.length > 0 && (
              <ul className="mt-2 space-y-1">
                {s.notes.map((n) => (
                  <li key={n} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-[2px] shrink-0">·</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-full border border-foreground px-4 py-1.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
            >
              View on Airbnb ↗
            </a>
          </div>
        </div>
      ))}
      <p className="text-xs text-muted">
        Prices are for the trip dates, all fees in — they move if we shift the weekend.
      </p>
    </div>
  );
}
