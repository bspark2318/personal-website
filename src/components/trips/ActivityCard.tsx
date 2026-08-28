"use client";

import { useState } from "react";
import VoteButton from "@/components/trips/VoteButton";
import type { Activity, TripState, VoteValue } from "@/lib/trips";

export default function ActivityCard({
  activity,
  state,
  canVote,
  onVote,
}: {
  activity: Activity;
  state: TripState | null;
  canVote: boolean;
  onVote: (activityId: string, vote: VoteValue | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-card-border p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="display text-xl font-semibold">
          {activity.emoji && <span className="mr-2">{activity.emoji}</span>}
          {activity.title}
        </h2>
        {activity.when && (
          <span className="shrink-0 text-xs uppercase tracking-[0.15em] text-muted">
            {activity.when}
          </span>
        )}
      </div>
      <p className="mt-2 text-[15px] leading-relaxed">{activity.blurb}</p>
      {activity.details.length > 0 && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-2 text-sm text-muted underline-offset-2 hover:underline"
          >
            {open ? "Less" : "Details"}
          </button>
          {open && (
            <ul className="mt-2 space-y-2">
              {activity.details.map((d) => (
                <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-[2px] shrink-0">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {activity.votable && (
        <VoteButton
          activityId={activity.id}
          state={state}
          canVote={canVote}
          onVote={onVote}
        />
      )}
    </section>
  );
}
