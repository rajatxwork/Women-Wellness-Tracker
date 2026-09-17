import { differenceInCalendarDays, addDays } from "date-fns";
import { getCyclePhase, type CyclePhase } from "@/lib/data/cycle-phases";

export type CycleStatus = {
  dayOfCycle: number;
  phase: CyclePhase;
  nextPeriodDate: Date;
  ovulationDate: Date;
  daysUntilNextPeriod: number;
};

export function computeCycleStatus(
  lastPeriodStart: Date,
  avgCycleLength: number,
  today: Date = new Date(),
): CycleStatus {
  const rawDiff = differenceInCalendarDays(today, lastPeriodStart);
  const dayOfCycle = ((rawDiff % avgCycleLength) + avgCycleLength) % avgCycleLength + 1;
  const cyclesElapsed = Math.floor(rawDiff / avgCycleLength);
  const currentCycleStart = addDays(
    lastPeriodStart,
    cyclesElapsed * avgCycleLength,
  );
  const nextPeriodDate = addDays(currentCycleStart, avgCycleLength);
  const ovulationDate = addDays(currentCycleStart, avgCycleLength - 14);
  const phase = getCyclePhase(dayOfCycle, avgCycleLength);
  const daysUntilNextPeriod = differenceInCalendarDays(nextPeriodDate, today);

  return { dayOfCycle, phase, nextPeriodDate, ovulationDate, daysUntilNextPeriod };
}
