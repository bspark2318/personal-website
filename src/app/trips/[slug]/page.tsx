"use client";

import { AnimatePresence, motion } from "framer-motion";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import CostEstimator from "@/components/trips/CostEstimator";
import DaysTab from "@/components/trips/DaysTab";
import FoodTab from "@/components/trips/FoodTab";
import NamePicker from "@/components/trips/NamePicker";
import NightlifeTab from "@/components/trips/NightlifeTab";
import OverviewTab from "@/components/trips/OverviewTab";
import PasscodeGate from "@/components/trips/PasscodeGate";
import TabBar from "@/components/trips/TabBar";
import RsvpPanel from "@/components/trips/RsvpPanel";
import {
  TRIP_HEADER,
  storageNameKey,
  storagePasscodeKey,
  type RsvpStatus,
  type TripState,
  type VoteValue,
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

  const sendRsvp = async (status: RsvpStatus) => {
    if (!myName || !state) return;
    const prev = state;
    setState({ ...state, me: { rsvp: status, votes: state.me?.votes ?? {} } });
    const res = await fetch(`/api/trips/${slug}/rsvp`, {
      method: "POST",
      headers: { [TRIP_HEADER]: passcode(), "content-type": "application/json" },
      body: JSON.stringify({ name: myName, status }),
    });
    if (!res.ok) setState(prev);
    else void tryUnlock(passcode(), myName);
  };

  const sendVote = async (activityId: string, vote: VoteValue | null) => {
    if (!myName || !state) return;
    const prev = state;
    const meVotes = { ...(state.me?.votes ?? {}) };
    if (vote === null) delete meVotes[activityId];
    else meVotes[activityId] = vote;
    setState({ ...state, me: { rsvp: state.me?.rsvp ?? null, votes: meVotes } });
    const res = await fetch(`/api/trips/${slug}/vote`, {
      method: "POST",
      headers: { [TRIP_HEADER]: passcode(), "content-type": "application/json" },
      body: JSON.stringify({ name: myName, activityId, vote }),
    });
    if (!res.ok) setState(prev);
    else void tryUnlock(passcode(), myName);
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
          {tab === "overview" && <OverviewTab trip={trip} />}
          {tab === "days" && (
            <DaysTab
              trip={trip}
              state={state}
              canVote={Boolean(myName) && !dbDown}
              onVote={sendVote}
            />
          )}
          {tab === "food" && <FoodTab trip={trip} />}
          {tab === "night" && <NightlifeTab trip={trip} />}
          {tab === "costs" && <CostEstimator trip={trip} />}
          {tab === "rsvp" && (
            <RsvpPanel
              crewSize={trip.crew.length}
              state={state}
              canRsvp={Boolean(myName) && !dbDown}
              onRsvp={sendRsvp}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />
    </main>
  );
}

