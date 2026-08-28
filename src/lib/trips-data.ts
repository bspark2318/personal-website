import type { Activity, CostItem, Trip } from "./trips";

// TODO(bspark): replace placeholder crew names with the real 8.
const MIAMI_CREW = [
  "Shai",
  "Guest 2",
  "Guest 3",
  "Guest 4",
  "Guest 5",
  "Guest 6",
  "Guest 7",
  "Guest 8",
];

const MIAMI_ACTIVITIES: Activity[] = [
  { id: "everglades", dayId: "fri", title: "Everglades — Shark Valley bikes", votable: true },
  { id: "club-fri", dayId: "fri", title: "Club night — E11EVEN / Space", votable: true },
  { id: "boat", dayId: "sat", title: "Private boat — sandbar + skyline", votable: true },
  { id: "joes", dayId: "sat", title: "Joe's Stone Crab", votable: true },
  { id: "club-halloween", dayId: "sat", title: "Halloween Saturday — Wynwood / clubs", votable: true },
  { id: "oleta", dayId: "sun", title: "Oleta River kayaks — manatees", votable: true },
];

// Budget §7 of the doc: per-person total at 8 people ≈ $1,125.
const MIAMI_COSTS: CostItem[] = [
  { id: "house", label: "Airbnb (3 nights)", amount: 1600, kind: "fixed-split" },
  { id: "boat", label: "Boat day + tip", amount: 1160, kind: "fixed-split", activityId: "boat" },
  { id: "everglades", label: "Everglades entry + bike", amount: 35, kind: "per-person", activityId: "everglades" },
  { id: "rental", label: "Rental car share (Everglades day)", amount: 25, kind: "per-person", activityId: "everglades" },
  { id: "oleta", label: "Oleta entry + kayak", amount: 35, kind: "per-person", activityId: "oleta" },
  { id: "club-fri", label: "Friday club night (GA + drinks)", amount: 187, kind: "per-person", activityId: "club-fri", rangeLabel: "$150–225" },
  { id: "club-halloween", label: "Halloween Saturday (GA + drinks)", amount: 188, kind: "per-person", activityId: "club-halloween", rangeLabel: "$150–225" },
  { id: "food", label: "Food (3 days)", amount: 190, kind: "per-person", rangeLabel: "$150–240" },
  { id: "joes", label: "Joe's Stone Crab", amount: 60, kind: "per-person", activityId: "joes", rangeLabel: "$40–80" },
  { id: "ubers", label: "Ubers", amount: 60, kind: "per-person" },
];

const miami2026: Trip = {
  slug: "miami-2026",
  title: "Miami Crew Trip",
  dates: "Oct 22–25, 2026",
  location: "Buena Vista / Design District",
  crew: MIAMI_CREW,
  passcodeEnvKey: "TRIP_PASSWORD_MIAMI_2026",
  intro: [],
  days: [],
  food: [],
  nightlife: { venues: [], rules: [] },
  info: [],
  activities: MIAMI_ACTIVITIES,
  costItems: MIAMI_COSTS,
};

export const TRIPS: Record<string, Trip> = {
  [miami2026.slug]: miami2026,
};
