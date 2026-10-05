import { NextResponse } from "next/server";

// Если запрос дошёл сюда — middleware уже проверил cookie
export function GET() {
  return NextResponse.json({ ok: true });
}
