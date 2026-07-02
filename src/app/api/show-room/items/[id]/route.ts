import { checkPassword, getSql } from "@/lib/showroom";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkPassword(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }
  const numId = Number(id);

  const sql = getSql();
  const rows = await sql`DELETE FROM showroom_items WHERE id = ${numId} RETURNING id`;
  if (rows.length === 0) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
