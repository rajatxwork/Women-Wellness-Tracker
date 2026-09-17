import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";
import { computeCycleStatus } from "@/lib/cycle";
import { CYCLE_PHASES } from "@/lib/data/cycle-phases";
import { WEEKLY_STRUCTURE } from "@/lib/data/movement";
import { getCelebration, getGreeting, getPhaseTip } from "@/lib/encouragement";
import { Card } from "@/components/ui/card";
import { WaterRing } from "@/components/water-ring";
import { HabitChecklist } from "@/components/habit-checklist";
import { QuickTasks } from "@/components/quick-tasks";
import { LinkButton } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = todayISO();

  const [{ data: profile }, { data: waterLogs }, { data: habits }, { data: habitLogsToday }, { data: tasks }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
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

  const jsWeekday = new Date().getDay(); // 0 = Sunday
  const dayIndex = jsWeekday === 0 ? 7 : jsWeekday; // Monday = 1 ... Sunday = 7
  const plannedDay = WEEKLY_STRUCTURE.find((d) => d.day === dayIndex);

  const seed = new Date().getDate();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-ink-soft">{getGreeting(seed)}</p>
        <h1 className="font-serif-display text-3xl text-ink sm:text-4xl">
          {profile?.name ? `Hi, ${profile.name}` : "Hi there"}
        </h1>
        <p className="mt-2 text-ink-soft">{getCelebration(seed + 3)}</p>
      </div>

      {cycleStatus && (
        <Card className="bg-blush/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-terracotta-deep">
                Day {cycleStatus.dayOfCycle} · {CYCLE_PHASES[cycleStatus.phase].name} phase
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {getPhaseTip(cycleStatus.phase)}
              </p>
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

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Water</h2>
          <WaterRing currentMl={waterTotal} goalMl={waterGoal} />
        </Card>

        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Today&apos;s plan</h2>
          {plannedDay ? (
            <div className="space-y-3">
              <p className="text-sm text-ink">{plannedDay.focus}</p>
              <LinkButton href="/workout" variant="outline" size="sm">
                Log today&apos;s movement
              </LinkButton>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Rest — however you want to spend it.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
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
