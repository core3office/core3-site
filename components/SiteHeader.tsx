"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/config/site";

export const navItems = [
  { id: "about", label: "О Марии" },
  { id: "bouquets", label: "Букеты" },
  { id: "gifts", label: "Боксы" },
  { id: "masterclass", label: "Мастер-классы" },
  { id: "faq", label: "Вопросы" },
  { id: "contacts", label: "Контакты" },
];

// Фиксированное меню одностраничника: прозрачное над героем, «стеклянное» при прокрутке,
// подсвечивает раздел, который сейчас на экране. На телефоне — полноэкранное меню.
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => window.scrollY < 200 && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled || open
            ? "border-b border-line/60 bg-ivory/75 shadow-[0_8px_30px_-12px_rgba(28,25,22,0.15)] backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-5">
          <a href="#top" onClick={() => setOpen(false)} className="group flex items-baseline gap-2">
            <span className="font-display text-[1.7rem] font-semibold tracking-wide">{site.brand}</span>
            <span className="hidden font-hand text-lg text-terra transition group-hover:rotate-[-4deg] sm:inline">
              florist
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`relative rounded-full px-3.5 py-2 text-[14px] font-medium transition ${
                  active === n.id ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-blush/70"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#bouquets"
              className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory transition hover:-translate-y-0.5 hover:bg-terra-dark sm:inline-block"
            >
              Заказать букет
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-ivory/70 lg:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-5 bg-ink transition duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-ink transition duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 flex flex-col bg-ivory/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="flex items-baseline gap-4 border-b border-line/60 py-4 font-display text-4xl"
                >
                  <span className="font-sans text-xs font-semibold text-terra">0{i + 1}</span>
                  {n.label}
                </motion.a>
              ))}
            </nav>
            <motion.a
              href="#bouquets"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto rounded-full bg-ink py-4 text-center font-semibold text-ivory"
            >
              Заказать букет
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
