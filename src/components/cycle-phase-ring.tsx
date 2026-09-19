import { CYCLE_PHASES, type CyclePhase } from "@/lib/data/cycle-phases";

const RING_COLOR: Record<CyclePhase, string> = {
  menstrual: "var(--color-blush-deep)",
  follicular: "var(--color-sage-deep)",
  ovulation: "var(--color-terracotta-deep)",
  luteal: "var(--color-rose)",
};

const TRACK_COLOR: Record<CyclePhase, string> = {
  menstrual: "var(--color-blush)",
  follicular: "var(--color-sage)",
  ovulation: "var(--color-gold)",
  luteal: "var(--color-rose)",
};

export function CyclePhaseRing({
  phase,
  dayOfCycle,
  cycleLength,
}: {
  phase: CyclePhase;
  dayOfCycle: number;
  cycleLength: number;
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.round((dayOfCycle / cycleLength) * 100));
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={TRACK_COLOR[phase]}
          strokeOpacity={0.35}
          strokeWidth="14"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={RING_COLOR[phase]}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Current phase</p>
        <p className="mt-1 font-serif-display text-2xl" style={{ color: RING_COLOR[phase] }}>
          {CYCLE_PHASES[phase].name}
        </p>
        <p className="mt-2 text-xs text-ink-soft">
          Day {dayOfCycle} of {cycleLength}
        </p>
      </div>
    </div>
  );
}
