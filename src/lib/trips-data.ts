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
  {
    id: "boat",
    emoji: "🚤",
    title: "Party boat — sandbar + skyline",
    route: "MIA · Biscayne Bay",
    price: "$145",
    facts: ["Captained 30–40 ft", "4 hrs", "BYOB", "~$145/pp at 8"],
    blurb: "**Star Island** → **Haulover Sandbar** (anchor, swim, snorkel) → **Biscayne Bay skyline**.",
    details: [
      "Bring a packed **cooler** from the house.",
      "Book via **GetMyBoat / Boatsetter / Aqua**; confirm fuel, cooler/ice, sandbar stop, and **cancellation policy**. Slots book **2–4 weeks out**.",
      "Ask the charter to include **snorkel gear** — sandbar water is shallow and clear.",
    ],
    votable: true,
  },
  {
    id: "fishing",
    emoji: "🎣",
    title: "Deep-sea fishing charter",
    route: "MIA · Atlantic",
    price: "$45–180",
    facts: ["Half-day 4–6 hrs", "Drift boat $45–70/pp", "Private ~$100–180/pp"],
    blurb: "Late October is peak migration — **sailfish, mahi, kingfish** within a few miles of the inlet. Ranges from a **cheap drift boat** to a **private charter**.",
    details: [
      "Cheapest: **drift fishing** — **Reward Fleet** ($45/pp) or **Kelley Fleet** at Haulover ($69/pp), 4 hrs, bait + tackle included, no group-size cap.",
      "Private: **6-passenger charters** cap at 6 people — for 8, split across **two half-day boats** (~$700–1,100 each ≈ $100–180/pp).",
      "Book via **FishingBooker** or direct at **Haulover Marina** / **Miami Beach Marina**.",
      "Crew cleans the catch; some local restaurants will **cook your catch**.",
    ],
    votable: true,
  },
  {
    id: "everglades",
    emoji: "🐊",
    title: "Everglades — Shark Valley bikes",
    when: "any morning · needs cars",
    route: "MIA · Everglades",
    price: "$27 or $30",
    facts: ["15-mi flat paved loop", "2–3 hrs", "~50 min drive", "Bike $27 or airboat $30"],
    blurb: "**Alligators** are commonly on the path. **45-ft observation tower** at the halfway point.",
    details: [
      "Reserve bikes at sharkvalleytramtours.com; park entry ~$35/vehicle, split across the car. Drive west on **Tamiami Trail**.",
      "Alternatives to biking: **2-hr guided tram**, or an **airboat tour** on the drive back (~$30–40/pp).",
      "Try **gator bites + frog legs** at **Coopertown Restaurant** on Tamiami Trail, on the way back.",
      "Wildlife: alligators near-certain; herons, egrets, turtles, occasionally crocodiles. Keep **15 ft** distance.",
      "Optional stop on the drive back: **La Camaronera** — fried-shrimp counter, standing room, pan con minuta.",
    ],
    votable: true,
  },
  {
    id: "club-sat",
    emoji: "🥂",
    title: "Saturday night",
    when: "Sat night",
    route: "MIA · Wynwood / Mid-Beach",
    price: "$0–150",
    facts: ["Club covers $40–150", "Wynwood covers $0–20"],
    blurb: "Two options: **Wynwood bar crawl** (Gramps / Wood Tavern / Shots) or a large club — **LIV** at the Fontainebleau, **Story**, or **E11EVEN** again.",
    details: [
      "Strict doors at LIV/Story — **collared shirts**, enter in **mixed groups**, no sneakers.",
      "Table for 8: **$1,500–3K minimum**, roughly equal to GA + drinks, and guarantees entry.",
      "Wynwood bars are walkable between spots.",
    ],
    votable: true,
  },
  {
    id: "oleta",
    emoji: "🛶",
    title: "Kayaking / paddleboarding",
    when: "Sun morning",
    route: "MIA · Oleta / Biscayne Bay",
    price: "$25–40",
    facts: ["$25–40/hr", "~20 min drive", "Calm, beginner-friendly water"],
    blurb: "**Oleta River** mangrove channels toward **Raccoon Island**, or open water on **Biscayne Bay**. **Manatee season** starts late Oct — sightings possible, not guaranteed.",
    details: [
      "Oleta: rentals at oletariveradventures.com, concession opens 9 AM.",
      "Biscayne: **Virginia Key Outdoor Center** — mangrove + bay routes.",
      "**Dolphins** also possible. Bring a **dry bag** for phones.",
    ],
    votable: true,
  },
  {
    id: "joes",
    emoji: "🦞",
    title: "Stone crab season — Joe's",
    when: "any night",
    route: "MIA · South Beach",
    price: "$40–80",
    facts: ["Season opens Oct 15", "Trip hits the opening weeks", "No reservations"],
    blurb: "**Stone crab season runs Oct 15 – May 1** — the trip lands **one week after opening**, when claws are freshest. **Joe's** has served them for 100+ years. Order: **claws with mustard sauce**, hash browns, creamed spinach, **key lime pie**.",
    details: [
      "Arrive **at opening** or expect **1–2 hr waits**.",
      "**Joe's Take Away** next door sells the same claws with no wait.",
      "Medium claws **~$40s**, large **$60s+**; fried chicken **~$7**.",
    ],
    votable: true,
  },
  {
    id: "beach",
    emoji: "🌴",
    title: "South Beach / Mid-Beach hours",
    when: "flexible",
    route: "MIA · Ocean Drive",
    price: "$0",
    facts: ["Ocean ~83°F"],
    blurb: "Unscheduled time between other activities.",
    details: [
      "**La Sandwicherie** is open until **5 AM** for late-night food.",
      "Keep phones secured on **Ocean Drive** late at night.",
    ],
    votable: true,
  },
];

