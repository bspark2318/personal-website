"use client";

import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Experiments", href: "/#experiments" },
  { label: "Now", href: "/#now" },
  { label: "Show Room", href: "/show-room" },
];

export default function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-nav-bg border-b border-card-border"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="text-sm font-semibold tracking-tight">
          ✳
        </a>
        <div className="flex items-center gap-8 text-sm text-muted">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  );
}
