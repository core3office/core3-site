"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Био появляется с эффектом печатной машинки, когда блок попадает в экран.
export function TypingBio({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    const id = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 28);
    return () => clearInterval(id);
  }, [inView, text]);

  return (
    <div className="relative">
      {/* Невидимая копия держит высоту блока, чтобы страница не прыгала */}
      <p aria-hidden className="invisible font-hand text-2xl leading-snug sm:text-[1.7rem]">
        {text}
      </p>
      <p ref={ref} className="absolute inset-0 font-hand text-2xl leading-snug text-ink-soft sm:text-[1.7rem]">
        <span className="sr-only">{text}</span>
        <span aria-hidden className={n < text.length ? "caret" : ""}>
          {text.slice(0, n)}
        </span>
      </p>
    </div>
  );
}
