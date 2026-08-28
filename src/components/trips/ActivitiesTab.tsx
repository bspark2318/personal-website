"use client";

import ActivityCard from "@/components/trips/ActivityCard";
import type { Trip, TripState, VoteValue } from "@/lib/trips";

export default function ActivitiesTab({
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
    <div className="space-y-5">
      <p className="text-sm text-muted">
        Nothing here is a schedule — vote for what you actually want to do.
      </p>
      {trip.activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          state={state}
          canVote={canVote}
          onVote={onVote}
        />
      ))}
    </div>
  );
}
