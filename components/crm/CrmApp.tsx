"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lead } from "@/lib/types";
import { Board } from "./Board";
import { Detail } from "./Detail";
import { Login } from "./Login";

export function CrmApp() {
  const [auth, setAuth] = useState<"checking" | "in" | "out">("checking");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string[]>([]); // пусто = все статусы

  useEffect(() => {
    fetch("/api/crm/session").then((r) => setAuth(r.ok ? "in" : "out"));
  }, []);

  const load = useCallback(async () => {
    const r = await fetch("/api/crm/leads", { cache: "no-store" });
    if (r.status === 401) return setAuth("out");
    if (r.ok) setLeads(await r.json());
  }, []);

  // Подтягиваем новые заявки с сайта каждые 8 секунд
  useEffect(() => {
    if (auth !== "in") return;
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [auth, load]);

  const patch = useCallback(
    async (id: number, body: Record<string, unknown>) => {
      setLeads((ls) => ls.map((l) => (l.id === id ? ({ ...l, ...body } as Lead) : l)));
      await fetch(`/api/crm/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      load();
    },
    [load]
  );

  if (auth === "checking") return <div className="min-h-screen bg-[#f4ece1]" />;
  if (auth === "out") return <Login onSuccess={() => setAuth("in")} />;

  const logout = async () => {
    await fetch("/api/crm/login", { method: "DELETE" });
    setAuth("out");
  };

  const open = leads.find((l) => l.id === openId);

  return (
    <div className="min-h-screen bg-[#f4ece1] text-ink">
      {open ? (
        <Detail
          lead={open}
          siblings={leads.filter((l) => l.status === open.status)}
          onSelect={setOpenId}
          onClose={() => setOpenId(null)}
          onPatch={patch}
          onReload={load}
        />
      ) : (
        <Board
          leads={leads}
          filter={filter}
          setFilter={setFilter}
          onOpen={setOpenId}
          onMove={(id, status) => patch(id, { status })}
          onLogout={logout}
        />
      )}
    </div>
  );
}
