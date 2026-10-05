"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Ссылка, которая не ломается, пока реальный адрес не вписан в config/site.ts:
// вместо перехода в никуда показывает вежливое уведомление.
export function SmartLink({
  href,
  pending = "Ссылка скоро появится — напишите нам по телефону или email внизу страницы",
  className,
  children,
  ariaLabel,
}: {
  href: string;
  pending?: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={() => toast(pending)}>
      {children}
    </button>
  );
}

export function toast(text: string) {
  window.dispatchEvent(new CustomEvent("mf-toast", { detail: text }));
}

export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 3500);
    };
    window.addEventListener("mf-toast", on);
    return () => window.removeEventListener("mf-toast", on);
  }, []);
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 left-1/2 z-[60] w-[min(92vw,440px)] -translate-x-1/2 rounded-2xl bg-ink px-5 py-3.5 text-center text-sm text-ivory shadow-xl"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
