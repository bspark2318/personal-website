"use client";

import { motion } from "framer-motion";

export interface Tab {
  id: string;
  label: string;
}

export default function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="sticky top-0 z-20 -mx-5 mb-6 border-b border-card-border bg-background/80 px-5 backdrop-blur-xl">
      <div className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active === tab.id ? "text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {active === tab.id && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
