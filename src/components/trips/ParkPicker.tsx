"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { boldify } from "@/components/trips/boldify";
import type { Park } from "@/lib/trips";

export default function ParkPicker({ parks }: { parks: Park[] }) {
  const [activeId, setActiveId] = useState(parks[0]?.id);
  const active = parks.find((p) => p.id === activeId);
  if (!active) return null;

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(active.mapsQuery)}`;

  return (
    <div>
      <div className="mb-3 flex overflow-hidden rounded-full border border-card-border">
        {parks.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`relative flex-1 py-2 text-[13px] font-medium transition-colors ${
              p.id === activeId ? "text-background" : "text-muted"
            }`}
          >
            {p.id === activeId && (
              <motion.div
                layoutId="park-pill"
                className="absolute inset-0 bg-foreground"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">
              {p.emoji} {p.name}
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
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={active.photos[0]?.src}
            alt={active.name}
            className="h-48 w-full object-cover sm:h-64"
          />
          {active.photos.length > 1 && (
            <div className="grid grid-cols-2 gap-px">
              {active.photos.slice(1).map((p) => (
                <img
                  key={p.src}
                  src={p.src}
                  alt={active.name}
                  className={`h-28 w-full object-cover sm:h-36 ${
                    active.photos.length === 2 ? "col-span-2" : ""
                  }`}
                />
              ))}
            </div>
          )}
          {/* eslint-enable @next/next/no-img-element */}
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
                  <span>{boldify(b)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in Google Maps"
                title="Open in Google Maps"
                className="text-base font-medium hover:opacity-60"
              >
                ↗
              </a>
              <span className="text-right text-[10px] text-muted">
                Photos: {active.photos.map((p) => p.credit).join(" · ")}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
