import { startOfWeek, endOfWeek, addDays, differenceInCalendarDays, format, subDays } from "date-fns";
import Link from "next/link";
import { Dumbbell, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { formatDateISO } from "@/lib/utils";
import { WEEKLY_STRUCTURE } from "@/lib/data/movement";
import { TRAINING_LEVEL_OPTIONS, type AgeBand, type TrainingLevel } from "@/lib/data/workout-goals";
import type { DayType } from "@/app/actions/plan-days";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/page-heading";
import { WorkoutSessionForm } from "@/components/workout-session-form";
import { CardioForm, PlyoForm, RecoveryForm } from "@/components/cardio-plyo-recovery-forms";
import { CustomExerciseManager } from "@/components/custom-exercise-manager";
import { TrainingGoalSetup } from "@/components/training-goal-setup";
import { DynamicStretchLinks } from "@/components/dynamic-stretch-links";
import { WeeklyPlanBuilder, type DayView, type PlanItemView } from "@/components/weekly-plan-builder";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function toDayType(type: (typeof WEEKLY_STRUCTURE)[number]["type"]): DayType {
  if (type === "recovery") return "recovery";
  if (type === "rest") return "rest";
  if (type === "cardio") return "cardio";
  return "strength";
}

export default async function WorkoutPage() {
  const user = await getAuthedUser();
  if (!user) return null;

  const supabase = await createClient();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const [
    profile,
    { data: weekSessions },
    { data: bundles },
    { data: customExercises },
    { data: programItems },
    { data: planDays },
    { data: recentSets },
  ] = await Promise.all([
    getProfile(user.id),
    supabase
      .from("workout_sessions")
      .select("session_date")
      .eq("user_id", user.id)
      .gte("session_date", formatDateISO(weekStart))
      .lte("session_date", formatDateISO(weekEnd)),
    supabase.from("exercise_bundles").select("id, name").eq("user_id", user.id).order("created_at"),
    supabase
      .from("custom_exercises")
      .select("id, name, pattern_slug, bundle_id, variant")
      .eq("user_id", user.id)
      .order("created_at"),
    supabase
      .from("program_items")
      .select("id, program_id, exercise_name, pattern_slug, bundle_id, variant, day_of_week, sort_order")
      .eq("user_id", user.id)
      .order("sort_order"),
    supabase.from("plan_days").select("day_of_week, day_type").eq("user_id", user.id),
    supabase
      .from("workout_sets")
      .select("exercise_name, reps, weight_kg, workout_sessions!inner(session_date)")
      .eq("user_id", user.id)
      .gte("workout_sessions.session_date", formatDateISO(subDays(new Date(), 180))),
  ]);

  const completedByDayIndex = Array(7).fill(false);
  for (const session of weekSessions ?? []) {
    const idx = differenceInCalendarDays(new Date(session.session_date + "T00:00:00"), weekStart);
    if (idx >= 0 && idx < 7) completedByDayIndex[idx] = true;
  }

  const entriesByExercise = new Map<
    string,
    { date: string; reps: number | null; weightKg: number | null }[]
  >();
  for (const s of recentSets ?? []) {
    const session = s.workout_sessions as unknown as { session_date: string } | null;
    if (!session) continue;
    if (!entriesByExercise.has(s.exercise_name)) entriesByExercise.set(s.exercise_name, []);
    entriesByExercise.get(s.exercise_name)!.push({
      date: session.session_date,
      reps: s.reps,
      weightKg: s.weight_kg,
    });
  }
  for (const entries of entriesByExercise.values()) {
    entries.sort((a, b) => b.date.localeCompare(a.date));
  }

  const dayTypeByDayOfWeek = new Map((planDays ?? []).map((d) => [d.day_of_week, d.day_type as DayType]));

  const itemsByDayOfWeek = new Map<number, PlanItemView[]>();
  for (const it of programItems ?? []) {
    if (!it.day_of_week) continue;
    const view: PlanItemView = {
      id: it.id,
      programId: it.program_id,
      exerciseName: it.exercise_name,
      patternSlug: it.pattern_slug,
      bundleId: it.bundle_id,
      variant: it.variant,
      isBookExercise: !it.bundle_id && Boolean(it.pattern_slug),
      recentEntries: (entriesByExercise.get(it.exercise_name) ?? []).slice(0, 5),
    };
    if (!itemsByDayOfWeek.has(it.day_of_week)) itemsByDayOfWeek.set(it.day_of_week, []);
    itemsByDayOfWeek.get(it.day_of_week)!.push(view);
  }

  const days: DayView[] = WEEKLY_STRUCTURE.map((baseline, i) => {
    const dayOfWeek = i + 1;
    return {
      dayOfWeek,
      label: DAY_LABELS[i],
      dateLabel: format(addDays(weekStart, i), "MMM d"),
      dayType: dayTypeByDayOfWeek.get(dayOfWeek) ?? toDayType(baseline.type),
      done: completedByDayIndex[i],
      items: itemsByDayOfWeek.get(dayOfWeek) ?? [],
    };
  });

  const defaultVariant =
    TRAINING_LEVEL_OPTIONS.find((l) => l.value === profile?.training_level)?.defaultVariant ??
    "bodyweight";

  const customExerciseViews = (customExercises ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    patternSlug: c.pattern_slug,
    bundleId: c.bundle_id,
    variant: c.variant,
  }));

  return (
    <div className="space-y-6">
      <PageHeading
        icon={Dumbbell}
        title="Movement"
        subtitle="Your goals, your program, built around the book's guidance."
        accentClass="bg-terracotta/15 text-terracotta-deep"
      />

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Your training profile</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Tell us where you&apos;re starting from and what you want, and we&apos;ll suggest an ideal
          week, you can use it as is or build your own.
        </p>
        <TrainingGoalSetup
          initialAgeBand={profile?.age_band as AgeBand | null}
          initialTrainingLevel={profile?.training_level as TrainingLevel | null}
          initialGoalSlugs={profile?.workout_goal_slugs ?? []}
        />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">This week</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Set each day&apos;s type, then add whatever movements you want to it, this is your program.
        </p>
        <div className="mb-4">
          <DynamicStretchLinks />
        </div>
        <WeeklyPlanBuilder
          days={days}
          bundles={bundles ?? []}
          customExercises={customExerciseViews}
          defaultVariant={defaultVariant}
        />
      </Card>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Log a strength session</h2>
        <WorkoutSessionForm bundles={bundles ?? []} customExercises={customExerciseViews} />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Your own exercises</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Not everything fits the book&apos;s 8 patterns. Add your own and bundle them
          however makes sense to you, you can also add one straight from logging a session.
        </p>
        <CustomExerciseManager bundles={bundles ?? []} customExercises={customExerciseViews} />
      </Card>

      <div id="cardio-log" className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Cardio</h2>
          <CardioForm />
        </Card>
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Plyometrics</h2>
          <PlyoForm ageBand={profile?.age_band as AgeBand | null} />
        </Card>
      </div>

      <div id="recovery-log">
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Rest day or active recovery</h2>
          <RecoveryForm />
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-display text-lg text-ink">Movement pattern library</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Every pattern, every variant, and the bodyweight progressions, with form videos, over in
            the Library.
          </p>
        </div>
        <Link
          href="/library?chapter=strength&section=strength-patterns"
          className="flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-terracotta-deep"
        >
          Open Library <ArrowRight size={15} />
        </Link>
      </Card>
    </div>
  );
}
