import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";

// Закрываем API мини-CRM. Страница /crm сама показывает окно пароля,
// а без cookie никакие данные клиентов с сервера не отдаются.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/api/crm/login") return NextResponse.next();
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (token && token === (await expectedToken())) return NextResponse.next();
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export const config = { matcher: ["/api/crm/:path*"] };
