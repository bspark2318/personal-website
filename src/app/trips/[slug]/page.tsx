"use client";

import { AnimatePresence, motion } from "framer-motion";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import NamePicker from "@/components/trips/NamePicker";
import PasscodeGate from "@/components/trips/PasscodeGate";
import TabBar from "@/components/trips/TabBar";
import {
  TRIP_HEADER,
  storageNameKey,
  storagePasscodeKey,
  type TripState,
} from "@/lib/trips";
import { TRIPS } from "@/lib/trips-data";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "days", label: "Days" },
  { id: "food", label: "Food" },
  { id: "night", label: "Night" },
  { id: "costs", label: "Costs" },
  { id: "rsvp", label: "RSVP" },
];

type Phase = "loading" | "locked" | "open";

export default function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trip = TRIPS[slug];

  const [phase, setPhase] = useState<Phase>("loading");
  const [gateError, setGateError] = useState<string | null>(null);
  const [myName, setMyName] = useState<string | null>(null);
  const [state, setState] = useState<TripState | null>(null);
  const [dbDown, setDbDown] = useState(false);
  const [tab, setTab] = useState("overview");

  const tryUnlock = useCallback(
    async (passcode: string, name: string | null) => {
      const me = name ? `?me=${encodeURIComponent(name)}` : "";
      let res: Response;
      try {
        res = await fetch(`/api/trips/${slug}/state${me}`, {
          headers: { [TRIP_HEADER]: passcode },
        });
      } catch {
        setDbDown(true);
        setPhase("open");
        return;
      }
      if (res.status === 401) {
        localStorage.removeItem(storagePasscodeKey(slug));
        setGateError("Wrong passcode");
        setPhase("locked");
        return;
      }
      localStorage.setItem(storagePasscodeKey(slug), passcode);
      if (res.ok) {
        setState(await res.json());
        setDbDown(false);
      } else {
        setDbDown(true);
      }
      setPhase("open");
    },
    [slug]
  );

  useEffect(() => {
    if (!trip) return;
    queueMicrotask(() => {
      const name = localStorage.getItem(storageNameKey(slug));
      if (name) setMyName(name);
      const passcode = localStorage.getItem(storagePasscodeKey(slug));
      if (passcode) void tryUnlock(passcode, name);
      else setPhase("locked");
    });
  }, [slug, trip, tryUnlock]);

  if (!trip) notFound();

  const passcode = () =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem(storagePasscodeKey(slug)) ?? "";

  const pickName = (name: string) => {
    setMyName(name);
    localStorage.setItem(storageNameKey(slug), name);
    void tryUnlock(passcode(), name);
  };

  if (phase === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-muted">Loading…</p>
      </main>
    );
  }

  if (phase === "locked") {
    return (
      <PasscodeGate
        tripTitle={trip.title}
        error={gateError}
        onSubmit={(p) => {
          setGateError(null);
          void tryUnlock(p, myName);
        }}
      />
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 pb-28 pt-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          {trip.dates} · {trip.location}
        </p>
        <h1 className="display mt-2 text-4xl font-semibold">{trip.title}</h1>
        {dbDown && (
          <p className="mt-3 rounded-lg border border-card-border px-3 py-2 text-sm text-muted">
            RSVPs and votes are offline right now — the plan below still stands.
          </p>
        )}
        <div className="mt-6">
          <NamePicker crew={trip.crew} value={myName} onChange={pickName} />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {tab === "overview" && <div className="text-muted">Overview soon.</div>}
          {tab === "days" && <div className="text-muted">Days soon.</div>}
          {tab === "food" && <div className="text-muted">Food soon.</div>}
          {tab === "night" && <div className="text-muted">Nightlife soon.</div>}
          {tab === "costs" && <div className="text-muted">Costs soon.</div>}
          {tab === "rsvp" && <div className="text-muted">RSVP soon.</div>}
        </motion.div>
      </AnimatePresence>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />
    </main>
  );
}

