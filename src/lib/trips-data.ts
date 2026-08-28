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
  // 2 midsize/SUV rentals, Thu–Sun (~4 days): ~$55/day base + ~30% taxes/fees
  // + $2/day FL surcharge ≈ $72/day/car → ~$580, + gas/tolls ~$60. Parking free.
  { id: "cars", label: "2 rental cars, Thu–Sun (taxes, gas, tolls)", amount: 640, kind: "fixed-split", rangeLabel: "$580–700 total" },
  { id: "oleta", label: "Oleta entry + kayak", amount: 35, kind: "per-person", activityId: "oleta" },
  { id: "club-fri", label: "Friday club night (GA + drinks)", amount: 187, kind: "per-person", activityId: "club-fri", rangeLabel: "$150–225" },
  { id: "club-halloween", label: "Halloween Saturday (GA + drinks)", amount: 188, kind: "per-person", activityId: "club-halloween", rangeLabel: "$150–225" },
  { id: "food", label: "Food (3 days)", amount: 190, kind: "per-person", rangeLabel: "$150–240" },
  { id: "joes", label: "Joe's Stone Crab", amount: 60, kind: "per-person", activityId: "joes", rangeLabel: "$40–80" },
  { id: "ubers", label: "Ubers (club nights — nobody drives)", amount: 40, kind: "per-person" },
];

