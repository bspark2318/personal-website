"use client";

import type { Trip } from "@/lib/trips";

const mapsUrl = (name: string, city: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city}`)}`;

export default function FoodTab({ trip }: { trip: Trip }) {
  const city = trip.location.split("—")[0].trim();
  return (
    <div className="space-y-10">
      {trip.food.map(({ group, spots }) => (
        <section key={group}>
          <h2 className="display mb-4 text-xl font-semibold">{group}</h2>
          <ul className="divide-y divide-card-border">
            {spots.map((spot) => (
              <li key={`${group}-${spot.name}`} className="flex items-baseline gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    <a
                      href={mapsUrl(spot.name, city)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline-offset-2 hover:underline"
                    >
                      {spot.name}
                      <span className="ml-1 text-xs text-muted">↗</span>
                    </a>
                  </p>
                  <p className="text-sm text-muted">{spot.detail}</p>
                </div>
                {spot.price && (
                  <span className="shrink-0 text-sm text-muted">{spot.price}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
