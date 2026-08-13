import { buildSnapshot } from "@/lib/wnba-api";
import { writeSnapshot } from "@/lib/wnba-db";

// Cron target: fetch ESPN → transform → store today's snapshot.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await buildSnapshot();
    await writeSnapshot(snapshot);
    return Response.json({
      ok: true,
      date: snapshot.date,
      games: snapshot.matchups.length,
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "snapshot failed" },
      { status: 502 }
    );
  }
}
