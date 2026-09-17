import { WEEKLY_STRUCTURE } from "@/lib/data/movement";
import { cn } from "@/lib/utils";
import { getCelebration, getGentleNudge } from "@/lib/encouragement";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyStructureView({
  completedByDayIndex,
}: {
  completedByDayIndex: boolean[]; // index 0 = Monday ... 6 = Sunday
}) {
  const todayIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();

  const hitCount = completedByDayIndex.filter(Boolean).length;

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKLY_STRUCTURE.map((day, i) => {
          const done = completedByDayIndex[i];
          const isPast = i < todayIndex;
          const isToday = i === todayIndex;
          return (
            <div
              key={day.day}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border px-1.5 py-3 text-center",
                isToday ? "border-terracotta" : "border-border",
                done && "bg-sage-deep/10",
              )}
            >
              <span className="text-[11px] font-semibold text-ink-soft">{DAY_LABELS[i]}</span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  done
                    ? "bg-sage-deep text-white"
                    : isPast
                      ? "bg-cream-soft text-ink-faint"
                      : "bg-cream-soft text-ink-faint",
                )}
              >
                {done ? "✓" : "·"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 space-y-1 text-xs text-ink-soft">
        {WEEKLY_STRUCTURE.map((day, i) => (
          <p key={day.day} className={cn(i === todayIndex && "font-semibold text-ink")}>
            {DAY_LABELS[i]}: {day.focus}
          </p>
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        {hitCount >= 3 ? getCelebration() : getGentleNudge()}
      </p>
    </div>
  );
}
