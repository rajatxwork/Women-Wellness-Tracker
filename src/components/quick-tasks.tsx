"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { toggleTask } from "@/app/actions/tasks";
import { getEmptyState } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

type TaskItem = { id: string; title: string; completed: boolean };

export function QuickTasks({ tasks }: { tasks: TaskItem[] }) {
  const [, startTransition] = useTransition();
  const [localState, setLocalState] = useState(
    Object.fromEntries(tasks.map((t) => [t.id, t.completed])),
  );

  if (tasks.length === 0) {
    return <p className="text-sm text-ink-faint">{getEmptyState()}</p>;
  }

  function toggle(id: string) {
    const next = !localState[id];
    setLocalState((prev) => ({ ...prev, [id]: next }));
    startTransition(() => {
      toggleTask(id, next);
    });
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => {
        const done = localState[task.id];
        return (
          <li key={task.id}>
            <button
              onClick={() => toggle(task.id)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3.5 py-2.5 text-left transition-colors hover:border-terracotta/40"
            >
              <span
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all",
                  done
                    ? "border-terracotta bg-terracotta text-white"
                    : "border-border text-transparent",
                )}
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={cn("text-sm", done ? "text-ink-faint line-through" : "text-ink")}>
                {task.title}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
