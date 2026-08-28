"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function PasscodeGate({
  tripTitle,
  error,
  onSubmit,
}: {
  tripTitle: string;
  error: string | null;
  onSubmit: (passcode: string) => void;
}) {
  const [value, setValue] = useState("");

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
            if (value.trim()) onSubmit(value.trim());
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="password"
            inputMode="text"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Passcode"
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
