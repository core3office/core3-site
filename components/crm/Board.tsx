"use client";

import Link from "next/link";
import { useState } from "react";
import { STATUSES, type Lead, type StatusKey } from "@/lib/types";
import { LeadCard } from "./LeadCard";

export function Board({
  leads,
  filter,
  setFilter,
  onOpen,
  onMove,
  onLogout,
}: {
  leads: Lead[];
  filter: string[];
  setFilter: (f: string[]) => void;
  onOpen: (id: number) => void;
  onMove: (id: number, status: StatusKey) => void;
  onLogout: () => void;
}) {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const newCount = leads.filter((l) => l.status === "new").length;
  const unreadCount = leads.filter((l) => l.unread > 0).length;
  const columns = filter.length ? STATUSES.filter((s) => filter.includes(s.key)) : STATUSES;

  const toggle = (key: string) =>
    setFilter(filter.includes(key) ? filter.filter((k) => k !== key) : [...filter, key]);

  const exportHref = `/api/crm/export${filter.length ? `?status=${filter.join(",")}` : ""}`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[#e3d5c3] bg-[#fbf6ef] px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div>
            <p className="font-display text-2xl font-semibold leading-none">Maria Flora</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">Доска заявок</p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-[#c9473d] px-5 py-2.5 text-white shadow-lg shadow-[#c9473d]/25">
            <span className="font-display text-4xl font-bold leading-none">{newCount}</span>
            <span className="text-sm font-semibold leading-tight">
              {plural(newCount, "новая заявка", "новые заявки", "новых заявок")}
              <br />
              <span className="font-normal opacity-85">
                {unreadCount} {plural(unreadCount, "ждёт", "ждут", "ждут")} ответа
              </span>
            </span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <a
              href={exportHref}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-terra-dark"
              title={filter.length ? "Выгрузить только видимые карточки" : "Выгрузить всю базу"}
            >
              ↓ Скачать{filter.length ? " сегмент" : ""} CSV
            </a>
            <Link href="/" target="_blank" className="rounded-full border border-ink/20 px-4 py-2.5 text-sm hover:bg-white">
              Сайт ↗
            </Link>
            <button onClick={onLogout} className="rounded-full border border-ink/20 px-4 py-2.5 text-sm hover:bg-white">
              Выйти
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Фильтр:</span>
          <button
            onClick={() => setFilter([])}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter.length === 0 ? "bg-ink text-ivory" : "bg-white text-ink-soft hover:bg-[#efe5d8]"
            }`}
          >
            Все · {leads.length}
          </button>
          {STATUSES.map((s) => {
            const on = filter.includes(s.key);
            const n = leads.filter((l) => l.status === s.key).length;
            return (
              <button
                key={s.key}
                onClick={() => toggle(s.key)}
                className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
                style={{
                  borderColor: on ? s.color : "transparent",
                  background: on ? s.color : "#fff",
                  color: on ? "#fff" : "#4a433d",
                }}
              >
                {!on && <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />}
                {s.label} · {n}
              </button>
            );
          })}
        </div>
      </header>

      <div className="thin-scroll flex flex-1 gap-4 overflow-x-auto p-5">
        {columns.map((s) => {
          const items = leads.filter((l) => l.status === s.key);
          return (
            <section
              key={s.key}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(s.key);
              }}
              onDragLeave={() => setDragOver((d) => (d === s.key ? null : d))}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(null);
                const id = Number(e.dataTransfer.getData("text/plain"));
                if (id) onMove(id, s.key);
              }}
              className={`flex min-w-[235px] flex-1 flex-col rounded-3xl border-2 bg-[#fbf6ef]/80 transition ${
                dragOver === s.key ? "bg-white" : ""
              }`}
              style={{ borderColor: dragOver === s.key ? s.color : `${s.color}55` }}
            >
              <div className="rounded-t-[22px] px-4 py-3" style={{ background: `${s.color}18` }}>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                  <h2 className="flex-1 font-semibold">{s.label}</h2>
                  <span
                    className="grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold text-white"
                    style={{ background: s.color }}
                  >
                    {items.length}
                  </span>
                </div>
                <p className="mt-0.5 pl-5 text-xs text-muted">{s.hint}</p>
              </div>
              <div className="thin-scroll flex max-h-[calc(100vh-250px)] min-h-40 flex-col gap-2.5 overflow-y-auto p-3">
                {items.map((l) => (
                  <LeadCard key={l.id} lead={l} onOpen={() => onOpen(l.id)} />
                ))}
                {items.length === 0 && (
                  <p className="py-8 text-center text-xs text-muted">Перетащите карточку сюда</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
