import { subDays, startOfWeek, format, differenceInCalendarDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { formatDateISO } from "@/lib/utils";
import { computeStreak } from "@/lib/streaks";
import { NUTRITION_GOAL_CATEGORIES } from "@/lib/data/nutrition";
import { Card } from "@/components/ui/card";
import { ExerciseProgressionSection } from "@/components/exercise-progression-section";
import {
  WeeklyConsistencyChart,
  HabitCompletionChart,
  WaterTrendChart,
  NutritionCoverageChart,
  CycleLengthChart,
} from "@/components/charts";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const ninetyDaysAgo = formatDateISO(subDays(new Date(), 90));
  const fourteenDaysAgo = formatDateISO(subDays(new Date(), 13));
  const sevenDaysAgo = formatDateISO(subDays(new Date(), 6));
  const thirtyDaysAgo = formatDateISO(subDays(new Date(), 29));

  const [
    { data: sets },
    { data: sessions },
    { data: habits },
    { data: habitLogs },
    { data: waterLogs },
    { data: userGoals },
    { data: nutritionLogs },
    { data: cycleLogs },
  ] = await Promise.all([
    supabase
      .from("workout_sets")
      .select("exercise_name, reps, weight_kg, workout_sessions!inner(session_date)")
      .eq("user_id", user.id)
      .gte("workout_sessions.session_date", ninetyDaysAgo),
    supabase
      .from("workout_sessions")
      .select("session_date, session_type")
      .eq("user_id", user.id)
      .gte("session_date", ninetyDaysAgo),
    supabase.from("habits").select("id, name").eq("user_id", user.id).eq("archived", false),
    supabase.from("habit_logs").select("habit_id, log_date").eq("user_id", user.id).gte("log_date", thirtyDaysAgo),
    supabase.from("water_logs").select("log_date, amount_ml").eq("user_id", user.id).gte("log_date", fourteenDaysAgo),
    supabase.from("user_goal_categories").select("category_slug").eq("user_id", user.id),
    supabase
      .from("nutrition_logs")
      .select("category_slug, log_date")
      .eq("user_id", user.id)
      .gte("log_date", sevenDaysAgo),
    supabase.from("cycle_logs").select("period_start").eq("user_id", user.id).order("period_start", { ascending: true }),
  ]);

  // Exercise progression
  const setRecords = (sets ?? [])
    .map((s) => {
      const session = s.workout_sessions as unknown as { session_date: string } | null;
      return {
        date: session?.session_date ?? "",
        exerciseName: s.exercise_name,
        weightKg: s.weight_kg,
        reps: s.reps,
      };
    })
    .filter((s) => s.date);

  // Weekly strength consistency, last 8 weeks
  const weekBuckets = new Map<string, number>();
  for (const s of sessions ?? []) {
    if (s.session_type !== "strength") continue;
    const weekStart = format(startOfWeek(new Date(s.session_date + "T00:00:00"), { weekStartsOn: 1 }), "MMM d");
    weekBuckets.set(weekStart, (weekBuckets.get(weekStart) ?? 0) + 1);
  }
  const consistencyData = Array.from(weekBuckets.entries())
    .slice(-8)
    .map(([week, completed]) => ({ week, completed, planned: 3 }));

  // Habit completion rate over last 30 days
  const logsByHabit = new Map<string, string[]>();
  for (const log of habitLogs ?? []) {
    if (!logsByHabit.has(log.habit_id)) logsByHabit.set(log.habit_id, []);
    logsByHabit.get(log.habit_id)!.push(log.log_date);
  }
  const habitCompletionData = (habits ?? []).map((h) => ({
    name: h.name,
    rate: Math.round(((logsByHabit.get(h.id)?.length ?? 0) / 30) * 100),
  }));

  // Water trend, last 14 days
  const waterByDate = new Map<string, number>();
  for (const w of waterLogs ?? []) {
    waterByDate.set(w.log_date, (waterByDate.get(w.log_date) ?? 0) + w.amount_ml);
  }
  const waterTrendData = Array.from({ length: 14 }, (_, i) => {
    const date = formatDateISO(subDays(new Date(), 13 - i));
    return { date: date.slice(5), ml: waterByDate.get(date) ?? 0 };
  });

  // Nutrition coverage, last 7 days
  const focusSlugs = (userGoals ?? []).map((g) => g.category_slug);
  const coverageMap = new Map<string, Set<string>>();
  for (const log of nutritionLogs ?? []) {
    if (!coverageMap.has(log.category_slug)) coverageMap.set(log.category_slug, new Set());
    coverageMap.get(log.category_slug)!.add(log.log_date);
  }
  const nutritionCoverageData = focusSlugs.map((slug) => ({
    name: NUTRITION_GOAL_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug,
    daysHit: coverageMap.get(slug)?.size ?? 0,
  }));

  // Cycle length history
  const cycleStarts = (cycleLogs ?? []).map((c) => c.period_start);
  const cycleLengthData = cycleStarts.slice(1).map((start, i) => {
    const prev = new Date(cycleStarts[i] + "T00:00:00");
    const curr = new Date(start + "T00:00:00");
    return {
      cycle: format(prev, "MMM d"),
      length: differenceInCalendarDays(curr, prev),
    };
  });

  const longestHabitStreak = Math.max(
    0,
    ...(habits ?? []).map((h) => computeStreak(logsByHabit.get(h.id) ?? [])),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Your progress</h1>
        <p className="mt-1 text-ink-soft">
          A reflection of your patterns, not a performance review.
        </p>
      </div>

      {longestHabitStreak > 0 && (
        <Card className="bg-sage/10">
          <p className="text-sm text-ink">
            Your longest active streak right now is <strong>{longestHabitStreak} days</strong>.
          </p>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Strength progression</h2>
        <ExerciseProgressionSection sets={setRecords} />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Weekly strength consistency</h2>
        <p className="mb-4 text-sm text-ink-soft">Sessions completed vs. the book&apos;s 3-day template.</p>
        <WeeklyConsistencyChart data={consistencyData} />
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Habit consistency</h2>
          <HabitCompletionChart data={habitCompletionData} />
        </Card>
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Water, last 14 days</h2>
          <WaterTrendChart data={waterTrendData} />
        </Card>
      </div>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Nutrition coverage, this week</h2>
        <p className="mb-4 text-sm text-ink-soft">Your focus areas, days hit out of 7.</p>
        <NutritionCoverageChart data={nutritionCoverageData} />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Cycle length history</h2>
        <p className="mb-4 text-sm text-ink-soft">
          How your recent cycles compare, so you can spot your own normal.
        </p>
        <CycleLengthChart data={cycleLengthData} />
      </Card>
    </div>
  );
}
