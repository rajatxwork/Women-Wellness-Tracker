"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { toggleHabitLog } from "@/app/actions/habits";
import { getEmptyState } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

type HabitItem = { id: string; name: string; done: boolean };

export function HabitChecklist({ habits }: { habits: HabitItem[] }) {
  const [, startTransition] = useTransition();
  const [localState, setLocalState] = useState(
    Object.fromEntries(habits.map((h) => [h.id, h.done])),
  );

  if (habits.length === 0) {
    return <p className="text-sm text-ink-faint">{getEmptyState()}</p>;
  }

  function toggle(id: string) {
    setLocalState((prev) => ({ ...prev, [id]: !prev[id] }));
    startTransition(() => {
      toggleHabitLog(id);
    });
  }

  return (
    <ul className="space-y-2">
      {habits.map((habit) => {
        const done = localState[habit.id];
        return (
          <li key={habit.id}>
            <button
              onClick={() => toggle(habit.id)}
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
              <span className={cn("text-sm", done ? "text-ink-faint line-through" : "text-ink")}>
                {habit.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
