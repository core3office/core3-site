"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { bouquets, gifts, type Product } from "@/config/products";
import { site } from "@/config/site";
import { OrderModal, type OrderTarget } from "./OrderModal";
import { Wave } from "./Wave";

function ProductCard({ p, onOrder, i }: { p: Product; onOrder: () => void; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-[28px] border border-line/70 bg-ivory/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-terra/10"
    >
      <div className="overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.7rem] font-semibold leading-tight">{p.name}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{p.description}</p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="font-display text-3xl">${p.price}</span>
          <button
            type="button"
            onClick={onOrder}
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-terra-dark"
          >
            Заказать
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Heading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terra">{kicker}</p>
      <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{title}</h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-ink-soft">{sub}</p>}
    </div>
  );
}

export function ShopSections() {
  const [target, setTarget] = useState<OrderTarget | null>(null);
  const close = useCallback(() => setTarget(null), []);

  return (
    <>
      <section id="bouquets" className="mx-auto max-w-6xl px-5 py-14">
        <Heading
          kicker="6 композиций"
          title="Авторские букеты"
          sub="Ручная сборка из сезонных цветов. Состав фиксирован, по сезону возможны небольшие замены."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bouquets.map((p, i) => (
            <ProductCard key={p.slug} p={p} i={i} onOrder={() => setTarget({ type: "order", product: p })} />
          ))}
        </div>
      </section>

      <Wave variant={1} />

      <section id="gifts" className="mx-auto max-w-5xl px-5 py-14">
        <Heading kicker="Готовые подарки" title="Подарочные боксы & наборы" sub="Собраны заранее, доставка в день заказа." />
        <div className="grid gap-6 sm:grid-cols-2">
          {gifts.map((p, i) => (
            <ProductCard key={p.slug} p={p} i={i} onOrder={() => setTarget({ type: "order", product: p })} />
          ))}
        </div>
      </section>

      <Wave variant={0} />

      <section id="masterclass" className="mx-auto max-w-3xl px-5 py-16 text-center">
        <Heading kicker="Студия в центре Портленда" title="Обучение флористике & мастер-классы" />
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-soft">
          Погрузитесь в мир органического модернизма: учимся сочетать цвета, работать с формой и собирать сезонную
          композицию в эко-упаковке.
        </p>
        <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-3">
          {["Группы до 6 человек", "Все материалы включены", "Новичкам, девичникам, командам"].map((t) => (
            <li key={t} className="rounded-2xl border border-line/80 bg-ivory/70 px-4 py-3 text-center text-sm font-medium">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col items-center gap-3">
          {site.masterclassBookingUrl ? (
            <a
              href={site.masterclassBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-9 py-4 font-semibold text-ivory shadow-xl shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-terra-dark"
            >
              Забронировать место
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setTarget({ type: "masterclass" })}
              className="rounded-full bg-ink px-9 py-4 font-semibold text-ivory shadow-xl shadow-ink/20 transition hover:-translate-y-0.5 hover:bg-terra-dark"
            >
              Забронировать место
            </button>
          )}
          {site.masterclassBookingUrl && (
            <button
              type="button"
              onClick={() => setTarget({ type: "masterclass" })}
              className="text-sm text-muted underline underline-offset-4 hover:text-ink"
            >
              или оставить заявку на индивидуальное занятие
            </button>
          )}
          <p className="text-sm text-muted">Цена и дата согласуются индивидуально</p>
        </div>
      </section>

      <OrderModal target={target} onClose={close} />
    </>
  );
}
