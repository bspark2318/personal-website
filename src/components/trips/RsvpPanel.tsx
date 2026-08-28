"use client";

import NamePicker from "@/components/trips/NamePicker";
import type { RsvpStatus, TripState } from "@/lib/trips";

const OPTIONS: { status: RsvpStatus; label: string }[] = [
  { status: "in", label: "I'm in" },
  { status: "maybe", label: "Maybe" },
  { status: "out", label: "Out" },
];

export default function RsvpPanel({
  crew,
  myName,
  onPickName,
  state,
  canRsvp,
  onRsvp,
}: {
  crew: string[];
  myName: string | null;
  onPickName: (name: string) => void;
  state: TripState | null;
  canRsvp: boolean;
  onRsvp: (status: RsvpStatus) => void;
}) {
  const crewSize = crew.length;
  const me = state?.me?.rsvp ?? null;
  const ins = state?.ins ?? [];
  const pending =
    crewSize - ins.length - (state?.outCount ?? 0) - (state?.maybeCount ?? 0);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-card-border p-4">
        <NamePicker crew={crew} value={myName} onChange={onPickName} />
      </section>

      <section>
        <h2 className="display mb-1 text-xl font-semibold">Are you in?</h2>
        <p className="mb-4 text-sm text-muted">
          Only confirmed names are shown — maybes and outs stay anonymous.
        </p>
        <div className="flex gap-2">
          {OPTIONS.map(({ status, label }) => (
            <button
              key={status}
              disabled={!canRsvp}
              onClick={() => onRsvp(status)}
              className={`flex-1 rounded-xl border px-4 py-3 font-medium transition-colors disabled:opacity-40 ${
                me === status
                  ? "border-foreground bg-foreground text-background"
                  : "border-card-border hover:border-card-border-hover"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {!canRsvp && (
          <p className="mt-3 text-sm text-muted">
            Pick your name above to RSVP.
          </p>
        )}
      </section>

      <section>
        <h2 className="display mb-4 text-xl font-semibold">
          Locked in · {ins.length}/{crewSize}
        </h2>
        {ins.length === 0 ? (
          <p className="text-sm text-muted">Nobody yet — be the first.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {ins.map((name) => (
              <li
                key={name}
                className="rounded-full border border-card-border px-3 py-1.5 text-sm"
              >
                {name}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm text-muted">
          {state?.maybeCount ?? 0} maybe · {state?.outCount ?? 0} out ·{" "}
          {Math.max(pending, 0)} haven&apos;t answered
        </p>
      </section>
    </div>
  );
}
