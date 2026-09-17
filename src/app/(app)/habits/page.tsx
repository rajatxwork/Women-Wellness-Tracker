import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/utils";
import { computeStreak } from "@/lib/streaks";
import { Card } from "@/components/ui/card";
import { HabitManager } from "@/components/habit-manager";
import { TaskManager } from "@/components/task-manager";

export default async function HabitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = todayISO();

  const [{ data: habits }, { data: allHabitLogs }, { data: tasks }] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("archived", false)
      .order("created_at", { ascending: true }),
    supabase.from("habit_logs").select("habit_id, log_date").eq("user_id", user.id),
    supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const logsByHabit = new Map<string, string[]>();
  for (const log of allHabitLogs ?? []) {
    if (!logsByHabit.has(log.habit_id)) logsByHabit.set(log.habit_id, []);
    logsByHabit.get(log.habit_id)!.push(log.log_date);
  }

  const habitItems = (habits ?? []).map((h) => {
    const dates = logsByHabit.get(h.id) ?? [];
    return {
      id: h.id,
      name: h.name,
      done: dates.includes(today),
      streak: computeStreak(dates),
      isSuggested: h.is_suggested,
    };
  });

  const activeSuggestedNames = habitItems.filter((h) => h.isSuggested).map((h) => h.name);

  const taskItems = (tasks ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    dueDate: t.due_date,
    completed: t.completed,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Habits & Tasks</h1>
        <p className="mt-1 text-ink-soft">Small, repeatable things — and the odd one-off to remember.</p>
      </div>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Daily habits</h2>
        <HabitManager habits={habitItems} activeSuggestedNames={activeSuggestedNames} />
      </Card>

      <Card>
        <h2 className="mb-4 font-serif-display text-lg text-ink">Tasks</h2>
        <TaskManager tasks={taskItems} />
      </Card>
    </div>
  );
}
