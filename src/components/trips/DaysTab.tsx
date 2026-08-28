"use client";

import DayCard from "@/components/trips/DayCard";
import type { Trip, TripState, VoteValue } from "@/lib/trips";

export default function DaysTab({
  trip,
  state,
  canVote,
  onVote,
}: {
  trip: Trip;
  state: TripState | null;
  canVote: boolean;
  onVote: (activityId: string, vote: VoteValue | null) => void;
}) {
  return (
    <div className="space-y-8">
      {trip.days.map((day) => (
        <DayCard
          key={day.id}
          day={day}
          state={state}
          canVote={canVote}
          onVote={onVote}
        />
      ))}
    </div>
  );
}
