"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { createHabit, toggleSuggestedHabit, toggleHabitLog, archiveHabit } from "@/app/actions/habits";
import { SUGGESTED_HABITS } from "@/lib/data/habits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStreakMessage } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

type HabitItem = { id: string; name: string; done: boolean; streak: number; isSuggested: boolean };

export function HabitManager({
  habits,
  activeSuggestedNames,
}: {
  habits: HabitItem[];
  activeSuggestedNames: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [newHabitName, setNewHabitName] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">Add a habit</p>
        <div className="flex gap-2">
          <Input
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="e.g. Ten minute walk after dinner"
          />
          <Button
            size="sm"
            disabled={isPending || !newHabitName.trim()}
            onClick={() => {
              const name = newHabitName.trim();
              setNewHabitName("");
              startTransition(() => createHabit(name));
            }}
          >
            Add
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-soft">From the book</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_HABITS.map((s) => {
            const active = activeSuggestedNames.includes(s.name);
            return (
              <button
                key={s.name}
                onClick={() => startTransition(() => toggleSuggestedHabit(s.name, s.category))}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-sage-deep bg-sage-deep/15 text-ink"
                    : "border-border bg-surface-soft text-ink-soft hover:border-sage-deep/40",
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3.5 py-2.5"
          >
            <button
              onClick={() => startTransition(() => toggleHabitLog(habit.id))}
              className={cn(
                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                habit.done ? "border-sage-deep bg-sage-deep text-white" : "border-border text-transparent",
              )}
            >
              <Check size={14} strokeWidth={3} />
            </button>
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm", habit.done ? "text-ink-faint line-through" : "text-ink")}>
                {habit.name}
              </p>
              {habit.streak > 0 && (
                <p className="text-xs text-terracotta-deep">{getStreakMessage(habit.streak, habit.streak)}</p>
              )}
            </div>
            <button
              onClick={() => startTransition(() => archiveHabit(habit.id))}
              className="text-ink-faint hover:text-terracotta-deep"
              aria-label="Remove habit"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