// Budget §7 of the doc: per-person total at 8 people ≈ $1,125.
const MIAMI_COSTS: CostItem[] = [
  { id: "house", label: "Airbnb (3 nights)", amount: 1600, kind: "fixed-split" },
  { id: "boat", label: "Boat day + tip", amount: 1160, kind: "fixed-split", activityId: "boat" },
  { id: "everglades", label: "Everglades bike + split entry", amount: 32, kind: "per-person", activityId: "everglades" },
  // Booking.com quotes, MIA Thu→Sun, reputable tier (Alamo/Enterprise/Dollar,
  // 9+ rated): compact SUV ~$240–290/3 days all-in → 2 cars ~$540 + gas/tolls ~$60.
  { id: "cars", label: "2 rental SUVs, Thu–Sun (taxes, gas, tolls)", amount: 600, kind: "fixed-split", rangeLabel: "$540–660 total" },
  { id: "oleta", label: "Oleta entry + kayak", amount: 35, kind: "per-person", activityId: "oleta" },
  { id: "club-fri", label: "Club night — E11EVEN/Space (GA + drinks)", amount: 187, kind: "per-person", rangeLabel: "$150–225" },
  { id: "club-sat", label: "Saturday night (GA + drinks)", amount: 188, kind: "per-person", activityId: "club-sat", rangeLabel: "$150–225" },
  { id: "food", label: "Food (3 days)", amount: 190, kind: "per-person", rangeLabel: "$150–240" },
  { id: "joes", label: "Joe's Stone Crab", amount: 60, kind: "per-person", activityId: "joes", rangeLabel: "$40–80" },
  { id: "ubers", label: "Ubers (club nights — nobody drives)", amount: 40, kind: "per-person" },
];

