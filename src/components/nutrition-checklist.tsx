"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { toggleNutritionCategory } from "@/app/actions/nutrition";
import { NUTRITION_GOAL_CATEGORIES } from "@/lib/data/nutrition";
import { getEmptyState } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

export function NutritionChecklist({
  focusSlugs,
  loggedSlugsToday,
}: {
  focusSlugs: string[];
  loggedSlugsToday: string[];
}) {
  const [, startTransition] = useTransition();
  const [localState, setLocalState] = useState(new Set(loggedSlugsToday));

  const categories = NUTRITION_GOAL_CATEGORIES.filter((c) => focusSlugs.includes(c.slug));

  if (categories.length === 0) {
    return (
      <p className="text-sm text-ink-faint">
        {getEmptyState()} Pick a few focus areas above to start your daily checklist.
      </p>
    );
  }

  function toggle(slug: string) {
    setLocalState((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    startTransition(() => {
      toggleNutritionCategory(slug);
    });
  }

  return (
    <ul className="space-y-2">
      {categories.map((cat) => {
        const done = localState.has(cat.slug);
        return (
          <li key={cat.slug}>
            <button
              onClick={() => toggle(cat.slug)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3.5 py-2.5 text-left transition-colors hover:border-terracotta/40"
            >
              <span
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  done
                    ? "border-sage-deep bg-sage-deep text-white animate-gentle-pop"
                    : "border-border text-transparent",
                )}
              >
                <Check size={14} strokeWidth={3} />
              </span>
              <span className="text-sm text-ink">
                Ate something for <strong>{cat.name}</strong> today
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
