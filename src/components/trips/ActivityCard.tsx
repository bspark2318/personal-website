"use client";

import { useState } from "react";
import VoteButton from "@/components/trips/VoteButton";
import { parseRich, type Activity, type TripState, type VoteValue } from "@/lib/trips";

/** Renders **bold** spans and bare domains as links via parseRich(). */
function rich(text: string) {
  return parseRich(text).map((seg, i) => {
    if (seg.kind === "bold")
      return (
        <strong key={i} className="font-semibold">
          {seg.value}
        </strong>
      );
    if (seg.kind === "link")
      return (
        <a
          key={i}
          href={seg.href}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          {seg.value}
        </a>
      );
    return seg.value;
  });
}

const notch =
  "absolute -right-[7px] z-10 h-3.5 w-3.5 rounded-full border border-card-border bg-background";

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
    <section className="drop-shadow-sm">
      <div
        className="grid cursor-pointer grid-cols-[1fr_124px]"
        onClick={() => setOpen((o) => !o)}
      >
        <div
          className={`relative border border-r-0 border-card-border bg-white p-4 pl-5 ${
            open ? "rounded-tl-xl border-b-0" : "rounded-l-xl"
          }`}
        >
          <span className={`${notch} -top-2`} />
          {!open && <span className={`${notch} -bottom-2`} />}
          {activity.route && (
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {activity.route}
            </p>
          )}
          <h2 className="display mt-0.5 text-[17px] font-semibold">
            {activity.emoji && <span className="mr-1.5">{activity.emoji}</span>}
            {activity.title}
          </h2>
          {activity.facts && activity.facts.length > 0 && (
            <p className="mt-0.5 text-[13px] text-muted">
              {activity.facts.join(" · ")}
            </p>
          )}
        </div>
        <div
          className={`flex flex-col items-center justify-center gap-1 border border-card-border bg-white p-2 text-center [border-left-style:dashed] [border-left-width:1.5px] ${
            open ? "rounded-tr-xl border-b-0" : "rounded-r-xl"
          }`}
        >
          {activity.when && (
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted">
              {activity.when}
            </p>
          )}
          {activity.price && (
            <p className="text-base font-semibold">{activity.price}</p>
          )}
          {activity.votable && (
            <div onClick={(e) => e.stopPropagation()}>
              <VoteButton
                activityId={activity.id}
                state={state}
                canVote={canVote}
                onVote={onVote}
              />
            </div>
          )}
          <p className="text-[11px] text-muted">
            details {open ? "▴" : "▾"}
          </p>
        </div>
      </div>
      {open && (
        <div className="rounded-b-xl border border-card-border bg-white px-5 pb-4 pt-3 [border-top-style:dashed] [border-top-width:1.5px]">
          <p className="text-[15px] leading-relaxed">{rich(activity.blurb)}</p>
          {activity.details.length > 0 && (
            <ul className="mt-2 space-y-2">
              {activity.details.map((d) => (
                <li key={d} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span className="mt-[2px] shrink-0">·</span>
                  <span>{rich(d)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
