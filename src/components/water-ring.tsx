"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { addWater } from "@/app/actions/water";
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

  const percent = Math.min(100, Math.round((optimisticMl / goalMl) * 100));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const hitGoal = optimisticMl >= goalMl;

  function handleAdd() {
    const next = optimisticMl + GLASS_ML;
    setOptimisticMl(next);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
    startTransition(() => {
      addWater(GLASS_ML);
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
          <span className="text-xs text-ink-faint">of {(goalMl / 1000).toFixed(1)}L</span>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-full bg-water/20 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-water/30 active:scale-95 disabled:opacity-60"
      >
        <Plus size={16} /> Add a glass
      </button>

      {hitGoal && (
        <p className="animate-gentle-fade text-center text-xs font-medium text-sage-deep">
          {getWaterCelebration()}
        </p>
      )}
    </div>
  );
}
