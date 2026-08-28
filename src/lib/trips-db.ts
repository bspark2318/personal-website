import { neon } from "@neondatabase/serverless";
import {
  type RsvpRow,
  type RsvpStatus,
  type Trip,
  type VoteRow,
  type VoteValue,
} from "./trips";

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set — add it to .env.local");
  return neon(url);
}

// Passcode gate disabled for now — accepts every request. To re-enable:
// compare req.headers.get(TRIP_HEADER) against process.env[trip.passcodeEnvKey]
// and restore the locked phase + PasscodeGate in the trip page.
export function checkTripPassword(_req: Request, _trip: Trip): boolean {
  return true;
}

export async function ensureTables() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS trip_rsvps (
      trip_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (trip_slug, name)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS trip_votes (
      trip_slug TEXT NOT NULL,
      activity_id TEXT NOT NULL,
      name TEXT NOT NULL,
      vote TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (trip_slug, activity_id, name)
    )
  `;
}

export async function upsertRsvp(slug: string, name: string, status: RsvpStatus) {
  const sql = getSql();
  await ensureTables();
  await sql`
    INSERT INTO trip_rsvps (trip_slug, name, status)
    VALUES (${slug}, ${name}, ${status})
    ON CONFLICT (trip_slug, name) DO UPDATE SET status = ${status}, updated_at = now()
  `;
}

export async function setVote(
  slug: string,
  activityId: string,
  name: string,
  vote: VoteValue | null
) {
  const sql = getSql();
  await ensureTables();
  if (vote === null) {
    await sql`
      DELETE FROM trip_votes
      WHERE trip_slug = ${slug} AND activity_id = ${activityId} AND name = ${name}
    `;
  } else {
    await sql`
      INSERT INTO trip_votes (trip_slug, activity_id, name, vote)
      VALUES (${slug}, ${activityId}, ${name}, ${vote})
      ON CONFLICT (trip_slug, activity_id, name)
      DO UPDATE SET vote = ${vote}, updated_at = now()
    `;
  }
}

export async function readRows(
  slug: string
): Promise<{ rsvps: RsvpRow[]; votes: VoteRow[] }> {
  const sql = getSql();
  await ensureTables();
  const [rsvps, votes] = await Promise.all([
    sql`SELECT name, status FROM trip_rsvps WHERE trip_slug = ${slug}`,
    sql`SELECT activity_id, name, vote FROM trip_votes WHERE trip_slug = ${slug}`,
  ]);
  return {
    rsvps: rsvps.map((r) => ({ name: r.name as string, status: r.status as RsvpStatus })),
    votes: votes.map((v) => ({
      activityId: v.activity_id as string,
      name: v.name as string,
      vote: v.vote as VoteValue,
    })),
  };
}
