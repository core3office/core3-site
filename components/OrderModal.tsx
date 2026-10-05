"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Product } from "@/config/products";

export type OrderTarget = { type: "order"; product: Product } | { type: "masterclass" };

const input =
  "w-full rounded-xl border border-line bg-ivory px-4 py-3 text-[15px] outline-none transition placeholder:text-muted/70 focus:border-terra focus:ring-2 focus:ring-terra/15";

export function OrderModal({ target, onClose }: { target: OrderTarget | null; onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ paymentUrl: string | null } | null>(null);

  useEffect(() => {
    if (!target) return;
    setDone(null);
    setError("");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!target) return;
    setSending(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: target.type,
          productSlug: target.type === "order" ? target.product.slug : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Не удалось отправить");
      setDone({ paymentUrl: json.paymentUrl ?? null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить, попробуйте ещё раз");
    } finally {
      setSending(false);
    }
  }

  const isOrder = target?.type === "order";

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isOrder ? "Оформление заказа" : "Запись на мастер-класс"}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8"
          >
            <div className="mb-6 flex items-start gap-4">
              {isOrder && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={target.product.image} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
              )}
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terra">
                  {isOrder ? "Оформление заказа" : "Мастер-класс"}
                </p>
                <h3 className="mt-1 font-display text-3xl leading-tight">
                  {isOrder ? target.product.name : "Запись на занятие"}
                </h3>
                {isOrder && <p className="mt-1 text-lg font-semibold">${target.product.price}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/15 text-xl hover:bg-ivory"
              >
                ×
              </button>
            </div>

            {done ? (
              <div className="space-y-5 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage/15 text-3xl text-sage">✓</div>
                <h4 className="font-display text-2xl">Спасибо, заявка принята!</h4>
                {isOrder && done.paymentUrl ? (
                  <>
                    <p className="text-ink-soft">Осталось оплатить заказ — после оплаты Мария начнёт собирать ваш букет.</p>
                    <a
                      href={done.paymentUrl}
                      className="block w-full rounded-full bg-ink py-4 text-center font-semibold text-ivory transition hover:bg-terra-dark"
                    >
                      Перейти к оплате
                    </a>
                  </>
                ) : isOrder ? (
                  <p className="text-ink-soft">
                    Мария проверит детали и пришлёт ссылку на оплату на ваш email или телефон в течение пары часов.
                  </p>
                ) : (
                  <p className="text-ink-soft">
                    Мария свяжется с вами, чтобы согласовать дату и стоимость. Группы — до 6 человек, все материалы включены.
                  </p>
                )}
                <button type="button" onClick={onClose} className="text-sm text-muted underline underline-offset-4">
                  Вернуться на сайт
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input name="firstName" required placeholder="Имя" autoComplete="given-name" className={input} />
                  <input
                    name="lastName"
                    required={isOrder}
                    placeholder={isOrder ? "Фамилия" : "Фамилия (необязательно)"}
                    autoComplete="family-name"
                    className={input}
                  />
                </div>
                <input name="phone" required type="tel" placeholder="Телефон" autoComplete="tel" className={input} />
                <input name="email" required type="email" placeholder="Email" autoComplete="email" className={input} />
                {isOrder ? (
                  <input
                    name="address"
                    required
                    placeholder="Адрес доставки (Портленд и пригороды)"
                    autoComplete="street-address"
                    className={input}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input name="date" placeholder="Желаемая дата" className={input} />
                    <input name="guests" type="number" min={1} max={6} placeholder="Сколько человек (до 6)" className={input} />
                  </div>
                )}
                <textarea
                  name="comment"
                  rows={2}
                  placeholder={isOrder ? "Повод, открытка, время доставки (необязательно)" : "Повод, пожелания (необязательно)"}
                  className={input}
                />
                {error && <p className="rounded-xl bg-terra/10 px-4 py-2.5 text-sm text-terra-dark">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-2 w-full rounded-full bg-ink py-4 font-semibold text-ivory transition hover:bg-terra-dark disabled:opacity-60"
                >
                  {sending ? "Отправляем…" : isOrder ? "Перейти к оплате" : "Отправить заявку"}
                </button>
                <p className="text-center text-xs text-muted">
                  {isOrder
                    ? "Заказы принимаются минимум за 48 часов. Срочно? Напишите в WhatsApp."
                    : "Цена и дата согласуются с Марией лично."}
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
