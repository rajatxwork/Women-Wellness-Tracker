import { startOfWeek, endOfWeek, differenceInCalendarDays, subDays } from "date-fns";
import { Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { formatDateISO } from "@/lib/utils";
import { MOVEMENT_PATTERNS, BODYWEIGHT_PROGRESSION } from "@/lib/data/movement";
import type { AgeBand } from "@/lib/data/plyometrics";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/page-heading";
import { WorkoutSessionForm } from "@/components/workout-session-form";
import { CardioForm, PlyoForm, RecoveryForm } from "@/components/cardio-plyo-recovery-forms";
import { WeeklyStructureView } from "@/components/weekly-structure-view";
import { CustomExerciseManager } from "@/components/custom-exercise-manager";
import { ProgramSection } from "@/components/program-section";

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
    { data: programs },
    { data: programItems },
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
    supabase.from("programs").select("id, name").eq("user_id", user.id).order("created_at"),
    supabase
      .from("program_items")
      .select("id, program_id, exercise_name, pattern_slug, bundle_id, variant, sort_order")
      .eq("user_id", user.id)
      .order("sort_order"),
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

  const programViews = (programs ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    items: (programItems ?? [])
      .filter((it) => it.program_id === p.id)
      .map((it) => ({
        id: it.id,
        exerciseName: it.exercise_name,
        patternSlug: it.pattern_slug,
        bundleId: it.bundle_id,
        variant: it.variant,
        recentEntries: (entriesByExercise.get(it.exercise_name) ?? []).slice(0, 5),
      })),
  }));

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
        subtitle="Full body, three days a week, with room to breathe around it."
        accentClass="bg-terracotta/15 text-terracotta-deep"
      />

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">This week</h2>
        <WeeklyStructureView completedByDayIndex={completedByDayIndex} />
      </Card>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Log a strength session</h2>
        <WorkoutSessionForm />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Your programs</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Build your own plan from whatever movements you choose, then track them here
          over time.
        </p>
        <ProgramSection
          programs={programViews}
          bundles={bundles ?? []}
          customExercises={customExerciseViews}
        />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Your own exercises</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Not everything fits the book&apos;s 8 patterns. Add your own and bundle them
          however makes sense to you.
        </p>
        <CustomExerciseManager bundles={bundles ?? []} customExercises={customExerciseViews} />
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Cardio</h2>
          <CardioForm />
        </Card>
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Plyometrics</h2>
          <PlyoForm defaultAgeBand={(profile?.age_band as AgeBand) ?? "20s-30s"} />
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Rest day or active recovery</h2>
        <RecoveryForm />
      </Card>

      <div className="space-y-4">
        <h2 className="font-serif-display text-lg text-ink">Movement pattern library</h2>
        {MOVEMENT_PATTERNS.map((pattern) => (
          <Card key={pattern.slug}>
            <h3 className="font-serif-display text-base text-ink">
              {pattern.name}
              {pattern.priority && (
                <span className="ml-2 rounded-full bg-terracotta/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-terracotta-deep">
                  Priority
                </span>
              )}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="mb-1 text-xs font-semibold text-ink-faint">Gym</p>
                <ul className="space-y-1 text-sm text-ink-soft">
                  {pattern.exercises.gym.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-ink-faint">Home + weights</p>
                <ul className="space-y-1 text-sm text-ink-soft">
                  {pattern.exercises["home-weights"].map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-ink-faint">Bodyweight</p>
                <ul className="space-y-1 text-sm text-ink-soft">
                  {pattern.exercises.bodyweight.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Bodyweight progression</h2>
        <div className="space-y-4">
          {([1, 2, 3] as const).map((level) => (
            <div key={level}>
              <p className="mb-2 text-sm font-semibold text-ink">
                {BODYWEIGHT_PROGRESSION[level].label}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {BODYWEIGHT_PROGRESSION[level].exercises.map((ex) => (
                  <li
                    key={ex.exercise}
                    className="rounded-full bg-cream-soft px-3 py-1 text-xs text-ink-soft"
                  >
                    {ex.exercise}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
