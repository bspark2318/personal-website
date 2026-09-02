import type { Activity, CostItem, CrewMember, StayOption, Trip } from "./trips";

const MIAMI_CREW: CrewMember[] = [
  { first: "BumSu", last: "Park" },
  { first: "Emily", last: "Lam" },
  { first: "Taku", last: "Takamatsu" },
  { first: "Rohan", last: "Datar" },
  { first: "Andy", last: "Chan" },
  { first: "Sam", last: "Choi" },
  { first: "Ratik", last: "Dubey" },
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
    id: "skydive",
    emoji: "🪂",
    title: "Skydiving — tandem jump",
    route: "Homestead · 13,500 ft",
    price: "$230–350",
    facts: ["Tandem 13,500 ft", "~60 sec freefall", "Cars needed", "45–60 min south"],
    blurb: "**Skydive Miami** at Homestead: tandem from **13,500 ft**, ~**60 sec of freefall** over the **coast, Biscayne Bay, and the Everglades**.",
    details: [
      "**$230–350/pp** for the jump (weekday cheaper); **handcam video + photos** add ~**$100–120**.",
      "**Homestead General Airport**, ~45–60 min south — **cars needed**. Book the **first morning slot**: calmest winds, least likely to scrub.",
      "Weight limit ~**230–240 lb**, photo ID, closed-toe shoes. **Weather-dependent** — they rebook if it's windy or storming.",
      "Reserve **2–3 weeks out** at **skydivemiami.com**; whoever sits out can watch the landings from the drop zone.",
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
    id: "club-fri",
    emoji: "🍾",
    title: "First night out — E11EVEN / Space",
    when: "Fri night",
    route: "MIA · Downtown / Wynwood",
    price: "$150–225",
    facts: ["GA + drinks", "24/7 club", "Ubers both ways"],
    blurb: "Opening night at **E11EVEN** (never closes) or **Club Space** for the after-hours crowd. GA plus a few rounds runs **$150–225/pp**.",
    details: [
      "**E11EVEN** is 24/7 — go late, leave whenever.",
      "**Club Space** terrace for sunrise sets; check the lineup at **clubspace.com**.",
      "Table for 8: **$1,500–3K minimum** ≈ GA + drinks, and guarantees entry.",
    ],
    votable: true,
  },
  {
    id: "club-sat",
    emoji: "🥂",
    title: "Saturday night — LIV / Wynwood",
    when: "Sat night",
    route: "MIA · Wynwood / Mid-Beach",
    price: "$150–225",
    facts: ["Club covers $40–150", "Wynwood covers $0–20", "GA + drinks $150–225"],
    blurb: "Two options: a **Wynwood bar crawl** (Las Rosas / El Patio / MAD Club) or a big club — **LIV** at the Fontainebleau, **Club Space**, or **E11EVEN** again.",
    details: [
      "Strict doors at LIV — **collared shirts**, enter in **mixed groups**, no sneakers.",
      "Table for 8: **$1,500–3K minimum**, roughly equal to GA + drinks, and guarantees entry.",
      "Wynwood bars are walkable between spots.",
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
  // Roundtrip domestic airfare to MIA — single reasonable estimate, no range.
  { id: "flights", label: "Flights — roundtrip to MIA", amount: 300, kind: "per-person" },
  // Budget-to-splurge spread for the house — from a cheaper find to a nicer stay.
  { id: "house", label: "Airbnb (3 nights)", amount: 1600, low: 1200, high: 2000, kind: "fixed-split", rangeLabel: "$1,200–2,000 total" },
  { id: "boat", label: "Boat day + tip", amount: 1160, kind: "fixed-split", activityId: "boat" },
  // Alternative water day to the boat (drift ~$45–70/pp, private ~$100–180/pp).
  { id: "fishing", label: "Deep-sea fishing charter", amount: 130, low: 45, high: 180, kind: "per-person", activityId: "fishing", rangeLabel: "$45–180" },
  { id: "skydive", label: "Skydiving — tandem + video", amount: 400, low: 230, high: 470, kind: "per-person", activityId: "skydive", rangeLabel: "$230–470" },
  { id: "everglades", label: "Everglades bike + split entry", amount: 32, kind: "per-person", activityId: "everglades" },
  // Booking.com quotes, MIA Thu→Sun, reputable tier (Alamo/Enterprise/Dollar,
  // 9+ rated): compact SUV ~$240–290/3 days all-in → 2 cars ~$540 + gas/tolls ~$60.
  { id: "cars", label: "2 rental SUVs, Thu–Sun (taxes, gas, tolls)", amount: 600, low: 540, high: 660, kind: "fixed-split", rangeLabel: "$540–660 total" },
  { id: "oleta", label: "Oleta entry + kayak", amount: 35, kind: "per-person", activityId: "oleta" },
  // Both nights are optional — toggle either off in the estimator (or 👎 it).
  { id: "club-fri", label: "First night out (GA + drinks)", amount: 100, low: 50, high: 150, kind: "per-person", activityId: "club-fri", rangeLabel: "$50–150" },
  { id: "club-sat", label: "Saturday night (GA + drinks)", amount: 100, low: 50, high: 150, kind: "per-person", activityId: "club-sat", rangeLabel: "$50–150" },
  { id: "food", label: "Food (3 days)", amount: 190, low: 150, high: 240, kind: "per-person", rangeLabel: "$150–240" },
  { id: "joes", label: "Joe's Stone Crab", amount: 60, low: 40, high: 80, kind: "per-person", activityId: "joes", rangeLabel: "$40–80" },
  { id: "ubers", label: "Ubers (club nights — nobody drives)", amount: 40, kind: "per-person" },
];

// Candidate Airbnbs. Metadata + photos pulled from the live listings;
// `total` is a rough Oct Thu–Sun all-in estimate — confirm real quotes on Airbnb.
const IMG = "?im_w=720";
const MIAMI_STAYS: StayOption[] = [
  {
    id: "modern-villa",
    name: "Modern villa — Design District & Wynwood",
    url: "https://www.airbnb.com/rooms/1006171965970945656",
    neighborhood: "Design District / Wynwood",
    total: 2100,
    perNight: 700,
    sleeps: 10,
    layout: "4 BR · 6 beds · 2 BA · ★4.96 (123)",
    images: [
      "https://a0.muscache.com/im/pictures/miso/Hosting-1006171965970945656/original/3b97c449-72d2-46c7-b8a2-117d51f2339d.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/miso/Hosting-1006171965970945656/original/1c75aced-a91f-497c-92c9-9c2b67dd0cca.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/miso/Hosting-1006171965970945656/original/75dab6e0-772d-4d65-ad1a-7c8fc9686e22.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/miso/Hosting-1006171965970945656/original/630c71e3-b934-46a1-a1cb-c7a4440e9596.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/miso/Hosting-1006171965970945656/original/df2b8f75-dabf-445d-a31e-28976d5ef205.jpeg" + IMG,
    ],
    notes: [
      "Highest-rated of the three (★4.96, 123 reviews) — the safe pick.",
      "Walkable to Wynwood; sleeps 10 so we're not maxed at 8.",
    ],
  },
  {
    id: "big-yard",
    name: "Big Yard & Fire Pit — near Design District",
    url: "https://www.airbnb.com/rooms/1572599686379859890",
    neighborhood: "Near Design District",
    total: 2700,
    perNight: 900,
    sleeps: 14,
    layout: "4 BR · 9 beds · 3 BA · ★4.92 (25)",
    images: [
      "https://a0.muscache.com/im/pictures/airflow/Hosting-1572599686379859890/original/342b9dd0-9274-4882-9ed5-3a6f293ca850.jpg" + IMG,
      "https://a0.muscache.com/im/pictures/airflow/Hosting-1572599686379859890/original/6077ecf9-4d6a-405c-99be-aca0d3cc3188.jpg" + IMG,
      "https://a0.muscache.com/im/pictures/airflow/Hosting-1572599686379859890/original/c90ef2a0-2064-418c-ad85-d1c978417bdf.jpg" + IMG,
      "https://a0.muscache.com/im/pictures/airflow/Hosting-1572599686379859890/original/79012a73-e4e3-4cd4-89a0-a22879d6999e.jpg" + IMG,
      "https://a0.muscache.com/im/pictures/airflow/Hosting-1572599686379859890/original/0cf7e05b-7158-4f1f-af77-e73d1e3710ff.jpg" + IMG,
    ],
    notes: [
      "Backyard + fire pit — the pregame spot. Sleeps 14, most beds.",
      "Newest listing, fewest reviews (25) but strong rating.",
    ],
  },
  {
    id: "cloud-couch",
    name: "Cloud Couch — Design District",
    url: "https://www.airbnb.com/rooms/1299863899868599119",
    neighborhood: "Design District",
    total: 1900,
    perNight: 633,
    sleeps: 8,
    layout: "4 BR · 5 beds · 3 BA · ★4.93 (68)",
    images: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1299863899868599119/original/ebaf470c-29c7-4eeb-85ec-f26f6198d4e6.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1299863899868599119/original/a47187ac-06bb-4633-81db-b64152924c85.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1299863899868599119/original/ed2acc57-550a-401d-8cfb-b0e0f6aef0ce.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1299863899868599119/original/421e2d31-0074-4e9d-958d-7f738095f57d.jpeg" + IMG,
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1299863899868599119/original/0268661e-811b-4d4c-8214-361589a1df09.jpeg" + IMG,
    ],
    notes: [
      "Exactly 8 beds for 8 — tightest fit, no extra room.",
      "Design District location; solid ★4.93 over 68 reviews.",
    ],
  },
];

const miami2026: Trip = {
  slug: "miami-2026",
  title: "Miami '26",
  dates: "Oct 2026 · weekend TBD",
  location: "Miami — hood TBD",
  crew: MIAMI_CREW,
  dateOptions: [
    { id: "oct-8", label: "Oct 8–11 (Thu–Sun)" },
    { id: "oct-15", label: "Oct 15–18 (Thu–Sun)" },
    { id: "oct-22", label: "Oct 22–25 (Thu–Sun)" },
  ],
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
      photo: { src: "/trips/hl-fishing.jpg", credit: "Florida Memory, public domain" },
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
      {
        name: "E11EVEN",
        where: "Downtown",
        vibe: "24/7 ultraclub, open-format/hip-hop, performers over the crowd",
        cover: "$20–60",
        notes: "Most forgiving door of the majors; 8-min Uber from house",
        lineups: {
          "oct-8": [
            { date: "Thu Oct 8", act: "Kamal Bankay" },
            { date: "Fri Oct 9", act: "Yung Miami" },
            { date: "Sat Oct 10", act: "Offset" },
            { date: "Sun Oct 11", act: "Damaged Goods" },
          ],
          "oct-15": [{ date: "Thu Oct 15", act: "Bone Thugs-N-Harmony" }],
          "oct-22": [
            { date: "Thu Oct 22", act: "Dynamiqo" },
            { date: "Sat Oct 24", act: "EDX" },
            { date: "Sun Oct 25", act: "Chizzle" },
          ],
        },
      },
      {
        name: "Club Space",
        where: "Downtown",
        vibe: "House/techno temple; Terrace runs past sunrise",
        cover: "$20–50",
        notes: "Most relaxed dress code; check RA for lineups",
        lineups: {
          "oct-8": [{ date: "Sat Oct 10", act: "Mason Collective" }],
          "oct-15": [
            { date: "Thu Oct 15", act: "Cloonee · Vintage Culture", note: "III Points Satellite" },
            { date: "Fri Oct 16", act: "999999999 · KI/KI", note: "III Points Satellite" },
            { date: "Sat Oct 17", act: "Four Tet b2b Floating Points b2b Daphni", note: "III Points Satellite" },
            { date: "Sun Oct 18", act: "Marco Carola · Seth Troxler · Honey Dijon", note: "33hr Terrace marathon" },
          ],
          "oct-22": [{ date: "Fri Oct 23", act: "Baby J", note: "The Ground — rap, not Terrace" }],
        },
      },
      {
        name: "LIV",
        where: "Fontainebleau",
        vibe: "Big-room EDM + celebs",
        cover: "$40–150",
        notes: "Hardest door in Miami; groups of guys get culled",
        lineups: {
          "oct-8": [
            { date: "Fri Oct 9", act: "Alesso" },
            { date: "Sat Oct 10", act: "SIDEPIECE" },
          ],
          "oct-15": [],
          "oct-22": [],
        },
      },
      {
        name: "Wynwood bars",
        where: "Walkable cluster",
        vibe: "1-800-Lucky, Coyo speakeasy, El Patio, Las Rosas, MAD Club",
        cover: "$0–20",
        notes: "Walkable crawl; cheapest good night in Miami. Lineups not posted this far out.",
      },
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
  stays: MIAMI_STAYS,
};

export const TRIPS: Record<string, Trip> = {
  [miami2026.slug]: miami2026,
};
