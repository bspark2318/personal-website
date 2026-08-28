"use client";

import { AnimatePresence, motion } from "framer-motion";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import ActivitiesTab from "@/components/trips/ActivitiesTab";
import CostEstimator from "@/components/trips/CostEstimator";
import FoodTab from "@/components/trips/FoodTab";
import NightlifeTab from "@/components/trips/NightlifeTab";
import OverviewTab from "@/components/trips/OverviewTab";
import TabBar from "@/components/trips/TabBar";
import RsvpPanel from "@/components/trips/RsvpPanel";
import {
  storageNameKey,
  type RsvpStatus,
  type TripState,
  type VoteValue,
} from "@/lib/trips";
import { TRIPS } from "@/lib/trips-data";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "activities", label: "Activities" },
  { id: "food", label: "Food" },
  { id: "night", label: "Night" },
  { id: "costs", label: "Costs" },
  { id: "rsvp", label: "RSVP" },
];

type Phase = "loading" | "open";

export default function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trip = TRIPS[slug];

  const [phase, setPhase] = useState<Phase>("loading");
  const [myName, setMyName] = useState<string | null>(null);
  const [state, setState] = useState<TripState | null>(null);
  const [dbDown, setDbDown] = useState(false);
  const [tab, setTab] = useState("overview");

  // Passcode gate is disabled (see checkTripPassword in trips-db.ts); requests
  // carry no auth header. Re-add TRIP_HEADER here when the gate comes back.
  const loadState = useCallback(
    async (name: string | null) => {
      const me = name ? `?me=${encodeURIComponent(name)}` : "";
      let res: Response;
      try {
        res = await fetch(`/api/trips/${slug}/state${me}`);
      } catch {
        setDbDown(true);
        setPhase("open");
        return;
      }
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
      void loadState(name);
    });
  }, [slug, trip, loadState]);

  if (!trip) notFound();

  const pickName = (name: string) => {
    setMyName(name);
    localStorage.setItem(storageNameKey(slug), name);
    void loadState(name);
  };

  const sendRsvp = async (status: RsvpStatus) => {
    if (!myName || !state) return;
    const prev = state;
    setState({ ...state, me: { rsvp: status, votes: state.me?.votes ?? {} } });
    const res = await fetch(`/api/trips/${slug}/rsvp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: myName, status }),
    });
    if (!res.ok) setState(prev);
    else void loadState(myName);
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
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: myName, activityId, vote }),
    });
    if (!res.ok) setState(prev);
    else void loadState(myName);
  };

  if (phase === "loading") {
    return (
      <main className="trip-light flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-muted">Loading…</p>
      </main>
    );
  }

  return (
    <div className="trip-light min-h-screen">
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-10">
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              {trip.dates} · {trip.location}
            </p>
            <h1 className="display mt-2 text-4xl font-semibold">{trip.title}</h1>
          </div>
          {myName && (
            <button
              onClick={() => setTab("rsvp")}
              className="mt-1 shrink-0 rounded-full border border-card-border px-3 py-1.5 text-sm text-muted hover:border-card-border-hover"
            >
              {myName}
            </button>
          )}
        </div>
        {dbDown && (
          <p className="mt-3 rounded-lg border border-card-border px-3 py-2 text-sm text-muted">
            RSVPs and votes are offline right now — the plan below still stands.
          </p>
        )}
      </header>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {tab === "overview" && <OverviewTab trip={trip} />}
          {tab === "activities" && (
            <ActivitiesTab
              trip={trip}
              state={state}
              canVote={Boolean(myName) && !dbDown}
              onVote={sendVote}
            />
          )}
          {tab === "food" && <FoodTab trip={trip} />}
          {tab === "night" && <NightlifeTab trip={trip} />}
          {tab === "costs" && <CostEstimator trip={trip} state={state} />}
          {tab === "rsvp" && (
            <RsvpPanel
              crew={trip.crew}
              myName={myName}
              onPickName={pickName}
              state={state}
              canRsvp={Boolean(myName) && !dbDown}
              onRsvp={sendRsvp}
            />
          )}
        </motion.div>
      </AnimatePresence>
      </main>
    </div>
  );
}

