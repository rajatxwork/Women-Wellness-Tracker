"use client";

import { useMemo, useState } from "react";
import { WeightProgressionChart } from "@/components/charts";

type SetRecord = { date: string; exerciseName: string; weightKg: number | null; reps: number | null };

export function ExerciseProgressionSection({ sets }: { sets: SetRecord[] }) {
  const exerciseNames = useMemo(
    () => Array.from(new Set(sets.map((s) => s.exerciseName))).sort(),
    [sets],
  );
  const [selected, setSelected] = useState(exerciseNames[0] ?? "");

  const chartData = useMemo(() => {
    const byDate = new Map<string, { weight: number[]; reps: number[] }>();
    for (const s of sets) {
      if (s.exerciseName !== selected) continue;
      if (!byDate.has(s.date)) byDate.set(s.date, { weight: [], reps: [] });
      const entry = byDate.get(s.date)!;
      if (s.weightKg != null) entry.weight.push(s.weightKg);
      if (s.reps != null) entry.reps.push(s.reps);
    }
    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        date,
        weight: v.weight.length ? Math.max(...v.weight) : null,
        reps: v.reps.length ? Math.max(...v.reps) : null,
      }));
  }, [sets, selected]);

  if (exerciseNames.length === 0) {
    return (
      <p className="text-sm text-ink-faint">
        Log a strength session and your progression will show up here.
      </p>
    );
  }

  return (
    <div>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="mb-4 rounded-2xl border border-border bg-surface-soft px-3.5 py-2 text-sm text-ink"
      >
        {exerciseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <WeightProgressionChart data={chartData} />
    </div>
  );
}
