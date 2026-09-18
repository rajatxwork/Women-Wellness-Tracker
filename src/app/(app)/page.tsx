import Link from "next/link";
import { format, subDays, differenceInCalendarDays } from "date-fns";
import { Dumbbell, Apple } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { todayISO, formatDateISO } from "@/lib/utils";
import { computeCycleStatus } from "@/lib/cycle";
import { CYCLE_PHASES } from "@/lib/data/cycle-phases";
import { todayDayOfWeek, baselineDayType, type DayType } from "@/lib/data/workout-goals";
import { getCelebration, getGreeting } from "@/lib/encouragement";
import { Card } from "@/components/ui/card";
import { WaterRing } from "@/components/water-ring";
import { HabitChecklist } from "@/components/habit-checklist";
import { QuickTasks } from "@/components/quick-tasks";
import { TodaysWorkoutCard, type ExerciseCompare, type SetEntry } from "@/components/todays-workout-card";

const DAY_TITLE: Record<DayType, string> = {
  strength: "Today's workout",
  cardio: "Today's cardio",
  recovery: "Today's active recovery",
  rest: "Today's rest day",
};

export default async function DashboardPage() {
  const user = await getAuthedUser();
  if (!user) return null;

  const supabase = await createClient();
  const today = todayISO();
  const todayDow = todayDayOfWeek();

  const [
    profile,
    { data: waterLogs },
    { data: habits },
    { data: habitLogsToday },
    { data: tasks },
    { data: planDays },
    { data: programItemsToday },
    { data: recentSets },
  ] = await Promise.all([
    getProfile(user.id),
    supabase.from("water_logs").select("amount_ml").eq("user_id", user.id).eq("log_date", today),
    supabase
      .from("habits")
      .select("id, name")
      .eq("user_id", user.id)
      .eq("archived", false)
      .order("created_at", { ascending: true }),
    supabase.from("habit_logs").select("habit_id").eq("user_id", user.id).eq("log_date", today),
    supabase
      .from("tasks")
      .select("id, title, completed")
      .eq("user_id", user.id)
      .eq("completed", false)
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5),
    supabase.from("plan_days").select("day_of_week, day_type").eq("user_id", user.id),
    supabase
      .from("program_items")
      .select("id, program_id, exercise_name, pattern_slug, bundle_id, variant")
      .eq("user_id", user.id)
      .eq("day_of_week", todayDow)
      .order("sort_order"),
    supabase
      .from("workout_sets")
      .select("id, exercise_name, reps, weight_kg, set_number, workout_sessions!inner(session_date)")
      .eq("user_id", user.id)
      .gte("workout_sessions.session_date", formatDateISO(subDays(new Date(), 90))),
  ]);

  const waterTotal = (waterLogs ?? []).reduce((sum, w) => sum + w.amount_ml, 0);
  const waterGoal = profile?.water_goal_ml ?? 2000;

  const doneHabitIds = new Set((habitLogsToday ?? []).map((h) => h.habit_id));
  const habitItems = (habits ?? []).map((h) => ({
    id: h.id,
    name: h.name,
    done: doneHabitIds.has(h.id),
  }));

  const cycleStatus = profile?.last_period_start
    ? computeCycleStatus(
        new Date(profile.last_period_start + "T00:00:00"),
        profile.avg_cycle_length ?? 28,
      )
    : null;

  const seed = new Date().getDate();

  // Group logged sets by exercise, then by the date they were logged on, so
  // we can pull "today's sets" and "the most recent prior session" for each
  // planned exercise, and separately bucket everything by week for the
  // volume trend banner.
  const setsByExerciseAndDate = new Map<string, Map<string, SetEntry[]>>();
  let thisWeekVolume = 0;
  let lastWeekVolume = 0;

  for (const s of recentSets ?? []) {
    const session = s.workout_sessions as unknown as { session_date: string } | null;
    if (!session) continue;
    const date = session.session_date;

    if (!setsByExerciseAndDate.has(s.exercise_name)) setsByExerciseAndDate.set(s.exercise_name, new Map());
    const byDate = setsByExerciseAndDate.get(s.exercise_name)!;
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date)!.push({ id: s.id, setNumber: s.set_number, reps: s.reps, weightKg: s.weight_kg });

    if (s.weight_kg) {
      const diffDays = differenceInCalendarDays(new Date(today + "T00:00:00"), new Date(date + "T00:00:00"));
      const volume = (s.reps ?? 0) * s.weight_kg;
      if (diffDays >= 0 && diffDays <= 6) thisWeekVolume += volume;
      else if (diffDays >= 7 && diffDays <= 13) lastWeekVolume += volume;
    }
  }

  const volumeTrend = {
    thisWeek: thisWeekVolume,
    lastWeek: lastWeekVolume,
    percentChange:
      lastWeekVolume > 0 ? Math.round(((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100) : null,
  };

  const todayDayType: DayType =
    (planDays ?? []).find((d) => d.day_of_week === todayDow)?.day_type ?? baselineDayType(todayDow);

  const todaysExercises: ExerciseCompare[] = (programItemsToday ?? []).map((it) => {
    const byDate = setsByExerciseAndDate.get(it.exercise_name);
    const todaySets = byDate?.get(today) ?? [];
    const priorDates = byDate
      ? Array.from(byDate.keys())
          .filter((d) => d !== today)
          .sort((a, b) => b.localeCompare(a))
      : [];
    const lastDate = priorDates[0];

    return {
      id: it.id,
      programId: it.program_id,
      exerciseName: it.exercise_name,
      patternSlug: it.pattern_slug,
      bundleId: it.bundle_id,
      variant: it.variant,
      lastSession: lastDate ? { date: lastDate, sets: byDate!.get(lastDate)! } : null,
      todaySets,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-terracotta-deep">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <p className="mt-1 text-ink-soft">{getGreeting(seed)}</p>
        <h1 className="font-serif-display text-3xl text-ink sm:text-4xl">
          {profile?.name ? `Hi, ${profile.name}` : "Hi there"}
        </h1>
        <p className="mt-2 text-ink-soft">{getCelebration(seed + 3)}</p>
      </div>

      {cycleStatus && (
        <Card className="bg-blush/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-terracotta-deep">
            Day {cycleStatus.dayOfCycle} · {CYCLE_PHASES[cycleStatus.phase].name} phase
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-2.5 rounded-2xl bg-surface/60 p-3">
              <Dumbbell size={16} className="mt-0.5 flex-shrink-0 text-terracotta-deep" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Train like this
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink">
                  {CYCLE_PHASES[cycleStatus.phase].trainingNote}
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 rounded-2xl bg-surface/60 p-3">
              <Apple size={16} className="mt-0.5 flex-shrink-0 text-sage-deep" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Eat like this
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink">
                  {CYCLE_PHASES[cycleStatus.phase].nutritionNote}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/cycle"
            className="mt-3 inline-block text-xs font-semibold text-terracotta-deep"
          >
            View your cycle →
          </Link>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-lg text-ink">{DAY_TITLE[todayDayType]}</h2>
          <Link href="/workout#this-week" className="text-xs font-semibold text-terracotta-deep">
            Edit your week
          </Link>
        </div>
        <TodaysWorkoutCard dayType={todayDayType} exercises={todaysExercises} volumeTrend={volumeTrend} />
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Water</h2>
          <WaterRing currentMl={waterTotal} goalMl={waterGoal} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif-display text-lg text-ink">Today&apos;s habits</h2>
            <Link href="/habits" className="text-xs font-semibold text-terracotta-deep">
              Manage
            </Link>
          </div>
          <HabitChecklist habits={habitItems} />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif-display text-lg text-ink">Quick tasks</h2>
            <Link href="/habits?tab=tasks" className="text-xs font-semibold text-terracotta-deep">
              See all
            </Link>
          </div>
          <QuickTasks tasks={(tasks ?? []).map((t) => ({ id: t.id, title: t.title, completed: t.completed }))} />
        </Card>
      </div>
    </div>
  );
}
