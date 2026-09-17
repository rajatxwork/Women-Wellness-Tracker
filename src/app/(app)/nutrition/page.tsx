import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { todayISO, formatDateISO } from "@/lib/utils";
import { NUTRITION_GOAL_CATEGORIES } from "@/lib/data/nutrition";
import { Card } from "@/components/ui/card";
import { WaterRing } from "@/components/water-ring";
import { GoalCategoryPicker } from "@/components/goal-category-picker";
import { NutritionChecklist } from "@/components/nutrition-checklist";
import { MealNoteField } from "@/components/meal-note-field";
import { NutritionCoverage } from "@/components/nutrition-coverage";

export default async function NutritionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = todayISO();
  const weekAgo = formatDateISO(subDays(new Date(), 6));

  const [
    { data: profile },
    { data: userGoals },
    { data: waterLogs },
    { data: todayLogs },
    { data: todayNote },
    { data: weekLogs },
  ] = await Promise.all([
    supabase.from("profiles").select("water_goal_ml").eq("id", user.id).maybeSingle(),
    supabase.from("user_goal_categories").select("category_slug").eq("user_id", user.id),
    supabase.from("water_logs").select("amount_ml").eq("user_id", user.id).eq("log_date", today),
    supabase
      .from("nutrition_logs")
      .select("category_slug")
      .eq("user_id", user.id)
      .eq("log_date", today),
    supabase
      .from("nutrition_notes")
      .select("note")
      .eq("user_id", user.id)
      .eq("log_date", today)
      .maybeSingle(),
    supabase
      .from("nutrition_logs")
      .select("category_slug, log_date")
      .eq("user_id", user.id)
      .gte("log_date", weekAgo),
  ]);

  const focusSlugs = (userGoals ?? []).map((g) => g.category_slug);
  const waterTotal = (waterLogs ?? []).reduce((sum, w) => sum + w.amount_ml, 0);
  const waterGoal = profile?.water_goal_ml ?? 2000;

  const coverageMap = new Map<string, Set<string>>();
  for (const log of weekLogs ?? []) {
    if (!coverageMap.has(log.category_slug)) coverageMap.set(log.category_slug, new Set());
    coverageMap.get(log.category_slug)!.add(log.log_date);
  }
  const coverageRows = focusSlugs.map((slug) => {
    const cat = NUTRITION_GOAL_CATEGORIES.find((c) => c.slug === slug);
    return {
      slug,
      name: cat?.name ?? slug,
      daysHit: coverageMap.get(slug)?.size ?? 0,
    };
  });

  const focusCategories = NUTRITION_GOAL_CATEGORIES.filter((c) => focusSlugs.includes(c.slug));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Nutrition</h1>
        <p className="mt-1 text-ink-soft">
          Not about counting calories — about noticing what your body&apos;s actually asking for.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-serif-display text-lg text-ink">Water</h2>
          <WaterRing currentMl={waterTotal} goalMl={waterGoal} />
        </Card>

        <Card>
          <h2 className="mb-2 font-serif-display text-lg text-ink">Today&apos;s checklist</h2>
          <NutritionChecklist
            focusSlugs={focusSlugs}
            loggedSlugsToday={(todayLogs ?? []).map((l) => l.category_slug)}
          />
        </Card>
      </div>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Your focus areas</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Pick a few things you actually care about right now — you can change these any time.
        </p>
        <GoalCategoryPicker initialSlugs={focusSlugs} />
      </Card>

      <Card>
        <h2 className="mb-3 font-serif-display text-lg text-ink">Meal notes</h2>
        <MealNoteField initialNote={todayNote?.note ?? ""} />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">This week&apos;s coverage</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Just a reflection of your last 7 days — not a scorecard.
        </p>
        <NutritionCoverage rows={coverageRows} />
      </Card>

      {focusCategories.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif-display text-lg text-ink">Foods for your focus areas</h2>
          {focusCategories.map((cat) => (
            <Card key={cat.slug}>
              <h3 className="font-serif-display text-base text-ink">{cat.name}</h3>
              <p className="mt-1 text-sm text-ink-soft">{cat.tagline}</p>
              <ul className="mt-3 space-y-2.5">
                {cat.foods.map((food) => (
                  <li key={food.food} className="text-sm">
                    <span className="font-medium text-ink">{food.food}</span>
                    <span className="text-ink-soft"> — {food.why}</span>
                  </li>
                ))}
              </ul>
              {cat.quickTip && (
                <p className="mt-3 rounded-xl bg-cream-soft px-3 py-2 text-xs text-ink-soft">
                  {cat.quickTip}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