const miami2026: Trip = {
  slug: "miami-2026",
  title: "Miami Crew Trip",
  dates: "Oct 22–25, 2026",
  location: "Miami — hood TBD",
  crew: MIAMI_CREW,
  passcodeEnvKey: "TRIP_PASSWORD_MIAMI_2026",
  intro: [
    "A private boat anchored at Haulover Sandbar — cooler full, 83°F water, skyline on the ride home.",
    "One proper send-it Saturday — Wynwood bar crawl or big-room night at LIV.",
    "Stone crab claws at Joe's — the season literally just opened for us.",
    "Biking past wild alligators sunning on the path in the Everglades.",
    "Sunrise on the Club Space Terrace, if you make it.",
    "Kayaking mangrove tunnels with a real shot at manatees.",
    "Backyard fire pit pregames at our own house, 5 min from everything.",
  ],
  conditions: [
    { label: "Ocean", value: "83–84°F", sub: "bathwater — no wetsuit", span: "big" },
    { label: "Day high", value: "84–87°F", sub: "sun hits different" },
    { label: "Night low", value: "73–77°F", sub: "shorts at 3 AM, fine" },
    { label: "Sunset", value: "~6:45 PM", sub: "golden hour on the water", span: "wide" },
    { label: "Rain", value: "30–40%", sub: "brief PM shower, moves on" },
    { label: "UV", value: "High", sub: "sunscreen, non-negotiable" },
    { label: "Hurricane risk", value: "Low", sub: "past Sep 10 peak; check NHC week-of", span: "wide" },
  ],
  neighborhoods: [
    {
      id: "buena-vista",
      name: "Buena Vista",
      emoji: "🏡",
      tagline: "The chill HQ",
      bullets: [
        "Quiet residential pocket with actual houses — backyard, fire pit, room to pregame loud-ish.",
        "Wynwood 5–7 min, South Beach 10–15 via I-195, MIA 12 min. Uber to everything.",
        "Cheapest way to get a whole house for 8.",
        "Safety: calm residential blocks, but it thins out toward the NW edges at night — Uber door-to-door after dark, fine on foot by day.",
      ],
      mapsQuery: "Buena Vista, Miami, FL",
    },
    {
      id: "wynwood",
      name: "Wynwood",
      emoji: "🎨",
      tagline: "Sleep inside the party",
      bullets: [
        "Bars, murals, and street food at the front door — walk home at 3 AM, no Ubers.",
        "Loudest of the three; more lofts/condos than houses, backyard unlikely.",
        "Best if the group's priority is going out over hanging in.",
        "Safety: packed and fine while the bars run; edges go quiet/industrial after close — stay in the active blocks, phones in front pockets.",
      ],
      mapsQuery: "Wynwood, Miami, FL",
    },
    {
      id: "design-district",
      name: "Design District",
      emoji: "🛍️",
      tagline: "The polished one",
      bullets: [
        "Luxury shopping blocks, free ICA museum, Mandolin's garden a corner away.",
        "Dead quiet at night — you go to the party, it never comes to you.",
        "Sits right between Buena Vista and Wynwood; same Uber math everywhere.",
        "Safety: the safest of the three — private security and cameras everywhere; streets are just empty at night, not sketchy.",
      ],
      mapsQuery: "Miami Design District, Miami, FL",
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
      { name: "Wynwood bars", where: "Walkable cluster", vibe: "Gramps, Wood Tavern, Shots, MAD Club", cover: "$0–20", notes: "Walkable crawl; cheapest good night in Miami" },
    ],
    rules: [
      "21+ everywhere, physical ID.",
      "Dress: no shorts, no flip-flops, no athletic wear after dark. Collared shirt + real shoes = safe. LIV hates sneakers.",
      "Drinks inside: cocktails $18–25, beers $12–15 → budget $100–150/person/night on GA.",
      "Big nights: buy GA in advance — covers rise at the door. Table for 8 roughly breaks even vs GA and guarantees entry.",
      "Lineups post 2–4 weeks out: 11miami.com, clubspace.com, livnightclub.com, ra.co.",
      "Uber everything; parking is misery.",
    ],
  },
  info: [
    {
      title: "Pack right",
      bullets: [
        "Swimwear ×2, collared shirt + real shoes for clubs, sunscreen, dramamine for the boat, portable speaker.",
        "House rules: exterior cameras exist; 8-guest cap is hard.",
        "Safety: tourist-normal zones; Uber door-to-door at night; phones in front pockets on Ocean Drive at 3 AM.",
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
  ],
  activities: MIAMI_ACTIVITIES,
  costItems: MIAMI_COSTS,
};

export const TRIPS: Record<string, Trip> = {
  [miami2026.slug]: miami2026,
};
