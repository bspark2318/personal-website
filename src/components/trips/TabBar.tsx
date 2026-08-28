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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-card-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 py-3 text-[11px] font-medium sm:text-xs ${
              active === tab.id ? "" : "text-muted"
            }`}
          >
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-foreground"
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
