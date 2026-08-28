# Spec: Miami Trip Itinerary Page

<!-- WHAT & WHY. No tech — that's plan.md. Unknowns → [NEEDS CLARIFICATION: q]. Fewest words possible. -->

**Status:** approved

## Problem

Miami crew trip (Oct 22–25, 2026, 8 people) is planned in a doc. Need a shareable page so the 7 friends can see the full plan, confirm they're in, and vote on individual activities — instead of parsing a wall of text in group chat.

## User stories

- [ ] As the organizer, I want to send one link that shows the whole trip so friends can judge buy-in.
- [ ] As a friend, I want to mark myself **in / out / maybe** for the trip.
- [ ] As a friend, I want to vote **👍/👎** on individual activities (boat, Everglades, clubs, Joe's…) so we can cut what nobody wants.
- [ ] As a friend, I want to play with a cost estimator — vary headcount and which activities we do — to see my per-person damage.
- [ ] As the organizer, I want to see who's in and which activities have support, at a glance.

## Functional requirements

- **FR-001:** MUST render the full trip content organized by **activity** (boat, Everglades, clubs, Joe's, Oleta, Little Havana…), not by day — freedom of movement over fixed schedule. Overview keeps logistics (check-in/checkout, getting around); food/nightlife/budget/practical retained.
- **FR-001a:** MUST organize content as tabbed sections (e.g., Overview / Activities / Food / Nightlife / Costs / RSVP) — not one long scroll.
- **FR-002:** MUST gate the page behind a shared passcode; wrong/no passcode shows only the passcode prompt.
- **FR-003:** MUST let each visitor identify as one of the 8 crew names (tap to pick); choice persists on their device.
- **FR-004:** MUST let an identified visitor set trip RSVP: in / out / maybe, changeable anytime.
- **FR-005:** MUST let an identified visitor vote 👍/👎 per votable activity, changeable anytime; one vote per person per activity.
- **FR-006:** MUST show live tallies with limited identity: names shown **only for "in" RSVPs**; out/maybe RSVPs and all activity votes display as anonymous counts.
- **FR-007:** MUST persist RSVPs and votes across visits and devices (shared, not local-only).
- **FR-008:** MUST work well on phones — friends will open the link from group chat.
- **FR-009:** MUST provide a cost-estimator tab: adjustable headcount and toggleable activities (boat, clubs ×N, Everglades, Oleta, Joe's…) recomputing per-person total live.
- **FR-010:** Cost estimator MUST reflect real split math (fixed costs ÷ headcount vs per-person costs) using the budget numbers from the doc.

## Key entities

- **Crew member:** one of 8 preset names; has one RSVP and many votes.
- **Activity:** votable itinerary item (e.g., boat day, E11EVEN night, Shark Valley, Joe's); belongs to a day.
- **RSVP:** crew member → in/out/maybe.
- **Vote:** crew member → activity → 👍/👎 (displayed anonymously).
- **Cost item:** activity/expense with cost type (fixed-split vs per-person) and amount; feeds the estimator.

## Acceptance criteria

1. Given no passcode entered, when visiting the page, then only the passcode prompt is visible — no itinerary content.
2. Given correct passcode, when the page loads, then full itinerary + name picker appear.
3. Given I picked "Shai" and tapped **In**, when anyone else loads the page, then Shai shows by name as in.
4. Given I RSVP'd **maybe** or **out**, then others see only updated counts — never my name.
5. Given I 👍'd the boat, then others see the boat's count increment with no name attached; on my own phone my vote stays pre-selected.
6. Given the cost tab with 8 people and all activities on, the per-person total matches the doc's ~$1,000–1,250; dropping headcount to 6 raises fixed-split items (house, boat) accordingly.
7. Given I toggle off both club nights in the estimator, the per-person total drops by the club line items.
8. On a phone-width screen, tabs and all sections are readable without horizontal scrolling.

## Edge cases

- Two people claim the same name → last write wins per device; votes keyed by name, so they'd overwrite each other — acceptable for 8 friends.
- Vote toggling (👍 → 👎 → remove) — must not double-count.
- Passcode brute force — low stakes; no lockout needed.
- Cost estimator is a per-visitor sandbox — tweaks don't affect others or persist.
- Estimator with headcount below fixed-cost viability (e.g., 2 people) — show the ugly number, no floor.
- Data unavailable → page still shows itinerary content, voting disabled with a notice.

## Out of scope

- Free-text comments (discussion stays in group chat).
- Admin/edit UI — itinerary content updated by the organizer via code.
- Accounts, real auth, per-user passwords.
- Payments/Venmo integration, flight tracking.
- Editing the crew list from the UI.

## Open questions

<!-- Empty before approval. -->
