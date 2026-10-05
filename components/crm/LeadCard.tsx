"use client";

import type { Lead } from "@/lib/types";
import { fmtDate } from "./format";

export function LeadCard({
  lead,
  active = false,
  onOpen,
  draggable = true,
}: {
  lead: Lead;
  active?: boolean;
  onOpen: () => void;
  draggable?: boolean;
}) {
  const unread = lead.unread > 0;
  return (
    <button
      type="button"
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(lead.id));
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onOpen}
      className={`relative w-full rounded-2xl border bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? "border-ink ring-2 ring-ink/10"
          : unread
            ? "border-terra/60 bg-[#fff6f0] ring-2 ring-terra/15"
            : "border-[#e6dacb]"
      } ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      {unread && (
        <span className="absolute right-3 top-3.5 flex h-3 w-3" title="Есть непрочитанные сообщения">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terra opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-terra" />
        </span>
      )}
      <p className={`pr-5 text-[15px] leading-tight ${unread ? "font-bold" : "font-semibold"}`}>{lead.name || "Без имени"}</p>
      <p className="mt-0.5 text-xs text-muted">{lead.tg_username || lead.phone || lead.email || "—"}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
        <span
          className={`rounded-full px-2 py-0.5 ${
            lead.kind === "lead" ? "bg-[#ece7e1] text-[#6d655d]" : "bg-[#f6e3d6] text-terra-dark"
          }`}
        >
          {lead.kind === "lead" ? "Лид" : lead.request_type || "Заявка"}
        </span>
        <span className="text-muted">{fmtDate(lead.created_at)}</span>
      </div>
      {lead.preview && (
        <p className="mt-2 line-clamp-2 whitespace-pre-line text-[13px] leading-snug text-ink-soft">{lead.preview}</p>
      )}
    </button>
  );
}
