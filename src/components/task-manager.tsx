"use client";

import { useState, useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import { createTask, toggleTask, deleteTask } from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TaskItem = {
  id: string;
  title: string;
  category: string | null;
  dueDate: string | null;
  completed: boolean;
};

const CATEGORIES = [
  { value: "", label: "General" },
  { value: "workout", label: "Workout" },
  { value: "nutrition", label: "Nutrition" },
  { value: "cycle", label: "Cycle" },
  { value: "general", label: "General" },
];

export function TaskManager({ tasks }: { tasks: TaskItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  const incomplete = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  function handleAdd() {
    const t = title.trim();
    if (!t) return;
    setTitle("");
    startTransition(() => createTask(t, category || "general", dueDate || null));
    setDueDate("");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[160px]">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-2xl border border-border bg-surface-soft px-3 py-2.5 text-sm text-ink"
        >
          {CATEGORIES.filter((c, i) => i === 0 || c.value !== "general").map((c) => (
            <option key={c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-40"
        />
        <Button size="sm" disabled={isPending} onClick={handleAdd}>
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {incomplete.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={startTransition} />
        ))}
        {completed.length > 0 && (
          <>
            <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Done</p>
            {completed.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={startTransition} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
}: {
  task: TaskItem;
  onToggle: (fn: () => void) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-soft px-3.5 py-2.5">
      <button
        onClick={() => onToggle(() => toggleTask(task.id, !task.completed))}
        className={cn(
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all",
          task.completed ? "border-terracotta bg-terracotta text-white" : "border-border text-transparent",
        )}
      >
        <Check size={12} strokeWidth={3} />
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", task.completed ? "text-ink-faint line-through" : "text-ink")}>
          {task.title}
        </p>
        <div className="flex gap-2 text-[11px] text-ink-faint">
          {task.category && <span className="capitalize">{task.category}</span>}
          {task.dueDate && <span>· due {task.dueDate}</span>}
        </div>
      </div>
      <button
        onClick={() => onToggle(() => deleteTask(task.id))}
        className="text-ink-faint hover:text-terracotta-deep"
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
