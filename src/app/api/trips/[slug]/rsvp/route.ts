import { TRIPS } from "@/lib/trips-data";
import { checkTripPassword, upsertRsvp } from "@/lib/trips-db";

const STATUSES = ["in", "out", "maybe"] as const;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const trip = TRIPS[slug];
  if (!trip) {
    return Response.json({ error: "unknown trip" }, { status: 404 });
  }
  if (!checkTripPassword(req, trip)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name, status } = body;
  if (typeof name !== "string" || !trip.crew.includes(name)) {
    return Response.json({ error: "name must be one of the crew" }, { status: 400 });
  }
  if (!STATUSES.includes(status)) {
    return Response.json({ error: "status must be in, out, or maybe" }, { status: 400 });
  }

  await upsertRsvp(slug, name, status);
  return Response.json({ ok: true });
}
