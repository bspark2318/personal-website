import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import MatchupBoard from "@/components/wnba/MatchupBoard";
import NoGames from "@/components/wnba/NoGames";
import { buildSnapshot } from "@/lib/wnba-api";
import { readSnapshot, writeSnapshot } from "@/lib/wnba-db";
import { fetchKalshiLines } from "@/lib/kalshi";
import type { Snapshot } from "@/lib/wnba";

export const dynamic = "force-dynamic";
export const metadata = { title: "WNBA Board" };

// Read today's snapshot; build once on demand if the cron hasn't run.
async function getSnapshot(): Promise<Snapshot> {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
  const existing = await readSnapshot(date);
  if (existing) return existing;
  const snapshot = await buildSnapshot();
  await writeSnapshot(snapshot);
  return snapshot;
}

export default async function WnbaPage() {
  let snapshot: Snapshot | null = null;
  let failed = false;
  const [snapResult, kalshiLines] = await Promise.all([
    getSnapshot().catch(() => null),
    fetchKalshiLines(),
  ]);
  if (snapResult) snapshot = snapResult;
  else failed = true;

  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
        <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">
            {snapshot?.date ?? "today"} · pre-game snapshot
          </p>
          <h1 className="display mb-10 text-4xl font-semibold sm:text-5xl">
            WNBA Board
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          {failed || !snapshot ? (
            <div className="rounded-2xl border border-card-border p-16 text-center">
              <p className="text-lg font-semibold">Couldn&apos;t load stats</p>
              <p className="mt-1 text-sm text-muted">
                ESPN or the database didn&apos;t answer. Refresh in a minute.
              </p>
            </div>
          ) : snapshot.matchups.length === 0 ? (
            <NoGames />
          ) : (
            <MatchupBoard
              snapshot={snapshot}
              kalshiLines={kalshiLines ? Object.fromEntries(kalshiLines) : null}
            />
          )}
        </Reveal>
      </section>
    </main>
  );
}
