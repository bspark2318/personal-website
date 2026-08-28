import { fullName } from "@/lib/trips";
import { TRIPS } from "@/lib/trips-data";
import { setVote } from "@/lib/trips-db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const trip = TRIPS[slug];
  if (!trip) {
    return Response.json({ error: "unknown trip" }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const { name, activityId, vote } = body;
  if (typeof name !== "string" || !trip.crew.some((m) => fullName(m) === name)) {
    return Response.json({ error: "name must be one of the crew" }, { status: 400 });
  }
  if (!trip.activities.some((a) => a.id === activityId && a.votable)) {
    return Response.json({ error: "unknown activity" }, { status: 400 });
  }
  if (vote !== null && vote !== "up" && vote !== "down") {
    return Response.json({ error: "vote must be up, down, or null" }, { status: 400 });
  }

  await setVote(slug, activityId, name, vote);
  return Response.json({ ok: true });
}
