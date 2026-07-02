import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import AddItemForm from "@/components/showroom/AddItemForm";
import ItemCard from "@/components/showroom/ItemCard";
import { getSql, ROOMS, type Item } from "@/lib/showroom";

export const dynamic = "force-dynamic";
export const metadata = { title: "Show Room" };

function groupByRoom(items: Item[]): [string, Item[]][] {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const list = groups.get(item.room) ?? [];
    list.push(item);
    groups.set(item.room, list);
  }
  const known = ROOMS.filter((r) => groups.has(r));
  const unknown = [...groups.keys()].filter((r) => !ROOMS.includes(r)).sort();
  return [...known, ...unknown].map((r) => [r, groups.get(r)!]);
}

export default async function ShowRoom() {
  const sql = getSql();
  const items = (await sql`
    SELECT * FROM showroom_items ORDER BY created_at DESC
  `) as Item[];
  const rooms = groupByRoom(items);

  return (
    <main>
      <Nav />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-40 text-center">
        <Reveal>
          <h1 className="display text-4xl font-semibold sm:text-6xl">Show Room.</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            Furniture picks for mom&apos;s place — add a link, we&apos;ll fetch the rest.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <AddItemForm />
        </Reveal>
      </section>

      {rooms.length === 0 && (
        <p className="pb-32 text-center text-muted">Nothing here yet — add the first piece.</p>
      )}

      {rooms.map(([room, roomItems]) => (
        <section key={room} className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal>
            <h2 className="mb-8 text-xs uppercase tracking-[0.2em] text-muted">{room}</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roomItems.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <ItemCard item={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <footer className="border-t border-card-border py-10 text-center text-sm text-muted">
        Built with Next.js. Forever a work in progress.
      </footer>
    </main>
  );
}
