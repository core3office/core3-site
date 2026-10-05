"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STATUSES, statusMeta, type Lead, type Message } from "@/lib/types";
import { fmtDate, fmtDateTime, fmtTime, SOURCE_LABEL } from "./format";
import { LeadCard } from "./LeadCard";

type Full = Lead & { messages: Message[] };

export function Detail({
  lead,
  siblings,
  onSelect,
  onClose,
  onPatch,
  onReload,
}: {
  lead: Lead;
  siblings: Lead[];
  onSelect: (id: number) => void;
  onClose: () => void;
  onPatch: (id: number, body: Record<string, unknown>) => Promise<void>;
  onReload: () => void;
}) {
  const [full, setFull] = useState<Full | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const meta = statusMeta(lead.status);

  const fetchFull = useCallback(async () => {
    const r = await fetch(`/api/crm/leads/${lead.id}`, { cache: "no-store" });
    if (r.ok) setFull(await r.json());
  }, [lead.id]);

  // Открыли карточку — загружаем переписку и снимаем «непрочитано»
  useEffect(() => {
    setFull(null);
    fetchFull();
    if (lead.unread) onPatch(lead.id, { unread: 0 });
    const id = setInterval(fetchFull, 8000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ block: "end" });
  }, [full?.messages.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const text = String(new FormData(form).get("text") || "").trim();
    if (!text) return;
    form.reset();
    const r = await fetch(`/api/crm/leads/${lead.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (r.ok) setFull(await r.json());
    // Ответили новой заявке — логично перевести её «В работу»
    if (lead.status === "new" || lead.status === "lead") await onPatch(lead.id, { status: "in_progress" });
    else onReload();
  }

  async function remove() {
    if (!confirm(`Удалить карточку «${lead.name}» вместе с перепиской? Это действие нельзя отменить.`)) return;
    await fetch(`/api/crm/leads/${lead.id}`, { method: "DELETE" });
    onClose();
    onReload();
  }

  return (
    <div className="flex h-screen">
      {/* Левая часть — карточки из той же колонки */}
      <aside className="hidden w-80 shrink-0 flex-col border-r border-[#e3d5c3] bg-[#fbf6ef] lg:flex">
        <div className="flex items-center gap-2 border-b border-[#e3d5c3] px-4 py-4">
          <button onClick={onClose} className="rounded-full border border-ink/20 px-3 py-1.5 text-sm hover:bg-white">
            ← Доска
          </button>
          <span className="h-3 w-3 rounded-full" style={{ background: meta.color }} />
          <span className="font-semibold">{meta.label}</span>
          <span className="ml-auto text-sm text-muted">{siblings.length}</span>
        </div>
        <div className="thin-scroll flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
          {siblings.map((s) => (
            <LeadCard key={s.id} lead={s} active={s.id === lead.id} draggable={false} onOpen={() => onSelect(s.id)} />
          ))}
        </div>
      </aside>

      {/* Правая часть — переписка и данные клиента */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-[#e3d5c3] bg-[#fbf6ef] px-5 py-3.5">
          <button onClick={onClose} className="rounded-full border border-ink/20 px-3 py-1.5 text-sm hover:bg-white lg:hidden">
            ←
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold">{lead.name || "Без имени"}</h1>
            <p className="text-sm text-muted">
              {[lead.tg_username, lead.kind === "lead" ? "Лид" : lead.request_type || "Заявка", SOURCE_LABEL[lead.source], `создано ${fmtDateTime(lead.created_at)}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <span className="rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ background: meta.color }}>
            {meta.label}
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          {/* Чат в стиле Telegram */}
          <section className="flex min-h-[50vh] min-w-0 flex-1 flex-col bg-[#e9dfd2] bg-[radial-gradient(#d9ccbb_1px,transparent_1px)] [background-size:18px_18px]">
            <div className="thin-scroll flex-1 space-y-2 overflow-y-auto px-4 py-5 sm:px-8">
              {!full && <p className="text-center text-sm text-muted">Загрузка…</p>}
              {full?.messages.map((m, i) => {
                const prev = full.messages[i - 1];
                const newDay = !prev || fmtDate(prev.created_at) !== fmtDate(m.created_at);
                const mine = m.sender !== "client";
                return (
                  <div key={m.id}>
                    {newDay && (
                      <div className="my-3 text-center">
                        <span className="rounded-full bg-ink/25 px-3 py-1 text-xs font-medium text-white">{fmtDate(m.created_at)}</span>
                      </div>
                    )}
                    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`relative max-w-[78%] whitespace-pre-wrap break-words px-3.5 pb-1.5 pt-2 text-[15px] leading-snug shadow-sm ${
                          mine
                            ? "rounded-2xl rounded-br-md bg-[#f6dccb] text-ink"
                            : "rounded-2xl rounded-bl-md bg-white text-ink"
                        }`}
                      >
                        {m.text}
                        <span className="float-right ml-3 mt-1.5 text-[11px] text-muted">
                          {fmtTime(m.created_at)}
                          {mine && " ✓✓"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEnd} />
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-[#d9ccbb] bg-[#fbf6ef] p-3">
              <input
                name="text"
                autoComplete="off"
                placeholder="Написать ответ клиенту…"
                className="flex-1 rounded-full border border-[#e3d5c3] bg-white px-5 py-3 outline-none focus:border-terra"
              />
              <button className="rounded-full bg-[#3f73b8] px-6 font-semibold text-white transition hover:bg-[#335f99]">
                Отправить
              </button>
            </form>
            <p className="bg-[#fbf6ef] px-4 pb-2 text-center text-[11px] text-muted">
              Ответ сохраняется в истории карточки. Доставка клиенту в Telegram заработает после подключения бота.
            </p>
          </section>

          {/* Статусы, контакты, заметки */}
          <aside className="thin-scroll w-full shrink-0 space-y-6 overflow-y-auto border-l border-[#e3d5c3] bg-[#fbf6ef] p-5 xl:w-[360px]">
            <div>
              <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-muted">Статус</h3>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => {
                  const on = s.key === lead.status;
                  return (
                    <button
                      key={s.key}
                      onClick={() => !on && onPatch(lead.id, { status: s.key })}
                      className="rounded-xl border-2 px-3 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5"
                      style={{
                        borderColor: s.color,
                        background: on ? s.color : "#fff",
                        color: on ? "#fff" : "#1c1916",
                      }}
                    >
                      {on && "✓ "}
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Fields lead={lead} onSave={(b) => onPatch(lead.id, b)} />

            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Заметки Маши · клиент не видит</h3>
              <Notes key={lead.id} initial={lead.notes} onSave={(notes) => onPatch(lead.id, { notes })} />
            </div>

            <button onClick={remove} className="text-sm text-muted underline underline-offset-4 hover:text-[#c9473d]">
              Удалить карточку
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

const FIELDS = [
  ["phone", "Телефон"],
  ["email", "Email"],
  ["tg_username", "Telegram"],
  ["address", "Адрес"],
] as const;

function Fields({ lead, onSave }: { lead: Lead; onSave: (b: Record<string, string>) => void }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Контакты</h3>
      <div className="space-y-2">
        {lead.product && (
          <p className="rounded-xl bg-white px-3 py-2 text-sm">
            <span className="text-muted">Товар: </span>
            <b>{lead.product}</b>
          </p>
        )}
        {FIELDS.map(([key, label]) => (
          <label key={`${lead.id}-${key}`} className="flex items-center gap-2 rounded-xl border border-[#e6dacb] bg-white px-3 py-1.5">
            <span className="w-20 shrink-0 text-xs text-muted">{label}</span>
            <input
              defaultValue={lead[key]}
              placeholder="—"
              onBlur={(e) => e.target.value !== lead[key] && onSave({ [key]: e.target.value })}
              className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function Notes({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [v, setV] = useState(initial);
  const [saved, setSaved] = useState(true);
  return (
    <div>
      <textarea
        value={v}
        rows={5}
        onChange={(e) => {
          setV(e.target.value);
          setSaved(false);
        }}
        onBlur={() => {
          if (!saved) {
            onSave(v);
            setSaved(true);
          }
        }}
        placeholder="Например: аллергия на лилии, предпочитает доставку после 17:00"
        className="w-full rounded-xl border border-[#e6dacb] bg-[#fffbe9] px-3 py-2.5 text-sm outline-none focus:border-[#d9a31f]"
      />
      <p className="mt-1 text-[11px] text-muted">{saved ? "Сохранено" : "Сохранится, когда кликнете вне поля"}</p>
    </div>
  );
}
