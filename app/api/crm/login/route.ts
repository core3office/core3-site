import { NextResponse } from "next/server";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password !== (process.env.CRM_PASSWORD || "maria2026")) {
    await new Promise((r) => setTimeout(r, 600)); // притормаживаем подбор
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  // Без maxAge — cookie живёт до закрытия браузера
  res.cookies.set(AUTH_COOKIE, await expectedToken(), { httpOnly: true, sameSite: "lax", path: "/" });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(AUTH_COOKIE);
  return res;
}
