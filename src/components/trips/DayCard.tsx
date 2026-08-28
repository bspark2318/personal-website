"use client";

import VoteButton from "@/components/trips/VoteButton";
import type { TripDay, TripState, VoteValue } from "@/lib/trips";

export default function DayCard({
  day,
  state,
  canVote,
  onVote,
}: {
  day: TripDay;
  state: TripState | null;
  canVote: boolean;
  onVote: (activityId: string, vote: VoteValue | null) => void;
}) {
  return (
    <section className="rounded-2xl border border-card-border p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">{day.label}</p>
      <h2 className="display mt-1 text-xl font-semibold">{day.title}</h2>
      <ul className="mt-4 space-y-4">
        {day.entries.map((entry) => (
          <li key={`${day.id}-${entry.time}`} className="flex gap-3">
            <span className="w-16 shrink-0 pt-0.5 text-xs font-medium uppercase text-muted">
              {entry.time}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] leading-relaxed">{entry.text}</p>
              {entry.activityId && (
                <VoteButton
                  activityId={entry.activityId}
                  state={state}
                  canVote={canVote}
                  onVote={onVote}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
