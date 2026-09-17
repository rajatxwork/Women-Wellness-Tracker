import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addDays,
  format,
} from "date-fns";
import { cn } from "@/lib/utils";

type CyclePeriod = { start: Date; end: Date };

export function CycleCalendar({
  monthDate,
  loggedPeriods,
  predictedPeriod,
  ovulationDate,
}: {
  monthDate: Date;
  loggedPeriods: CyclePeriod[];
  predictedPeriod: CyclePeriod | null;
  ovulationDate: Date | null;
}) {
  const start = startOfWeek(startOfMonth(monthDate));
  const end = endOfWeek(endOfMonth(monthDate));
  const days = eachDayOfInterval({ start, end });
  const today = new Date();

  function isLogged(day: Date) {
    return loggedPeriods.some((p) => isWithinInterval(day, { start: p.start, end: p.end }));
  }
  function isPredicted(day: Date) {
    return predictedPeriod && isWithinInterval(day, predictedPeriod);
  }
  function isOvulation(day: Date) {
    return ovulationDate && isSameDay(day, ovulationDate);
  }

  return (
    <div>
      <p className="mb-3 text-center font-serif-display text-lg text-ink">
        {format(monthDate, "MMMM yyyy")}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-ink-faint">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="pb-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, monthDate);
          const logged = isLogged(day);
          const predicted = isPredicted(day);
          const ovulation = isOvulation(day);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-full text-xs",
                !inMonth && "text-ink-faint/40",
                inMonth && !logged && !predicted && "text-ink-soft",
                logged && "bg-blush-deep text-white font-semibold",
                predicted && !logged && "border-2 border-dashed border-terracotta/50 text-terracotta-deep",
                isToday && !logged && "ring-2 ring-terracotta ring-offset-1 ring-offset-surface",
              )}
            >
              {day.getDate()}
              {ovulation && (
                <span className="absolute -bottom-0.5 h-1.5 w-1.5 rounded-full bg-sage-deep" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-blush-deep" /> Logged period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-dashed border-terracotta/50" /> Predicted period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-sage-deep" /> Predicted ovulation
        </span>
      </div>
    </div>
  );
}

export function buildPredictedPeriod(nextPeriodDate: Date): CyclePeriod {
  return { start: nextPeriodDate, end: addDays(nextPeriodDate, 4) };
}
