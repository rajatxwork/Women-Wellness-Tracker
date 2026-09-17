import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getAuthedUser, getProfile } from "@/lib/supabase/get-user";
import { todayISO, formatDateISO } from "@/lib/utils";
import { NUTRITION_GOAL_CATEGORIES } from "@/lib/data/nutrition";
import { Card } from "@/components/ui/card";
import { WaterRing } from "@/components/water-ring";
import { GoalCategoryPicker } from "@/components/goal-category-picker";
import { NutritionChecklist } from "@/components/nutrition-checklist";
import { MealNoteField } from "@/components/meal-note-field";
import { Apple } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { NutritionCoverage } from "@/components/nutrition-coverage";
import { NutrientCalculator } from "@/components/nutrient-calculator";
import { NutrientTargetsTable } from "@/components/nutrient-targets-table";
import { SupplementTracker } from "@/components/supplement-tracker";

export default async function NutritionPage() {
  const user = await getAuthedUser();
  if (!user) return null;

  const supabase = await createClient();
  const today = todayISO();
  const weekAgo = formatDateISO(subDays(new Date(), 6));

  const [
    profile,
    { data: userGoals },
    { data: waterLogs },
    { data: todayLogs },
    { data: todayNote },
    { data: weekLogs },
    { data: nutrientTargets },
    { data: supplements },
    { data: supplementLogsToday },
  ] = await Promise.all([
    getProfile(user.id),
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
    supabase
      .from("nutrient_targets")
      .select("id, nutrient_name, category, target_amount, unit")
      .eq("user_id", user.id)
      .order("nutrient_name"),
    supabase
      .from("supplements")
      .select("id, name, dosage")
      .eq("user_id", user.id)
      .order("created_at"),
    supabase.from("supplement_logs").select("supplement_id").eq("user_id", user.id).eq("log_date", today),
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

  const targetRows = (nutrientTargets ?? []).map((t) => ({
    id: t.id,
    nutrientName: t.nutrient_name,
    category: t.category,
    targetAmount: t.target_amount,
    unit: t.unit,
  }));

  const takenTodaySet = new Set((supplementLogsToday ?? []).map((s) => s.supplement_id));
  const supplementItems = (supplements ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    dosage: s.dosage,
    takenToday: takenTodaySet.has(s.id),
  }));

  return (
    <div className="space-y-6">
      <PageHeading
        icon={Apple}
        title="Nutrition"
        subtitle="Not about counting calories, about noticing what your body's actually asking for."
        accentClass="bg-sage/25 text-sage-deep"
      />

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
          Pick a few things you actually care about right now, you can change these any time.
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
          Just a reflection of your last 7 days, not a scorecard.
        </p>
        <NutritionCoverage rows={coverageRows} />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Nutrient calculator</h2>
        <p className="mb-4 text-sm text-ink-soft">
          A quick, science-based estimate of your daily needs, built from your height,
          weight, activity, and goal.
        </p>
        <NutrientCalculator />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Your macro & micro targets</h2>
        <p className="mb-4 text-sm text-ink-soft">
          A personal reference sheet, prefill it from the calculator above or build it
          yourself.
        </p>
        <NutrientTargetsTable targets={targetRows} />
      </Card>

      <Card>
        <h2 className="mb-1 font-serif-display text-lg text-ink">Supplements</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Keep track of what you&apos;re taking, and whether today&apos;s the day you took it.
        </p>
        <SupplementTracker supplements={supplementItems} />
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
                    <span className="text-ink-soft">: {food.why}</span>
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
