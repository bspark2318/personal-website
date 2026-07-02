import { checkPassword, getSql } from "@/lib/showroom";

export async function POST(req: Request) {
  if (!checkPassword(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { room, title, url, addedBy, price, imageUrl } = body;
  if (![room, title, url, addedBy].every((v) => typeof v === "string" && v.trim())) {
    return Response.json({ error: "room, title, url, addedBy are required" }, { status: 400 });
  }
  const opt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

  const sql = getSql();
  const rows = await sql`
    INSERT INTO showroom_items (room, title, price, url, image_url, added_by)
    VALUES (${room.trim()}, ${title.trim()}, ${opt(price)}, ${url.trim()},
            ${opt(imageUrl)}, ${addedBy.trim()})
    RETURNING *
  `;
  return Response.json({ item: rows[0] }, { status: 201 });
}
