"use client";

import { AnimatePresence, motion } from "framer-motion";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import ActivitiesTab from "@/components/trips/ActivitiesTab";
import CostEstimator from "@/components/trips/CostEstimator";
import FoodTab from "@/components/trips/FoodTab";
import NightlifeTab from "@/components/trips/NightlifeTab";
import NameGate from "@/components/trips/NameGate";
import OverviewTab from "@/components/trips/OverviewTab";
import TabBar from "@/components/trips/TabBar";
import RsvpPanel from "@/components/trips/RsvpPanel";
import {
  fullName,
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

export default function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trip = TRIPS[slug];

  const [phase, setPhase] = useState<"loading" | "gated" | "open">("loading");
  const [myName, setMyName] = useState<string | null>(null);
  const [state, setState] = useState<TripState | null>(null);
  const [dbDown, setDbDown] = useState(false);
  const [tab, setTab] = useState("overview");

  const loadState = useCallback(
    async (name: string | null) => {
      const me = name ? `?me=${encodeURIComponent(name)}` : "";
      try {
        const res = await fetch(`/api/trips/${slug}/state${me}`);
        if (!res.ok) throw new Error("state fetch failed");
        setState(await res.json());
        setDbDown(false);
      } catch {
        setDbDown(true);
      }
    },
    [slug]
  );

  useEffect(() => {
    if (!trip) return;
    const name = localStorage.getItem(storageNameKey(slug));
    if (name && trip.crew.some((m) => fullName(m) === name)) {
      setMyName(name);
      setPhase("open");
      void loadState(name);
    } else {
      setPhase("gated");
    }
  }, [slug, trip, loadState]);

  if (!trip) notFound();

  const unlock = (name: string) => {
    localStorage.setItem(storageNameKey(slug), name);
    setMyName(name);
    setPhase("open");
    void loadState(name);
  };

  const sendRsvp = async (status: RsvpStatus) => {
    if (!myName || !state) return;
    const prev = state;
    setState({
      ...state,
      me: {
        rsvp: status,
        votes: state.me?.votes ?? {},
        dates: state.me?.dates ?? [],
      },
    });
    const res = await fetch(`/api/trips/${slug}/rsvp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: myName, status }),
    });
    if (!res.ok) setState(prev);
    else void loadState(myName);
  };

  const sendDatePref = async (optionId: string, works: boolean) => {
    if (!myName || !state) return;
    const prev = state;
    const dates = new Set(state.me?.dates ?? []);
    if (works) dates.add(optionId);
    else dates.delete(optionId);
    setState({
      ...state,
      me: {
        rsvp: state.me?.rsvp ?? null,
        votes: state.me?.votes ?? {},
        dates: [...dates],
      },
    });
    const res = await fetch(`/api/trips/${slug}/date-pref`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: myName, optionId, works }),
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
    setState({
      ...state,
      me: {
        rsvp: state.me?.rsvp ?? null,
        votes: meVotes,
        dates: state.me?.dates ?? [],
      },
    });
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

  if (phase === "gated") {
    return (
      <div className="trip-light min-h-screen">
        <NameGate tripTitle={trip.title} crew={trip.crew} onUnlock={unlock} />
      </div>
    );
  }

  return (
    <div className="trip-light min-h-screen">
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-10">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          {trip.dates} · {trip.location}
        </p>
        <h1 className="display mt-2 text-4xl font-semibold">{trip.title}</h1>
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
          {tab === "costs" && <CostEstimator trip={trip} />}
          {tab === "rsvp" && (
            <RsvpPanel
              crew={trip.crew}
              dateOptions={trip.dateOptions}
              myName={myName}
              state={state}
              canRsvp={Boolean(myName) && !dbDown}
              onRsvp={sendRsvp}
              onDatePref={sendDatePref}
            />
          )}
        </motion.div>
      </AnimatePresence>
      </main>
    </div>
  );
}
