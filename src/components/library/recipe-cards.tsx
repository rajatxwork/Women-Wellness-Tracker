"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Clock, Users } from "lucide-react";
import { RECIPES, RECIPE_MEAL_TYPES, type Recipe } from "@/lib/data/recipes";
import { PillTabs } from "@/components/ui/pill-tabs";
import { cn } from "@/lib/utils";

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [showSteps, setShowSteps] = useState(false);

  function toggleIngredient(item: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  return (
    <div className="mb-4 break-inside-avoid rounded-3xl border border-border bg-surface-soft p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif-display text-lg leading-tight text-ink">{recipe.name}</h3>
        <span className="flex-shrink-0 rounded-full bg-blush/60 px-2.5 py-1 text-[11px] font-semibold text-ink">
          {recipe.mealType}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-ink-faint">
        <span className="flex items-center gap-1">
          <Clock size={14} /> {recipe.prepMinutes + recipe.cookMinutes} min
        </span>
        <span className="flex items-center gap-1">
          <Users size={14} /> {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cream-soft px-2.5 py-1 text-[11px] font-medium text-ink-soft"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">{recipe.whyItHelps}</p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Ingredients</p>
        <ul className="mt-1">
          {recipe.ingredients.map((item) => {
            const isChecked = checked.has(item);
            return (
              <li key={item}>
                <label className="flex min-h-11 cursor-pointer items-center gap-2.5 py-1.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleIngredient(item)}
                    className="h-5 w-5 flex-shrink-0 rounded-md border-border accent-terracotta"
                  />
                  <span
                    className={cn(
                      "text-sm text-ink",
                      isChecked && "text-ink-faint line-through",
                    )}
                  >
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setShowSteps((s) => !s)}
        aria-expanded={showSteps}
        className="mt-2 flex h-11 w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-terracotta-deep"
      >
        Method
        <ChevronDown size={16} className={cn("transition-transform", showSteps && "rotate-180")} />
      </button>
      {showSteps && (
        <ol className="space-y-1.5 pb-1">
          {recipe.method.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink">
              <span className="flex-shrink-0 font-semibold text-terracotta-deep">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function RecipeCards() {
  const [filter, setFilter] = useState<string>("All");

  const filtered = useMemo(
    () => (filter === "All" ? RECIPES : RECIPES.filter((r) => r.mealType === filter)),
    [filter],
  );

  const options = [{ value: "All", label: "All" }, ...RECIPE_MEAL_TYPES.map((m) => ({ value: m, label: m }))];

  return (
    <div>
      <PillTabs options={options} value={filter} onChange={setFilter} />
      <p className="mb-3 mt-3 text-xs text-ink-faint">
        {filtered.length} recipe{filtered.length === 1 ? "" : "s"}
      </p>
      <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
