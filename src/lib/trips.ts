// Trip pages: shared types + pure logic (cost estimator, state shaping).
// Content lives in trips-data.ts; DB access in trips-db.ts.

export type RsvpStatus = "in" | "out" | "maybe";
export type VoteValue = "up" | "down";
export type CostKind = "fixed-split" | "per-person";
export type SpendProfile = "conservative" | "medium" | "aggressive";

export interface Activity {
  id: string;
  title: string;
  emoji?: string;
  /** Loose timing hint, e.g. "Sat morning" — not a schedule. */
  when?: string;
  /** Short logistics chips, e.g. "4 hrs", "~$145/pp". */
  facts?: string[];
  /** Ticket route line, e.g. "MIA · Biscayne Bay". */
  route?: string;
  /** Ticket stub price, e.g. "$145". */
  price?: string;
  blurb: string;
  details: string[];
  votable: boolean;
}

export interface CostItem {
  id: string;
  label: string;
  /**
   * Medium/default estimate. fixed-split: total dollars split by headcount.
   * per-person: dollars per head.
   */
  amount: number;
  /** Conservative-profile estimate (range low). Falls back to `amount`. */
  low?: number;
  /** Aggressive-profile estimate (range high). Falls back to `amount`. */
  high?: number;
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

export interface StayOption {
  id: string;
  name: string;
  url: string;
  neighborhood: string;
  /** Whole-stay total, fees in. */
  total: number;
  perNight: number;
  sleeps: number;
  /** e.g. "4 BR · 3 BA" */
  layout: string;
  images: string[];
  notes: string[];
}

export interface InfoSection {
  title: string;
  bullets: string[];
}

export interface IntroHighlight {
  text: string;
  photo: CreditedPhoto;
}

export interface DateOption {
  id: string;
  label: string;
}

// Gate: first name identifies, last name is the password.
// Full name is the identity key in the DB and API payloads.
export interface CrewMember {
  first: string;
  last: string;
}

export const fullName = (m: CrewMember) => `${m.first} ${m.last}`;

/** First name for a stored full-name key; falls back to the key itself. */
export function firstNameOf(name: string, crew: CrewMember[]): string {
  return crew.find((m) => fullName(m) === name)?.first ?? name;
}

// Both names must match a crew member (case-insensitive). Duplicate first
// names are fine — the last name disambiguates. Returns the full-name key.
export function matchCrew(
  first: string,
  last: string,
  crew: CrewMember[]
): string | null {
  const qFirst = first.trim().toLowerCase();
  const qLast = last.trim().toLowerCase();
  if (!qFirst || !qLast) return null;
  const member = crew.find(
    (m) => m.first.toLowerCase() === qFirst && m.last.toLowerCase() === qLast
  );
  return member ? fullName(member) : null;
}

export interface Trip {
  slug: string;
  title: string;
  dates: string;
  location: string;
  crew: CrewMember[];
  /** Candidate date ranges; crew marks which ones work for them. */
  dateOptions: DateOption[];
  intro: IntroHighlight[];
  conditions: ConditionStat[];
  neighborhoods: Neighborhood[];
  parks: Park[];
  /** Candidate Airbnbs — photos, costs, links. */
  stays: StayOption[];
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

export type RichSegment =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "link"; value: string; href: string };

const URL_RE =
  /\b((?:https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|org|net|gov)\b(?:\/[^\s,;)]*)?)/gi;
const BOLD_RE = /\*\*([^*]+)\*\*/g;

// Parse **bold** spans and bare/http domains into ordered segments.
// Pure so it can be unit-tested; ActivityCard maps segments to JSX.
export function parseRich(text: string): RichSegment[] {
  const out: RichSegment[] = [];
  const pushLinks = (seg: string) => {
    let last = 0;
    for (const m of seg.matchAll(URL_RE)) {
      const raw = m[1];
      if (m.index > last) out.push({ kind: "text", value: seg.slice(last, m.index) });
      out.push({
        kind: "link",
        value: raw,
        href: /^https?:/i.test(raw) ? raw : `https://${raw}`,
      });
      last = m.index + raw.length;
    }
    if (last < seg.length) out.push({ kind: "text", value: seg.slice(last) });
  };
  let last = 0;
  for (const m of text.matchAll(BOLD_RE)) {
    if (m.index > last) pushLinks(text.slice(last, m.index));
    out.push({ kind: "bold", value: m[1] });
    last = m.index + m[0].length;
  }
  pushLinks(text.slice(last));
  return out;
}

// Pick an item's total by spend profile: conservative→low, aggressive→high,
// medium→amount. Ranged fields fall back to amount when absent.
function amountFor(item: CostItem, profile: SpendProfile): number {
  if (profile === "conservative") return item.low ?? item.amount;
  if (profile === "aggressive") return item.high ?? item.amount;
  return item.amount;
}

// Fixed costs split by headcount, per-person costs pass through.
// Items tied to a toggled-off activity are excluded.
export function estimateCost(
  items: CostItem[],
  headcount: number,
  offActivityIds: string[],
  profile: SpendProfile = "medium"
): { perPerson: number; lines: CostLine[] } {
  const off = new Set(offActivityIds);
  const lines: CostLine[] = items
    .filter((i) => !i.activityId || !off.has(i.activityId))
    .map((i) => {
      const total = amountFor(i, profile);
      return {
        id: i.id,
        label: i.label,
        perPerson: i.kind === "fixed-split" ? total / headcount : total,
        ...(i.rangeLabel ? { rangeLabel: i.rangeLabel } : {}),
      };
    });
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

export interface DatePrefRow {
  optionId: string;
  name: string;
}

export interface TripState {
  ins: string[];
  outCount: number;
  maybeCount: number;
  votes: Record<string, { up: number; down: number }>;
  /** optionId → names it works for. */
  datePrefs: Record<string, string[]>;
  me: {
    rsvp: RsvpStatus | null;
    votes: Record<string, VoteValue>;
    dates: string[];
  } | null;
}

// Anonymity contract (FR-006): only "in" RSVPs are named; everything else
// leaves this function as counts. Callers must not re-attach names.
export function shapeState(
  rsvps: RsvpRow[],
  votes: VoteRow[],
  datePrefs: DatePrefRow[],
  me: string | null
): TripState {
  const tallies: TripState["votes"] = {};
  for (const v of votes) {
    const t = (tallies[v.activityId] ??= { up: 0, down: 0 });
    t[v.vote === "up" ? "up" : "down"] += 1;
  }
  const prefs: TripState["datePrefs"] = {};
  for (const p of datePrefs) {
    (prefs[p.optionId] ??= []).push(p.name);
  }
  return {
    ins: rsvps.filter((r) => r.status === "in").map((r) => r.name),
    outCount: rsvps.filter((r) => r.status === "out").length,
    maybeCount: rsvps.filter((r) => r.status === "maybe").length,
    votes: tallies,
    datePrefs: prefs,
    me:
      me === null
        ? null
        : {
            rsvp: rsvps.find((r) => r.name === me)?.status ?? null,
            votes: Object.fromEntries(
              votes.filter((v) => v.name === me).map((v) => [v.activityId, v.vote])
            ),
            dates: datePrefs.filter((p) => p.name === me).map((p) => p.optionId),
          },
  };
}

export const storageNameKey = (slug: string) => `trip-${slug}-name`;
