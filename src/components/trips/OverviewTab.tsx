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
