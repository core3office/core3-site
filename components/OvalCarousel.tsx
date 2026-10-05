"use client";

import { useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Item = { src: string; title: string };

// 3D-карусель: карточки едут друг за другом по овалу.
// Наведение на карточку — карусель замирает, карточка плавно увеличивается.
export function OvalCarousel({ items }: { items: Item[] }) {
  const box = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const angle = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [size, setSize] = useState({ w: 480, h: 420 });
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (hovered === null && !reduced.current) angle.current += delta * 0.00022;
    const rx = size.w * 0.34;
    const ry = size.h * 0.2;
    const step = (Math.PI * 2) / items.length;
    cards.current.forEach((el, i) => {
      if (!el) return;
      const a = angle.current + i * step;
      const depth = (Math.cos(a) + 1) / 2; // 1 — ближе к зрителю, 0 — дальше
      const x = Math.sin(a) * rx;
      const y = Math.cos(a) * ry;
      const isHover = hovered === i;
      const scale = (0.58 + depth * 0.42) * (isHover ? 1.28 : 1);
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      el.style.zIndex = isHover ? "50" : String(Math.round(depth * 40));
      el.style.opacity = String(0.45 + depth * 0.55);
      el.style.filter = isHover ? "none" : `saturate(${0.75 + depth * 0.25})`;
    });
  });

  const cardW = Math.min(170, size.w * 0.36);

  return (
    <div ref={box} className="relative h-[380px] w-full select-none sm:h-[440px]" onMouseLeave={() => setHovered(null)}>
      {items.map((it, i) => (
        <div
          key={it.src}
          ref={(el) => {
            cards.current[i] = el;
          }}
          onMouseEnter={() => setHovered(i)}
          onClick={() => setHovered((h) => (h === i ? null : i))}
          className="absolute left-1/2 top-1/2 cursor-pointer transition-[box-shadow] duration-300 will-change-transform"
          style={{ width: cardW }}
        >
          <div
            className={`overflow-hidden rounded-[22px] border-[3px] border-ivory bg-ivory shadow-xl ${
              hovered === i ? "shadow-2xl shadow-terra/30" : "shadow-ink/10"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt={it.title} className="aspect-[4/5] w-full object-cover" draggable={false} />
            <div className="px-3 py-2 text-center font-display text-base italic text-ink">{it.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
