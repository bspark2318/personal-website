import { fullName } from "@/lib/trips";
import { TRIPS } from "@/lib/trips-data";
import { setDatePref } from "@/lib/trips-db";

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
  const { name, optionId, works } = body;
  if (typeof name !== "string" || !trip.crew.some((m) => fullName(m) === name)) {
    return Response.json({ error: "name must be one of the crew" }, { status: 400 });
  }
  if (!trip.dateOptions.some((o) => o.id === optionId)) {
    return Response.json({ error: "unknown date option" }, { status: 400 });
  }
  if (typeof works !== "boolean") {
    return Response.json({ error: "works must be a boolean" }, { status: 400 });
  }

  await setDatePref(slug, optionId, name, works);
  return Response.json({ ok: true });
}
