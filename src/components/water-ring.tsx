"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import { addWater, setWaterGoal } from "@/app/actions/water";
import { getWaterCelebration } from "@/lib/encouragement";
import { cn } from "@/lib/utils";

const GLASS_ML = 250;

export function WaterRing({
  currentMl,
  goalMl,
}: {
  currentMl: number;
  goalMl: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const [optimisticMl, setOptimisticMl] = useState(currentMl);
  const [optimisticGoal, setOptimisticGoal] = useState(goalMl);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(goalMl));

  const percent = Math.min(100, Math.round((optimisticMl / optimisticGoal) * 100));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const hitGoal = optimisticMl >= optimisticGoal;

  function handleAdd() {
    const next = optimisticMl + GLASS_ML;
    setOptimisticMl(next);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
    startTransition(() => {
      addWater(GLASS_ML);
    });
  }

  function handleSaveGoal() {
    const parsed = Math.round(Number(goalInput));
    if (!parsed || parsed <= 0) {
      setEditingGoal(false);
      setGoalInput(String(optimisticGoal));
      return;
    }
    setOptimisticGoal(parsed);
    setEditingGoal(false);
    startTransition(() => {
      setWaterGoal(parsed);
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--color-cream-soft)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--color-water)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center",
            justAdded && "animate-gentle-pop",
          )}
        >
          <span className="font-serif-display text-2xl text-ink">
            {(optimisticMl / 1000).toFixed(2).replace(/0$/, "")}L
          </span>
          <span className="text-xs text-ink-faint">
            of {(optimisticGoal / 1000).toFixed(1)}L
          </span>
        </div>
      </div>

      {editingGoal ? (
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={250}
            step={50}
            autoFocus
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveGoal()}
            className="w-24 rounded-full border border-border bg-surface-soft px-3 py-1 text-center text-sm text-ink outline-none focus:border-terracotta"
          />
          <span className="text-xs text-ink-faint">ml</span>
          <button
            onClick={handleSaveGoal}
            aria-label="Save water goal"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-deep text-white"
          >
            <Check size={14} strokeWidth={3} />
          </button>
          <button
            onClick={() => {
              setEditingGoal(false);
              setGoalInput(String(optimisticGoal));
            }}
            aria-label="Cancel"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-cream-soft text-ink-faint"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-full bg-water/20 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-water/30 active:scale-95 disabled:opacity-60"
          >
            <Plus size={16} /> Add a glass
          </button>
          <button
            onClick={() => setEditingGoal(true)}
            aria-label="Edit water goal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-terracotta-deep"
          >
            <Pencil size={14} />
          </button>
        </div>
      )}

      {hitGoal && (
        <p className="animate-gentle-fade text-center text-xs font-medium text-sage-deep">
          {getWaterCelebration()}
        </p>
      )}
    </div>
  );
}
