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
    title: "Private boat — sandbar + skyline",
    when: "best Sat morning",
    blurb: "Captained 30–40ft, 4 hrs, BYOB. Star Island celeb mansions → Haulover Sandbar (anchor, swim, float, party scene) → Biscayne Bay skyline.",
    details: [
      "~$145/head all-in at 8 people. Pack the cooler from the house.",
      "Book GetMyBoat / Boatsetter / Aqua; confirm fuel, cooler/ice, sandbar stop, cancellation. Slots go 2–4 weeks out.",
      "Fishing alternative: 6-pack boats cap at 6 people — for 8 it's a bigger inspected boat (~$1,500–2,500) or two boats. Late Oct = sailfish, mahi, kingfish.",
    ],
    votable: true,
  },
  {
    id: "everglades",
    emoji: "🐊",
    title: "Everglades — Shark Valley bikes",
    when: "any morning, cars needed",
    blurb: "15-mile flat paved loop through gator country — they sun themselves ON the path. 45-ft observation tower at the halfway point. 2–3 hrs.",
    details: [
      "Bikes $27/day, reserve at sharkvalleytramtours.com; ~$35/vehicle entry. ~50 min drive west on Tamiami Trail.",
      "Don't want to bike? 2-hr guided tram, or airboat on the way back (~$30–40/pp).",
      "Wildlife: gators guaranteed, herons, egrets, turtles, maybe crocs. Keep 15 ft.",
      "Pair with La Camaronera on the drive back — standing-room fried shrimp counter, pan con minuta.",
    ],
    votable: true,
  },
  {
    id: "little-havana",
    emoji: "🇨🇺",
    title: "Little Havana — Calle Ocho",
    when: "easy first evening",
    blurb: "Walk SW 8th St: Domino Park old-timers, cigar rollers at Cuba Tobacco, Azucar ice cream (guava + cheese). Dinner at Sanguich or Versailles.",
    details: [
      "12 min Uber from the house. Zero cost beyond food.",
      "Old's Havana for sit-down + live music if the night stretches.",
    ],
    votable: true,
  },
  {
    id: "joes",
    emoji: "🦞",
    title: "Joe's Stone Crab",
    when: "dinner, any night",
    blurb: "100+ years old, tuxedoed waiters, stone crab season just opened Oct 15. Claws + mustard sauce, hash browns, creamed spinach, key lime pie.",
    details: [
      "Main dining room takes no reservations — go at opening or expect 1–2 hr waits.",
      "Cheat code: Joe's Take Away next door — same claws, no wait.",
      "Medium claws ~$40s, large $60s+; the fried chicken is famously ~$7.",
    ],
    votable: true,
  },
  {
    id: "club-fri",
    emoji: "🪩",
    title: "Club night — E11EVEN / Space",
    when: "Thu or Fri night",
    blurb: "E11EVEN: 24/7 ultraclub, performers over the crowd, hip-hop-leaning. Club Space literally across the street: house/techno temple, Terrace runs past sunrise.",
    details: [
      "GA in advance: 11miami.com / clubspace.com, $20–60. 8-min Uber.",
      "21+, physical ID, no shorts/flip-flops/athletic wear.",
      "Budget $100–150/head inside (cocktails $18–25).",
    ],
    votable: true,
  },
  {
    id: "club-sat",
    emoji: "🥂",
    title: "Big Saturday night",
    when: "Sat night",
    blurb: "The send-it night. Wynwood bar crawl (Gramps / Wood Tavern / Shots) or go big-room: LIV at the Fontainebleau, Story, or back to E11EVEN.",
    details: [
      "LIV/Story covers $40–150; hardest doors in Miami — collared shirts, enter in mixed pairs, no sneakers.",
      "Table math for 8: $1,500–3K minimum ≈ breaks even with GA + drinks, and guarantees entry.",
      "Cheap version: Wynwood bars, $0–20 covers, walkable between spots.",
    ],
    votable: true,
  },
  {
    id: "oleta",
    emoji: "🛶",
    title: "Oleta River kayaks — manatees",
    when: "best Sun morning",
    blurb: "FL's largest urban park: paddle mangrove tunnels toward Raccoon Island on calm, beginner water. Manatee season is just starting — real chance, not a promise.",
    details: [
      "~$25–40/hr kayak/paddleboard, concession opens 9 AM (oletariveradventures.com). ~20 min drive.",
      "Dolphins possible too. Bring a dry bag for phones.",
    ],
    votable: true,
  },
  {
    id: "beach",
    emoji: "🌴",
    title: "South Beach / Mid-Beach hours",
    when: "whenever",
    blurb: "Ocean's 83°F. Default filler between everything else — post-boat, pre-Joe's, hangover repair.",
    details: [
      "La Sandwicherie (open till 5 AM) is the eternal post-anything move.",
      "Phones in front pockets on Ocean Drive at 3 AM.",
    ],
    votable: true,
  },
];

