"use client";

import { useEffect, useState } from "react";

type Room = { id: string; room: string; count: number };

export default function RoomNav({ rooms }: { rooms: Room[] }) {
  const [active, setActive] = useState(rooms[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const r of rooms) {
      const el = document.getElementById(r.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [rooms]);

  if (rooms.length === 0) return null;

  return (
    <div className="sticky top-16 z-40 -mx-6 mb-12 border-y border-card-border bg-nav-bg px-6 py-3 backdrop-blur-xl">
      <div className="flex gap-2 overflow-x-auto">
        {rooms.map((r) => (
          <a
            key={r.id}
            href={`#${r.id}`}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === r.id
                ? "border-card-border-hover bg-card-from text-foreground"
                : "border-card-border text-muted hover:text-foreground"
            }`}
          >
            {r.room}
            <span className="text-xs opacity-60">{r.count}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
