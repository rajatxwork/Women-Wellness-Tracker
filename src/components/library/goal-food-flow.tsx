import { ArrowDown, ArrowRight } from "lucide-react";
import { NUTRITION_GOAL_CATEGORIES } from "@/lib/data/nutrition";

export function GoalFoodFlow() {
  return (
    <div className="space-y-5">
      {NUTRITION_GOAL_CATEGORIES.map((goal) => (
        <div
          key={goal.slug}
          className="flex flex-col gap-3 rounded-3xl border border-border bg-surface-soft p-4 sm:flex-row sm:items-center sm:gap-4"
        >
          <div className="flex flex-shrink-0 flex-col gap-2 sm:w-48">
            <div className="rounded-2xl bg-terracotta px-4 py-3 text-white shadow-softer">
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">Goal</p>
              <p className="font-serif-display text-base leading-tight">{goal.name}</p>
            </div>
            <p className="hidden text-xs leading-relaxed text-ink-faint sm:block">{goal.tagline}</p>
          </div>

          <ArrowDown size={18} className="mx-auto flex-shrink-0 text-ink-faint sm:hidden" />
          <ArrowRight size={18} className="hidden flex-shrink-0 text-ink-faint sm:block" />

          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
            {goal.foods.map((food) => (
              <div
                key={food.food}
                className="rounded-2xl border border-border bg-surface px-3.5 py-2.5"
              >
                <p className="text-sm font-semibold text-ink">{food.food}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{food.why}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
