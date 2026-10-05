"use client";

import { useState } from "react";

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const r = await fetch("/api/crm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (r.ok) onSuccess();
    else setError("Неверный пароль");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f4ece1] px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-line bg-ivory p-8 shadow-xl shadow-ink/5">
        <p className="font-display text-3xl font-semibold">Maria Flora</p>
        <p className="mt-1 text-sm text-muted">Рабочая доска заявок</p>
        <label className="mt-8 block text-sm font-medium" htmlFor="pw">
          Пароль
        </label>
        <input
          id="pw"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-terra/20 ${
            error ? "border-terra" : "border-line focus:border-terra"
          }`}
          onChange={() => setError("")}
        />
        {error && <p className="mt-2 text-sm font-medium text-terra-dark">{error}</p>}
        <button
          disabled={busy}
          className="mt-6 w-full rounded-full bg-ink py-3.5 font-semibold text-ivory transition hover:bg-terra-dark disabled:opacity-60"
        >
          {busy ? "Проверяем…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
