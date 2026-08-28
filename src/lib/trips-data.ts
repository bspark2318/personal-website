import type { Trip } from "./trips";

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
  activities: [],
  costItems: [],
};

export const TRIPS: Record<string, Trip> = {
  [miami2026.slug]: miami2026,
};
