import { differenceInCalendarDays } from "date-fns";

// Given a set of ISO log dates for a single habit, return the current streak
// length. A streak is unbroken if today or yesterday is logged, then counts
// consecutive days backward from there.
export function computeStreak(logDates: string[], today: Date = new Date()): number {
  if (logDates.length === 0) return 0;
  const dateSet = new Set(logDates);
  const sorted = [...logDates].sort().reverse();
  const mostRecent = new Date(sorted[0] + "T00:00:00");
  const gapFromToday = differenceInCalendarDays(today, mostRecent);
  if (gapFromToday > 1) return 0;

  let streak = 1;
  const cursor = new Date(mostRecent);
  while (true) {
    cursor.setDate(cursor.getDate() - 1);
    const iso = cursor.toISOString().slice(0, 10);
    if (dateSet.has(iso)) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}
