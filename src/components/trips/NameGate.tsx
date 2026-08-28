"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { matchCrew, type CrewMember } from "@/lib/trips";

export default function NameGate({
  tripTitle,
  crew,
  onUnlock,
}: {
  tripTitle: string;
  crew: CrewMember[];
  onUnlock: (name: string) => void;
}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="aurora-warm absolute inset-0 -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">
          Private trip
        </p>
        <h1 className="display mb-8 text-3xl font-semibold">{tripTitle}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = matchCrew(first, last, crew);
            if (name) onUnlock(name);
            else setError("No match — check both names");
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            autoFocus
            value={first}
            onChange={(e) => {
              setFirst(e.target.value);
              setError(null);
            }}
            placeholder="First name"
            className="rounded-xl border border-card-border bg-transparent px-4 py-3 text-center outline-none focus:border-card-border-hover"
          />
          <input
            type="password"
            value={last}
            onChange={(e) => {
              setLast(e.target.value);
              setError(null);
            }}
            placeholder="Last name"
            className="rounded-xl border border-card-border bg-transparent px-4 py-3 text-center outline-none focus:border-card-border-hover"
          />
          <button
            type="submit"
            className="rounded-xl bg-foreground px-4 py-3 font-medium text-background transition-opacity hover:opacity-80"
          >
            Enter
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </motion.div>
    </main>
  );
}
