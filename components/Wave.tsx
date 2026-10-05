// Абстрактные волнистые линии-разделители на всю ширину экрана.
// viewBox растягивается (preserveAspectRatio="none"), а толщина линий
// не искажается (vector-effect) — краёв не видно ни на каком мониторе.
export function Wave({ variant = 0, className = "" }: { variant?: 0 | 1 | 2; className?: string }) {
  const paths = [
    ["M0,40 C180,5 360,75 540,40 S900,5 1080,40 S1260,75 1440,40", "M0,52 C200,22 380,84 600,50 S960,18 1440,56"],
    ["M0,46 C240,80 420,10 720,42 S1200,80 1440,30", "M0,34 C220,60 460,6 760,36 S1180,66 1440,44"],
    ["M0,38 C160,70 320,10 520,38 S860,72 1040,40 S1300,10 1440,46", "M0,50 C260,26 520,78 820,46 S1240,20 1440,52"],
  ][variant];
  return (
    <div aria-hidden className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden ${className}`}>
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="block h-14 w-full md:h-20">
        <path d={paths[0]} fill="none" stroke="#b9876f" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        <path d={paths[1]} fill="none" stroke="#c9b49a" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="1 7" strokeLinecap="round" />
      </svg>
    </div>
  );
}
