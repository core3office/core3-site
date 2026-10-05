import { listLeads } from "@/lib/db";
import { statusMeta } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// ?status=new,in_progress — выгрузить только видимый сегмент; без параметра — всю базу
export async function GET(req: Request) {
  const filter = new URL(req.url).searchParams.get("status");
  const allowed = filter ? new Set(filter.split(",")) : null;
  const rows = (await listLeads()).filter((l) => !allowed || allowed.has(l.status));

  const header = ["Имя", "Telegram", "Телефон", "Email", "Адрес", "Тип", "Статус", "Дата создания"];
  const lines = rows.map((l) =>
    [
      l.name,
      l.tg_username,
      l.phone,
      l.email,
      l.address,
      l.kind === "lead" ? "Лид" : `Заявка${l.request_type ? ": " + l.request_type : ""}`,
      statusMeta(l.status).label,
      new Date(l.created_at).toLocaleString("ru-RU", { timeZone: "America/Los_Angeles" }),
    ]
      .map(cell)
      .join(";")
  );
  // BOM + «;» — чтобы Excel сразу открыл кириллицу по колонкам
  const csv = "﻿" + [header.map(cell).join(";"), ...lines].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="maria-flora-clients-${stamp}.csv"`,
    },
  });
}
