"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-5 text-left"
            >
              <span className="w-7 shrink-0 font-display text-lg text-terra">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-display text-xl font-medium leading-snug sm:text-2xl">{it.q}</span>
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/20 text-lg transition ${
                  isOpen ? "rotate-45 bg-ink text-ivory" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pl-11 pr-12 text-[15px] leading-relaxed text-ink-soft">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