// Budget §7 of the doc: per-person total at 8 people ≈ $1,125.
const MIAMI_COSTS: CostItem[] = [
  { id: "house", label: "Airbnb (3 nights)", amount: 1600, kind: "fixed-split" },
  { id: "boat", label: "Boat day + tip", amount: 1160, kind: "fixed-split", activityId: "boat" },
  { id: "everglades", label: "Everglades entry + bike", amount: 35, kind: "per-person", activityId: "everglades" },
  // Booking.com quotes, MIA Thu→Sun, reputable tier (Alamo/Enterprise/Dollar,
  // 9+ rated): compact SUV ~$240–290/3 days all-in → 2 cars ~$540 + gas/tolls ~$60.
  { id: "cars", label: "2 rental SUVs, Thu–Sun (taxes, gas, tolls)", amount: 600, kind: "fixed-split", rangeLabel: "$540–660 total" },
  { id: "oleta", label: "Oleta entry + kayak", amount: 35, kind: "per-person", activityId: "oleta" },
  { id: "club-fri", label: "Club night — E11EVEN/Space (GA + drinks)", amount: 187, kind: "per-person", activityId: "club-fri", rangeLabel: "$150–225" },
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
    {
      text: "**Private party boat** — anchored at **Haulover Sandbar**, 4 hours, BYOB, **83°F water**, **snorkeling** off the boat, skyline ride back.",
      photo: { src: "/trips/hl-boat.jpg", credit: "James Willamor, CC BY-SA 2.0" },
    },
    {
      text: "**Nightlife at every speed** — Wynwood bar crawl, **LIV**, **E11EVEN**, or the **Club Space Terrace** till sunrise.",
      photo: { src: "/trips/hl-night.jpg", credit: "Ines Hegedus-Garcia, CC BY 2.0" },
    },
    {
      text: "**Everglades National Park** — bike the loop, **alligators** on the path.",
      photo: { src: "/trips/everglades-gator.jpg", credit: "Gatorfan252525, CC BY-SA 4.0" },
    },
    {
      text: "Kayak the **mangrove tunnels**; **manatee** sightings possible.",
      photo: { src: "/trips/hl-kayak.jpg", credit: "NARA, public domain" },
    },
    {
      text: "**Deep-sea fishing** option — late October runs **sailfish, mahi, kingfish**.",
      photo: { src: "/trips/hl-fishing.jpg", credit: "Florida Memory" },
    },
    {
      text: "**Joe's Stone Crab** — 100 years old, season opens right before we land.",
      photo: { src: "/trips/hl-joes.jpg", credit: "FoodOfMiami, public domain" },
    },
    {
      text: "House has a **backyard fire pit** and is **centrally located**.",
      photo: { src: "/trips/hl-firepit.jpg", credit: "Kurt Kaiser, CC0" },
    },
  ],
  conditions: [
    { label: "Ocean", value: "83–84°F", sub: "warm enough to swim", span: "big" },
    { label: "Day high", value: "84–87°F", sub: "strong sun" },
    { label: "Night low", value: "73–77°F", sub: "warm overnight" },
    { label: "Sunset", value: "~6:45 PM", sub: "boat back before dark", span: "wide" },
    { label: "Rain", value: "30–40%", sub: "short afternoon showers" },
    { label: "UV", value: "High", sub: "bring sunscreen" },
    { label: "Hurricane risk", value: "Low", sub: "past seasonal peak; check NHC week-of", span: "wide" },
  ],
  neighborhoods: [
    {
      id: "buena-vista",
      name: "Buena Vista",
      emoji: "🏡",
      tagline: "Residential home base",
      bullets: [
        "**Quiet residential** area with **full houses** — backyard and fire pit likely.",
        "**Wynwood 5–7 min**, **South Beach 10–15** via I-195, **MIA 12 min**. Uber to everything.",
        "**Cheapest** way to get a **whole house for 8**.",
        "**Safety:** calm residential blocks; NW edges empty out at night — **Uber door-to-door after dark**, fine on foot by day.",
      ],
      mapsQuery: "Buena Vista, Miami, FL",
    },
    {
      id: "wynwood",
      name: "Wynwood",
      emoji: "🎨",
      tagline: "Walkable nightlife",
      bullets: [
        "**Bars, murals, and street food** within walking distance — **no Ubers needed** at night.",
        "**Loudest** of the three; more lofts/condos than houses, **backyard unlikely**.",
        "Best fit if **going out** matters more than hanging at the house.",
        "**Safety:** busy while bars are open; edges turn quiet and industrial after close — **stay in the active blocks**.",
      ],
      mapsQuery: "Wynwood, Miami, FL",
    },
    {
      id: "design-district",
      name: "Design District",
      emoji: "🛍️",
      tagline: "Quiet and upscale",
      bullets: [
        "**Luxury retail** blocks, **free ICA museum**, Mandolin a block away.",
        "**Quiet at night**; nightlife requires travel.",
        "**Between Buena Vista and Wynwood**; similar Uber times everywhere.",
        "**Safety:** safest of the three — **private security and cameras**; streets are empty at night, not unsafe.",
      ],
      mapsQuery: "Miami Design District, Miami, FL",
    },
  ],
  parks: [
    {
      id: "everglades",
      name: "Everglades",
      emoji: "🐊",
      tagline: "National park",
      bullets: [
        "**Shark Valley**: **15-mile paved loop** — bike rentals and a tram on site.",
        "**Alligators** on and beside the path; keep 15 ft.",
        "**Observation tower** at the loop's halfway point; **airboat tours** on the drive back.",
        "**~50 min drive** west on Tamiami Trail.",
      ],
      mapsQuery: "Shark Valley Visitor Center, Everglades National Park, FL",
      photos: [
        { src: "/trips/everglades-gator.jpg", credit: "Gatorfan252525, CC BY-SA 4.0" },
        { src: "/trips/everglades-tower.jpg", credit: "DaSpader, CC BY-SA 3.0" },
        { src: "/trips/everglades-airboat.jpg", credit: "chensiyuan, CC BY-SA 4.0" },
      ],
    },
    {
      id: "south-beach",
      name: "South Beach",
      emoji: "🌴",
      tagline: "The party beach",
      bullets: [
        "**Lummus Park stretch** (5th–15th St) — the crowded, social one.",
        "**Ocean Drive** art deco strip runs alongside; **83°F water**.",
        "Default filler between plans — post-boat, pre-dinner.",
        "**10–15 min** from the house.",
      ],
      mapsQuery: "Lummus Park Beach, Miami Beach, FL",
      photos: [
        { src: "/trips/southbeach-beach.jpg", credit: "M McBey, CC BY 2.0" },
        { src: "/trips/southbeach-lifeguard.jpg", credit: "Matt Kieffer, CC BY-SA 2.0" },
        { src: "/trips/southbeach-oceandrive.jpg", credit: "Jorge Láscar, CC BY 2.0" },
      ],
    },
    {
      id: "biscayne",
      name: "Biscayne",
      emoji: "🤿",
      tagline: "National park",
      bullets: [
        "**Mostly underwater** — coral reefs, wrecks, keys.",
        "**Snorkel/boat tours** from the Homestead visitor center; book ahead.",
        "**Boca Chita Key lighthouse** and **Stiltsville** by boat.",
        "**~1 hr drive** south.",
      ],
      mapsQuery: "Biscayne National Park, Homestead, FL",
      photos: [
        { src: "/trips/biscayne-snorkel.jpg", credit: "NPS, public domain" },
        { src: "/trips/biscayne-bocachita.jpg", credit: "NPS, public domain" },
        { src: "/trips/biscayne-stiltsville.jpg", credit: "Pallowick, CC BY-SA 4.0" },
      ],
    },
    {
      id: "keys",
      name: "Florida Keys",
      emoji: "🌉",
      tagline: "Day trip south",
      bullets: [
        "**Key Largo ~1.5 hr**, **Islamorada ~2 hr** — realistic as a **full-day** trip.",
        "**John Pennekamp Coral Reef SP**: glass-bottom boat + snorkel tours to **Christ of the Abyss**.",
        "**Seven Mile Bridge** further down if the drive stretches.",
      ],
      mapsQuery: "Key Largo, FL",
      photos: [
        { src: "/trips/keys-bridge.jpg", credit: "Brian W. Schaller, FAL" },
        { src: "/trips/keys-pennekamp.jpg", credit: "Serge Melki, CC BY 2.0" },
        { src: "/trips/keys-islamorada.jpg", credit: "Sharon Hahn Darlin, CC BY 2.0" },
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
      title: "Wildlife",
      bullets: [
        "**Alligators:** common at **Shark Valley**, often on the bike path. **Keep 15 ft**; don't feed.",
        "**Manatees:** season starts **late October** — **Oleta kayak** is the best option; peak is Dec–Feb.",
        "**Birds:** fall migration peaks in October — **binoculars** worth bringing.",
        "**Marine:** **83°F water**; turtles, rays, nurse sharks possible while snorkeling.",
      ],
    },
  ],
  activities: MIAMI_ACTIVITIES,
  costItems: MIAMI_COSTS,
};

export const TRIPS: Record<string, Trip> = {
  [miami2026.slug]: miami2026,
};
