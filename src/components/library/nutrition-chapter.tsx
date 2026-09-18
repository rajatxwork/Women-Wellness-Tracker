import { NUTRITION_SIMPLE_TIPS } from "@/lib/data/nutrition";
import { LibrarySection } from "@/components/library/library-section";
import { GoalFoodFlow } from "@/components/library/goal-food-flow";

export function NutritionChapter() {
  return (
    <div className="space-y-8">
      <LibrarySection
        id="nutrition-goals"
        title="Your goals, mapped to food"
        subtitle="Every goal, and the foods and nutrients that support it."
      >
        <GoalFoodFlow />
      </LibrarySection>

      <LibrarySection id="nutrition-tips" title="Quick nutrition tips">
        <ul className="space-y-2">
          {NUTRITION_SIMPLE_TIPS.map((tip) => (
            <li
              key={tip}
              className="rounded-2xl border border-border bg-surface-soft px-4 py-2.5 text-sm text-ink"
            >
              {tip}
            </li>
          ))}
        </ul>
      </LibrarySection>
    </div>
  );
}
