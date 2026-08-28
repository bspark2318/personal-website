"use client";

import {
  firstNameOf,
  type CrewMember,
  type DateOption,
  type RsvpStatus,
  type TripState,
} from "@/lib/trips";

function GlyphIcon({ kind, className }: { kind: RsvpStatus; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {kind === "in" && <path d="M20 6 9 17l-5-5" />}
      {kind === "maybe" && (
        <>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </>
      )}
      {kind === "out" && <path d="M18 6 6 18M6 6l12 12" />}
    </svg>
  );
}

const OPTIONS: {
  status: RsvpStatus;
  label: string;
  selected: string;
}[] = [
  { status: "in", label: "In", selected: "border-green-600 bg-green-50 text-green-700" },
  { status: "maybe", label: "Maybe", selected: "border-amber-600 bg-amber-50 text-amber-700" },
  { status: "out", label: "Out", selected: "border-red-600 bg-red-50 text-red-700" },
];

// "Guest 2" → "G2", "Shai" → "SH"
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  return (
    words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)
  ).toUpperCase();
}

export default function RsvpPanel({
  crew,
  dateOptions,
  myName,
  state,
  canRsvp,
  onRsvp,
  onDatePref,
}: {
  crew: CrewMember[];
  dateOptions: DateOption[];
  myName: string | null;
  state: TripState | null;
  canRsvp: boolean;
  onRsvp: (status: RsvpStatus) => void;
  onDatePref: (optionId: string, works: boolean) => void;
}) {
  const crewSize = crew.length;
  const me = state?.me?.rsvp ?? null;
  const myDates = state?.me?.dates ?? [];
  const ins = state?.ins ?? [];
  const maybeCount = state?.maybeCount ?? 0;
  const outCount = state?.outCount ?? 0;
  const pending = Math.max(crewSize - ins.length - outCount - maybeCount, 0);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="display mb-1 text-xl font-semibold">Your RSVP</h2>
        <p className="mb-4 text-sm text-muted">
          Confirmed names are listed. Maybe and out are shown anonymously.
        </p>
        <div className="flex gap-2.5">
          {OPTIONS.map(({ status, label, selected }) => (
            <button
              key={status}
              disabled={!canRsvp}
              onClick={() => onRsvp(status)}
              className={`flex-1 rounded-2xl border px-4 py-4 text-center transition-colors disabled:opacity-40 ${
                me === status
                  ? selected
                  : "border-card-border text-muted hover:border-card-border-hover"
              }`}
            >
              <GlyphIcon kind={status} className="mx-auto h-6 w-6" />
              <span className="mt-1.5 block font-semibold">{label}</span>
            </button>
          ))}
        </div>
        {!canRsvp && (
          <p className="mt-3 text-sm text-muted">
            RSVPs are offline right now.
          </p>
        )}
      </section>

      <section>
        <h2 className="display mb-1 text-xl font-semibold">Which weekend?</h2>
        <p className="mb-4 text-sm text-muted">
          Mark every weekend that works. Same Thu–Sun pattern each time.
        </p>
        <ul className="space-y-2.5">
          {dateOptions.map((opt) => {
            const names = state?.datePrefs?.[opt.id] ?? [];
            const mine = myDates.includes(opt.id);
            return (
              <li key={opt.id}>
                <button
                  disabled={!canRsvp}
                  onClick={() => onDatePref(opt.id, !mine)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors disabled:opacity-40 ${
                    mine
                      ? "border-green-600 bg-green-50"
                      : "border-card-border hover:border-card-border-hover"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{opt.label}</span>
                    <span className="block text-sm text-muted">
                      {names.length === 0
                        ? "Works for nobody yet"
                        : `Works for ${names.length}: ${names
                            .map((n) => firstNameOf(n, crew))
                            .join(", ")}`}
                    </span>
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      mine ? "bg-green-600 text-white" : "bg-black/5 text-muted"
                    }`}
                  >
                    <GlyphIcon kind="in" className="h-4 w-4" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <div className="mb-2 flex items-baseline justify-between text-sm text-muted">
          <span>Confirmed</span>
          <span>
            {ins.length}/{crewSize}
          </span>
        </div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-300"
            style={{ width: `${(ins.length / crewSize) * 100}%` }}
          />
        </div>
        <ul className="grid grid-cols-4 gap-2.5">
          {ins.map((name) => (
            <li
              key={name}
              className="rounded-xl border border-green-600 bg-green-50 px-1.5 py-3 text-center"
            >
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
                {initials(name)}
              </span>
              <span className="mt-1.5 block truncate text-[11px] font-medium">
                {name === myName ? "You" : firstNameOf(name, crew)}
              </span>
            </li>
          ))}
          {Array.from({ length: maybeCount }, (_, i) => (
            <li
              key={`maybe-${i}`}
              className="rounded-xl border border-dashed border-amber-600 bg-amber-50 px-1.5 py-3 text-center"
            >
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-white">
                <GlyphIcon kind="maybe" className="h-4 w-4" />
              </span>
              <span className="mt-1.5 block text-[11px] text-muted">maybe</span>
            </li>
          ))}
          {Array.from({ length: outCount }, (_, i) => (
            <li
              key={`out-${i}`}
              className="rounded-xl border border-red-600 bg-red-50 px-1.5 py-3 text-center"
            >
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
                <GlyphIcon kind="out" className="h-4 w-4" />
              </span>
              <span className="mt-1.5 block text-[11px] text-muted">out</span>
            </li>
          ))}
          {Array.from({ length: pending }, (_, i) => (
            <li
              key={`pending-${i}`}
              className="rounded-xl border border-card-border px-1.5 py-3 text-center opacity-45"
            >
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-xs text-muted">
                ·
              </span>
              <span className="mt-1.5 block text-[11px] text-muted">—</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
