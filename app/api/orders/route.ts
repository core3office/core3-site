import { NextResponse } from "next/server";
import { createLead } from "@/lib/db";
import { findProduct } from "@/config/products";

export const runtime = "nodejs";

const clip = (v: unknown, n = 300) => (typeof v === "string" ? v.trim().slice(0, n) : "");

// Публичная форма сайта: «Заказать» у товара и заявка на мастер-класс.
// Каждая отправка = новая карточка в CRM в колонке «Новая заявка».
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
  if (clip(body.website)) return NextResponse.json({ ok: true }); // ловушка для ботов

  const type = body.type === "masterclass" ? "masterclass" : "order";
  const firstName = clip(body.firstName, 80);
  const lastName = clip(body.lastName, 80);
  const phone = clip(body.phone, 40);
  const email = clip(body.email, 120);
  const address = clip(body.address, 250);
  const comment = clip(body.comment, 1000);
  const date = clip(body.date, 40);
  const guests = clip(body.guests, 10);

  const errors: string[] = [];
  if (!firstName) errors.push("имя");
  if (phone.replace(/\D/g, "").length < 7) errors.push("телефон");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email");

  if (type === "order") {
    if (!lastName) errors.push("фамилию");
    if (address.length < 5) errors.push("адрес доставки");
    const product = findProduct(clip(body.productSlug, 60));
    if (!product) return NextResponse.json({ error: "Товар не найден" }, { status: 400 });
    if (errors.length) return NextResponse.json({ error: `Проверьте: ${errors.join(", ")}` }, { status: 400 });

    const lines = [
      `Заказ с сайта: ${product.name} — $${product.price}`,
      `Клиент: ${firstName} ${lastName}`,
      `Телефон: ${phone}`,
      `Email: ${email}`,
      `Адрес доставки: ${address}`,
      comment && `Комментарий: ${comment}`,
    ].filter(Boolean);
    await createLead({
      name: `${firstName} ${lastName}`,
      phone,
      email,
      address,
      kind: "request",
      source: "site_order",
      request_type: product.kind === "gift" ? "Подарочный набор" : "Букет",
      product: product.name,
      status: "new",
      firstMessage: lines.join("\n"),
    });
    return NextResponse.json({ ok: true, paymentUrl: product.paymentUrl || null });
  }

  if (errors.length) return NextResponse.json({ error: `Проверьте: ${errors.join(", ")}` }, { status: 400 });
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const lines = [
    "Заявка на мастер-класс",
    `Клиент: ${fullName}`,
    `Телефон: ${phone}`,
    `Email: ${email}`,
    date && `Желаемая дата: ${date}`,
    guests && `Участников: ${guests}`,
    comment && `Комментарий: ${comment}`,
  ].filter(Boolean);
  await createLead({
    name: fullName,
    phone,
    email,
    kind: "request",
    source: "masterclass",
    request_type: "Мастер-класс",
    status: "new",
    firstMessage: lines.join("\n"),
  });
  return NextResponse.json({ ok: true });
}
