// Trip pages: shared types + pure logic (cost estimator, state shaping).
// Content lives in trips-data.ts; DB access in trips-db.ts.

export type RsvpStatus = "in" | "out" | "maybe";
export type VoteValue = "up" | "down";
export type CostKind = "fixed-split" | "per-person";

export interface Activity {
  id: string;
  dayId: string;
  title: string;
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

export interface DayEntry {
  time: string;
  text: string;
  activityId?: string;
}

export interface TripDay {
  id: string;
  label: string; // "THU 10/22"
  title: string; // "Land, settle, Little Havana"
  entries: DayEntry[];
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

export interface InfoSection {
  title: string;
  bullets: string[];
}

export interface Trip {
  slug: string;
  title: string;
  dates: string;
  location: string;
  crew: string[];
  passcodeEnvKey: string;
  intro: string[];
  days: TripDay[];
  food: { group: string; spots: FoodSpot[] }[];
  nightlife: { venues: Venue[]; rules: string[] };
  info: InfoSection[];
  activities: Activity[];
  costItems: CostItem[];
}

export const TRIP_HEADER = "x-trip-password";
export const storagePasscodeKey = (slug: string) => `trip-${slug}-passcode`;
export const storageNameKey = (slug: string) => `trip-${slug}-name`;
