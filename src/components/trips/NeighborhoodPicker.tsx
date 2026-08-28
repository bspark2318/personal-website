"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Neighborhood } from "@/lib/trips";

export default function NeighborhoodPicker({
  neighborhoods,
}: {
  neighborhoods: Neighborhood[];
}) {
  const [activeId, setActiveId] = useState(neighborhoods[0]?.id);
  const active = neighborhoods.find((n) => n.id === activeId);
  if (!active) return null;

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.mapsQuery)}`;
  const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(active.mapsQuery)}&z=14&output=embed`;

  return (
    <div>
      <div className="mb-3 flex overflow-hidden rounded-full border border-card-border">
        {neighborhoods.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveId(n.id)}
            className={`relative flex-1 py-2 text-[13px] font-medium transition-colors ${
              n.id === activeId ? "text-background" : "text-muted"
            }`}
          >
            {n.id === activeId && (
              <motion.div
                layoutId="hood-pill"
                className="absolute inset-0 bg-foreground"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">
              {n.emoji} {n.name}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="overflow-hidden rounded-2xl border border-card-border"
        >
          <iframe
            title={`Map of ${active.name}`}
            src={mapsEmbed}
            className="h-44 w-full border-0 sm:h-56"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">
                {active.emoji} {active.name}
              </h3>
              <span className="text-xs uppercase tracking-[0.15em] text-muted">
                {active.tagline}
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {active.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-[2px] shrink-0">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium underline-offset-2 hover:underline"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
