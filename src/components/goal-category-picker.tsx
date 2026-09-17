"use client";

import { useState, useTransition } from "react";
import { setUserGoalCategories } from "@/app/actions/nutrition";
import { NUTRITION_GOAL_CATEGORIES } from "@/lib/data/nutrition";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoalCategoryPicker({ initialSlugs }: { initialSlugs: string[] }) {
  const [selected, setSelected] = useState(new Set(initialSlugs));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      await setUserGoalCategories(Array.from(selected));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {NUTRITION_GOAL_CATEGORIES.map((cat) => {
          const active = selected.has(cat.slug);
          return (
            <button
              key={cat.slug}
              onClick={() => toggle(cat.slug)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-terracotta bg-terracotta text-white"
                  : "border-border bg-surface-soft text-ink-soft hover:border-terracotta/40",
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
      <Button onClick={save} disabled={isPending} size="sm" className="mt-4">
        {isPending ? "Saving…" : saved ? "Saved ✓" : "Save my focus areas"}
      </Button>
    </div>
  );
}
