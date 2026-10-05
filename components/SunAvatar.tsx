import { site } from "@/config/site";

// Фото Марии в центре, вокруг — медленно вращающаяся рамка-солнце.
export function SunAvatar() {
  const rays = Array.from({ length: 36 });
  return (
    <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
      <svg viewBox="0 0 200 200" className="sun-spin absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="100" cy="100" r="78" fill="none" stroke="#b9876f" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#c9b49a" strokeWidth="0.6" strokeDasharray="1 4" />
        {rays.map((_, i) => {
          const long = i % 2 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1={long ? 4 : 10}
              x2="100"
              y2="15"
              stroke={long ? "#a8573f" : "#c9a283"}
              strokeWidth={long ? 1.6 : 1}
              strokeLinecap="round"
              transform={`rotate(${i * 10} 100 100)`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-[16%] overflow-hidden rounded-full border-4 border-ivory bg-sand shadow-2xl shadow-terra/20">
        {site.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={site.photo} alt="Мария, флорист-дизайнер" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blush to-sand">
            <span className="font-display text-6xl italic text-terra-dark/80">MF</span>
          </div>
        )}
      </div>
    </div>
  );
}
