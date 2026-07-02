import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import AddItemForm from "@/components/showroom/AddItemForm";
import ItemCard from "@/components/showroom/ItemCard";
import RoomNav from "@/components/showroom/RoomNav";
import { getSql, ROOMS, type Item } from "@/lib/showroom";

export const dynamic = "force-dynamic";
export const metadata = { title: "둥지 트는 중" };

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
  const navRooms = rooms.map(([room, its], i) => ({
    id: `room-${i}`,
    room,
    count: its.length,
  }));

  return (
    <main>
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-40 text-center">
        <div className="aurora-warm absolute inset-0 -z-10" />
        <Reveal>
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">
            우리 집 가구 리스트
          </p>
          <h1 className="display text-5xl font-semibold sm:text-7xl">둥지 트는 중</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted">
            엄마 방을 꾸밀 가구들 — 링크만 넣으면 나머지는 알아서 채워져요.
          </p>
        </Reveal>
        {items.length > 0 && (
          <Reveal delay={0.15}>
            <p className="mt-4 text-sm text-muted">
              가구 {items.length}개 · 공간 {rooms.length}곳
            </p>
          </Reveal>
        )}
        <Reveal delay={0.2} className="mt-10">
          <AddItemForm />
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <RoomNav rooms={navRooms} />

        {rooms.length === 0 && (
          <p className="py-32 text-center text-muted">
            아직 아무것도 없어요 — 위에서 첫 번째 가구를 추가해보세요.
          </p>
        )}

        {rooms.map(([room, roomItems], i) => (
          <section key={room} id={`room-${i}`} className="scroll-mt-32 pb-20">
            <Reveal>
              <div className="mb-8 flex items-baseline gap-3">
                <h2 className="display text-2xl font-semibold sm:text-3xl">{room}</h2>
                <span className="text-sm text-muted">{roomItems.length}</span>
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roomItems.map((item, j) => (
                <Reveal key={item.id} delay={j * 0.05}>
                  <ItemCard item={item} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="border-t border-card-border py-10 text-center text-sm text-muted">
        Next.js로 만들었어요.
      </footer>
    </main>
  );
}
