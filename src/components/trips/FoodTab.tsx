"use client";

import type { Trip } from "@/lib/trips";

export default function FoodTab({ trip }: { trip: Trip }) {
  return (
    <div className="space-y-10">
      {trip.food.map(({ group, spots }) => (
        <section key={group}>
          <h2 className="display mb-4 text-xl font-semibold">{group}</h2>
          <ul className="divide-y divide-card-border">
            {spots.map((spot) => (
              <li key={`${group}-${spot.name}`} className="flex items-baseline gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{spot.name}</p>
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
