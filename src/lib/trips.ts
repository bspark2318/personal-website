// Trip pages: shared types + pure logic (cost estimator, state shaping).
// Content lives in trips-data.ts; DB access in trips-db.ts.

export type RsvpStatus = "in" | "out" | "maybe";
export type VoteValue = "up" | "down";
export type CostKind = "fixed-split" | "per-person";

export interface Activity {
  id: string;
  title: string;
  emoji?: string;
  /** Loose timing hint, e.g. "Sat morning" — not a schedule. */
  when?: string;
  blurb: string;
  details: string[];
  votable: boolean;
}

export interface CostItem {
  id: string;
  label: string;
  /** fixed-split: total dollars split by headcount. per-person: dollars per head. */
  amount: number;
  kind: CostKind;
  /** When set, toggling this activity off in the estimator removes the item. */
  activityId?: string;
  /** Optional display label for ranged estimates, e.g. "$300–450". */
  rangeLabel?: string;
}

export interface FoodSpot {
  name: string;
  detail: string;
  price?: string;
}

export interface Venue {
  name: string;
  where: string;
  vibe: string;
  cover: string;
  notes: string;
}

export interface ConditionStat {
  label: string;
  value: string;
  sub?: string;
  /** Bento sizing: big = 2×2 hero tile, wide = 2×1. */
  span?: "big" | "wide";
}

// "84–87°F" → "29–31°C"; strings without °F pass through untouched.
export function toCelsiusLabel(value: string): string {
  if (!value.includes("°F")) return value;
  return value
    .replace(/(\d+)(–(\d+))?°F/, (_, a, _b, c) => {
      const conv = (f: string) => Math.round(((Number(f) - 32) * 5) / 9);
      return c ? `${conv(a)}–${conv(c)}°C` : `${conv(a)}°C`;
    });
}

/** A photo with an attribution string, used by highlights and parks. */
export interface CreditedPhoto {
  src: string;
  credit: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  bullets: string[];
  /** Query string for Google Maps (link + embed). */
  mapsQuery: string;
}

export interface Park {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  bullets: string[];
  mapsQuery: string;
  photos: CreditedPhoto[];
}

export interface InfoSection {
  title: string;
  bullets: string[];
}

export interface IntroHighlight {
  text: string;
  photo: CreditedPhoto;
}

export interface Trip {
  slug: string;
  title: string;
  dates: string;
  location: string;
  crew: string[];
  passcodeEnvKey: string;
  intro: IntroHighlight[];
  conditions: ConditionStat[];
  neighborhoods: Neighborhood[];
  parks: Park[];
  food: { group: string; spots: FoodSpot[] }[];
  nightlife: { venues: Venue[]; rules: string[] };
  info: InfoSection[];
  activities: Activity[];
  costItems: CostItem[];
}

export interface CostLine {
  id: string;
  label: string;
  perPerson: number;
  rangeLabel?: string;
}

// Fixed costs split by headcount, per-person costs pass through.
// Items tied to a toggled-off activity are excluded.
export function estimateCost(
  items: CostItem[],
  headcount: number,
  offActivityIds: string[]
): { perPerson: number; lines: CostLine[] } {
  const off = new Set(offActivityIds);
  const lines: CostLine[] = items
    .filter((i) => !i.activityId || !off.has(i.activityId))
    .map((i) => ({
      id: i.id,
      label: i.label,
      perPerson: i.kind === "fixed-split" ? i.amount / headcount : i.amount,
      ...(i.rangeLabel ? { rangeLabel: i.rangeLabel } : {}),
    }));
  return { perPerson: lines.reduce((s, l) => s + l.perPerson, 0), lines };
}

export interface RsvpRow {
  name: string;
  status: RsvpStatus;
}

export interface VoteRow {
  activityId: string;
  name: string;
  vote: VoteValue;
}

export interface TripState {
  ins: string[];
  outCount: number;
  maybeCount: number;
  votes: Record<string, { up: number; down: number }>;
  me: { rsvp: RsvpStatus | null; votes: Record<string, VoteValue> } | null;
}

// Anonymity contract (FR-006): only "in" RSVPs are named; everything else
// leaves this function as counts. Callers must not re-attach names.
export function shapeState(
  rsvps: RsvpRow[],
  votes: VoteRow[],
  me: string | null
): TripState {
  const tallies: TripState["votes"] = {};
  for (const v of votes) {
    const t = (tallies[v.activityId] ??= { up: 0, down: 0 });
    t[v.vote === "up" ? "up" : "down"] += 1;
  }
  return {
    ins: rsvps.filter((r) => r.status === "in").map((r) => r.name),
    outCount: rsvps.filter((r) => r.status === "out").length,
    maybeCount: rsvps.filter((r) => r.status === "maybe").length,
    votes: tallies,
    me:
      me === null
        ? null
        : {
            rsvp: rsvps.find((r) => r.name === me)?.status ?? null,
            votes: Object.fromEntries(
              votes.filter((v) => v.name === me).map((v) => [v.activityId, v.vote])
            ),
          },
  };
}

export const TRIP_HEADER = "x-trip-password";
export const storagePasscodeKey = (slug: string) => `trip-${slug}-passcode`;
export const storageNameKey = (slug: string) => `trip-${slug}-name`;
