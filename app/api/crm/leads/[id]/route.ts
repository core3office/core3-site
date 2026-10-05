import { NextResponse } from "next/server";
import { deleteLead, getLead, isStatus, updateLead } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const lead = await getLead(Number((await params).id));
  if (!lead) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const id = Number((await params).id);
  if (!(await getLead(id))) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const patch: Record<string, string | number> = {};
  for (const k of ["name", "tg_username", "phone", "email", "address", "notes", "request_type"]) {
    if (typeof body[k] === "string") patch[k] = body[k].slice(0, 2000);
  }
  if (body.status !== undefined) {
    if (!isStatus(body.status)) return NextResponse.json({ error: "bad status" }, { status: 400 });
    patch.status = body.status;
  }
  if (body.unread !== undefined) patch.unread = body.unread ? 1 : 0;
  await updateLead(id, patch);
  return NextResponse.json(await getLead(id));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  await deleteLead(Number((await params).id));
  return NextResponse.json({ ok: true });
}
