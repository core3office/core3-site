import { NextResponse } from "next/server";
import { addMessage, getLead } from "@/lib/db";

export const runtime = "nodejs";

// Ответ Маши клиенту. Пока Telegram-бот не подключён, ответ сохраняется
// в истории карточки (см. ИНСТРУКЦИЯ.md → «Подключение Telegram»).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!(await getLead(id))) return NextResponse.json({ error: "not found" }, { status: 404 });
  const { text } = await req.json().catch(() => ({ text: "" }));
  const clean = typeof text === "string" ? text.trim().slice(0, 4000) : "";
  if (!clean) return NextResponse.json({ error: "empty" }, { status: 400 });
  await addMessage(id, "maria", clean);
  return NextResponse.json(await getLead(id));
}
