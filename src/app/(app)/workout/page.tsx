import { startOfWeek, endOfWeek, differenceInCalendarDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { formatDateISO } from "@/lib/utils";
import { MOVEMENT_PATTERNS, BODYWEIGHT_PROGRESSION } from "@/lib/data/movement";
import type { AgeBand } from "@/lib/data/plyometrics";
import { Card } from "@/components/ui/card";
import { WorkoutSessionForm } from "@/components/workout-session-form";
import { CardioForm, PlyoForm, RecoveryForm } from "@/components/cardio-plyo-recovery-forms";
import { WeeklyStructureView } from "@/components/weekly-structure-view";

export default async function WorkoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("age_band")
    .eq("id", user.id)
    .maybeSingle();

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: weekSessions } = await supabase
    .from("workout_sessions")
    .select("session_date")
    .eq("user_id", user.id)
    .gte("session_date", formatDateISO(weekStart))
    .lte("session_date", formatDateISO(weekEnd));

  const completedByDayIndex = Array(7).fill(false);
  for (const session of weekSessions ?? []) {
    const idx = differenceInCalendarDays(new Date(session.session_date + "T00:00:00"), weekStart);
    if (idx >= 0 && idx < 7) completedByDayIndex[idx] = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Movement</h1>
        <p className="mt-1 text-ink-soft">
          Full body, three days a week, with room to breathe around it.
        </p>
      </div>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">This week</h2>
        <WeeklyStructureView completedByDayIndex={completedByDayIndex} />
      </Card>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Log a strength session</h2>
        <WorkoutSessionForm />
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
