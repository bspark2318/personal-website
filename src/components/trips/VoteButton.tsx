"use client";

import type { TripState, VoteValue } from "@/lib/trips";

export default function VoteButton({
  activityId,
  state,
  canVote,
  onVote,
}: {
  activityId: string;
  state: TripState | null;
  canVote: boolean;
  onVote: (activityId: string, vote: VoteValue | null) => void;
}) {
  const tally = state?.votes[activityId] ?? { up: 0, down: 0 };
  const mine = state?.me?.votes[activityId] ?? null;

  const button = (vote: VoteValue, emoji: string, count: number) => (
    <button
      disabled={!canVote}
      onClick={() => onVote(activityId, mine === vote ? null : vote)}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors disabled:opacity-40 ${
        mine === vote
          ? "border-foreground bg-foreground text-background"
          : "border-card-border text-muted hover:border-card-border-hover"
      }`}
    >
      <span>{emoji}</span>
      <span className="tabular-nums">{count}</span>
    </button>
  );

  return (
    <div className="mt-2 flex gap-2">
      {button("up", "👍", tally.up)}
      {button("down", "👎", tally.down)}
    </div>
  );
}