const miami2026: Trip = {
  slug: "miami-2026",
  title: "Miami Crew Trip",
  dates: "Oct 22–25, 2026",
  location: "Buena Vista / Design District",
  crew: MIAMI_CREW,
  passcodeEnvKey: "TRIP_PASSWORD_MIAMI_2026",
  intro: [
    "8 people · 3 nights · Airbnb in Buena Vista, next to the Design District — backyard + fire pit as pregame HQ.",
    "Late October = tail end of rainy season. Highs ~85°F, ocean 83°F — swimmable, past the worst humidity.",
    "Shoulder-season pricing: hotels, boats, and restaurants cheaper than winter high season.",
    "Stone crab season opened Oct 15 — we're eating claws.",
    "Sailfish season starting + fall mullet run = prime fishing window.",
    "Sat Oct 24 is Halloween Saturday — Wynwood becomes Miami's biggest street costume party.",
    "Getting around: 2 rental cars for the weekend (Everglades, beach, Oleta) + Ubers for club nights (~$10–20/ride); 10–15 min to South Beach, 12 min to MIA.",
  ],
  days: [
    {
      id: "thu",
      label: "THU 10/22",
      title: "Land, settle, Little Havana",
      entries: [
        { time: "3–4 PM", text: "Check-in (4 PM at Shai's). Grocery + booze run — Publix, 1776 Biscayne Blvd." },
        { time: "6 PM", text: "Uber to Little Havana (~12 min)." },
        { time: "6–8 PM", text: "Walk Calle Ocho (12th–17th Ave): Domino Park, cigar rollers at Cuba Tobacco, Azucar ice cream (guava + cheese)." },
        { time: "8 PM", text: "Dinner — Sanguich de Miami (best Cubans in the city) or Versailles (the legendary old-school giant; ventanita cafecito)." },
        { time: "10 PM+", text: "Easy night: fire pit at the house, or Wynwood warm-up — Gramps (backyard bar/arcade) or Coyo Taco (hidden bar behind the tortilla counter)." },
      ],
    },
    {
      id: "fri",
      label: "FRI 10/23",
      title: "Everglades + first club night",
      entries: [
        { time: "7:30 AM", text: "Leave the house. Both cars west on Tamiami Trail (~50 min).", activityId: "everglades" },
        { time: "8:30 AM", text: "Shark Valley, Everglades NP. Bikes $27/day (reserve: sharkvalleytramtours.com), ~$35/vehicle entry. 15-mile flat loop, 2–3 hrs: gators on the path, 45-ft observation tower halfway. Alt: 2-hr guided tram, or airboat on the way back (~$30–40/pp).", activityId: "everglades" },
        { time: "12:30 PM", text: "Lunch on the drive back — La Camaronera: standing-room fried shrimp counter, pan con minuta." },
        { time: "2–6 PM", text: "Recover at the house. Nap. Hydrate. Tonight is long." },
        { time: "8 PM", text: "Dinner in Wynwood — KYU (wood-fired Asian, book on Resy: Korean fried chicken + brisket burnt ends) or 1-800-Lucky (Asian food hall, everyone picks their own)." },
        { time: "11 PM+", text: "Club night one: E11EVEN (24/7 ultraclub, performers over the crowd) or Club Space across the street (house/techno, Terrace runs past sunrise). GA in advance $20–60. 21+, no shorts/flip-flops.", activityId: "club-fri" },
      ],
    },
    {
      id: "sat",
      label: "SAT 10/24",
      title: "Boat day + stone crab + Halloween",
      entries: [
        { time: "10 AM", text: "Private boat, 4 hrs: Star Island celeb mansions → Haulover Sandbar (anchor, swim, party scene) → Biscayne Bay skyline. BYOB — pack the cooler. ~$145/head all-in.", activityId: "boat" },
        { time: "2:30 PM", text: "Post-boat food — La Sandwicherie (South Beach institution since '88, open till 5 AM)." },
        { time: "3–5 PM", text: "Beach hour on South Beach or back to the house to rally." },
        { time: "6:30 PM", text: "Joe's Stone Crab — 100+ years old, season just opened. Claws at market price + mustard sauce, hash browns, key lime pie. No reservations in the dining room — go at opening, or hit Joe's Take Away next door (same claws, no wait).", activityId: "joes" },
        { time: "10 PM+", text: "HALLOWEEN SATURDAY. Costumes mandatory. (a) Wynwood street scene — thousands in costume, no tickets; or (b) club it — LIV / Story / E11EVEN. Halloween covers $50–150, buy 2+ weeks out. Table for 8 ≈ breaks even with GA + drinks and guarantees entry.", activityId: "club-halloween" },
      ],
    },
    {
      id: "sun",
      label: "SUN 10/25",
      title: "Manatees + brunch + out",
      entries: [
        { time: "8:15 AM", text: "Checkout prep — bags in cars by 8:30 (checkout 11 AM, do it early)." },
        { time: "9 AM", text: "Oleta River State Park (~20 min): kayak/paddleboard the mangrove tunnels toward Raccoon Island (~$25–40/hr). Manatee season is just starting — real chance, not a guarantee; dolphins possible.", activityId: "oleta" },
        { time: "11:30 AM", text: "Brunch — Zak the Baker (Wynwood, James Beard-noted, closes 3 PM) or El Bagel (NYC-tier hand-rolled bagels)." },
        { time: "1 PM+", text: "Flight-dependent: Mid-Beach hour, Design District stroll (free ICA museum), or straight to MIA (12 min)." },
      ],
    },
  ],
  food: [
    {
      group: "Cuban / Little Havana",
      spots: [
        { name: "Sanguich de Miami", detail: "Best-in-class Cuban sandwiches, counter spot", price: "$$" },
        { name: "Versailles", detail: "\"The World's Most Famous Cuban Restaurant\" — go for the scene + ventanita coffee window", price: "$$" },
        { name: "La Camaronera", detail: "Fried shrimp + pan con minuta, standing counter", price: "$" },
        { name: "Old's Havana", detail: "Sit-down Cuban with live music on Calle Ocho", price: "$$" },
      ],
    },
    {
      group: "Wynwood / Design District (near the house)",
      spots: [
        { name: "KYU", detail: "Wood-fired Asian BBQ, the group-dinner splurge — RESERVE on Resy", price: "$$$" },
        { name: "1-800-Lucky", detail: "Asian food hall + bar, zero-coordination group dinner", price: "$$" },
        { name: "Coyo Taco", detail: "Tacos + speakeasy in back", price: "$" },
        { name: "Zak the Baker", detail: "Bakery/brunch, closes 3 PM", price: "$" },
        { name: "Michael's Genuine", detail: "Miami's OG farm-to-table, solid brunch (Design District)", price: "$$$" },
        { name: "Mandolin Aegean Bistro", detail: "Greek/Turkish garden restaurant, walkable from the house", price: "$$$" },
      ],
    },
    {
      group: "South Beach",
      spots: [
        { name: "Joe's Stone Crab", detail: "The institution; Take Away counter skips the wait", price: "$$$$" },
        { name: "La Sandwicherie", detail: "French-deli sandwiches till 5 AM, post-boat/post-club", price: "$" },
        { name: "Puerto Sagua", detail: "Old-school Cuban diner in SoBe", price: "$$" },
      ],
    },
    {
      group: "Late night",
      spots: [
        { name: "La Sandwicherie", detail: "Open till 5 AM" },
        { name: "Coyo Taco", detail: "3 AM Fri–Sat" },
        { name: "Steve's Pizza", detail: "North Miami legend, rolls late" },
      ],
    },
  ],
  nightlife: {
    venues: [
      { name: "E11EVEN", where: "Downtown", vibe: "24/7 ultraclub, open-format/hip-hop, performers over the crowd", cover: "$20–60", notes: "Most forgiving door of the majors; 8-min Uber from house" },
      { name: "Club Space", where: "Downtown", vibe: "House/techno temple; Terrace runs past sunrise", cover: "$20–50", notes: "Most relaxed dress code; check RA for lineups" },
      { name: "LIV", where: "Fontainebleau", vibe: "Big-room EDM + celebs", cover: "$40–150", notes: "Hardest door in Miami; groups of guys get culled" },
      { name: "Story", where: "South Beach", vibe: "LIV's sister, EDM", cover: "$40–100", notes: "Same door energy" },
      { name: "Wynwood bars", where: "Walkable cluster", vibe: "Gramps, Wood Tavern, Shots, MAD Club", cover: "$0–20", notes: "Halloween weekend = street party central" },
    ],
    rules: [
      "21+ everywhere, physical ID.",
      "Dress: no shorts, no flip-flops, no athletic wear after dark. Collared shirt + real shoes = safe. LIV hates sneakers.",
      "Drinks inside: cocktails $18–25, beers $12–15 → budget $100–150/person/night on GA.",
      "Halloween Saturday: covers $50–150, buy tickets 2+ weeks ahead — they sell out. Table for 8 roughly breaks even vs GA and guarantees entry.",
      "Lineups post 2–4 weeks out: 11miami.com, clubspace.com, livnightclub.com, ra.co.",
      "Uber everything; parking is misery.",
    ],
  },
  info: [
    {
      title: "The boat",
      bullets: [
        "Plan A — private party boat: captained 30–40ft, 4 hrs, BYOB, sandbar + skyline. $600–1,200 + 15–20% tip → $95–185/head. Book: GetMyBoat / Boatsetter / Aqua.",
        "Confirm before booking: fuel included? cooler/ice? sandbar stop? cancellation policy? Sunset slots go 2–4 weeks out.",
        "Plan B — fishing: 6-pack boats cap at 6 (Coast Guard); for 8 it's a bigger inspected boat (~$1,500–2,500 half day) or two boats. Late Oct = sailfish ramping, mahi, kingfish; charters cover licenses.",
        "Cheap seats: Kelley Fishing Fleet party boat, $69/adult 4-hr, bait + license included.",
      ],
    },
    {
      title: "Wildlife",
      bullets: [
        "Alligators: guaranteed at Shark Valley — often on the bike path. Keep 15 ft, don't feed.",
        "Manatees: late Oct is the start of season — Oleta kayak is the best shot; peak reliability is Dec–Feb.",
        "Birds: fall migration peaking — bring binoculars Friday.",
        "Marine: 83°F water; turtles, rays, nurse sharks if we snorkel.",
      ],
    },
    {
      title: "Book ahead (in order of urgency)",
      bullets: [
        "1. Saturday Halloween club tickets — sell out earliest.",
        "2. Boat — free-cancellation listing.",
        "3. KYU reservation (Resy) — Friday 8 PM for 8.",
        "4. Shark Valley bikes — reserve online.",
        "5. Rental cars for Friday.",
        "6. Group Venmo/Splitwise before the trip.",
      ],
    },
    {
      title: "Practical",
      bullets: [
        "Weather: 85°F days, brief PM shower possible. Hurricane risk low but nonzero — everything is refundable on purpose; check nhc.noaa.gov week-of.",
        "Pack: costume (non-negotiable), swimwear ×2, collared shirt + real shoes, sunscreen, dramamine for the boat, portable speaker.",
        "House rules: exterior cameras exist; keep the backyard neighbor-friendly after midnight; 8-guest cap is hard.",
        "Safety: tourist-normal zones; Uber door-to-door at night; phones in front pockets on Ocean Drive at 3 AM.",
        "Money: boat and table get Venmo'd within 24 hrs, no ghosts.",
      ],
    },
  ],
  activities: MIAMI_ACTIVITIES,
  costItems: MIAMI_COSTS,
};

export const TRIPS: Record<string, Trip> = {
  [miami2026.slug]: miami2026,
};
