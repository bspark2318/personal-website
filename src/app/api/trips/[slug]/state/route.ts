import { shapeState } from "@/lib/trips";
import { TRIPS } from "@/lib/trips-data";
import { checkTripPassword, readRows } from "@/lib/trips-db";

export async function GET(
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

  const me = new URL(req.url).searchParams.get("me");
  const { rsvps, votes } = await readRows(slug);
  return Response.json(shapeState(rsvps, votes, me));
}
